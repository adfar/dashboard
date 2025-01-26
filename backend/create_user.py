from database import SessionLocal, User
from auth import get_password_hash

def create_user(username: str, password: str) -> None:
    db = SessionLocal()
    try:
        # Check if user exists
        existing_user = db.query(User).filter(User.username == username).first()
        if existing_user:
            print(f"Error: Username '{username}' already exists")
            return

        # Create new user
        new_user = User(
            username=username,
            hashed_password=get_password_hash(password)
        )
        db.add(new_user)
        db.commit()
        print(f"User '{username}' created successfully")
    
    except Exception as e:
        print(f"Error creating user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    import getpass
    
    username = input("Enter username: ")
    password = getpass.getpass("Enter password: ")
    password_confirm = getpass.getpass("Confirm password: ")
    
    if password != password_confirm:
        print("Error: Passwords don't match")
    else:
        create_user(username, password)