# ============================================================
# FOODBRIDGE AI - MATCHING ENGINE
# ============================================================

import math

from fastapi import APIRouter, Depends, HTTPException, status

from auth import get_current_user
from database import get_connection


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/matches",
    tags=["AI Matching"],
)


# ============================================================
# TEXT NORMALIZATION
# ============================================================

def normalize_food_text(value):
    """
    Normalize food names/types so comparisons are consistent.

    Examples:
        "Jollof Rice" -> "jollof rice"
        "prepared_meal" -> "prepared meal"
        "  Jollof   Rice  " -> "jollof rice"
    """

    if value is None:
        return ""

    return " ".join(
        str(value)
        .strip()
        .lower()
        .replace("-", " ")
        .replace("_", " ")
        .split()
    )


# ============================================================
# DISTANCE CALCULATION
# ============================================================

def calculate_distance_km(
    lat1,
    lon1,
    lat2,
    lon2,
):
    """
    Calculate distance between two coordinates
    using the Haversine formula.
    """

    try:
        lat1 = float(lat1)
        lon1 = float(lon1)
        lat2 = float(lat2)
        lon2 = float(lon2)
    except (TypeError, ValueError):
        return None

    # Validate latitude
    if not -90 <= lat1 <= 90:
        return None

    if not -90 <= lat2 <= 90:
        return None

    # Validate longitude
    if not -180 <= lon1 <= 180:
        return None

    if not -180 <= lon2 <= 180:
        return None

    earth_radius_km = 6371.0

    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)

    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)

    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1_rad)
        * math.cos(lat2_rad)
        * math.sin(dlon / 2) ** 2
    )

    a = max(0.0, min(1.0, a))

    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a),
    )

    return earth_radius_km * c


# ============================================================
# DISTANCE SCORE
# ============================================================

def calculate_distance_score(distance_km):
    """
    Convert physical distance into a 0-100 score.

    0-1 km     = 100
    1-3 km     = 95
    3-5 km     = 90
    5-10 km    = 80
    10-20 km   = 65
    20-30 km   = 50
    30-50 km   = 35
    50+ km     = 20
    """

    if distance_km is None:
        return 50.0

    distance_km = float(distance_km)

    if distance_km <= 1:
        return 100.0

    if distance_km <= 3:
        return 95.0

    if distance_km <= 5:
        return 90.0

    if distance_km <= 10:
        return 80.0

    if distance_km <= 20:
        return 65.0

    if distance_km <= 30:
        return 50.0

    if distance_km <= 50:
        return 35.0

    return 20.0


# ============================================================
# FOOD TYPE / FOOD NAME SCORE
# ============================================================

def calculate_food_type_score(
    donation_food_name,
    donation_food_type,
    requested_food_type,
):
    """
    Match the donated food against the recipient's request.

    Example:

        Donation food_name:
            Jollof Rice

        Donation food_type:
            prepared_meal

        Recipient requested food_type:
            jollof rice

    Result:
        100

    This allows a specific food such as Jollof Rice
    to match a broader category such as prepared_meal.

    The function still prevents unrelated foods
    from being matched.
    """

    donation_name = normalize_food_text(
        donation_food_name
    )

    donation_type = normalize_food_text(
        donation_food_type
    )

    requested_type = normalize_food_text(
        requested_food_type
    )

    if not requested_type:
        return 0.0

    # --------------------------------------------------------
    # Exact match against the actual donated food name
    # --------------------------------------------------------

    if (
        donation_name
        and donation_name == requested_type
    ):
        return 100.0

    # --------------------------------------------------------
    # Exact match against donation category/type
    # --------------------------------------------------------

    if (
        donation_type
        and donation_type == requested_type
    ):
        return 100.0

    # --------------------------------------------------------
    # Partial/similar food-name match
    #
    # Example:
    # donation = "jollof rice"
    # request  = "jollof rice meal"
    # --------------------------------------------------------

    if (
        donation_name
        and (
            donation_name in requested_type
            or requested_type in donation_name
        )
    ):
        return 95.0

    # --------------------------------------------------------
    # Broad food categories
    # --------------------------------------------------------

    broad_food_categories = {
        "prepared meal",
        "prepared meals",
        "meal",
        "meals",
        "cooked food",
        "cooked meal",
        "food",
    }

    if (
        donation_type in broad_food_categories
        and requested_type in broad_food_categories
    ):
        return 100.0

    # --------------------------------------------------------
    # Partial category/type compatibility
    # --------------------------------------------------------

    if (
        donation_type
        and requested_type
        and (
            donation_type in requested_type
            or requested_type in donation_type
        )
    ):
        return 80.0

    return 0.0


