from http.server import BaseHTTPRequestHandler
import json
import numpy as np

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)

        initial = data.get("initial", 2000)
        years = data.get("years", 5)
        base_return = data.get("base_return", 0.089)
        bonus = data.get("first_fruits_bonus", 0.028)
        simulations = data.get("simulations", 10000)
        first_fruits_share = data.get("first_fruits_share", 0.12)

        np.random.seed(42)
        annual_returns = np.random.normal(base_return + bonus, 0.12, (simulations, years))

        portfolio = np.zeros((simulations, years + 1))
        portfolio[:, 0] = initial

        for t in range(1, years + 1):
            portfolio[:, t] = portfolio[:, t-1] * (1 + annual_returns[:, t-1])

        final = portfolio[:, -1]
        first_fruits = final * first_fruits_share * years / 5

        result = {
            "initial": initial,
            "mean_final": round(np.mean(final), 0),
            "mean_first_fruits": round(np.mean(first_fruits), 0),
            "p5": round(np.percentile(final, 5), 0),
            "p95": round(np.percentile(final, 95), 0),
            "prob_over_10pct": round(np.mean(final > initial * (1.10 ** years)) * 100, 1)
        }

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(result).encode())
