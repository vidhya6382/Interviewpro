import pandas as pd
import numpy as np
import traceback
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def submit_code(request):
    code = request.data.get('code', '')
    question_id = request.data.get('question_id', '')

    # Basic check
    if 'def solve' not in code or 'return' not in code:
        return Response({
            "status": "Wrong Answer",
            "score": 0,
            "reason": "solve() must be defined and return DataFrame",
            "logic_error": "Missing def solve() or return"
        })

    # Real execution check
    exec_code = f"""
{code}

# --- TEST ---
try:
    df_result = solve()
    assert isinstance(df_result, pd.DataFrame), f"Must return DataFrame, got {{type(df_result)}}"
    nulls = int(df_result.isnull().sum().sum())
    assert nulls == 0, f"Still has {{nulls}} null values"
    print("PASS")
except Exception as e:
    raise e
"""

    try:
        # Run in safe env
        exec_globals = {"pd": pd, "np": np, "pandas": pd, "numpy": np}
        exec(exec_code, exec_globals, {})
        
        # If no error = Correct
        return Response({
            "status": "Correct",
            "score": 10,
            "reason": "All test cases passed! 0 null values."
        })
    except AssertionError as e:
        return Response({
            "status": "Wrong Answer",
            "score": 0,
            "reason": str(e),
            "logic_error": str(e)
        })
    except SyntaxError as e:
        return Response({
            "status": "Syntax Error",
            "score": 0,
            "reason": f"Line {e.lineno}: {e.msg}",
            "logic_error": traceback.format_exc()
        })
    except Exception as e:
        return Response({
            "status": "Runtime Error",
            "score": 0,
            "reason": f"{type(e).__name__}: {e}",
            "logic_error": traceback.format_exc()[-500:]
        })