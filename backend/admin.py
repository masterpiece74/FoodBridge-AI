from fastapi import APIRouter, Depends, HTTPException, status

from auth import get_current_admin
from database import get_connection


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


# =========================================================
# ADMIN OVERVIEW
# =========================================================

@router.get("/overview")
def get_admin_overview(
    current_admin: dict = Depends(get_current_admin),
):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            # =========================
            # USER COUNTS
            # =========================

            cursor.execute(
                """
                SELECT
                    COUNT(*) AS total_users,
                    COUNT(*) FILTER (WHERE role = 'donor') AS donors,
                    COUNT(*) FILTER (WHERE role = 'recipient') AS recipients,
                    COUNT(*) FILTER (WHERE role = 'volunteer') AS volunteers,
                    COUNT(*) FILTER (WHERE role = 'admin') AS admins
                FROM users
                """
            )

            users = cursor.fetchone()

            # =========================
            # DONATION COUNTS
            # =========================

            cursor.execute(
                """
                SELECT
                    COUNT(*) AS total_donations,
                    COUNT(*) FILTER (
                        WHERE status = 'available'
                    ) AS available,
                    COUNT(*) FILTER (
                        WHERE status = 'matched'
                    ) AS matched,
                    COUNT(*) FILTER (
                        WHERE status = 'reserved'
                    ) AS reserved,
                    COUNT(*) FILTER (
                        WHERE status = 'picked_up'
                    ) AS picked_up,
                    COUNT(*) FILTER (
                        WHERE status = 'delivered'
                    ) AS delivered,
                    COUNT(*) FILTER (
                        WHERE status = 'expired'
                    ) AS expired,
                    COUNT(*) FILTER (
                        WHERE status = 'cancelled'
                    ) AS cancelled
                FROM food_donations
                """
            )

            donations = cursor.fetchone()

            # =========================
            # MATCH COUNTS
            # =========================

            cursor.execute(
                """
                SELECT
                    COUNT(*) AS total_matches,
                    COUNT(*) FILTER (
                        WHERE status = 'suggested'
                    ) AS suggested,
                    COUNT(*) FILTER (
                        WHERE status = 'accepted'
                    ) AS accepted,
                    COUNT(*) FILTER (
                        WHERE status = 'rejected'
                    ) AS rejected,
                    COUNT(*) FILTER (
                        WHERE status = 'completed'
                    ) AS completed
                FROM food_matches
                """
            )

            matches = cursor.fetchone()

            # =========================
            # DELIVERY COUNTS
            # =========================

            cursor.execute(
                """
                SELECT
                    COUNT(*) AS total_deliveries,
                    COUNT(*) FILTER (
                        WHERE status = 'pending'
                    ) AS pending,
                    COUNT(*) FILTER (
                        WHERE status = 'assigned'
                    ) AS assigned,
                    COUNT(*) FILTER (
                        WHERE status = 'picked_up'
                    ) AS picked_up,
                    COUNT(*) FILTER (
                        WHERE status = 'in_transit'
                    ) AS in_transit,
                    COUNT(*) FILTER (
                        WHERE status = 'delivered'
                    ) AS delivered,
                    COUNT(*) FILTER (
                        WHERE status = 'cancelled'
                    ) AS cancelled
                FROM deliveries
                """
            )

            deliveries = cursor.fetchone()

            # =========================
            # IMPACT
            # =========================

            cursor.execute(
                """
                SELECT
                    COALESCE(SUM(meals_rescued), 0),
                    COALESCE(SUM(food_saved_kg), 0),
                    COALESCE(SUM(people_supported), 0)
                FROM impact_records
                """
            )

            impact = cursor.fetchone()

            # =========================
            # VERIFICATION
            # =========================

            cursor.execute(
                """
                SELECT
                    COUNT(*) AS total_recipient_profiles,
                    COUNT(*) FILTER (
                        WHERE verification_status = 'pending'
                    ) AS pending,
                    COUNT(*) FILTER (
                        WHERE verification_status = 'verified'
                    ) AS verified,
                    COUNT(*) FILTER (
                        WHERE verification_status = 'rejected'
                    ) AS rejected
                FROM recipient_profiles
                """
            )

            verification = cursor.fetchone()

            return {
                "users": {
                    "total": users[0],
                    "donors": users[1],
                    "recipients": users[2],
                    "volunteers": users[3],
                    "admins": users[4],
                },
                "donations": {
                    "total": donations[0],
                    "available": donations[1],
                    "matched": donations[2],
                    "reserved": donations[3],
                    "picked_up": donations[4],
                    "delivered": donations[5],
                    "expired": donations[6],
                    "cancelled": donations[7],
                },
                "matches": {
                    "total": matches[0],
                    "suggested": matches[1],
                    "accepted": matches[2],
                    "rejected": matches[3],
                    "completed": matches[4],
                },
                "deliveries": {
                    "total": deliveries[0],
                    "pending": deliveries[1],
                    "assigned": deliveries[2],
                    "picked_up": deliveries[3],
                    "in_transit": deliveries[4],
                    "delivered": deliveries[5],
                    "cancelled": deliveries[6],
                },
                "impact": {
                    "meals_rescued": impact[0],
                    "food_saved_kg": float(impact[1]),
                    "people_supported": impact[2],
                },
                "verification": {
                    "total": verification[0],
                    "pending": verification[1],
                    "verified": verification[2],
                    "rejected": verification[3],
                },
            }

    finally:
        connection.close()


