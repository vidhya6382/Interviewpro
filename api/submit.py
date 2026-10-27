from http.server import BaseHTTPRequestHandler
import json

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


def normalize(qid):
    return str(qid).strip().lower().replace(" ", "-")


def same(a, b):
    if isinstance(a, (list, tuple)) and isinstance(b, (list, tuple)):
        return sorted(a) == sorted(b)
    return a == b


def check(code, qid):
    t = TESTS.get(normalize(qid))
    if t is None:
        return {"status": "Not Auto-Gradable", "score": 0,
                "reason": "Indha question ku auto test case illa. Self-review pannunga."}
    ns = {}
    try:
        exec(code, ns)
        fn = ns.get(t["func"])
        if not callable(fn):
            return {"status": "Wrong Answer", "score": 0,
                    "reason": t["func"] + "() function define pannala"}
        for i, (args, expected) in enumerate(t["cases"], 1):
            got = fn(*args)
            if not same(got, expected):
                return {"status": "Wrong Answer", "score": 0,
                        "reason": f"Test case {i} fail. Input: {args}, Expected: {expected}, Got: {got}"}
        n = len(t["cases"])
        return {"status": "Correct", "score": 10,
                "reason": f"{n}/{n} test cases passed"}
    except SyntaxError as e:
        return {"status": "Syntax Error", "score": 0, "reason": f"Line {e.lineno}: {e.msg}"}
    except Exception as e:
        return {"status": "Runtime Error", "score": 0, "reason": f"{type(e).__name__}: {e}"}


class handler(BaseHTTPRequestHandler):
    def _send(self, code, body):
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body.encode())

    def do_OPTIONS(self):
        self._send(204, "")

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            data = json.loads(self.rfile.read(length).decode("utf-8") or "{}")
        except Exception:
            return self._send(400, json.dumps(
                {"status": "Error", "score": 0, "reason": "Invalid JSON"}))
        result = check(data.get("code", ""), data.get("question_id", ""))
        self._send(200, json.dumps(result))