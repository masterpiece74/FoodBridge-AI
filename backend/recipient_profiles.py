from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
import requests

from database import get_connection
from auth import get_current_user


router = APIRouter(
    prefix="/recipient-profile",
    tags=["Recipient Profile"],
)


# ============================================================
# MODELS
# ============================================================

class RecipientProfileCreate(BaseModel):
    organization_name: str
    organization_type: str
    address: str
    city: str
    state: str

    latitude: Optional[float] = Field(
        default=None,
        ge=-90,
        le=90,
    )

    longitude: Optional[float] = Field(
        default=None,
        ge=-180,
        le=180,
    )

    people_supported: int = 0


class RecipientLocationRequest(BaseModel):
    address: str
    city: Optional[str] = None
    state: Optional[str] = None


class RecipientLocationUpdate(BaseModel):
    address: str
    city: str
    state: str

    latitude: float = Field(
        ge=-90,
        le=90,
    )

    longitude: float = Field(
        ge=-180,
        le=180,
    )


# ============================================================
# CREATE RECIPIENT PROFILE
# ============================================================

@router.post("")
def create_recipient_profile(
    profile: RecipientProfileCreate,
    current_user=Depends(get_current_user),
):
    if current_user["role"] != "recipient":
        raise HTTPException(
            status_code=403,
            detail="Only recipients can create a recipient profile.",
        )

    conn = get_connection()

    try:
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT id
            FROM recipient_profiles
            WHERE user_id = %s
            """,
            (current_user["id"],),
        )

        existing = cursor.fetchone()

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Recipient profile already exists.",
            )

        cursor.execute(
            """
            INSERT INTO recipient_profiles (
                user_id,
                organization_name,
                organization_type,
                address,
                city,
                state,
                latitude,
                longitude,
                people_supported
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
                %s
            )
            RETURNING *
            """,
            (
                current_user["id"],
                profile.organization_name,
                profile.organization_type,
                profile.address,
                profile.city,
                profile.state,
                profile.latitude,
                profile.longitude,
                profile.people_supported,
            ),
        )

        row = cursor.fetchone()

        conn.commit()

        columns = [
            description[0]
            for description in cursor.description
        ]

        result = dict(zip(columns, row))

        return {
            "status": "success",
            "profile": result,
        }

    finally:
        conn.close()


# ============================================================
# GET RECIPIENT PROFILE
# ============================================================

@router.get("")
def get_recipient_profile(
    current_user=Depends(get_current_user),
):
    if current_user["role"] != "recipient":
        raise HTTPException(
            status_code=403,
            detail="Only recipients can access a recipient profile.",
        )

    conn = get_connection()

    try:
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT *
            FROM recipient_profiles
            WHERE user_id = %s
            """,
            (current_user["id"],),
        )

        row = cursor.fetchone()

        if not row:
            raise HTTPException(
                status_code=404,
                detail="Recipient profile not found.",
            )

        columns = [
            description[0]
            for description in cursor.description
        ]

        result = dict(zip(columns, row))

        return {
            "status": "success",
            "profile": result,
        }

    finally:
        conn.close()


# ============================================================
# FIND LOCATION USING OPENSTREETMAP / NOMINATIM
# ============================================================

