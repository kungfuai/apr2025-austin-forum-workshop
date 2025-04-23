"""
Example file demonstrating multiple use cases of the inline editor.

This file contains several practical examples where the inline editor would be useful:
1. Function refactoring
2. Adding new features
3. Fixing bugs
4. Code optimization
5. Documentation updates
"""

# Example 1: Function refactoring
def calculate_total(items):
    """Calculate total price of items with tax."""
    subtotal = sum(item['price'] for item in items)
    tax = subtotal * 0.08
    return subtotal + tax

# Example 2: Adding new features
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email
        self.last_login = None
    
    def login(self):
        self.last_login = datetime.now()
        return True

# Example 3: Fixing bugs
def process_data(data):
    """Process data and return cleaned results."""
    try:
        cleaned = []
        for item in data:
            if item is not None:
                cleaned.append(str(item).strip())
        return cleaned
    except Exception as e:
        print(f"Error processing data: {e}")
        return []

# Example 4: Code optimization
def find_duplicates(items):
    """Find duplicate items in a list."""
    seen = set()
    duplicates = []
    for item in items:
        if item in seen:
            duplicates.append(item)
        else:
            seen.add(item)
    return duplicates

# Example 5: Documentation updates
def format_date(date_str):
    """
    Format a date string into a standardized format.
    
    Args:
        date_str (str): Date string in various formats
        
    Returns:
        str: Formatted date string in YYYY-MM-DD format
    """
    try:
        date_obj = datetime.strptime(date_str, "%m/%d/%Y")
        return date_obj.strftime("%Y-%m-%d")
    except ValueError:
        return None