# =========================================================
# USERS
# =========================================================

@router.get("/users")
def get_users(
    current_admin: dict = Depends(get_current_admin),
):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    id,
                    full_name,
                    email,
                    phone,
                    role,
                    is_verified,
                    created_at
                FROM users
                ORDER BY created_at DESC
                """
            )

            rows = cursor.fetchall()

            users = [
                {
                    "id": row[0],
                    "full_name": row[1],
                    "email": row[2],
                    "phone": row[3],
                    "role": row[4],
                    "is_verified": row[5],
                    "created_at": row[6],
                }
                for row in rows
            ]

            return {
                "count": len(users),
                "users": users,
            }

    finally:
        connection.close()


# =========================================================
# DONATIONS
# =========================================================

@router.get("/donations")
def get_admin_donations(
    current_admin: dict = Depends(get_current_admin),
):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    d.id,
                    d.food_name,
                    d.food_type,
                    d.quantity,
                    d.quantity_unit,
                    d.freshness_score,
                    d.urgency_score,
                    d.city,
                    d.state,
                    d.status,
                    d.created_at,

                    u.id,
                    u.full_name,
                    u.email

                FROM food_donations d

                JOIN users u
                    ON d.donor_id = u.id

                ORDER BY d.created_at DESC
                """
            )

            rows = cursor.fetchall()

            donations = [
                {
                    "id": row[0],
                    "food_name": row[1],
                    "food_type": row[2],
                    "quantity": float(row[3]),
                    "quantity_unit": row[4],
                    "freshness_score": row[5],
                    "urgency_score": row[6],
                    "city": row[7],
                    "state": row[8],
                    "status": row[9],
                    "created_at": row[10],
                    "donor": {
                        "id": row[11],
                        "full_name": row[12],
                        "email": row[13],
                    },
                }
                for row in rows
            ]

            return {
                "count": len(donations),
                "donations": donations,
            }

    finally:
        connection.close()


# =========================================================
# DELIVERIES
# =========================================================

