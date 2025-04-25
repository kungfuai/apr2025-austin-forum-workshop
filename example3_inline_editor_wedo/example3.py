import math

class Calculator:
    def __init__(self):
        self.result = 0

    # Idea: be able to pass in any number of arguments and sum them up.
    # Idea: Refactor to add to `self.result`, or make another method to do so.
    def add(self, x, y):
        return x + y

    # Idea: be able to pass in any number of arguments and multiply them.
    # Idea: Refactor to add to `self.result`, or make another method to do so.
    def multiply(self, x, y):
        return x * y

    # Idea: Refactor or add another method to do the factorial of `self.result`.
    def factorial(self, x):
        if x < 0:
            raise ValueError("Cannot calculate factorial of negative number")
        if not isinstance(x, int):
            raise ValueError("Factorial is only defined for integers")
        return math.factorial(x)

    # Idea: Add operations, like square root. Include input validation.

    def clear(self):
        self.result = 0

    # Idea: A print method that prints the result.


if __name__ == "__main__":
    calc = Calculator()
    print(calc.add(1, 2))
    print(calc.multiply(3, 4))
    print(calc.factorial(5))
