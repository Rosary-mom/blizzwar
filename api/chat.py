import os
from flask import Flask, request, jsonify
from openai import OpenAI
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

client = OpenAI(
    api_key=os.environ.get("XAI_API_KEY"),
    base_url="https://api.x.ai/v1"
)

@app.route("/", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    
    try:
        response = client.chat.completions.create(
            model="grok-beta",
            messages=[
                {"role": "system", "content": "You are a helpful assistant for COP30 scenarios and rosary-related queries."},
                {"role": "user", "content": user_message}
            ],
            max_tokens=600,
            temperature=0.7
        )
        return jsonify({"response": response.choices[0].message.content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