@router.get("/deliveries")
def get_admin_deliveries(
    current_admin: dict = Depends(get_current_admin),
):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    d.id,
                    d.status,
                    d.pickup_address,
                    d.delivery_address,
                    d.pickup_time,
                    d.delivery_time,
                    d.created_at,

                    fm.id,
                    fm.match_score,

                    fd.id,
                    fd.food_name,
                    fd.quantity,
                    fd.quantity_unit,

                    donor.id,
                    donor.full_name,

                    recipient.id,
                    recipient.full_name,

                    volunteer.id,
                    volunteer.full_name

                FROM deliveries d

                JOIN food_matches fm
                    ON d.match_id = fm.id

                JOIN food_donations fd
                    ON fm.donation_id = fd.id

                JOIN users donor
                    ON fd.donor_id = donor.id

                JOIN users recipient
                    ON fm.recipient_id = recipient.id

                LEFT JOIN users volunteer
                    ON d.volunteer_id = volunteer.id

                ORDER BY d.created_at DESC
                """
            )

            rows = cursor.fetchall()

            deliveries = [
                {
                    "id": row[0],
                    "status": row[1],
                    "pickup_address": row[2],
                    "delivery_address": row[3],
                    "pickup_time": row[4],
                    "delivery_time": row[5],
                    "created_at": row[6],

                    "match": {
                        "id": row[7],
                        "score": float(row[8]),
                    },

                    "food": {
                        "id": row[9],
                        "name": row[10],
                        "quantity": float(row[11]),
                        "quantity_unit": row[12],
                    },

                    "donor": {
                        "id": row[13],
                        "full_name": row[14],
                    },

                    "recipient": {
                        "id": row[15],
                        "full_name": row[16],
                    },

                    "volunteer": (
                        {
                            "id": row[17],
                            "full_name": row[18],
                        }
                        if row[17] is not None
                        else None
                    ),
                }
                for row in rows
            ]

            return {
                "count": len(deliveries),
                "deliveries": deliveries,
            }

    finally:
        connection.close()


# =========================================================
# RECIPIENT / ORGANISATION VERIFICATION
# =========================================================

@router.get("/organisations")
def get_organisations(
    current_admin: dict = Depends(get_current_admin),
):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    rp.id,
                    rp.user_id,
                    rp.organization_name,
                    rp.organization_type,
                    rp.address,
                    rp.city,
                    rp.state,
                    rp.people_supported,
                    rp.verification_status,

                    u.full_name,
                    u.email,
                    u.phone,
                    u.is_verified

                FROM recipient_profiles rp

                JOIN users u
                    ON rp.user_id = u.id

                ORDER BY rp.id DESC
                """
            )

            rows = cursor.fetchall()

            organisations = [
                {
                    "id": row[0],
                    "user_id": row[1],
                    "organization_name": row[2],
                    "organization_type": row[3],
                    "address": row[4],
                    "city": row[5],
                    "state": row[6],
                    "people_supported": row[7],
                    "verification_status": row[8],
                    "contact": {
                        "full_name": row[9],
                        "email": row[10],
                        "phone": row[11],
                    },
                    "user_verified": row[12],
                }
                for row in rows
            ]

            return {
                "count": len(organisations),
                "organisations": organisations,
            }

    finally:
        connection.close()


# =========================================================
# VERIFY ORGANISATION
# =========================================================

@router.patch(
    "/organisations/{profile_id}/verify"
)
def verify_organisation(
    profile_id: int,
    current_admin: dict = Depends(get_current_admin),
):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    id,
                    user_id,
                    verification_status
                FROM recipient_profiles
                WHERE id = %s
                """,
                (profile_id,),
            )

            profile = cursor.fetchone()

            if not profile:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Organisation profile not found.",
                )

            cursor.execute(
                """
                UPDATE recipient_profiles
                SET verification_status = 'verified'
                WHERE id = %s
                """,
                (profile_id,),
            )

            cursor.execute(
                """
                UPDATE users
                SET is_verified = TRUE
                WHERE id = %s
                """,
                (profile[1],),
            )

            connection.commit()

            return {
                "message": "Organisation verified successfully.",
                "profile_id": profile_id,
                "user_id": profile[1],
                "verification_status": "verified",
            }

    finally:
        connection.close()


# =========================================================
# REJECT ORGANISATION
# =========================================================

@router.patch(
    "/organisations/{profile_id}/reject"
)
def reject_organisation(
    profile_id: int,
    current_admin: dict = Depends(get_current_admin),
):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    id,
                    user_id
                FROM recipient_profiles
                WHERE id = %s
                """,
                (profile_id,),
            )

            profile = cursor.fetchone()

            if not profile:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Organisation profile not found.",
                )

            cursor.execute(
                """
                UPDATE recipient_profiles
                SET verification_status = 'rejected'
                WHERE id = %s
                """,
                (profile_id,),
            )

            cursor.execute(
                """
                UPDATE users
                SET is_verified = FALSE
                WHERE id = %s
                """,
                (profile[1],),
            )

            connection.commit()

            return {
                "message": "Organisation verification rejected.",
                "profile_id": profile_id,
                "user_id": profile[1],
                "verification_status": "rejected",
            }

    finally:
        connection.close()