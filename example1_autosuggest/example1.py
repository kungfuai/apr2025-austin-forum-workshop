
from typing import TypedDict

data = {
    "name": "John",
    "age": 30,
    "city": "New York"
}

class User(TypedDict):
    name: str
    age: int
    city: str


