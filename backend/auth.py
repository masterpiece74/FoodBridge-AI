from datetime import datetime, timedelta, timezone
import os
import secrets
import resend

import jwt
from dotenv import load_dotenv
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
)
from pydantic import BaseModel, EmailStr
from pwdlib import PasswordHash

from database import get_connection


# =========================
# LOAD ENVIRONMENT VARIABLES
# =========================

load_dotenv()


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# =========================
# PASSWORD HASHING
# =========================

password_hash = PasswordHash.recommended()


# =========================
# JWT SETTINGS
# =========================

SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    raise RuntimeError(
        "SECRET_KEY is not configured in the .env file."
    )

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_HOURS = 24

# Password reset tokens are valid for 30 minutes.
PASSWORD_RESET_EXPIRE_MINUTES = 30


# =========================
# RESEND EMAIL SETTINGS
# =========================

RESEND_API_KEY = os.getenv("RESEND_API_KEY")

if not RESEND_API_KEY:
    raise RuntimeError(
        "RESEND_API_KEY is not configured in the .env file."
    )

resend.api_key = RESEND_API_KEY


# =========================
# JWT SECURITY
# =========================

security = HTTPBearer()


# =========================
# PYDANTIC MODELS
# =========================

class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    phone: str | None = None
    password: str
    role: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


# =========================
# CREATE ACCESS TOKEN
# =========================

def create_access_token(
    user_id: int,
    role: str,
):
    expire = datetime.now(timezone.utc) + timedelta(
        hours=ACCESS_TOKEN_EXPIRE_HOURS
    )

    payload = {
        "sub": str(user_id),
        "role": role,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


# =========================
# SEND PASSWORD RESET EMAIL
# =========================

def send_password_reset_email(
    recipient_email: str,
    recipient_name: str,
    reset_link: str,
):
    """
    Send a password reset email using Resend.
    """

    html_content = f"""
    <html>
        <body style="
            margin: 0;
            padding: 30px;
            background-color: #FAFAF7;
            font-family: Arial, sans-serif;
            color: #0B2F1A;
        ">

            <div style="
                max-width: 600px;
                margin: 0 auto;
            ">

                <div style="
                    text-align: center;
                    margin-bottom: 28px;
                ">

                    <h1 style="
                        color: #14532D;
                        margin-bottom: 8px;
                    ">
                        FoodBridge AI
                    </h1>

                    <p style="
                        color: #666666;
                        margin-top: 0;
                    ">
                        Turning Surplus Into Hope
                    </p>

                </div>

                <div style="
                    background-color: #ffffff;
                    padding: 32px;
                    border-radius: 16px;
                ">

                    <h2 style="
                        color: #14532D;
                        margin-top: 0;
                    ">
                        Reset Your Password
                    </h2>

                    <p>
                        Hello {recipient_name},
                    </p>

                    <p>
                        We received a request to reset
                        your FoodBridge AI password.
                    </p>

                    <p>
                        Click the button below to create
                        a new password:
                    </p>

                    <div style="
                        text-align: center;
                        margin: 30px 0;
                    ">

                        <a
                            href="{reset_link}"
                            style="
                                display: inline-block;
                                background-color: #1F7A4D;
                                color: #ffffff;
                                padding: 14px 28px;
                                text-decoration: none;
                                border-radius: 8px;
                                font-weight: bold;
                            "
                        >
                            Reset My Password
                        </a>

                    </div>

                    <p style="
                        color: #666666;
                        font-size: 14px;
                    ">
                        This password reset link will
                        expire in 30 minutes.
                    </p>

                    <p style="
                        color: #666666;
                        font-size: 14px;
                    ">
                        If you did not request this
                        password reset, you can safely
                        ignore this email.
                    </p>

                </div>

                <p style="
                    text-align: center;
                    color: #888888;
                    font-size: 12px;
                    margin-top: 24px;
                ">
                    © 2026 FoodBridge AI.
                    Turning Surplus Into Hope.
                </p>

            </div>

        </body>
    </html>
    """

    response = resend.Emails.send(
        {
            "from": "FoodBridge AI <onboarding@resend.dev>",
            "to": [recipient_email],
            "subject": "Reset Your FoodBridge AI Password",
            "html": html_content,
        }
    )

    return response


# =========================
# GET CURRENT USER
# =========================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    ),
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        user_id = int(payload["sub"])
        role = payload["role"]

        return {
            "id": user_id,
            "role": role,
        }

    except (
        jwt.ExpiredSignatureError,
        jwt.InvalidTokenError,
        KeyError,
        ValueError,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )


# =========================
# GET CURRENT ADMIN
# =========================

def get_current_admin(
    current_user: dict = Depends(get_current_user),
):
    """
    Allow access only to users with the admin role.
    """

    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )

    return current_user


# =========================
# REGISTER
# =========================

@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
)
def register(user: RegisterRequest):

    # Public registration roles only.
    # Admin accounts must be created separately.
    allowed_roles = [
        "donor",
        "recipient",
        "volunteer",
    ]

    if user.role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Role must be donor, recipient, "
                "or volunteer."
            ),
        )

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            # =========================
            # CHECK EXISTING EMAIL
            # =========================

            cursor.execute(
                """
                SELECT id
                FROM users
                WHERE email = %s
                """,
                (user.email,),
            )

            existing_user = cursor.fetchone()

            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=(
                        "An account with this email "
                        "already exists."
                    ),
                )

            # =========================
            # HASH PASSWORD
            # =========================

            hashed_password = password_hash.hash(
                user.password
            )

            # =========================
            # CREATE USER
            # =========================

            cursor.execute(
                """
                INSERT INTO users (
                    full_name,
                    email,
                    phone,
                    password_hash,
                    role
                )
                VALUES (%s, %s, %s, %s, %s)
                RETURNING
                    id,
                    full_name,
                    email,
                    role
                """,
                (
                    user.full_name,
                    user.email,
                    user.phone,
                    hashed_password,
                    user.role,
                ),
            )

            new_user = cursor.fetchone()

            connection.commit()

            return {
                "message": "Registration successful!",
                "user": {
                    "id": new_user[0],
                    "full_name": new_user[1],
                    "email": new_user[2],
                    "role": new_user[3],
                },
            }

    finally:
        connection.close()


