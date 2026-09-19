from fastapi import APIRouter, Depends, HTTPException, status
from auth import get_current_user
from database import get_connection

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


# =========================================================
# GET NOTIFICATIONS
# =========================================================

@router.get("/")
def get_notifications(
    current_user: dict = Depends(get_current_user)
):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    user_id,
                    title,
                    message,
                    notification_type,
                    related_delivery_id,
                    related_donation_id,
                    related_match_id,
                    is_read,
                    created_at
                FROM notifications
                WHERE user_id = %s
                ORDER BY created_at DESC
                """,
                (current_user["id"],)
            )

            rows = cursor.fetchall()

            return {
                "count": len(rows),
                "unread_count": sum(
                    1 for row in rows if not row[8]
                ),
                "notifications": [
                    {
                        "id": row[0],
                        "user_id": row[1],
                        "title": row[2],
                        "message": row[3],
                        "notification_type": row[4],
                        "related_delivery_id": row[5],
                        "related_donation_id": row[6],
                        "related_match_id": row[7],
                        "is_read": row[8],
                        "created_at": row[9],
                    }
                    for row in rows
                ],
            }

    finally:
        connection.close()


# =========================================================
# MARK ONE NOTIFICATION AS READ
# =========================================================

@router.patch("/{notification_id}/read")
def mark_notification_as_read(
    notification_id: int,
    current_user: dict = Depends(get_current_user)
):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute(
                """
                SELECT id
                FROM notifications
                WHERE id = %s
                AND user_id = %s
                """,
                (
                    notification_id,
                    current_user["id"],
                )
            )

            notification = cursor.fetchone()

            if not notification:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Notification not found."
                )

            cursor.execute(
                """
                UPDATE notifications
                SET is_read = TRUE
                WHERE id = %s
                AND user_id = %s
                """,
                (
                    notification_id,
                    current_user["id"],
                )
            )

            connection.commit()

            return {
                "message": "Notification marked as read.",
                "notification_id": notification_id,
            }

    finally:
        connection.close()


# =========================================================
# MARK ALL NOTIFICATIONS AS READ
# =========================================================

@router.patch("/read-all")
def mark_all_notifications_as_read(
    current_user: dict = Depends(get_current_user)
):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute(
                """
                UPDATE notifications
                SET is_read = TRUE
                WHERE user_id = %s
                AND is_read = FALSE
                """,
                (current_user["id"],)
            )

            updated_count = cursor.rowcount

            connection.commit()

            return {
                "message": "All notifications marked as read.",
                "updated_count": updated_count,
            }

    finally:
        connection.close()