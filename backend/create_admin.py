from pwdlib import PasswordHash

from database import get_connection


password_hash = PasswordHash.recommended()

FULL_NAME = "GreatManBillion"
EMAIL = "oluwafemicharles1@gmail.com"
PHONE = None
PASSWORD = "Mercyandgrace@1997"


connection = get_connection()

try:
    with connection.cursor() as cursor:

        # Check whether the email already exists
        cursor.execute(
            """
            SELECT id, role
            FROM users
            WHERE email = %s
            """,
            (EMAIL,),
        )

        existing_user = cursor.fetchone()

        if existing_user:
            user_id, current_role = existing_user

            cursor.execute(
                """
                UPDATE users
                SET
                    full_name = %s,
                    phone = %s,
                    password_hash = %s,
                    role = 'admin',
                    is_verified = TRUE
                WHERE id = %s
                """,
                (
                    FULL_NAME,
                    PHONE,
                    password_hash.hash(PASSWORD),
                    user_id,
                ),
            )

            connection.commit()

            print("====================================")
            print("ADMIN ACCOUNT UPDATED SUCCESSFULLY")
            print("====================================")
            print(f"ID: {user_id}")
            print(f"Name: {FULL_NAME}")
            print(f"Email: {EMAIL}")
            print("Role: admin")
            print("Verified: True")

        else:
            cursor.execute(
                """
                INSERT INTO users (
                    full_name,
                    email,
                    phone,
                    password_hash,
                    role,
                    is_verified
                )
                VALUES (%s, %s, %s, %s, 'admin', TRUE)
                RETURNING id
                """,
                (
                    FULL_NAME,
                    EMAIL,
                    PHONE,
                    password_hash.hash(PASSWORD),
                ),
            )

            admin_id = cursor.fetchone()[0]

            connection.commit()

            print("====================================")
            print("ADMIN ACCOUNT CREATED SUCCESSFULLY")
            print("====================================")
            print(f"ID: {admin_id}")
            print(f"Name: {FULL_NAME}")
            print(f"Email: {EMAIL}")
            print("Role: admin")
            print("Verified: True")

finally:
    connection.close()