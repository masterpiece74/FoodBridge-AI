from fastapi import APIRouter, Depends, HTTPException, status
from auth import get_current_user
from database import get_connection

router = APIRouter(
    prefix="/recipient-deliveries",
    tags=["Recipient Deliveries"]
)


@router.get("/")
def get_recipient_deliveries(
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] != "recipient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recipients can view recipient deliveries."
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
                    rp.state,
                    rp.people_supported
                FROM deliveries d
                JOIN food_matches fm
                    ON fm.id = d.match_id
                JOIN food_donations fd
                    ON fd.id = fm.donation_id
                JOIN recipient_profiles rp
                    ON rp.user_id = fm.recipient_id
                WHERE fm.recipient_id = %s
                ORDER BY d.id DESC
                """,
                (current_user["id"],),
            )

            rows = cursor.fetchall()

            return {
                "count": len(rows),
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
                            "people_supported": row[15] or 0,
                        },
                    }
                    for row in rows
                ],
            }

    finally:
        connection.close()