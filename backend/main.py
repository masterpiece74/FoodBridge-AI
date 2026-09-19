from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import get_connection
from auth import router as auth_router
from donations import router as donations_router
from recipient_needs import router as recipient_needs_router
from recipient_profiles import router as recipient_profiles_router
from matching import router as matching_router
from deliveries import router as deliveries_router
from recipient_deliveries import router as recipient_deliveries_router
from notifications import router as notifications_router
from admin import router as admin_router
from impact import router as impact_router

app = FastAPI(
    title="FoodBridge AI API",
    description="AI-powered platform for turning surplus food into meaningful impact.",
    version="1.0.0",
)


# =========================
# CORS CONFIGURATION
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "https://food-bridge-ai-self.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# =========================
# API ROUTES
# =========================

# Authentication
app.include_router(auth_router)

# Food Donations
app.include_router(donations_router)

# Recipient Needs
app.include_router(recipient_needs_router)

# Recipient Profiles
app.include_router(recipient_profiles_router)

# AI Matching
app.include_router(matching_router)
# Deliveries
app.include_router(deliveries_router)

# Recipient Deliveries
app.include_router(recipient_deliveries_router)

# Notifications
app.include_router(notifications_router)

# Admin
app.include_router(admin_router)

# Impact
app.include_router(impact_router)

# =========================
# ROOT
# =========================

@app.get("/")
def root():
    return {
        "message": "Welcome to FoodBridge AI API",
        "status": "running",
    }


# =========================
# HEALTH CHECK
# =========================

@app.get("/health")
def health_check():
    try:
        connection = get_connection()
        connection.close()

        return {
            "status": "healthy",
            "database": "connected",
        }

    except Exception as error:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(error),
        }