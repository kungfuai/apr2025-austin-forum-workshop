import math

class Calculator:
    def __init__(self):
        pass

    # Idea: be able to pass in any number of arguments and sum them up.
    def add(self, x, y):
        return x + y

    # Idea: be able to pass in any number of arguments and multiply them.
    def multiply(self, x, y):
        return x * y

    def factorial(self, x):
        if x < 0:
            raise ValueError("Cannot calculate factorial of negative number")
        if not isinstance(x, int):
            raise ValueError("Factorial is only defined for integers")
        return math.factorial(x)

    # Idea: Add operations, like square root. Include input validation.


if __name__ == "__main__":
    calc = Calculator()
    # Idea: Refactor this method to take a bunch of numbers rather than just 2.
    print(calc.add(1, 2))
    # Idea: Refactor this method to take a bunch of numbers rather than just 2.
    print(calc.multiply(3, 4))

