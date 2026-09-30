from datetime import datetime, timedelta, timezone
import os
import secrets
from urllib.parse import urlencode

import requests
import resend
import jwt

from dotenv import load_dotenv
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from fastapi.responses import RedirectResponse
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

PASSWORD_RESET_EXPIRE_MINUTES = 30


# =========================
# GOOGLE OAUTH SETTINGS
# =========================

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

GOOGLE_REDIRECT_URI = (
    "https://foodbridge-ai-qj9q.onrender.com/auth/google/callback"
)

FRONTEND_URL = (
    "https://food-bridge-ai-self.vercel.app"
)

if not GOOGLE_CLIENT_ID:
    raise RuntimeError(
        "GOOGLE_CLIENT_ID is not configured."
    )

if not GOOGLE_CLIENT_SECRET:
    raise RuntimeError(
        "GOOGLE_CLIENT_SECRET is not configured."
    )


# =========================
# GOOGLE OAUTH ENDPOINTS
# =========================

GOOGLE_AUTHORIZATION_URL = (
    "https://accounts.google.com/o/oauth2/v2/auth"
)

GOOGLE_TOKEN_URL = (
    "https://oauth2.googleapis.com/token"
)

GOOGLE_USERINFO_URL = (
    "https://openidconnect.googleapis.com/v1/userinfo"
)


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


# ============================================================
# GOOGLE OAUTH STATE
# ============================================================

def create_google_state(role: str):
    """
    Create a short-lived signed state token.

    The selected role is carried through the Google
    authentication process for new users.
    """

    allowed_roles = [
        "donor",
        "recipient",
        "volunteer",
    ]

    if role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Role must be donor, recipient, "
                "or volunteer."
            ),
        )

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=10
    )

    payload = {
        "role": role,
        "nonce": secrets.token_urlsafe(24),
        "type": "google_oauth",
        "exp": expire,
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


def decode_google_state(state: str):
    """
    Verify and decode the Google OAuth state token.
    """

    try:
        payload = jwt.decode(
            state,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        if payload.get("type") != "google_oauth":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid Google authentication state.",
            )

        role = payload.get("role")

        if role not in [
            "donor",
            "recipient",
            "volunteer",
        ]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid registration role.",
            )

        return payload

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Google authentication session expired. "
                "Please try again."
            ),
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Google authentication state.",
        )


# ============================================================
# SEND PASSWORD RESET EMAIL
# ============================================================

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

            hashed_password = password_hash.hash(
                user.password
            )

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

            password_valid = password_hash.verify(
                credentials.password,
                user[3],
            )

            if not password_valid:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password.",
                )

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
# GOOGLE LOGIN
# ============================================================

@router.get("/google/login")
def google_login(
    role: str = "donor",
):
    """
    Start Google OAuth.

    The role is used only when a brand-new FoodBridge
    account needs to be created.
    """

    state = create_google_state(role)

    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        "access_type": "online",
        "prompt": "select_account",
    }

    authorization_url = (
        GOOGLE_AUTHORIZATION_URL
        + "?"
        + urlencode(params)
    )

    return RedirectResponse(
        url=authorization_url,
        status_code=status.HTTP_302_FOUND,
    )


# ============================================================
# GOOGLE CALLBACK
# ============================================================

