from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from auth import get_current_user
from database import get_connection


router = APIRouter(
    prefix="/recipient-needs",
    tags=["Recipient Needs"],
)


# =========================
# PYDANTIC MODEL
# =========================

class RecipientNeedRequest(BaseModel):
    food_type: str
    quantity_needed: float
    quantity_unit: str
    urgency_score: int = 50
    people_to_feed: int = 0


# =========================
# CREATE RECIPIENT NEED
# =========================

@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
)
def create_recipient_need(
    need: RecipientNeedRequest,
    current_user: dict = Depends(get_current_user),
):

    # Only recipients can create needs
    if current_user["role"] != "recipient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recipients can create food needs.",
        )

    # Validate quantity
    if need.quantity_needed <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quantity needed must be greater than zero.",
        )

    # Validate urgency
    if not 0 <= need.urgency_score <= 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Urgency score must be between 0 and 100.",
        )

    # Validate people to feed
    if need.people_to_feed < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="People to feed cannot be negative.",
        )

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            # Check that recipient profile exists
            cursor.execute(
                """
                SELECT id
                FROM recipient_profiles
                WHERE user_id = %s
                """,
                (current_user["id"],),
            )

            recipient_profile = cursor.fetchone()

            if not recipient_profile:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=(
                        "Recipient profile not found. "
                        "Please create a recipient profile first."
                    ),
                )

            # Create recipient need
            cursor.execute(
                """
                INSERT INTO recipient_needs (
                    recipient_id,
                    food_type,
                    quantity_needed,
                    quantity_unit,
                    urgency_score,
                    people_to_feed
                )
                VALUES (
                    %s, %s, %s, %s, %s, %s
                )
                RETURNING
                    id,
                    recipient_id,
                    food_type,
                    quantity_needed,
                    quantity_unit,
                    urgency_score,
                    people_to_feed,
                    status,
                    created_at
                """,
                (
                    current_user["id"],
                    need.food_type,
                    need.quantity_needed,
                    need.quantity_unit,
                    need.urgency_score,
                    need.people_to_feed,
                ),
            )

            new_need = cursor.fetchone()

            connection.commit()

            return {
                "message": "Recipient food need created successfully!",
                "need": {
                    "id": new_need[0],
                    "recipient_id": new_need[1],
                    "food_type": new_need[2],
                    "quantity_needed": float(new_need[3]),
                    "quantity_unit": new_need[4],
                    "urgency_score": new_need[5],
                    "people_to_feed": new_need[6],
                    "status": new_need[7],
                    "created_at": new_need[8],
                },
            }

    finally:
        connection.close()


# =========================
# GET MY RECIPIENT NEEDS
# =========================

@router.get("")
def get_my_recipient_needs(
    current_user: dict = Depends(get_current_user),
):

    # Only recipients can view their needs
    if current_user["role"] != "recipient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recipients can access recipient needs.",
        )

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    id,
                    food_type,
                    quantity_needed,
                    quantity_unit,
                    urgency_score,
                    people_to_feed,
                    status,
                    created_at
                FROM recipient_needs
                WHERE recipient_id = %s
                ORDER BY created_at DESC
                """,
                (current_user["id"],),
            )

            needs = cursor.fetchall()

            return {
                "count": len(needs),
                "needs": [
                    {
                        "id": row[0],
                        "food_type": row[1],
                        "quantity_needed": float(row[2]),
                        "quantity_unit": row[3],
                        "urgency_score": row[4],
                        "people_to_feed": row[5],
                        "status": row[6],
                        "created_at": row[7],
                    }
                    for row in needs
                ],
            }

    finally:
        connection.close()