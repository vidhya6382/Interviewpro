import ast
import json
import urllib.request

from django.core.management.base import BaseCommand
from students.models import Question, TestCase

DATASET_URL = "https://raw.githubusercontent.com/google-research/google-research/master/mbpp/sanitized-mbpp.json"


def parse_assert(stmt):
    """
    Parses a string like: assert func_name(1, 2) == 3
    Returns (func_name, [arg1, arg2, ...], expected_value) or None if it
    can't be safely parsed.
    """
    try:
        tree = ast.parse(stmt.strip(), mode="exec")
        assert_node = tree.body[0]
        if not isinstance(assert_node, ast.Assert):
            return None
        compare = assert_node.test
        if not isinstance(compare, ast.Compare):
            return None
        call = compare.left
        if not isinstance(call, ast.Call):
            return None
        func_name = call.func.id
        args = [ast.literal_eval(a) for a in call.args]
        expected = ast.literal_eval(compare.comparators[0])
        return func_name, args, expected
    except Exception:
        return None


class Command(BaseCommand):
    help = "Downloads and seeds the MBPP dataset (~974 real verified Python problems)"

    def handle(self, *args, **options):
        self.stdout.write("Downloading MBPP dataset...")
        try:
            with urllib.request.urlopen(DATASET_URL, timeout=60) as resp:
                raw = resp.read().decode("utf-8")
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Download failed: {e}"))
            self.stdout.write(self.style.WARNING(
                "Check your internet connection, or download the file manually from:\n"
                f"{DATASET_URL}\nand place it as mbpp_data.json next to manage.py, "
                "then re-run with --local"
            ))
            return

        data = json.loads(raw)
        self.stdout.write(f"Downloaded {len(data)} raw problems. Parsing...")

        created, skipped = 0, 0

        for item in data:
            task_id = item.get("task_id")
            prompt = (item.get("prompt") or "").strip()
            test_list = item.get("test_list") or []

            if not prompt or not test_list:
                skipped += 1
                continue

            parsed_tests = []
            func_name = None
            param_count = None

            for t in test_list:
                parsed = parse_assert(t)
                if not parsed:
                    continue
                fn, call_args, expected = parsed
                if func_name is None:
                    func_name = fn
                    param_count = len(call_args)
                if fn != func_name or len(call_args) != param_count:
                    continue
                parsed_tests.append((call_args, expected))

            if not func_name or len(parsed_tests) < 1:
                skipped += 1
                continue

            slug = f"mbpp-{task_id}"
            params = [f"arg{i+1}" for i in range(param_count)]

            defaults = {
                "title": prompt[:120],
                "difficulty": "Easy",
                "category": "SWE_FULL_STACK",
                "topic": "General",
                "company_tags": "Practice",
                "description": prompt,
                "sample_input": ", ".join(repr(a) for a in parsed_tests[0][0]),
                "sample_output": repr(parsed_tests[0][1]),
                "constraints": "Auto-imported from MBPP dataset.",
                "hints": "Read the description carefully and check the sample input/output.",
                "starter_code": f"def {func_name}({', '.join(params)}):\n    # Write your code here\n    pass",
                "language_id": 71,
            }

            obj, was_created = Question.objects.update_or_create(slug=slug, defaults=defaults)
            obj.testcases.all().delete()
            for order, (call_args, expected) in enumerate(parsed_tests[:5], start=1):
                input_data = "\n".join(repr(a) for a in call_args)
                TestCase.objects.create(
                    question=obj,
                    input_data=input_data,
                    expected_output=repr(expected),
                    order=order,
                )
            created += 1

            if created % 100 == 0:
                self.stdout.write(f"  ...{created} imported so far")

        self.stdout.write(self.style.SUCCESS(
            f"Done. {created} questions imported, {skipped} skipped (couldn't auto-parse)."
        ))