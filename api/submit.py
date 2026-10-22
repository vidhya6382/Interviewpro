from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8')
        
        try:
            data = json.loads(body)
            code = data.get('code', '')
            import pandas as pd
            import numpy as np
            
            if 'def solve' not in code:
                result = {"status": "Wrong Answer", "score": 0, "reason": "solve() function not found", "logic_error": "Define def solve():", "ai_hint": "Use def solve():"}
                self.wfile.write(json.dumps(result).encode())
                return
            
            exec_code = code + "\n\nresult_df = solve()\n"
            exec_globals = {"pd": pd, "np": np, "pandas": pd}
            exec_locals = {}
            exec(exec_code, exec_globals, exec_locals)
            df_result = exec_locals.get('result_df') or exec_globals.get('result_df')
            
            if not isinstance(df_result, pd.DataFrame):
                result = {"status": "Wrong Answer", "score": 0, "reason": "Must return a DataFrame", "logic_error": "return df missing", "ai_hint": "return DataFrame"}
            elif int(df_result.isnull().sum().sum()) != 0:
                nulls = int(df_result.isnull().sum().sum())
                result = {"status": "Wrong Answer", "score": 0, "reason": f"Still has {nulls} null values", "logic_error": f"{nulls} nulls", "ai_hint": "Use df.fillna() or df.dropna()"}
            else:
                result = {"status": "Correct", "score": 10, "reason": "All test cases passed! 0 null values.", "logic_error": "", "ai_hint": "Great job!"}
        except SyntaxError as e:
            result = {"status": "Syntax Error", "score": 0, "reason": f"Line {e.lineno}: {e.msg}", "logic_error": str(e), "ai_hint": "Check brackets"}
        except Exception as e:
            result = {"status": "Runtime Error", "score": 0, "reason": f"{type(e).__name__}: {e}", "logic_error": str(e), "ai_hint": "Check logic"}
        
        self.wfile.write(json.dumps(result).encode())