# ============================================================
# QUANTITY SCORE
# ============================================================

def calculate_quantity_score(
    donation_quantity,
    required_quantity,
):
    if (
        donation_quantity is None
        or required_quantity is None
    ):
        return 0.0

    donation_quantity = float(
        donation_quantity
    )

    required_quantity = float(
        required_quantity
    )

    if required_quantity <= 0:
        return 100.0

    score = (
        donation_quantity
        / required_quantity
    ) * 100

    return max(
        0.0,
        min(100.0, score),
    )


# ============================================================
# FRESHNESS SCORE
# ============================================================

def calculate_freshness_score(
    stored_freshness_score,
):
    if stored_freshness_score is None:
        return 50.0

    try:
        score = float(
            stored_freshness_score
        )
    except (TypeError, ValueError):
        return 50.0

    return max(
        0.0,
        min(100.0, score),
    )


# ============================================================
# URGENCY SCORE
# ============================================================

def calculate_urgency_score(
    recipient_urgency_score,
):
    if recipient_urgency_score is None:
        return 50.0

    try:
        score = float(
            recipient_urgency_score
        )
    except (TypeError, ValueError):
        return 50.0

    return max(
        0.0,
        min(100.0, score),
    )


# ============================================================
# OVERALL MATCH SCORE
# ============================================================

def calculate_overall_match_score(
    distance_score,
    food_type_score,
    quantity_score,
    freshness_score,
    urgency_score,
):
    score = (
        (float(distance_score) * 0.25)
        + (float(food_type_score) * 0.25)
        + (float(quantity_score) * 0.20)
        + (float(freshness_score) * 0.15)
        + (float(urgency_score) * 0.15)
    )

    return round(
        score,
        2,
    )


# ============================================================
# AI EXPLANATION
# ============================================================

def build_ai_reason(
    food_type_score,
    quantity_score,
    freshness_score,
    urgency_score,
    distance_score,
):
    reasons = []

    if food_type_score >= 100:
        reasons.append(
            "food type is an exact match"
        )

    elif food_type_score >= 80:
        reasons.append(
            "food type is closely compatible"
        )

    if quantity_score >= 100:
        reasons.append(
            "donation fully satisfies the requested quantity"
        )

    elif quantity_score >= 50:
        reasons.append(
            "donation partially satisfies the requested quantity"
        )

    if freshness_score >= 80:
        reasons.append(
            "food is very fresh"
        )

    elif freshness_score >= 50:
        reasons.append(
            "food still has reasonable freshness"
        )

    else:
        reasons.append(
            "food freshness requires timely redistribution"
        )

    if urgency_score >= 80:
        reasons.append(
            "recipient has a high-priority need"
        )

    elif urgency_score >= 50:
        reasons.append(
            "recipient has a moderate-priority need"
        )

    else:
        reasons.append(
            "recipient currently has a lower-priority need"
        )

    if distance_score >= 90:
        reasons.append(
            "recipient is very close to the donor"
        )

    elif distance_score >= 65:
        reasons.append(
            "recipient is within a practical delivery distance"
        )

    else:
        reasons.append(
            "delivery distance may require additional coordination"
        )

    return (
        "AI selected this recipient because "
        + ", ".join(reasons)
        + "."
    )


# ============================================================
# RUN AI MATCHING FOR A DONATION
# ============================================================

