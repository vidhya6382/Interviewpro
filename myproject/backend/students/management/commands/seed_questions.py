# seed_questions.py
# Django management command.
# Place this file at: <your_app>/management/commands/seed_questions.py
# (create the folders management/ and management/commands/ with empty __init__.py in each)
# Run with: python manage.py seed_questions

from django.core.management.base import BaseCommand
from students.models import Question, TestCase


QUESTIONS = [
    {
        "slug": "two-sum",
        "title": "Two Sum",
        "difficulty": "Easy",
        "category": "SWE_FULL_STACK",
        "topic": "Array",
        "company_tags": "Amazon, Google",
        "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        "sample_input": "[2,7,11,15], 9",
        "sample_output": "[0, 1]",
        "constraints": "1 <= n <= 10^5\nTime O(n), Space O(n)",
        "hints": "Use a hash map to store value -> index while scanning once.",
        "starter_code": "def solve(nums, target):\n    # Write your code here\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "[2,7,11,15]\n9", "expected_output": "[0, 1]", "order": 1},
            {"input_data": "[3,2,4]\n6", "expected_output": "[1, 2]", "order": 2},
            {"input_data": "[3,3]\n6", "expected_output": "[0, 1]", "order": 3},
        ],
    },
    {
        "slug": "valid-parentheses",
        "title": "Valid Parentheses",
        "difficulty": "Easy",
        "category": "SWE_FULL_STACK",
        "topic": "Stack",
        "company_tags": "Zoho, TCS",
        "description": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid (every bracket is closed by the same type in the correct order).",
        "sample_input": "\"()[]{}\"",
        "sample_output": "True",
        "constraints": "1 <= s.length <= 10^4",
        "hints": "Use a stack. Push opening brackets, pop and compare on closing brackets.",
        "starter_code": "def solve(s):\n    # Write your code here\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "\"()\"", "expected_output": "True", "order": 1},
            {"input_data": "\"()[]{}\"", "expected_output": "True", "order": 2},
            {"input_data": "\"(]\"", "expected_output": "False", "order": 3},
        ],
    },
    {
        "slug": "best-time-to-buy-and-sell-stock",
        "title": "Best Time to Buy and Sell Stock",
        "difficulty": "Easy",
        "category": "SWE_FULL_STACK",
        "topic": "Array",
        "company_tags": "TCS, Infosys",
        "description": "Given an array prices where prices[i] is the price of a stock on day i, return the maximum profit from buying on one day and selling on a later day. Return 0 if no profit is possible.",
        "sample_input": "[7,1,5,3,6,4]",
        "sample_output": "5",
        "constraints": "1 <= prices.length <= 10^5",
        "hints": "Track the minimum price seen so far and the best profit while scanning once.",
        "starter_code": "def solve(prices):\n    # Write your code here\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "[7,1,5,3,6,4]", "expected_output": "5", "order": 1},
            {"input_data": "[7,6,4,3,1]", "expected_output": "0", "order": 2},
        ],
    },
    {
        "slug": "two-sum-ii",
        "title": "Two Sum II",
        "difficulty": "Medium",
        "category": "SWE_FULL_STACK",
        "topic": "Two Pointers",
        "company_tags": "Amazon",
        "description": "Given a 1-indexed sorted array numbers, find two numbers that add up to target. Return their indices (1-indexed) as [index1, index2].",
        "sample_input": "[2,7,11,15]\n9",
        "sample_output": "[1, 2]",
        "constraints": "Array is sorted ascending.",
        "hints": "Use two pointers, one from the start and one from the end.",
        "starter_code": "def solve(numbers, target):\n    # Write your code here\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "[2,7,11,15]\n9", "expected_output": "[1, 2]", "order": 1},
            {"input_data": "[2,3,4]\n6", "expected_output": "[1, 3]", "order": 2},
        ],
    },
    {
        "slug": "3sum",
        "title": "3Sum",
        "difficulty": "Medium",
        "category": "SWE_FULL_STACK",
        "topic": "Array",
        "company_tags": "Adobe, Amazon",
        "description": "Given an integer array nums, return all unique triplets [a, b, c] such that a + b + c == 0.",
        "sample_input": "[-1,0,1,2,-1,-4]",
        "sample_output": "[[-1, -1, 2], [-1, 0, 1]]",
        "constraints": "0 <= nums.length <= 3000",
        "hints": "Sort the array, then use two pointers for each fixed first element.",
        "starter_code": "def solve(nums):\n    # Write your code here\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "[-1,0,1,2,-1,-4]", "expected_output": "[[-1, -1, 2], [-1, 0, 1]]", "order": 1},
        ],
    },
    {
        "slug": "group-anagrams",
        "title": "Group Anagrams",
        "difficulty": "Medium",
        "category": "SWE_FULL_STACK",
        "topic": "String",
        "company_tags": "Amazon",
        "description": "Given an array of strings strs, group the anagrams together. Return the groups as a list of lists (sorted internally and by group for consistent checking).",
        "sample_input": "[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]",
        "sample_output": "[['ate', 'eat', 'tea'], ['bat'], ['nat', 'tan']]",
        "constraints": "1 <= strs.length <= 10^4. Return groups sorted alphabetically, words within a group sorted alphabetically.",
        "hints": "Use a dict keyed by the sorted characters of each word.",
        "starter_code": "def solve(strs):\n    # Write your code here\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", "expected_output": "[['ate', 'eat', 'tea'], ['bat'], ['nat', 'tan']]", "order": 1},
        ],
    },
    {
        "slug": "maximum-subarray",
        "title": "Maximum Subarray",
        "difficulty": "Medium",
        "category": "SWE_FULL_STACK",
        "topic": "DP",
        "company_tags": "Infosys",
        "description": "Given an integer array nums, find the contiguous subarray with the largest sum and return that sum.",
        "sample_input": "[-2,1,-3,4,-1,2,1,-5,4]",
        "sample_output": "6",
        "constraints": "1 <= nums.length <= 10^5",
        "hints": "Kadane's Algorithm: track running sum, reset to current element when running sum goes negative.",
        "starter_code": "def solve(nums):\n    # Write your code here\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "[-2,1,-3,4,-1,2,1,-5,4]", "expected_output": "6", "order": 1},
            {"input_data": "[1]", "expected_output": "1", "order": 2},
        ],
    },
    {
        "slug": "merge-intervals",
        "title": "Merge Intervals",
        "difficulty": "Medium",
        "category": "SWE_FULL_STACK",
        "topic": "Array",
        "company_tags": "Google",
        "description": "Given an array of intervals, merge all overlapping intervals and return the merged, sorted list.",
        "sample_input": "[[1,3],[2,6],[8,10],[15,18]]",
        "sample_output": "[[1, 6], [8, 10], [15, 18]]",
        "constraints": "1 <= intervals.length <= 10^4",
        "hints": "Sort by start time, then merge whenever the current start <= previous end.",
        "starter_code": "def solve(intervals):\n    # Write your code here\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "[[1,3],[2,6],[8,10],[15,18]]", "expected_output": "[[1, 6], [8, 10], [15, 18]]", "order": 1},
        ],
    },
    {
        "slug": "linked-list-cycle",
        "title": "Linked List Cycle",
        "difficulty": "Easy",
        "category": "SWE_FULL_STACK",
        "topic": "Linked List",
        "company_tags": "TCS",
        "description": "Given the head values of a singly linked list built from a Python list, and a pos index where the tail connects to (forming a cycle), return whether the list has a cycle. Use pos = -1 for no cycle. For this simplified auto-graded version, the function receives (values, pos) and must return True/False.",
        "sample_input": "[3,2,0,-4]\n1",
        "sample_output": "True",
        "constraints": "0 <= n <= 10^4",
        "hints": "Use Floyd's cycle detection (slow/fast pointers) after building the list with the given pos.",
        "starter_code": "def solve(values, pos):\n    # Write your code here\n    # Build the linked list from `values`, connect tail to index `pos` if pos != -1\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "[3,2,0,-4]\n1", "expected_output": "True", "order": 1},
            {"input_data": "[1]\n-1", "expected_output": "False", "order": 2},
        ],
    },
    {
        "slug": "binary-search",
        "title": "Binary Search",
        "difficulty": "Easy",
        "category": "SWE_FULL_STACK",
        "topic": "Binary Search",
        "company_tags": "Accenture",
        "description": "Given a sorted array nums and a target value, return the index of target, or -1 if not found.",
        "sample_input": "[-1,0,3,5,9,12]\n9",
        "sample_output": "4",
        "constraints": "Array is sorted ascending, all unique elements.",
        "hints": "Classic binary search: compare mid element to target, narrow the range each step.",
        "starter_code": "def solve(nums, target):\n    # Write your code here\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "[-1,0,3,5,9,12]\n9", "expected_output": "4", "order": 1},
            {"input_data": "[-1,0,3,5,9,12]\n2", "expected_output": "-1", "order": 2},
        ],
    },
]


class Command(BaseCommand):
    help = "Seeds the 10 real Python Full Stack questions with testcases"

    def handle(self, *args, **options):
        for q in QUESTIONS:
            tcs = q.pop("testcases")
            obj, created = Question.objects.update_or_create(
                slug=q["slug"], defaults=q
            )
            obj.testcases.all().delete()
            for tc in tcs:
                TestCase.objects.create(question=obj, **tc)
            self.stdout.write(self.style.SUCCESS(
                f"{'Created' if created else 'Updated'}: {obj.slug} ({len(tcs)} testcases)"
            ))

        self.stdout.write(self.style.SUCCESS(f"Done. {len(QUESTIONS)} questions seeded."))