# =========================
# LOGIN
# =========================

@router.post("/login")
def login(
    credentials: LoginRequest,
):

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            # =========================
            # FIND USER
            # =========================

            cursor.execute(
                """
                SELECT
                    id,
                    full_name,
                    email,
                    password_hash,
                    role
                FROM users
                WHERE email = %s
                """,
                (credentials.email,),
            )

            user = cursor.fetchone()

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password.",
                )

            # =========================
            # VERIFY PASSWORD
            # =========================

            password_valid = password_hash.verify(
                credentials.password,
                user[3],
            )

            if not password_valid:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password.",
                )

            # =========================
            # CREATE JWT
            # =========================

            access_token = create_access_token(
                user_id=user[0],
                role=user[4],
            )

            return {
                "message": "Login successful!",
                "access_token": access_token,
                "token_type": "bearer",
                "user": {
                    "id": user[0],
                    "full_name": user[1],
                    "email": user[2],
                    "role": user[4],
                },
            }

    finally:
        connection.close()


# ============================================================
# FORGOT PASSWORD
# ============================================================

@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
):
    """
    Generate a secure password reset token and send
    the reset link to the user's email.

    The reset link is NOT returned to the frontend.
    """

    connection = get_connection()

    # Always return the same public message whether or not
    # the email exists. This helps prevent account enumeration.

    generic_message = (
        "If an account with that email exists, "
        "a password reset link has been sent."
    )

    try:
        with connection.cursor() as cursor:

            # =========================
            # FIND USER
            # =========================

            cursor.execute(
                """
                SELECT
                    id,
                    full_name,
                    email
                FROM users
                WHERE email = %s
                """,
                (request.email,),
            )

            user = cursor.fetchone()

            if not user:
                return {
                    "message": generic_message,
                }

            user_id = user[0]
            full_name = user[1]
            email = user[2]

            # =========================
            # CREATE SECURE TOKEN
            # =========================

            reset_token = secrets.token_urlsafe(32)

            reset_expires = (
                datetime.now(timezone.utc)
                + timedelta(
                    minutes=PASSWORD_RESET_EXPIRE_MINUTES
                )
            )

            # =========================
            # SAVE TOKEN
            # =========================

            cursor.execute(
                """
                UPDATE users
                SET
                    reset_token = %s,
                    reset_token_expires_at = %s
                WHERE id = %s
                """,
                (
                    reset_token,
                    reset_expires,
                    user_id,
                ),
            )

            connection.commit()

            # =========================
            # CREATE RESET LINK
            # =========================

            reset_link = (
                "https://food-bridge-ai-self.vercel.app/reset-password"
                f"?token={reset_token}"
            )

            # =========================
            # SEND EMAIL THROUGH RESEND
            # =========================

            try:

                send_password_reset_email(
                    recipient_email=email,
                    recipient_name=full_name,
                    reset_link=reset_link,
                )

            except Exception as email_error:

                # If email sending fails, clear the reset token
                # so the token cannot be used without the email.

                cursor.execute(
                    """
                    UPDATE users
                    SET
                        reset_token = NULL,
                        reset_token_expires_at = NULL
                    WHERE id = %s
                    """,
                    (user_id,),
                )

                connection.commit()

                print(
                    "Resend email error:",
                    email_error,
                )

                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=(
                        "Unable to send password reset email. "
                        "Please try again later."
                    ),
                )

            # =========================
            # SUCCESS
            # =========================

            return {
                "message": generic_message,
            }

    finally:
        connection.close()


# ============================================================
# RESET PASSWORD
# ============================================================

@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
):
    """
    Reset a user's password using a valid reset token.
    """

    # =========================
    # BASIC PASSWORD VALIDATION
    # =========================

    if len(request.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long.",
        )

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            # =========================
            # FIND VALID TOKEN
            # =========================

            cursor.execute(
                """
                SELECT
                    id,
                    reset_token_expires_at
                FROM users
                WHERE reset_token = %s
                """,
                (request.token,),
            )

            user = cursor.fetchone()

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid or expired reset token.",
                )

            user_id = user[0]
            expires_at = user[1]

            # =========================
            # CHECK EXPIRATION
            # =========================

            now = datetime.now(timezone.utc)

            if expires_at is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid or expired reset token.",
                )

            if expires_at <= now:

                cursor.execute(
                    """
                    UPDATE users
                    SET
                        reset_token = NULL,
                        reset_token_expires_at = NULL
                    WHERE id = %s
                    """,
                    (user_id,),
                )

                connection.commit()

                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid or expired reset token.",
                )

            # =========================
            # HASH NEW PASSWORD
            # =========================

            hashed_password = password_hash.hash(
                request.new_password
            )

            # =========================
            # UPDATE PASSWORD
            # =========================

            cursor.execute(
                """
                UPDATE users
                SET
                    password_hash = %s,
                    reset_token = NULL,
                    reset_token_expires_at = NULL
                WHERE id = %s
                """,
                (
                    hashed_password,
                    user_id,
                ),
            )

            connection.commit()

            return {
                "message": (
                    "Password reset successful. "
                    "You can now log in with your new password."
                )
            }

    finally:
        connection.close()