@router.post(
    "/donation/{donation_id}"
)
def run_ai_matching(
    donation_id: int,
    current_user: dict = Depends(get_current_user),
):
    if current_user["role"] != "donor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only donors can run AI matching.",
        )

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            # ------------------------------------------------
            # GET DONATION
            # ------------------------------------------------

            cursor.execute(
                """
                SELECT
                    id,
                    donor_id,
                    food_name,
                    food_type,
                    quantity,
                    quantity_unit,
                    freshness_score,
                    urgency_score,
                    latitude,
                    longitude,
                    status
                FROM food_donations
                WHERE id = %s
                """,
                (donation_id,),
            )

            donation = cursor.fetchone()

            if not donation:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Donation not found.",
                )

            (
                donation_id_db,
                donor_id,
                food_name,
                donation_food_type,
                donation_quantity,
                donation_quantity_unit,
                donation_freshness_score,
                donation_urgency_score,
                donor_latitude,
                donor_longitude,
                donation_status,
            ) = donation

            # ------------------------------------------------
            # VERIFY DONOR
            # ------------------------------------------------

            if donor_id != current_user["id"]:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You can only match your own donations.",
                )

            # ------------------------------------------------
            # VERIFY DONATION STATUS
            # ------------------------------------------------

            if donation_status != "available":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Only available donations can be matched.",
                )

            freshness_score = calculate_freshness_score(
                donation_freshness_score
            )

            # ------------------------------------------------
            # GET ACTIVE RECIPIENT NEEDS
            # ------------------------------------------------

            cursor.execute(
                """
                SELECT
                    rn.id,
                    rn.recipient_id,
                    rn.food_type,
                    rn.quantity_needed,
                    rn.quantity_unit,
                    rn.urgency_score,
                    rn.people_to_feed,

                    rp.organization_name,
                    rp.organization_type,
                    rp.address,
                    rp.city,
                    rp.state,
                    rp.latitude,
                    rp.longitude

                FROM recipient_needs rn

                JOIN recipient_profiles rp
                    ON rp.user_id = rn.recipient_id

                WHERE rn.status = 'active'

                ORDER BY
                    rn.urgency_score DESC,
                    rn.id DESC
                """
            )

            recipient_needs = cursor.fetchall()

            if not recipient_needs:
                connection.commit()

                return {
                    "status": "success",
                    "message": "No active recipient needs are currently available.",
                    "donation_id": donation_id,
                    "count": 0,
                    "matches": [],
                }

            formatted_matches = []

            # =================================================
            # PROCESS EACH RECIPIENT NEED
            # =================================================

            for need in recipient_needs:

                (
                    need_id,
                    recipient_id,
                    requested_food_type,
                    quantity_needed,
                    requested_quantity_unit,
                    recipient_urgency_score,
                    people_to_feed,
                    organization_name,
                    organization_type,
                    recipient_address,
                    recipient_city,
                    recipient_state,
                    recipient_latitude,
                    recipient_longitude,
                ) = need

                # ------------------------------------------------
                # FOOD MATCHING
                # ------------------------------------------------

                food_type_score = calculate_food_type_score(
                    food_name,
                    donation_food_type,
                    requested_food_type,
                )

                # If food is completely incompatible,
                # skip this recipient.
                if food_type_score <= 0:
                    continue

                # ------------------------------------------------
                # QUANTITY SCORE
                # ------------------------------------------------

                quantity_score = calculate_quantity_score(
                    donation_quantity,
                    quantity_needed,
                )

                # ------------------------------------------------
                # FRESHNESS SCORE
                # ------------------------------------------------

                current_freshness_score = freshness_score

                # ------------------------------------------------
                # URGENCY SCORE
                # ------------------------------------------------

                urgency_score = calculate_urgency_score(
                    recipient_urgency_score
                )

                # ------------------------------------------------
                # DISTANCE
                # ------------------------------------------------

                distance_km = calculate_distance_km(
                    donor_latitude,
                    donor_longitude,
                    recipient_latitude,
                    recipient_longitude,
                )

                distance_score = calculate_distance_score(
                    distance_km
                )

                # ------------------------------------------------
                # OVERALL AI SCORE
                # ------------------------------------------------

                match_score = calculate_overall_match_score(
                    distance_score,
                    food_type_score,
                    quantity_score,
                    current_freshness_score,
                    urgency_score,
                )

                # ------------------------------------------------
                # AI EXPLANATION
                # ------------------------------------------------

                ai_reason = build_ai_reason(
                    food_type_score,
                    quantity_score,
                    current_freshness_score,
                    urgency_score,
                    distance_score,
                )

                # ------------------------------------------------
                # CHECK EXISTING MATCH
                # ------------------------------------------------

                cursor.execute(
                    """
                    SELECT
                        id,
                        status
                    FROM food_matches
                    WHERE donation_id = %s
                      AND recipient_id = %s
                    LIMIT 1
                    """,
                    (
                        donation_id,
                        recipient_id,
                    ),
                )

                existing_match = cursor.fetchone()

                if existing_match:

                    match_id = existing_match[0]
                    existing_status = existing_match[1]

                    # Preserve completed/accepted/rejected states.
                    if existing_status in (
                        "accepted",
                        "completed",
                        "rejected",
                    ):
                        saved_status = existing_status

                    else:
                        cursor.execute(
                            """
                            UPDATE food_matches
                            SET
                                match_score = %s,
                                distance_score = %s,
                                food_type_score = %s,
                                quantity_score = %s,
                                freshness_score = %s,
                                urgency_score = %s,
                                ai_reason = %s
                            WHERE id = %s
                            """,
                            (
                                match_score,
                                distance_score,
                                food_type_score,
                                quantity_score,
                                current_freshness_score,
                                urgency_score,
                                ai_reason,
                                match_id,
                            ),
                        )

                        saved_status = existing_status

                else:

                    # ------------------------------------------------
                    # CREATE NEW MATCH
                    # ------------------------------------------------

                    cursor.execute(
                        """
                        INSERT INTO food_matches (
                            donation_id,
                            recipient_id,
                            match_score,
                            distance_score,
                            food_type_score,
                            quantity_score,
                            freshness_score,
                            urgency_score,
                            ai_reason,
                            status
                        )
                        VALUES (
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            'suggested'
                        )
                        RETURNING id
                        """,
                        (
                            donation_id,
                            recipient_id,
                            match_score,
                            distance_score,
                            food_type_score,
                            quantity_score,
                            current_freshness_score,
                            urgency_score,
                            ai_reason,
                        ),
                    )

                    match_id = cursor.fetchone()[0]

                    saved_status = "suggested"

                # ------------------------------------------------
                # ADD MATCH TO RESPONSE
                # ------------------------------------------------

                formatted_matches.append(
                    {
                        "match_id": match_id,
                        "recipient_id": recipient_id,
                        "organization_name": organization_name,
                        "organization_type": organization_type,
                        "address": recipient_address,
                        "city": recipient_city,
                        "state": recipient_state,
                        "food_type": requested_food_type,
                        "quantity_needed": (
                            float(quantity_needed)
                            if quantity_needed is not None
                            else None
                        ),
                        "quantity_unit": requested_quantity_unit,
                        "people_to_feed": people_to_feed,
                        "match_score": match_score,
                        "distance_km": (
                            round(distance_km, 2)
                            if distance_km is not None
                            else None
                        ),
                        "distance_score": distance_score,
                        "food_type_score": food_type_score,
                        "quantity_score": quantity_score,
                        "freshness_score": current_freshness_score,
                        "urgency_score": urgency_score,
                        "ai_reason": ai_reason,
                        "status": saved_status,
                    }
                )

            # ------------------------------------------------
            # SORT BEST MATCH FIRST
            # ------------------------------------------------

            formatted_matches.sort(
                key=lambda item: item["match_score"],
                reverse=True,
            )

            connection.commit()

            return {
                "status": "success",
                "message": "AI matching completed.",
                "donation_id": donation_id,
                "count": len(formatted_matches),
                "matches": formatted_matches,
            }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:

        connection.rollback()

        print(
            "AI MATCHING ERROR:",
            error,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI matching failed.",
        )

    finally:
        connection.close()


