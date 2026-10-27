from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        html = """
        <html><body>
        <h1>InterviewPro API Running ✅</h1>
        <p>Use /api/submit for code verification</p>
        <p>Frontend: <a href='/'>Go to App</a></p>
        </body></html>
        """
        self.wfile.write(html.encode())

    def do_POST(self):
        # Handle submit here too as backup
        if '/api/submit' in self.path or '/submit' in self.path:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            try:
                import pandas as pd
                data = json.loads(body)
                code = data.get('code', '')
                
                if 'def solve' not in code:
                    result = {"status": "Wrong Answer", "score": 0, "reason": "solve() not found"}
                else:
                    exec_code = code + "\nresult_df = solve()\n"
                    g = {"pd": pd, "pandas": pd}
                    l = {}
                    exec(exec_code, g, l)
                    df = l.get('result_df') or g.get('result_df')
                    if not isinstance(df, pd.DataFrame):
                        result = {"status": "Wrong Answer", "score": 0, "reason": "Must return DataFrame"}
                    elif int(df.isnull().sum().sum()) != 0:
                        result = {"status": "Wrong Answer", "score": 0, "reason": f"Still has {int(df.isnull().sum().sum())} nulls"}
                    else:
                        result = {"status": "Correct", "score": 10, "reason": "All test cases passed!"}
            except Exception as e:
                result = {"status": "Runtime Error", "score": 0, "reason": str(e)}
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
        else:
            self.do_GET()