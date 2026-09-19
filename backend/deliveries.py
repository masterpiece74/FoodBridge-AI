from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from auth import get_current_user
from database import get_connection


router = APIRouter(
    prefix="/deliveries",
    tags=["Deliveries"],
)


# ============================================================
# DELIVERY STATUS REQUEST
# ============================================================

class DeliveryStatusUpdate(BaseModel):
    status: str


# ============================================================
# IMPACT CALCULATION HELPER
# ============================================================

def calculate_impact(quantity, quantity_unit):
    """
    Calculate measurable impact from a completed donation.

    Rules:
    - servings / meals / plates / portions -> meals rescued
    - kg / kilogram / kilograms -> food saved in kg
    - other units are not converted into kg or meals because
      there is no safe conversion without additional information.

    Returns:
        {
            "meals_rescued": int,
            "food_saved_kg": float,
            "people_supported": int
        }
    """

    quantity = float(quantity or 0)

    unit = (quantity_unit or "").strip().lower()

    meals_rescued = 0
    food_saved_kg = 0.0
    people_supported = 0

    # --------------------------------------------------------
    # MEAL / SERVING BASED DONATIONS
    # --------------------------------------------------------

    meal_units = {
        "serving",
        "servings",
        "meal",
        "meals",
        "plate",
        "plates",
        "portion",
        "portions",
    }

    if unit in meal_units:
        meals_rescued = max(0, int(round(quantity)))

        # For meal-based donations, one serving is treated as
        # one person supported.
        people_supported = meals_rescued

    # --------------------------------------------------------
    # KG BASED DONATIONS
    # --------------------------------------------------------

    elif unit in {
        "kg",
        "kilogram",
        "kilograms",
    }:
        food_saved_kg = max(0.0, quantity)

    return {
        "meals_rescued": meals_rescued,
        "food_saved_kg": food_saved_kg,
        "people_supported": people_supported,
    }


# ============================================================
# RECORD IMPACT
# ============================================================

def record_delivery_impact(
    cursor,
    donation_id,
    match_id,
    quantity,
    quantity_unit,
):
    """
    Create an impact record for a completed delivery.

    This operation is idempotent:
    if an impact record already exists for this match,
    another record will NOT be created.
    """

    # --------------------------------------------------------
    # CHECK FOR EXISTING IMPACT RECORD
    # --------------------------------------------------------

    cursor.execute(
        """
        SELECT
            id
        FROM impact_records
        WHERE match_id = %s
        LIMIT 1
        """,
        (match_id,),
    )

    existing_record = cursor.fetchone()

    if existing_record:
        return {
            "created": False,
            "id": existing_record[0],
        }

    # --------------------------------------------------------
    # CALCULATE IMPACT
    # --------------------------------------------------------

    impact = calculate_impact(
        quantity=quantity,
        quantity_unit=quantity_unit,
    )

    # --------------------------------------------------------
    # CREATE IMPACT RECORD
    # --------------------------------------------------------

    cursor.execute(
        """
        INSERT INTO impact_records (
            donation_id,
            match_id,
            meals_rescued,
            food_saved_kg,
            people_supported
        )
        VALUES (
            %s,
            %s,
            %s,
            %s,
            %s
        )
        RETURNING id
        """,
        (
            donation_id,
            match_id,
            impact["meals_rescued"],
            impact["food_saved_kg"],
            impact["people_supported"],
        ),
    )

    impact_id = cursor.fetchone()[0]

    return {
        "created": True,
        "id": impact_id,
        **impact,
    }


# ============================================================
# NOTIFICATION HELPER
# ============================================================

def create_notification(
    cursor,
    user_id,
    title,
    message,
    notification_type,
    delivery_id=None,
    donation_id=None,
    match_id=None,
):
    """
    Create an in-app notification for a user.

    This function uses the existing database cursor so the
    notification is committed together with the delivery update.
    """

    if not user_id:
        return

    cursor.execute(
        """
        INSERT INTO notifications (
            user_id,
            title,
            message,
            notification_type,
            related_delivery_id,
            related_donation_id,
            related_match_id
        )
        VALUES (
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s
        )
        """,
        (
            user_id,
            title,
            message,
            notification_type,
            delivery_id,
            donation_id,
            match_id,
        ),
    )


