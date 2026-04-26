import os
from flask import Flask, request, jsonify
from openai import OpenAI
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()  # Load .env file

app = Flask(__name__)
CORS(app)

# ✅ CORRECT WAY
client = OpenAI(
    api_key=os.getenv("XAI_API_KEY"),   # ← This is correct
    base_url="https://api.x.ai/v1"
)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    model = data.get('model', 'grok-beta')

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are a helpful assistant for COP30 scenarios and rosary-related queries."},
                {"role": "user", "content": user_message}
            ],
            max_tokens=600,
            temperature=0.7
        )
        return jsonify({'response': response.choices[0].message.content})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
