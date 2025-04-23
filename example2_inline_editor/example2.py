import json
import openai
import pandas as pd
import matplotlib.pyplot as plt

def call_model(model, prompt):
    openai.api_key = "sk-proj-1234567890"
    response = openai.ChatCompletion.create(
        model=model,
        messages=[{"role": "system", "content": prompt}]
    )
    return response.choices[0].message.content

def parse_json(json_str) -> dict:
    return json.loads(json_str)

def plot_over_time(df: pd.DataFrame, x: str, y: str) -> None:
    plt.figure(figsize=(10, 5))
    plt.plot(df[x], df[y])
    plt.show()

def main():
    prompt = "Please create a JSON object with the following fields: name, age, email."