@router.get("/google/callback")
def google_callback(
    code: str | None = None,
    state: str | None = None,
    error: str | None = None,
):
    """
    Google redirects here after authentication.

    The backend exchanges Google's authorization code,
    retrieves the verified Google identity, creates or
    links the FoodBridge account, then creates a normal
    FoodBridge JWT.

    The JWT is returned to the frontend in the URL
    fragment rather than the query string.
    """

    # =========================
    # HANDLE GOOGLE ERROR
    # =========================

    if error:
        error_url = (
            f"{FRONTEND_URL}/login?"
            + urlencode(
                {
                    "google_error": (
                        "Google authentication was cancelled "
                        "or failed."
                    )
                }
            )
        )

        return RedirectResponse(
            url=error_url,
            status_code=status.HTTP_302_FOUND,
        )

    # =========================
    # VALIDATE PARAMETERS
    # =========================

    if not code or not state:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing Google authentication parameters.",
        )

    # =========================
    # VALIDATE STATE
    # =========================

    state_payload = decode_google_state(state)

    selected_role = state_payload["role"]

    # =========================
    # EXCHANGE CODE FOR TOKEN
    # =========================

    try:
        token_response = requests.post(
            GOOGLE_TOKEN_URL,
            data={
                "code": code,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
            timeout=15,
        )

    except requests.RequestException as error:
        print(
            "Google token request error:",
            error,
        )

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                "Unable to communicate with Google. "
                "Please try again."
            ),
        )

    if not token_response.ok:
        print(
            "Google token exchange failed:",
            token_response.text,
        )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Google authentication could not be completed."
            ),
        )

    token_data = token_response.json()

    google_access_token = token_data.get(
        "access_token"
    )

    if not google_access_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Google did not return a valid access token."
            ),
        )

    # =========================
    # GET GOOGLE USER INFO
    # =========================

    try:
        userinfo_response = requests.get(
            GOOGLE_USERINFO_URL,
            headers={
                "Authorization": (
                    f"Bearer {google_access_token}"
                )
            },
            timeout=15,
        )

    except requests.RequestException as error:
        print(
            "Google userinfo request error:",
            error,
        )

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                "Unable to retrieve Google account "
                "information."
            ),
        )

    if not userinfo_response.ok:
        print(
            "Google userinfo failed:",
            userinfo_response.text,
        )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Unable to verify your Google account."
            ),
        )

    google_user = userinfo_response.json()

    # =========================
    # VERIFY GOOGLE IDENTITY
    # =========================

    google_sub = google_user.get("sub")
    google_email = google_user.get("email")
    email_verified = google_user.get(
        "email_verified"
    )

    google_name = (
        google_user.get("name")
        or google_user.get("given_name")
        or "FoodBridge User"
    )

    if isinstance(email_verified, str):
        email_verified = (
            email_verified.lower() == "true"
        )

    if not google_sub:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Google account identification failed."
            ),
        )

    if not google_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Google did not provide an email address."
            ),
        )

    if not email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Your Google email must be verified "
                "before you can use Google login."
            ),
        )

    google_email = google_email.lower().strip()

    # =========================
    # FIND / CREATE USER
    # =========================

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            # =========================
            # FIRST: FIND GOOGLE ACCOUNT
            # =========================

            cursor.execute(
                """
                SELECT
                    id,
                    full_name,
                    email,
                    role,
                    google_sub
                FROM users
                WHERE google_sub = %s
                """,
                (google_sub,),
            )

            user = cursor.fetchone()

            # =========================
            # SECOND: FIND BY EMAIL
            # =========================

            if not user:

                cursor.execute(
                    """
                    SELECT
                        id,
                        full_name,
                        email,
                        role,
                        google_sub
                    FROM users
                    WHERE LOWER(email) = %s
                    """,
                    (google_email,),
                )

                user = cursor.fetchone()

            # =================================================
            # EXISTING FOODBRIDGE ACCOUNT
            # =================================================

            if user:

                user_id = user[0]
                full_name = user[1]
                email = user[2]
                role = user[3]
                existing_google_sub = user[4]

                # =========================
                # SECURITY CHECK
                # =========================

                if (
                    existing_google_sub
                    and existing_google_sub != google_sub
                ):
                    raise HTTPException(
                        status_code=(
                            status.HTTP_409_CONFLICT
                        ),
                        detail=(
                            "This FoodBridge account is "
                            "already linked to a different "
                            "Google account."
                        ),
                    )

                # =========================
                # LINK GOOGLE ACCOUNT
                # =========================

                if not existing_google_sub:

                    cursor.execute(
                        """
                        UPDATE users
                        SET
                            google_sub = %s,
                            is_verified = TRUE
                        WHERE id = %s
                        """,
                        (
                            google_sub,
                            user_id,
                        ),
                    )

                connection.commit()

            # =================================================
            # NEW FOODBRIDGE ACCOUNT
            # =================================================

            else:

                # Google users still need a password_hash
                # because the existing database requires
                # that field to be NOT NULL.
                #
                # A random secret is generated and hashed.
                # The user does not know this password and
                # therefore cannot use it to log in.

                random_password = secrets.token_urlsafe(
                    48
                )

                hashed_password = password_hash.hash(
                    random_password
                )

                cursor.execute(
                    """
                    INSERT INTO users (
                        full_name,
                        email,
                        phone,
                        password_hash,
                        role,
                        is_verified,
                        google_sub
                    )
                    VALUES (
                        %s,
                        %s,
                        NULL,
                        %s,
                        %s,
                        TRUE,
                        %s
                    )
                    RETURNING
                        id,
                        full_name,
                        email,
                        role
                    """,
                    (
                        google_name,
                        google_email,
                        hashed_password,
                        selected_role,
                        google_sub,
                    ),
                )

                new_user = cursor.fetchone()

                user_id = new_user[0]
                full_name = new_user[1]
                email = new_user[2]
                role = new_user[3]

                connection.commit()

            # =========================
            # CREATE FOODBRIDGE JWT
            # =========================

            access_token = create_access_token(
                user_id=user_id,
                role=role,
            )

    finally:
        connection.close()

    # =========================================================
    # REDIRECT TO FRONTEND
    # =========================================================

    # The token is placed in the URL fragment rather than
    # the query string so it is not sent as an HTTP request
    # to the frontend server.

    redirect_url = (
        f"{FRONTEND_URL}/auth/google/callback"
        f"#access_token={access_token}"
        f"&user_id={user_id}"
        f"&role={role}"
    )

    return RedirectResponse(
        url=redirect_url,
        status_code=status.HTTP_302_FOUND,
    )


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

    generic_message = (
        "If an account with that email exists, "
        "a password reset link has been sent."
    )

    try:
        with connection.cursor() as cursor:

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

            reset_token = secrets.token_urlsafe(32)

            reset_expires = (
                datetime.now(timezone.utc)
                + timedelta(
                    minutes=PASSWORD_RESET_EXPIRE_MINUTES
                )
            )

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

            reset_link = (
                "https://food-bridge-ai-self.vercel.app/reset-password"
                f"?token={reset_token}"
            )

            try:

                send_password_reset_email(
                    recipient_email=email,
                    recipient_name=full_name,
                    reset_link=reset_link,
                )

            except Exception as email_error:

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
                    status_code=(
                        status.HTTP_500_INTERNAL_SERVER_ERROR
                    ),
                    detail=(
                        "Unable to send password reset email. "
                        "Please try again later."
                    ),
                )

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

    if len(request.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Password must be at least 8 characters long."
            ),
        )

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

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

            hashed_password = password_hash.hash(
                request.new_password
            )

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