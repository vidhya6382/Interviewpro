import os, django, json
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()
from students.models import Question, TestCase

Question.objects.all().delete()
print("Old deleted")

json_path = "backend/ALL_ROLES_1800_QS/MASTER_ALL_1800_BACKEND.json"

with open(json_path, encoding='utf-8') as f:
    data = json.load(f)

print(f"Found {len(data)} questions")

for i, q in enumerate(data, start=1):
    # Frontend expects python-1, python-2...
    # Original slug like python-two-sum-1 ku badila python-1 nu vechom
    slug = f"python-{i}"
    obj = Question.objects.create(
        slug=slug,
        title=q['title'],
        difficulty=q['difficulty'],
        category=q['category'],
        topic=q.get('topic','Array'),
        company_tags=q.get('company_tags',[]),
        description=q['description'],
        sample_input=q['sample_input'],
        sample_output=q['sample_output'],
        constraints=q['constraints'],
        hints=q['hints'],
        starter_code=q['starter_code'],
        language_id=71
    )
    for idx, tc in enumerate(q.get('testcases', [])[:3], start=1):
        TestCase.objects.create(
            question=obj,
            input_data=tc['input'],
            expected_output=tc['output'],
            order=idx
        )

print(f"SUCCESS: Created {Question.objects.count()} questions!")