import os
import sys
import json
import traceback
from pathlib import Path

# For Vercel
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / "backend"))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')

# --- 1. DIRECT VERIFICATION API (No Django needed) ---
def handle_submit(request_body):
    try:
        data = json.loads(request_body) if isinstance(request_body, (str, bytes)) else request_body
        code = data.get('code', '')

        if 'def solve' not in code or 'return' not in code:
            return {"status": "Wrong Answer", "score": 0, "reason": "solve() must be defined and return DataFrame"}

        import pandas as pd
        import numpy as np

        test_code = code + """

try:
    df_result = solve()
    assert isinstance(df_result, pd.DataFrame), "Must return DataFrame"
    nulls = int(df_result.isnull().sum().sum())
    assert nulls == 0, f"Still has {nulls} null values"
except Exception as e:
    raise e
"""
        exec_globals = {"pd": pd, "np": np, "pandas": pd, "numpy": np}
        exec(test_code, exec_globals, {})

        return {"status": "Correct", "score": 10, "reason": "All test cases passed! 0 null values."}

    except AssertionError as e:
        return {"status": "Wrong Answer", "score": 0, "reason": str(e), "logic_error": str(e)}
    except SyntaxError as e:
        return {"status": "Syntax Error", "score": 0, "reason": f"Line {e.lineno}: {e.msg}"}
    except Exception as e:
        return {"status": "Runtime Error", "score": 0, "reason": f"{type(e).__name__}: {e}"}

# --- 2. VERCEL HANDLER ---
class Handler:
    def __init__(self, *args, **kwargs):
        pass

    def __call__(self, environ, start_response):
        from io import BytesIO
        path = environ.get('PATH_INFO', '')
        method = environ.get('REQUEST_METHOD', 'GET')
        
        # If it's submit API, handle here directly!
        if '/api/submit' in path and method == 'POST':
            try:
                content_length = int(environ.get('CONTENT_LENGTH', 0))
                body = environ['wsgi.input'].read(content_length).decode('utf-8')
                result = handle_submit(body)
                
                start_response('200 OK', [('Content-Type', 'application/json'), ('Access-Control-Allow-Origin', '*')])
                return [json.dumps(result).encode('utf-8')]
            except Exception as e:
                start_response('500 Internal Server Error', [('Content-Type', 'application/json')])
                return [json.dumps({"status": "Runtime Error", "reason": str(e)}).encode('utf-8')]
        
        # For all other routes, use Django
        try:
            from django.core.wsgi import get_wsgi_application
            application = get_wsgi_application()
            return application(environ, start_response)
        except Exception as e:
            start_response('500 Internal Server Error', [('Content-Type', 'text/plain')])
            return [f"Django Error: {e}\n{traceback.format_exc()}".encode('utf-8')]

app = Handler()
application = app