# ============================================================
# GET VOLUNTEER DELIVERIES
# ============================================================

@router.get("/")
def get_available_deliveries(
    current_user: dict = Depends(get_current_user),
):
    """
    Get deliveries relevant to the current volunteer.

    Returns:
    - pending/unassigned deliveries available for volunteers
    - deliveries assigned to the current volunteer
    - completed deliveries assigned to the current volunteer
    """

    if current_user["role"] != "volunteer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only volunteers can view deliveries.",
        )

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    d.id,
                    d.match_id,
                    d.volunteer_id,
                    d.pickup_address,
                    d.delivery_address,
                    d.status,
                    d.pickup_time,
                    d.delivery_time,

                    fd.food_name,
                    fd.food_type,
                    fd.quantity,
                    fd.quantity_unit,

                    rp.organization_name,
                    rp.city,
                    rp.state

                FROM deliveries d

                JOIN food_matches fm
                    ON fm.id = d.match_id

                JOIN food_donations fd
                    ON fd.id = fm.donation_id

                JOIN recipient_profiles rp
                    ON rp.user_id = fm.recipient_id

                WHERE
                    (
                        d.status = 'pending'
                        AND d.volunteer_id IS NULL
                    )
                    OR
                    (
                        d.volunteer_id = %s
                    )

                ORDER BY
                    CASE
                        WHEN d.status = 'pending' THEN 1
                        WHEN d.status IN (
                            'assigned',
                            'picked_up',
                            'in_transit'
                        ) THEN 2
                        WHEN d.status = 'delivered' THEN 3
                        ELSE 4
                    END,
                    d.id DESC
                """,
                (current_user["id"],),
            )

            deliveries = cursor.fetchall()

            return {
                "count": len(deliveries),
                "deliveries": [
                    {
                        "id": row[0],
                        "match_id": row[1],
                        "volunteer_id": row[2],
                        "pickup_address": row[3],
                        "delivery_address": row[4],
                        "status": row[5],
                        "pickup_time": row[6],
                        "delivery_time": row[7],
                        "food_name": row[8],
                        "food_type": row[9],
                        "quantity": float(row[10]),
                        "quantity_unit": row[11],
                        "recipient": {
                            "organization_name": row[12],
                            "city": row[13],
                            "state": row[14],
                        },
                    }
                    for row in deliveries
                ],
            }

    finally:
        connection.close()


# ============================================================
# ACCEPT DELIVERY
# ============================================================

@router.post("/{delivery_id}/accept")
def accept_delivery(
    delivery_id: int,
    current_user: dict = Depends(get_current_user),
):
    """
    Allow a volunteer to accept a pending delivery.
    """

    if current_user["role"] != "volunteer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only volunteers can accept deliveries.",
        )

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    d.id,
                    d.match_id,
                    d.volunteer_id,
                    d.pickup_address,
                    d.delivery_address,
                    d.status,

                    fm.donation_id,
                    fm.recipient_id,

                    fd.donor_id,
                    fd.food_name,
                    fd.quantity,
                    fd.quantity_unit,

                    rp.organization_name

                FROM deliveries d

                JOIN food_matches fm
                    ON fm.id = d.match_id

                JOIN food_donations fd
                    ON fd.id = fm.donation_id

                JOIN recipient_profiles rp
                    ON rp.user_id = fm.recipient_id

                WHERE d.id = %s

                FOR UPDATE
                """,
                (delivery_id,),
            )

            delivery = cursor.fetchone()

            if not delivery:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Delivery not found.",
                )

            (
                delivery_id_db,
                match_id,
                volunteer_id,
                pickup_address,
                delivery_address,
                delivery_status,
                donation_id,
                recipient_id,
                donor_id,
                food_name,
                quantity,
                quantity_unit,
                organization_name,
            ) = delivery

            if delivery_status != "pending":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=(
                        f"This delivery cannot be accepted because "
                        f"its current status is '{delivery_status}'."
                    ),
                )

            if volunteer_id is not None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="This delivery has already been assigned.",
                )

            # ------------------------------------------------
            # ASSIGN VOLUNTEER
            # ------------------------------------------------

            cursor.execute(
                """
                UPDATE deliveries
                SET
                    volunteer_id = %s,
                    status = 'assigned'
                WHERE id = %s
                """,
                (
                    current_user["id"],
                    delivery_id,
                ),
            )

            # ------------------------------------------------
            # NOTIFY VOLUNTEER
            # ------------------------------------------------

            create_notification(
                cursor=cursor,
                user_id=current_user["id"],
                title="Delivery Accepted",
                message=(
                    f"You have accepted the delivery of "
                    f"{quantity:g} {quantity_unit} of {food_name} "
                    f"to {organization_name}."
                ),
                notification_type="delivery_assigned",
                delivery_id=delivery_id,
                donation_id=donation_id,
                match_id=match_id,
            )

            # ------------------------------------------------
            # NOTIFY RECIPIENT
            # ------------------------------------------------

            create_notification(
                cursor=cursor,
                user_id=recipient_id,
                title="Volunteer Assigned",
                message=(
                    f"A volunteer has accepted the delivery of "
                    f"{quantity:g} {quantity_unit} of {food_name}. "
                    f"Your food is now being prepared for delivery."
                ),
                notification_type="delivery_assigned",
                delivery_id=delivery_id,
                donation_id=donation_id,
                match_id=match_id,
            )

            # ------------------------------------------------
            # NOTIFY DONOR
            # ------------------------------------------------

            create_notification(
                cursor=cursor,
                user_id=donor_id,
                title="Volunteer Assigned",
                message=(
                    f"A volunteer has accepted the delivery of "
                    f"your {quantity:g} {quantity_unit} donation "
                    f"of {food_name} to {organization_name}."
                ),
                notification_type="delivery_assigned",
                delivery_id=delivery_id,
                donation_id=donation_id,
                match_id=match_id,
            )

            connection.commit()

            return {
                "message": "Delivery accepted successfully!",
                "delivery": {
                    "id": delivery_id_db,
                    "match_id": match_id,
                    "volunteer_id": current_user["id"],
                    "pickup_address": pickup_address,
                    "delivery_address": delivery_address,
                    "status": "assigned",
                },
            }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to accept delivery: {str(error)}",
        )

    finally:
        connection.close()


