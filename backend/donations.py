from datetime import datetime, timezone
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import json

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from auth import get_current_user
from database import get_connection


router = APIRouter(
    prefix="/donations",
    tags=["Food Donations"],
)


# =========================
# PYDANTIC MODEL
# =========================

class DonationRequest(BaseModel):
    food_name: str
    food_type: str
    description: str | None = None
    quantity: float
    quantity_unit: str
    prepared_at: datetime | None = None
    expiry_time: datetime | None = None
    address: str
    city: str
    state: str
    latitude: float | None = None
    longitude: float | None = None


# =========================
# GEOCODE PICKUP LOCATION
# =========================

def geocode_address(
    address: str,
    city: str,
    state: str,
):
    """
    Convert a pickup address into latitude and longitude.

    Uses OpenStreetMap Nominatim.

    Returns:
        (latitude, longitude)
        or
        (None, None) if location cannot be found.
    """

    try:
        search_address = (
            f"{address}, {city}, {state}, Nigeria"
        )

        params = urlencode({
            "q": search_address,
            "format": "json",
            "limit": 1,
            "countrycodes": "ng",
        })

        url = (
            "https://nominatim.openstreetmap.org/search?"
            + params
        )

        request = Request(
            url,
            headers={
                "User-Agent": "FoodBridge-AI/1.0"
            },
        )

        with urlopen(request, timeout=8) as response:
            data = json.loads(
                response.read().decode("utf-8")
            )

        if not data:
            return None, None

        latitude = float(data[0]["lat"])
        longitude = float(data[0]["lon"])

        # Basic coordinate validation
        if not (-90 <= latitude <= 90):
            return None, None

        if not (-180 <= longitude <= 180):
            return None, None

        return latitude, longitude

    except Exception as error:
        print(
            f"GEOCODING WARNING: Could not geocode "
            f"'{address}, {city}, {state}': {error}"
        )

        return None, None


# =========================
# AI FRESHNESS SCORE
# =========================

def calculate_freshness_score(
    prepared_at: datetime | None,
    expiry_time: datetime | None,
):
    """
    Calculate an initial freshness score from 0-100.

    100 = very fresh
    0   = expired
    """

    if not expiry_time:
        return 70

    now = datetime.now(timezone.utc)

    # Already expired
    if expiry_time <= now:
        return 0

    # If preparation time isn't available,
    # use a neutral starting score.
    if not prepared_at:
        return 70

    # Invalid time range
    if prepared_at >= expiry_time:
        return 0

    total_duration = (
        expiry_time - prepared_at
    ).total_seconds()

    elapsed_duration = (
        now - prepared_at
    ).total_seconds()

    if total_duration <= 0:
        return 0

    freshness = 100 - (
        elapsed_duration / total_duration
    ) * 100

    return max(
        0,
        min(100, round(freshness)),
    )


# =========================
# AI URGENCY SCORE
# =========================

def calculate_urgency_score(
    expiry_time: datetime | None,
):
    """
    Calculate how urgently the food should be distributed.

    100 = extremely urgent
    20  = low urgency
    """

    if not expiry_time:
        return 30

    now = datetime.now(timezone.utc)

    remaining_hours = (
        expiry_time - now
    ).total_seconds() / 3600

    # Already expired
    if remaining_hours <= 0:
        return 100

    if remaining_hours <= 2:
        return 100

    if remaining_hours <= 6:
        return 90

    if remaining_hours <= 12:
        return 75

    if remaining_hours <= 24:
        return 60

    if remaining_hours <= 48:
        return 40

    return 20


# =========================
# CREATE FOOD DONATION
# =========================

