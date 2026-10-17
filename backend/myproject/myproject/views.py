import pandas as pd
import numpy as np
import traceback
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def submit_code(request):
    code = request.data.get('code', '')
    
    if 'def solve' not in code or 'return' not in code:
        return Response({
            "status": "Wrong Answer",
            "score": 0,
            "reason": "solve() must be defined and return DataFrame",
            "logic_error": "Missing def solve() or return"
        })

    test_wrapper = code + """

try:
    df_result = solve()
    if not isinstance(df_result, pd.DataFrame):
        raise AssertionError("Must return DataFrame")
    nulls = int(df_result.isnull().sum().sum())
    if nulls != 0:
        raise AssertionError(f"Still has {nulls} null values")
except Exception as e:
    raise e
"""
    try:
        exec_globals = {"pd": pd, "np": np, "pandas": pd, "numpy": np}
        exec(test_wrapper, exec_globals, {})
        return Response({"status": "Correct", "score": 10, "reason": "Passed! 0 nulls."})
    except AssertionError as e:
        return Response({"status": "Wrong Answer", "score": 0, "reason": str(e), "logic_error": str(e)})
    except Exception as e:
        return Response({"status": "Runtime Error", "score": 0, "reason": f"{type(e).__name__}: {e}"})