# ============================================================
# GET MATCHES FOR A DONATION
# ============================================================

@router.get(
    "/donation/{donation_id}",
)
def get_donation_matches(
    donation_id: int,
    current_user: dict = Depends(get_current_user),
):

    if current_user["role"] != "donor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only donors can view donation matches.",
        )

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            # ------------------------------------------------
            # GET DONATION
            # ------------------------------------------------

            cursor.execute(
                """
                SELECT
                    id,
                    donor_id,
                    food_name,
                    food_type,
                    quantity,
                    quantity_unit,
                    latitude,
                    longitude,
                    status
                FROM food_donations
                WHERE id = %s
                """,
                (donation_id,),
            )

            donation = cursor.fetchone()

            if not donation:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Donation not found.",
                )

            if donation[1] != current_user["id"]:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You can only view your own donation matches.",
                )

            (
                donation_id_db,
                donor_id,
                food_name,
                donation_food_type,
                donation_quantity,
                donation_quantity_unit,
                donor_latitude,
                donor_longitude,
                donation_status,
            ) = donation

            # ------------------------------------------------
            # GET MATCHES
            # ------------------------------------------------

            cursor.execute(
                """
                SELECT
                    fm.id,
                    fm.recipient_id,

                    rp.organization_name,
                    rp.organization_type,
                    rp.address,
                    rp.city,
                    rp.state,
                    rp.latitude,
                    rp.longitude,

                    fm.match_score,
                    fm.distance_score,
                    fm.food_type_score,
                    fm.quantity_score,
                    fm.freshness_score,
                    fm.urgency_score,
                    fm.ai_reason,
                    fm.status,
                    fm.created_at,

                    rn.food_type,
                    rn.quantity_needed,
                    rn.quantity_unit,
                    rn.people_to_feed,
                    rn.urgency_score

                FROM food_matches fm

                JOIN recipient_profiles rp
                    ON rp.user_id = fm.recipient_id

                LEFT JOIN LATERAL (
                    SELECT
                        food_type,
                        quantity_needed,
                        quantity_unit,
                        people_to_feed,
                        urgency_score

                    FROM recipient_needs

                    WHERE recipient_id = fm.recipient_id

                    ORDER BY
                        CASE
                            WHEN status = 'active'
                            THEN 0
                            ELSE 1
                        END,
                        id DESC

                    LIMIT 1

                ) rn ON TRUE

                WHERE fm.donation_id = %s

                ORDER BY fm.match_score DESC
                """,
                (donation_id,),
            )

            matches = cursor.fetchall()

            formatted_matches = []

            for row in matches:

                (
                    match_id,
                    recipient_id,

                    organization_name,
                    organization_type,
                    recipient_address,
                    recipient_city,
                    recipient_state,
                    recipient_latitude,
                    recipient_longitude,

                    match_score,
                    distance_score,
                    food_type_score,
                    quantity_score,
                    freshness_score,
                    urgency_score,
                    ai_reason,
                    match_status,
                    created_at,

                    requested_food,
                    quantity_needed,
                    requested_quantity_unit,
                    people_to_feed,
                    need_urgency_score,
                ) = row

                # ------------------------------------------------
                # RECALCULATE ACTUAL DISTANCE
                # ------------------------------------------------

                distance_km = calculate_distance_km(
                    donor_latitude,
                    donor_longitude,
                    recipient_latitude,
                    recipient_longitude,
                )

                formatted_matches.append(
                    {
                        "match_id": match_id,
                        "recipient_id": recipient_id,
                        "organization_name": organization_name,
                        "organization_type": organization_type,
                        "address": recipient_address,
                        "city": recipient_city,
                        "state": recipient_state,
                        "match_score": float(match_score),
                        "distance_km": (
                            round(distance_km, 2)
                            if distance_km is not None
                            else None
                        ),
                        "distance_score": float(distance_score),
                        "food_type_score": float(food_type_score),
                        "quantity_score": float(quantity_score),
                        "freshness_score": float(freshness_score),
                        "urgency_score": float(urgency_score),
                        "requested_food": (
                            requested_food
                            if requested_food is not None
                            else None
                        ),
                        "quantity_needed": (
                            float(quantity_needed)
                            if quantity_needed is not None
                            else None
                        ),
                        "requested_quantity_unit": requested_quantity_unit,
                        "people_to_feed": people_to_feed,
                        "ai_reason": ai_reason,
                        "status": match_status,
                        "created_at": created_at,
                    }
                )

            return {
                "donation_id": donation_id_db,

                "donation": {
                    "food_name": food_name,
                    "food_type": donation_food_type,
                    "quantity": (
                        float(donation_quantity)
                        if donation_quantity is not None
                        else None
                    ),
                    "quantity_unit": donation_quantity_unit,
                    "latitude": (
                        float(donor_latitude)
                        if donor_latitude is not None
                        else None
                    ),
                    "longitude": (
                        float(donor_longitude)
                        if donor_longitude is not None
                        else None
                    ),
                    "status": donation_status,
                },

                "count": len(formatted_matches),

                "matches": formatted_matches,
            }

    finally:
        connection.close()


