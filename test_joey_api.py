import json
import requests

BASE_URL = "https://api.joeyllm.ai"
API_KEY = "s/xpNZuN6V1LnPfHuNipDMKeQKyFfn2Ml0/S2QOy/14="

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

# Get available model
models = requests.get(
    f"{BASE_URL}/v1/models",
    headers=HEADERS,
    timeout=30,
)

models.raise_for_status()

model = models.json()["data"][0]["id"]

print("Joey API")
print("Model JoeyLLM")
print("Type 'exit' to quit.\n")

messages = []

while True:
    user_input = input("You: ").strip()

    if user_input.lower() in {"exit", "quit"}:
        break

    if not user_input:
        continue

    messages.append({
        "role": "user",
        "content": user_input,
    })

    response = requests.post(
        f"{BASE_URL}/v1/chat/completions",
        headers=HEADERS,
        json={
            "model": model,
            "messages": messages,
            "max_tokens": 500,
            "temperature": 0.7,
            "stream": True,
        },
        stream=True,
        timeout=120,
    )

    response.raise_for_status()

    print("\nJoey: ", end="", flush=True)

    full_reply = ""

    for line in response.iter_lines(decode_unicode=True):
        if not line:
            continue

        if not line.startswith("data: "):
            continue

        data = line[6:]

        if data == "[DONE]":
            break

        chunk = json.loads(data)

        delta = chunk["choices"][0]["delta"]
        content = delta.get("content")

        if content:
            print(content, end="", flush=True)
            full_reply += content

    print("\n")

    messages.append({
        "role": "assistant",
        "content": full_reply,
    })