# ============================================================
# UPDATE DELIVERY STATUS
# ============================================================

@router.patch("/{delivery_id}/status")
def update_delivery_status(
    delivery_id: int,
    data: DeliveryStatusUpdate,
    current_user: dict = Depends(get_current_user),
):
    """
    Allow the assigned volunteer to update delivery status.

    Valid progression:

    assigned
        ↓
    picked_up
        ↓
    in_transit
        ↓
    delivered
    """

    if current_user["role"] != "volunteer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only volunteers can update delivery status.",
        )

    allowed_statuses = {
        "picked_up",
        "in_transit",
        "delivered",
    }

    if data.status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Invalid delivery status. "
                "Allowed values: picked_up, in_transit, delivered."
            ),
        )

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            # ------------------------------------------------
            # GET DELIVERY + FOOD + USERS
            # ------------------------------------------------

            cursor.execute(
                """
                SELECT
                    d.id,
                    d.match_id,
                    d.volunteer_id,
                    d.pickup_address,
                    d.delivery_address,
                    d.status,

                    fm.donation_id,
                    fm.recipient_id,

                    fd.donor_id,
                    fd.food_name,
                    fd.quantity,
                    fd.quantity_unit,

                    rp.organization_name

                FROM deliveries d

                JOIN food_matches fm
                    ON fm.id = d.match_id

                JOIN food_donations fd
                    ON fd.id = fm.donation_id

                JOIN recipient_profiles rp
                    ON rp.user_id = fm.recipient_id

                WHERE d.id = %s

                FOR UPDATE
                """,
                (delivery_id,),
            )

            delivery = cursor.fetchone()

            if not delivery:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Delivery not found.",
                )

            (
                delivery_id_db,
                match_id,
                volunteer_id,
                pickup_address,
                delivery_address,
                current_status,
                donation_id,
                recipient_id,
                donor_id,
                food_name,
                quantity,
                quantity_unit,
                organization_name,
            ) = delivery

            if volunteer_id != current_user["id"]:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You can only update deliveries assigned to you.",
                )

            valid_transitions = {
                "assigned": ["picked_up"],
                "picked_up": ["in_transit"],
                "in_transit": ["delivered"],
            }

            if data.status not in valid_transitions.get(current_status, []):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=(
                        f"Cannot change delivery status from "
                        f"'{current_status}' to '{data.status}'."
                    ),
                )

            # =================================================
            # PICKED UP
            # =================================================

            if data.status == "picked_up":

                cursor.execute(
                    """
                    UPDATE deliveries
                    SET
                        status = %s,
                        pickup_time = CURRENT_TIMESTAMP
                    WHERE id = %s
                    """,
                    (
                        data.status,
                        delivery_id,
                    ),
                )

                # ---------------------------------------------
                # NOTIFY RECIPIENT
                # ---------------------------------------------

                create_notification(
                    cursor=cursor,
                    user_id=recipient_id,
                    title="Food Picked Up",
                    message=(
                        f"Your {quantity:g} {quantity_unit} of "
                        f"{food_name} has been picked up and is "
                        f"on its way to your organisation."
                    ),
                    notification_type="delivery_picked_up",
                    delivery_id=delivery_id,
                    donation_id=donation_id,
                    match_id=match_id,
                )

                # ---------------------------------------------
                # NOTIFY DONOR
                # ---------------------------------------------

                create_notification(
                    cursor=cursor,
                    user_id=donor_id,
                    title="Food Picked Up",
                    message=(
                        f"Your {quantity:g} {quantity_unit} donation "
                        f"of {food_name} has been picked up for delivery "
                        f"to {organization_name}."
                    ),
                    notification_type="delivery_picked_up",
                    delivery_id=delivery_id,
                    donation_id=donation_id,
                    match_id=match_id,
                )

                # ---------------------------------------------
                # NOTIFY VOLUNTEER
                # ---------------------------------------------

                create_notification(
                    cursor=cursor,
                    user_id=current_user["id"],
                    title="Food Picked Up",
                    message=(
                        f"You have picked up {quantity:g} "
                        f"{quantity_unit} of {food_name}."
                    ),
                    notification_type="delivery_picked_up",
                    delivery_id=delivery_id,
                    donation_id=donation_id,
                    match_id=match_id,
                )

            # =================================================
            # IN TRANSIT
            # =================================================

            elif data.status == "in_transit":

                cursor.execute(
                    """
                    UPDATE deliveries
                    SET
                        status = %s
                    WHERE id = %s
                    """,
                    (
                        data.status,
                        delivery_id,
                    ),
                )

                # ---------------------------------------------
                # NOTIFY RECIPIENT
                # ---------------------------------------------

                create_notification(
                    cursor=cursor,
                    user_id=recipient_id,
                    title="Food In Transit",
                    message=(
                        f"Your {quantity:g} {quantity_unit} of "
                        f"{food_name} is now in transit to "
                        f"{organization_name}."
                    ),
                    notification_type="delivery_in_transit",
                    delivery_id=delivery_id,
                    donation_id=donation_id,
                    match_id=match_id,
                )

                # ---------------------------------------------
                # NOTIFY DONOR
                # ---------------------------------------------

                create_notification(
                    cursor=cursor,
                    user_id=donor_id,
                    title="Food In Transit",
                    message=(
                        f"Your {quantity:g} {quantity_unit} donation "
                        f"of {food_name} is now in transit to "
                        f"{organization_name}."
                    ),
                    notification_type="delivery_in_transit",
                    delivery_id=delivery_id,
                    donation_id=donation_id,
                    match_id=match_id,
                )

                # ---------------------------------------------
                # NOTIFY VOLUNTEER
                # ---------------------------------------------

                create_notification(
                    cursor=cursor,
                    user_id=current_user["id"],
                    title="Delivery In Transit",
                    message=(
                        f"The {food_name} delivery is now marked "
                        f"as in transit."
                    ),
                    notification_type="delivery_in_transit",
                    delivery_id=delivery_id,
                    donation_id=donation_id,
                    match_id=match_id,
                )

            # =================================================
            # DELIVERED
            # =================================================

            elif data.status == "delivered":

                # ---------------------------------------------
                # MARK DELIVERY AS DELIVERED
                # ---------------------------------------------

                cursor.execute(
                    """
                    UPDATE deliveries
                    SET
                        status = %s,
                        delivery_time = CURRENT_TIMESTAMP
                    WHERE id = %s
                    """,
                    (
                        data.status,
                        delivery_id,
                    ),
                )

                # ---------------------------------------------
                # MARK DONATION AS DELIVERED
                # ---------------------------------------------

                cursor.execute(
                    """
                    UPDATE food_donations fd
                    SET status = 'delivered'
                    FROM food_matches fm
                    WHERE fm.id = %s
                    AND fd.id = fm.donation_id
                    """,
                    (match_id,),
                )

                # ---------------------------------------------
                # MARK MATCH AS COMPLETED
                # ---------------------------------------------

                cursor.execute(
                    """
                    UPDATE food_matches
                    SET status = 'completed'
                    WHERE id = %s
                    """,
                    (match_id,),
                )

                # =================================================
                # RECORD REAL IMPACT
                # =================================================

                impact_result = record_delivery_impact(
                    cursor=cursor,
                    donation_id=donation_id,
                    match_id=match_id,
                    quantity=quantity,
                    quantity_unit=quantity_unit,
                )

                # ---------------------------------------------
                # NOTIFY RECIPIENT
                # ---------------------------------------------

                create_notification(
                    cursor=cursor,
                    user_id=recipient_id,
                    title="Food Delivered Successfully",
                    message=(
                        f"Your {quantity:g} {quantity_unit} of "
                        f"{food_name} has been successfully delivered "
                        f"to {organization_name}."
                    ),
                    notification_type="delivery_delivered",
                    delivery_id=delivery_id,
                    donation_id=donation_id,
                    match_id=match_id,
                )

                # ---------------------------------------------
                # NOTIFY DONOR
                # ---------------------------------------------

                create_notification(
                    cursor=cursor,
                    user_id=donor_id,
                    title="Donation Delivered",
                    message=(
                        f"Your donation of {quantity:g} "
                        f"{quantity_unit} of {food_name} has been "
                        f"successfully delivered to "
                        f"{organization_name}."
                    ),
                    notification_type="delivery_delivered",
                    delivery_id=delivery_id,
                    donation_id=donation_id,
                    match_id=match_id,
                )

                # ---------------------------------------------
                # NOTIFY VOLUNTEER
                # ---------------------------------------------

                create_notification(
                    cursor=cursor,
                    user_id=current_user["id"],
                    title="Delivery Completed",
                    message=(
                        f"You successfully delivered {quantity:g} "
                        f"{quantity_unit} of {food_name} to "
                        f"{organization_name}."
                    ),
                    notification_type="delivery_delivered",
                    delivery_id=delivery_id,
                    donation_id=donation_id,
                    match_id=match_id,
                )

            # =================================================
            # COMMIT EVERYTHING
            # =================================================

            connection.commit()

            response = {
                "message": "Delivery status updated successfully!",
                "delivery": {
                    "id": delivery_id_db,
                    "match_id": match_id,
                    "volunteer_id": volunteer_id,
                    "pickup_address": pickup_address,
                    "delivery_address": delivery_address,
                    "status": data.status,
                },
            }

            # ------------------------------------------------
            # RETURN IMPACT DETAILS WHEN DELIVERED
            # ------------------------------------------------

            if data.status == "delivered":
                response["impact"] = {
                    "recorded": True,
                    "impact_record_id": impact_result.get("id"),
                    "created": impact_result.get("created"),
                    "meals_rescued": impact_result.get(
                        "meals_rescued",
                        0,
                    ),
                    "food_saved_kg": impact_result.get(
                        "food_saved_kg",
                        0,
                    ),
                    "people_supported": impact_result.get(
                        "people_supported",
                        0,
                    ),
                }

            return response

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update delivery status: {str(error)}",
        )

    finally:
        connection.close()

