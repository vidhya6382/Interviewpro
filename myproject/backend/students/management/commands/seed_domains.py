
from django.core.management.base import BaseCommand
from students.models import Question, TestCase

QUESTIONS = [
    # ---------------- DATA ANALYST ----------------
    {
        "slug": "da-column-mean",
        "title": "Compute Column Average (Pandas)",
        "difficulty": "Easy", "category": "DATA_ANALYST", "topic": "Pandas",
        "company_tags": "Practice",
        "description": "Given a list of dicts representing rows, and a column name, return the average value of that column, rounded to 2 decimals.",
        "sample_input": "[{'age':20},{'age':30},{'age':40}], 'age'",
        "sample_output": "30.0",
        "constraints": "Use pandas internally.",
        "hints": "pd.DataFrame(rows)[col].mean()",
        "starter_code": "def solve(rows, col):\n    import pandas as pd\n    # Write your code here\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "[{'age': 20}, {'age': 30}, {'age': 40}]\n'age'", "expected_output": "30.0", "order": 1},
            {"input_data": "[{'x': 5}, {'x': 15}]\n'x'", "expected_output": "10.0", "order": 2},
        ],
    },
    {
        "slug": "da-filter-rows",
        "title": "Filter Rows by Condition (Pandas)",
        "difficulty": "Easy", "category": "DATA_ANALYST", "topic": "Pandas",
        "company_tags": "Practice",
        "description": "Given a list of dicts and a numeric threshold, return the list of dicts where 'score' > threshold, preserving order.",
        "sample_input": "[{'name':'A','score':50},{'name':'B','score':90}], 60",
        "sample_output": "[{'name': 'B', 'score': 90}]",
        "constraints": "Use pandas internally.",
        "hints": "df[df['score'] > threshold].to_dict('records')",
        "starter_code": "def solve(rows, threshold):\n    import pandas as pd\n    # Write your code here\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "[{'name': 'A', 'score': 50}, {'name': 'B', 'score': 90}]\n60", "expected_output": "[{'name': 'B', 'score': 90}]", "order": 1},
        ],
    },
    {
        "slug": "da-groupby-sum",
        "title": "Group By and Sum (Pandas)",
        "difficulty": "Medium", "category": "DATA_ANALYST", "topic": "Pandas",
        "company_tags": "Practice",
        "description": "Given a list of dicts with 'dept' and 'sales', return a dict mapping each department to total sales.",
        "sample_input": "[{'dept':'A','sales':100},{'dept':'A','sales':50},{'dept':'B','sales':30}]",
        "sample_output": "{'A': 150, 'B': 30}",
        "constraints": "Use pandas groupby internally.",
        "hints": "df.groupby('dept')['sales'].sum().to_dict()",
        "starter_code": "def solve(rows):\n    import pandas as pd\n    # Write your code here\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "[{'dept': 'A', 'sales': 100}, {'dept': 'A', 'sales': 50}, {'dept': 'B', 'sales': 30}]", "expected_output": "{'A': 150, 'B': 30}", "order": 1},
        ],
    },
    {
        "slug": "da-missing-values",
        "title": "Count Missing Values",
        "difficulty": "Easy", "category": "DATA_ANALYST", "topic": "Data Cleaning",
        "company_tags": "Practice",
        "description": "Given a list of values (which may include None), return the count of None (missing) values.",
        "sample_input": "[1, None, 3, None, 5]",
        "sample_output": "2",
        "constraints": "",
        "hints": "Use pandas isna() or a simple count.",
        "starter_code": "def solve(values):\n    import pandas as pd\n    # Write your code here\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "[1, None, 3, None, 5]", "expected_output": "2", "order": 1},
            {"input_data": "[1, 2, 3]", "expected_output": "0", "order": 2},
        ],
    },
    {
        "slug": "da-pivot-count",
        "title": "Value Counts",
        "difficulty": "Easy", "category": "DATA_ANALYST", "topic": "Pandas",
        "company_tags": "Practice",
        "description": "Given a list of category strings, return a dict of each category mapped to its occurrence count.",
        "sample_input": "['a','b','a','c','b','a']",
        "sample_output": "{'a': 3, 'b': 2, 'c': 1}",
        "constraints": "",
        "hints": "pd.Series(values).value_counts().to_dict()",
        "starter_code": "def solve(values):\n    import pandas as pd\n    # Write your code here\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "['a', 'b', 'a', 'c', 'b', 'a']", "expected_output": "{'a': 3, 'b': 2, 'c': 1}", "order": 1},
        ],
    },

    # ---------------- ML ENGINEER ----------------
    {
        "slug": "ml-normalize",
        "title": "Min-Max Normalize a List (NumPy)",
        "difficulty": "Easy", "category": "ML_ENGINEER", "topic": "NumPy",
        "company_tags": "Practice",
        "description": "Given a list of numbers, scale them to the range [0, 1] using min-max normalization. Round each to 2 decimals.",
        "sample_input": "[10, 20, 30]",
        "sample_output": "[0.0, 0.5, 1.0]",
        "constraints": "Use numpy internally.",
        "hints": "(x - min) / (max - min)",
        "starter_code": "def solve(values):\n    import numpy as np\n    # Write your code here\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "[10, 20, 30]", "expected_output": "[0.0, 0.5, 1.0]", "order": 1},
        ],
    },
    {
        "slug": "ml-mean-squared-error",
        "title": "Mean Squared Error",
        "difficulty": "Easy", "category": "ML_ENGINEER", "topic": "Metrics",
        "company_tags": "Practice",
        "description": "Given two equal-length lists (y_true, y_pred), compute the Mean Squared Error, rounded to 2 decimals.",
        "sample_input": "[1,2,3], [1,2,4]",
        "sample_output": "0.33",
        "constraints": "",
        "hints": "mean((y_true - y_pred)**2)",
        "starter_code": "def solve(y_true, y_pred):\n    import numpy as np\n    # Write your code here\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "[1, 2, 3]\n[1, 2, 4]", "expected_output": "0.33", "order": 1},
        ],
    },
    {
        "slug": "ml-train-test-split",
        "title": "Train/Test Split Size",
        "difficulty": "Easy", "category": "ML_ENGINEER", "topic": "scikit-learn",
        "company_tags": "Practice",
        "description": "Given the total number of samples n and a test_size fraction, return the number of test samples (integer, rounded down).",
        "sample_input": "100, 0.2",
        "sample_output": "20",
        "constraints": "",
        "hints": "int(n * test_size)",
        "starter_code": "def solve(n, test_size):\n    # Write your code here\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "100\n0.2", "expected_output": "20", "order": 1},
            {"input_data": "50\n0.1", "expected_output": "5", "order": 2},
        ],
    },
    {
        "slug": "ml-euclidean-distance",
        "title": "Euclidean Distance (NumPy)",
        "difficulty": "Easy", "category": "ML_ENGINEER", "topic": "NumPy",
        "company_tags": "Practice",
        "description": "Given two points as lists of equal length, compute the Euclidean distance between them, rounded to 2 decimals.",
        "sample_input": "[0,0], [3,4]",
        "sample_output": "5.0",
        "constraints": "",
        "hints": "np.linalg.norm(a - b)",
        "starter_code": "def solve(a, b):\n    import numpy as np\n    # Write your code here\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "[0, 0]\n[3, 4]", "expected_output": "5.0", "order": 1},
        ],
    },
    {
        "slug": "ml-accuracy-score",
        "title": "Accuracy Score",
        "difficulty": "Easy", "category": "ML_ENGINEER", "topic": "Metrics",
        "company_tags": "Practice",
        "description": "Given y_true and y_pred (lists of 0/1 labels), compute classification accuracy rounded to 2 decimals.",
        "sample_input": "[1,0,1,1], [1,0,0,1]",
        "sample_output": "0.75",
        "constraints": "",
        "hints": "correct / total",
        "starter_code": "def solve(y_true, y_pred):\n    # Write your code here\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "[1, 0, 1, 1]\n[1, 0, 0, 1]", "expected_output": "0.75", "order": 1},
        ],
    },

    # ---------------- GENAI DEVELOPER ----------------
    {
        "slug": "genai-token-count",
        "title": "Simple Whitespace Tokenizer",
        "difficulty": "Easy", "category": "GENAI", "topic": "NLP Basics",
        "company_tags": "Practice",
        "description": "Given a sentence, return the number of whitespace-separated tokens.",
        "sample_input": "'the quick brown fox'",
        "sample_output": "4",
        "constraints": "",
        "hints": "len(sentence.split())",
        "starter_code": "def solve(sentence):\n    # Write your code here\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "'the quick brown fox'", "expected_output": "4", "order": 1},
        ],
    },
    {
        "slug": "genai-cosine-similarity",
        "title": "Cosine Similarity of Two Vectors",
        "difficulty": "Medium", "category": "GENAI", "topic": "Embeddings",
        "company_tags": "Practice",
        "description": "Given two equal-length numeric vectors, compute the cosine similarity between them, rounded to 2 decimals.",
        "sample_input": "[1,0], [0,1]",
        "sample_output": "0.0",
        "constraints": "",
        "hints": "dot(a,b) / (norm(a) * norm(b))",
        "starter_code": "def solve(a, b):\n    import numpy as np\n    # Write your code here\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "[1, 0]\n[0, 1]", "expected_output": "0.0", "order": 1},
            {"input_data": "[1, 1]\n[1, 1]", "expected_output": "1.0", "order": 2},
        ],
    },
    {
        "slug": "genai-top-k-words",
        "title": "Top-K Most Frequent Words",
        "difficulty": "Medium", "category": "GENAI", "topic": "NLP Basics",
        "company_tags": "Practice",
        "description": "Given a sentence and k, return the k most frequent words as a list, most frequent first. Break ties alphabetically.",
        "sample_input": "'the cat sat on the mat the cat ran', 2",
        "sample_output": "['the', 'cat']",
        "constraints": "",
        "hints": "Counter(words).most_common(k)",
        "starter_code": "def solve(sentence, k):\n    from collections import Counter\n    # Write your code here\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "'the cat sat on the mat the cat ran'\n2", "expected_output": "['the', 'cat']", "order": 1},
        ],
    },

    # ---------------- AI FULL STACK ----------------
    {
        "slug": "aifs-chunk-text",
        "title": "Chunk Text for RAG Pipeline",
        "difficulty": "Easy", "category": "AI_FULLSTACK", "topic": "RAG",
        "company_tags": "Practice",
        "description": "Given a string and a chunk_size, split it into a list of chunks of at most chunk_size characters each, preserving order.",
        "sample_input": "'abcdefgh', 3",
        "sample_output": "['abc', 'def', 'gh']",
        "constraints": "",
        "hints": "[text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]",
        "starter_code": "def solve(text, chunk_size):\n    # Write your code here\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "'abcdefgh'\n3", "expected_output": "['abc', 'def', 'gh']", "order": 1},
        ],
    },
    {
        "slug": "aifs-json-validate",
        "title": "Validate Required Keys in API Response",
        "difficulty": "Easy", "category": "AI_FULLSTACK", "topic": "API Design",
        "company_tags": "Practice",
        "description": "Given a dict and a list of required keys, return True if all required keys are present, else False.",
        "sample_input": "{'a':1,'b':2}, ['a','b']",
        "sample_output": "True",
        "constraints": "",
        "hints": "all(k in data for k in required)",
        "starter_code": "def solve(data, required):\n    # Write your code here\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "{'a': 1, 'b': 2}\n['a', 'b']", "expected_output": "True", "order": 1},
            {"input_data": "{'a': 1}\n['a', 'b']", "expected_output": "False", "order": 2},
        ],
    },
    {
        "slug": "aifs-rate-limiter",
        "title": "Simple Rate Limit Check",
        "difficulty": "Medium", "category": "AI_FULLSTACK", "topic": "System Design",
        "company_tags": "Practice",
        "description": "Given a sorted list of request timestamps (ints, seconds) and a limit, return True if the number of requests within the last 60 seconds (based on the max timestamp) is within the limit, else False.",
        "sample_input": "[1,10,20,70], 3",
        "sample_output": "True",
        "constraints": "",
        "hints": "Count timestamps >= (max - 60).",
        "starter_code": "def solve(timestamps, limit):\n    # Write your code here\n    pass",
        "language_id": 71,
        "testcases": [
            {"input_data": "[1, 10, 20, 70]\n3", "expected_output": "True", "order": 1},
        ],
    },
]


class Command(BaseCommand):
    help = "Seeds real Python coding questions for Data Analyst, ML Engineer, GenAI, AI Full Stack"

    def handle(self, *args, **options):
        created = 0
        for q in QUESTIONS:
            tcs = q.pop("testcases")
            obj, was_created = Question.objects.update_or_create(slug=q["slug"], defaults=q)
            obj.testcases.all().delete()
            for tc in tcs:
                TestCase.objects.create(question=obj, **tc)
            created += 1
            self.stdout.write(self.style.SUCCESS(f"{'Created' if was_created else 'Updated'}: {obj.slug}"))
        self.stdout.write(self.style.SUCCESS(f"Done. {created} domain questions seeded."))