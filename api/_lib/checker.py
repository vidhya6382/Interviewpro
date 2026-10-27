import os
import re
import subprocess
import sys
import tempfile

from .mbpp_data import MBPP


def normalize(qid):
    return re.sub(r"[^a-z0-9]+", "-", str(qid).lower()).strip("-")


# ---------- Hand-written tests ----------
TESTS = {
    "two-sum": {
        "func": "two_sum",
        "cases": [
            (([2, 7, 11, 15], 9), [0, 1]),
            (([3, 2, 4], 6), [1, 2]),
            (([3, 3], 6), [0, 1]),
        ],
    },
    "valid-parentheses": {
        "func": "is_valid",
        "cases": [
            (("()",), True),
            (("()[]{}",), True),
            (("(]",), False),
            (("([)]",), False),
        ],
    },
}


def _same(a, b):
    if isinstance(a, (list, tuple)) and isinstance(b, (list, tuple)):
        return sorted(a) == sorted(b)
    return a == b


def _check_hand(code, t):
    ns = {}
    try:
        exec(code, ns)
        fn = ns.get(t["func"])
        if not callable(fn):
            return {"status": "Wrong Answer", "score": 0,
                    "reason": t["func"] + "() function define pannala"}
        for i, (args, expected) in enumerate(t["cases"], 1):
            got = fn(*args)
            if not _same(got, expected):
                return {"status": "Wrong Answer", "score": 0,
                        "reason": f"Test case {i} fail. Input: {args}, Expected: {expected}, Got: {got}"}
        n = len(t["cases"])
        return {"status": "Correct", "score": 10, "reason": f"{n}/{n} test cases passed"}
    except SyntaxError as e:
        return {"status": "Syntax Error", "score": 0, "reason": f"Line {e.lineno}: {e.msg}"}
    except Exception as e:
        return {"status": "Runtime Error", "score": 0, "reason": f"{type(e).__name__}: {e}"}


# ---------- MBPP tests (run in a separate process with a timeout) ----------
RUNNER = r'''
import sys, json, traceback
src = json.load(open(sys.argv[1]))
ns = {}
try:
    exec(src["setup"], ns)
    exec(src["code"], ns)
except SyntaxError as e:
    print(json.dumps({"status": "Syntax Error", "reason": "Line %s: %s" % (e.lineno, e.msg)}))
    sys.exit(0)
except Exception as e:
    print(json.dumps({"status": "Runtime Error", "reason": type(e).__name__ + ": " + str(e)}))
    sys.exit(0)
passed = 0
for i, t in enumerate(src["tests"], 1):
    try:
        exec(t, ns)
        passed += 1
    except AssertionError:
        print(json.dumps({"status": "Wrong Answer", "passed": passed, "total": len(src["tests"]),
                          "reason": "Test case %d fail: %s" % (i, t.replace("assert ", "", 1))}))
        sys.exit(0)
    except Exception as e:
        print(json.dumps({"status": "Runtime Error", "passed": passed, "total": len(src["tests"]),
                          "reason": "Test case %d: %s: %s" % (i, type(e).__name__, e)}))
        sys.exit(0)
print(json.dumps({"status": "Correct", "passed": passed, "total": len(src["tests"])}))
'''


def _check_mbpp(code, q):
    import json
    if q["func"] not in code:
        return {"status": "Wrong Answer", "score": 0,
                "reason": q["func"] + "() function define pannala"}
    tmp = tempfile.mkdtemp()
    data_path = os.path.join(tmp, "data.json")
    run_path = os.path.join(tmp, "run.py")
    with open(data_path, "w") as f:
        json.dump({"setup": q["setup"], "code": code, "tests": q["tests"]}, f)
    with open(run_path, "w") as f:
        f.write(RUNNER)
    try:
        p = subprocess.run([sys.executable, run_path, data_path],
                           capture_output=True, text=True, timeout=5, cwd=tmp)
        last = (p.stdout.strip().splitlines() or [""])[-1]
        res = json.loads(last)
    except subprocess.TimeoutExpired:
        return {"status": "Time Limit Exceeded", "score": 0, "reason": "Code 5 second kulla mudiyala (infinite loop?)"}
    except Exception:
        return {"status": "Runtime Error", "score": 0, "reason": (p.stderr or "Unknown error")[-300:]}
    finally:
        for fp in (data_path, run_path):
            try:
                os.remove(fp)
            except OSError:
                pass
        try:
            os.rmdir(tmp)
        except OSError:
            pass

    if res["status"] == "Correct":
        return {"status": "Correct", "score": 10,
                "reason": f"{res['passed']}/{res['total']} test cases passed"}
    return {"status": res["status"], "score": 0, "reason": res["reason"]}


def check(code, qid, mbpp_id=None):
    for key in (mbpp_id, qid):
        if key and str(key) in MBPP:
            return _check_mbpp(code, MBPP[str(key)])

    t = TESTS.get(normalize(qid))
    if t is not None:
        return _check_hand(code, t)

    return {"status": "Not Auto-Gradable", "score": 0,
            "reason": "Indha question ku auto test case illa. Self-review pannunga."}
