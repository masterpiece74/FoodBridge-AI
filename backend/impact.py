from fastapi import APIRouter
from database import get_connection

router = APIRouter(
    prefix="/impact",
    tags=["Impact"],
)


@router.get("/summary")
def get_impact_summary():
    """
    Return real platform-wide impact statistics
    based on completed deliveries recorded in impact_records.
    """

    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                COALESCE(SUM(meals_rescued), 0) AS meals_rescued,
                COALESCE(SUM(food_saved_kg), 0) AS food_saved_kg,
                COALESCE(SUM(people_supported), 0) AS people_supported,
                COUNT(*) AS completed_deliveries
            FROM impact_records
            """
        )

        row = cursor.fetchone()

        return {
            "status": "success",
            "impact": {
                "meals_rescued": int(row[0] or 0),
                "food_saved_kg": float(row[1] or 0),
                "people_supported": int(row[2] or 0),
                "completed_deliveries": int(row[3] or 0),
            },
        }

    except Exception as error:
        return {
            "status": "error",
            "message": "Unable to retrieve impact statistics.",
            "error": str(error),
        }

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()