@router.post("/find-location")
def find_recipient_location(
    location: RecipientLocationRequest,
    current_user=Depends(get_current_user),
):
    if current_user["role"] != "recipient":
        raise HTTPException(
            status_code=403,
            detail="Only recipients can search for recipient locations.",
        )

    address = location.address.strip()
    city = (
        location.city.strip()
        if location.city
        else ""
    )
    state = (
        location.state.strip()
        if location.state
        else ""
    )

    if not address:
        raise HTTPException(
            status_code=400,
            detail="Please provide an address or nearby landmark.",
        )

    # ========================================================
    # BUILD MULTIPLE SEARCH QUERIES
    # ========================================================

    queries = []

    # Most specific query
    if city and state:
        queries.append(
            f"{address}, {city}, {state}, Nigeria"
        )

    # Address + city
    if city:
        queries.append(
            f"{address}, {city}, Nigeria"
        )

    # Address + state
    if state:
        queries.append(
            f"{address}, {state}, Nigeria"
        )

    # Basic Nigeria query
    queries.append(
        f"{address}, Nigeria"
    )

    headers = {
        "User-Agent": (
            "FoodBridge-AI/1.0 "
            "(food-redistribution-hackathon)"
        ),
        "Accept-Language": "en",
    }

    last_error = None

    for query in queries:

        try:
            response = requests.get(
                "https://nominatim.openstreetmap.org/search",
                params={
                    "q": query,
                    "format": "jsonv2",
                    "limit": 5,
                    "countrycodes": "ng",
                    "addressdetails": 1,
                },
                headers=headers,
                timeout=15,
            )

            response.raise_for_status()

            results = response.json()

            if not results:
                continue

            # ==================================================
            # FIND BEST RESULT
            # ==================================================

            selected = None

            # Prefer results that have useful address details.
            for result in results:
                result_address = result.get(
                    "address",
                    {},
                )

                if (
                    result_address.get("city")
                    or result_address.get("town")
                    or result_address.get("municipality")
                    or result_address.get("state")
                ):
                    selected = result
                    break

            if selected is None:
                selected = results[0]

            result_address = selected.get(
                "address",
                {},
            )

            # ==================================================
            # EXTRACT CITY
            # ==================================================

            detected_city = (
                result_address.get("city")
                or result_address.get("town")
                or result_address.get("municipality")
                or result_address.get("village")
                or city
            )

            # ==================================================
            # EXTRACT STATE
            # ==================================================

            detected_state = (
                result_address.get("state")
                or state
            )

            # ==================================================
            # RETURN LOCATION
            # ==================================================

            return {
                "status": "success",

                "display_name": selected.get(
                    "display_name"
                ),

                "address": result_address,

                "city": detected_city,

                "state": detected_state,

                "latitude": float(
                    selected["lat"]
                ),

                "longitude": float(
                    selected["lon"]
                ),

                "source": "OpenStreetMap",
            }

        except requests.RequestException as error:
            last_error = error
            continue

        except (
            ValueError,
            KeyError,
            TypeError,
        ) as error:
            last_error = error
            continue

    # ========================================================
    # NO RESULT
    # ========================================================

    detail = (
        "We could not find that location. "
        "Try adding a nearby landmark, bus stop, "
        "street, city, or state."
    )

    if last_error:
        print(
            "Nominatim location lookup error:",
            last_error,
        )

    raise HTTPException(
        status_code=404,
        detail=detail,
    )


# ============================================================
# UPDATE RECIPIENT LOCATION
# ============================================================

@router.patch("/location")
def update_recipient_location(
    location: RecipientLocationUpdate,
    current_user=Depends(get_current_user),
):
    if current_user["role"] != "recipient":
        raise HTTPException(
            status_code=403,
            detail="Only recipients can update recipient locations.",
        )

    conn = get_connection()

    try:
        cursor = conn.cursor()

        cursor.execute(
            """
            UPDATE recipient_profiles
            SET
                address = %s,
                city = %s,
                state = %s,
                latitude = %s,
                longitude = %s
            WHERE user_id = %s
            RETURNING *
            """,
            (
                location.address,
                location.city,
                location.state,
                location.latitude,
                location.longitude,
                current_user["id"],
            ),
        )

        row = cursor.fetchone()

        if not row:
            raise HTTPException(
                status_code=404,
                detail="Recipient profile not found.",
            )

        conn.commit()

        columns = [
            description[0]
            for description in cursor.description
        ]

        result = dict(zip(columns, row))

        return {
            "status": "success",
            "message": "Recipient location updated successfully.",
            "profile": result,
        }

    finally:
        conn.close()