@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
)
def create_donation(
    donation: DonationRequest,
    current_user: dict = Depends(get_current_user),
):

    # Only donors can create donations
    if current_user["role"] != "donor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only donors can create food donations.",
        )

    # Validate quantity
    if donation.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than zero.",
        )

    # Validate preparation and expiry times
    if (
        donation.prepared_at
        and donation.expiry_time
        and donation.expiry_time <= donation.prepared_at
    ):
        raise HTTPException(
            status_code=400,
            detail="Expiry time must be after prepared time.",
        )

    # =========================
    # DETERMINE DONOR LOCATION
    # =========================

    latitude = donation.latitude
    longitude = donation.longitude

    # If frontend did not provide coordinates,
    # automatically geocode the pickup address.
    if latitude is None or longitude is None:

        latitude, longitude = geocode_address(
            donation.address,
            donation.city,
            donation.state,
        )

    print(
        "DONATION LOCATION:",
        latitude,
        longitude,
    )

    # Calculate AI scores
    freshness_score = calculate_freshness_score(
        donation.prepared_at,
        donation.expiry_time,
    )

    urgency_score = calculate_urgency_score(
        donation.expiry_time,
    )

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute(
                """
                INSERT INTO food_donations (
                    donor_id,
                    food_name,
                    food_type,
                    description,
                    quantity,
                    quantity_unit,
                    prepared_at,
                    expiry_time,
                    freshness_score,
                    urgency_score,
                    address,
                    city,
                    state,
                    latitude,
                    longitude
                )
                VALUES (
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s
                )
                RETURNING
                    id,
                    food_name,
                    food_type,
                    quantity,
                    quantity_unit,
                    freshness_score,
                    urgency_score,
                    status,
                    created_at,
                    latitude,
                    longitude
                """,
                (
                    current_user["id"],
                    donation.food_name,
                    donation.food_type,
                    donation.description,
                    donation.quantity,
                    donation.quantity_unit,
                    donation.prepared_at,
                    donation.expiry_time,
                    freshness_score,
                    urgency_score,
                    donation.address,
                    donation.city,
                    donation.state,
                    latitude,
                    longitude,
                ),
            )

            new_donation = cursor.fetchone()

            connection.commit()

            return {
                "message": "Food donation created successfully!",

                "donation": {
                    "id": new_donation[0],
                    "food_name": new_donation[1],
                    "food_type": new_donation[2],
                    "quantity": float(new_donation[3]),
                    "quantity_unit": new_donation[4],
                    "freshness_score": new_donation[5],
                    "urgency_score": new_donation[6],
                    "status": new_donation[7],
                    "created_at": new_donation[8],

                    # Location information
                    "latitude": new_donation[9],
                    "longitude": new_donation[10],
                },

                "ai_insight": {
                    "freshness": f"{freshness_score}%",
                    "urgency": f"{urgency_score}%",

                    "recommendation": (
                        "Donate soon"
                        if urgency_score >= 60
                        else "Good time to match"
                    ),
                },
            }

    finally:
        connection.close()


# =========================
# GET MY DONATIONS
# =========================

@router.get("")
def get_my_donations(
    current_user: dict = Depends(get_current_user),
):

    # Only donors can view donor donations
    if current_user["role"] != "donor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only donors can access donor donations.",
        )

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    id,
                    food_name,
                    food_type,
                    quantity,
                    quantity_unit,
                    freshness_score,
                    urgency_score,
                    status,
                    created_at,
                    latitude,
                    longitude
                FROM food_donations
                WHERE donor_id = %s
                ORDER BY created_at DESC
                """,
                (current_user["id"],),
            )

            donations = cursor.fetchall()

            return {
                "count": len(donations),

                "donations": [
                    {
                        "id": row[0],
                        "food_name": row[1],
                        "food_type": row[2],
                        "quantity": float(row[3]),
                        "quantity_unit": row[4],
                        "freshness_score": row[5],
                        "urgency_score": row[6],
                        "status": row[7],
                        "created_at": row[8],

                        # Location information
                        "latitude": row[9],
                        "longitude": row[10],
                    }

                    for row in donations
                ],
            }

    finally:
        connection.close()