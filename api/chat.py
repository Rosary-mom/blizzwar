import os
from http.server import BaseHTTPRequestHandler
import json
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("XAI_API_KEY"),
    base_url="https://api.x.ai/v1"
)

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))

        user_message = data.get('message', '')

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
            result = {"response": response.choices[0].message.content}
        except Exception as e:
            result = {"error": str(e)}

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(result).encode())
