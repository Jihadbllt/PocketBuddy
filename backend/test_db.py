import pymysql

connection = pymysql.connect(
    host="127.0.0.1",
    user="root",
    password="t3ddyp1ck3r",
    database="pocketbuddy",
    port=3306
)

print("✅ Connected to MySQL successfully!")
connection.close()
