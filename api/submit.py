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
                result = {"status": "Wrong Answer", "score": 0, "reason": "solve() function not found"}
                self.wfile.write(json.dumps(result).encode())
                return
            
            exec_code = code + "\n\nresult_df = solve()\n"
            exec_globals = {"pd": pd, "np": np, "pandas": pd}
            exec_locals = {}
            exec(exec_code, exec_globals, exec_locals)
            df_result = exec_locals.get('result_df') or exec_globals.get('result_df')
            
            if not isinstance(df_result, pd.DataFrame):
                result = {"status": "Wrong Answer", "score": 0, "reason": "Must return a DataFrame - You returned " + str(type(df_result))}
            elif int(df_result.isnull().sum().sum()) != 0:
                nulls = int(df_result.isnull().sum().sum())
                result = {"status": "Wrong Answer", "score": 0, "reason": f"Still has {nulls} null values - Clean all nulls"}
            else:
                result = {"status": "Correct", "score": 10, "reason": "All test cases passed! 0 null values."}
        except SyntaxError as e:
            result = {"status": "Syntax Error", "score": 0, "reason": f"Line {e.lineno}: {e.msg}"}
        except Exception as e:
            result = {"status": "Runtime Error", "score": 0, "reason": f"{type(e).__name__}: {e}"}
        
        self.wfile.write(json.dumps(result).encode())