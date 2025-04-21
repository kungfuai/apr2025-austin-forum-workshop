import openai

def call_model(model, prompt):
    openai.api_key = "sk-proj-1234567890"
    response = openai.ChatCompletion.create(
        model=model,
        messages=[{"role": "system", "content": prompt}]
    )
    return response.choices[0].message.content
