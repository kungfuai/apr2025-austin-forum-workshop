from datetime import datetime


# Add age and validation.
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email
        self.last_login = None
    
    def login(self):
        self.last_login = datetime.now()
        return True


# Refactor to include age.
# Then test validation.
if __name__ == "__main__":
    user = User("John Doe", "john.doe@example.com")
    user.login()
    print(user.last_login)