# ============================================================
# ACCEPT A MATCH
# ============================================================

@router.post(
    "/{match_id}/accept"
)
def accept_match(
    match_id: int,
    current_user: dict = Depends(get_current_user),
):

    if current_user["role"] != "donor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only donors can accept matches.",
        )

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            # ------------------------------------------------
            # GET MATCH + DONATION + RECIPIENT
            # ------------------------------------------------

            cursor.execute(
                """
                SELECT
                    fm.id,
                    fm.donation_id,
                    fm.recipient_id,
                    fm.status,

                    fd.donor_id,
                    fd.status,
                    fd.address,

                    rp.address

                FROM food_matches fm

                JOIN food_donations fd
                    ON fd.id = fm.donation_id

                JOIN recipient_profiles rp
                    ON rp.user_id = fm.recipient_id

                WHERE fm.id = %s

                FOR UPDATE OF fm, fd
                """,
                (match_id,),
            )

            match = cursor.fetchone()

            if not match:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Match not found.",
                )

            (
                match_id_db,
                donation_id,
                recipient_id,
                match_status,
                donor_id,
                donation_status,
                pickup_address,
                delivery_address,
            ) = match

            # ------------------------------------------------
            # VERIFY DONOR
            # ------------------------------------------------

            if donor_id != current_user["id"]:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You can only accept matches for your own donations.",
                )

            # ------------------------------------------------
            # VERIFY MATCH STATUS
            # ------------------------------------------------

            if match_status != "suggested":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="This match is no longer available for acceptance.",
                )

            # ------------------------------------------------
            # VERIFY DONATION STATUS
            # ------------------------------------------------

            if donation_status != "available":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="This donation is no longer available.",
                )

            # ------------------------------------------------
            # VERIFY ADDRESSES
            # ------------------------------------------------

            if not pickup_address:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="The donation pickup address is missing.",
                )

            if not delivery_address:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="The recipient delivery address is missing.",
                )

            # ------------------------------------------------
            # ACCEPT SELECTED MATCH
            # ------------------------------------------------

            cursor.execute(
                """
                UPDATE food_matches
                SET status = 'accepted'
                WHERE id = %s
                """,
                (match_id_db,),
            )

            # ------------------------------------------------
            # RESERVE DONATION
            # ------------------------------------------------

            cursor.execute(
                """
                UPDATE food_donations
                SET status = 'reserved'
                WHERE id = %s
                """,
                (donation_id,),
            )

            # ------------------------------------------------
            # REJECT OTHER SUGGESTED MATCHES
            # ------------------------------------------------

            cursor.execute(
                """
                UPDATE food_matches
                SET status = 'rejected'
                WHERE donation_id = %s
                  AND id != %s
                  AND status = 'suggested'
                """,
                (
                    donation_id,
                    match_id_db,
                ),
            )

            rejected_count = cursor.rowcount

            # ------------------------------------------------
            # CREATE DELIVERY
            # ------------------------------------------------

            cursor.execute(
                """
                INSERT INTO deliveries (
                    match_id,
                    volunteer_id,
                    pickup_address,
                    delivery_address,
                    status
                )
                VALUES (
                    %s,
                    NULL,
                    %s,
                    %s,
                    'pending'
                )
                RETURNING id
                """,
                (
                    match_id_db,
                    pickup_address,
                    delivery_address,
                ),
            )

            delivery = cursor.fetchone()

            delivery_id = (
                delivery[0]
                if delivery
                else None
            )

            # ------------------------------------------------
            # COMMIT
            # ------------------------------------------------

            connection.commit()

            return {
                "status": "success",

                "message": (
                    "Match accepted successfully. "
                    "Donation reserved and delivery created."
                ),

                "match": {
                    "match_id": match_id_db,
                    "donation_id": donation_id,
                    "recipient_id": recipient_id,
                    "status": "accepted",
                },

                "donation": {
                    "donation_id": donation_id,
                    "status": "reserved",
                },

                "delivery": {
                    "id": delivery_id,
                    "delivery_id": delivery_id,
                    "match_id": match_id_db,
                    "status": "pending",
                    "pickup_address": pickup_address,
                    "delivery_address": delivery_address,
                },

                "rejected_matches": rejected_count,
            }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:

        connection.rollback()

        print(
            "ACCEPT MATCH ERROR:",
            error,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to accept match.",
        )

    finally:
        connection.close()