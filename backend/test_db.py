from database import get_connection


try:
    connection = get_connection()

    print("✅ Successfully connected to FoodBridge AI PostgreSQL!")

    connection.close()

except Exception as error:
    print("❌ Database connection failed:")
    print(error)