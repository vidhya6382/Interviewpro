import json
from pathlib import Path
import os, django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from students.models import Question

# FILE PATH-A INGA FIX PANNITTEN
json_path = Path(__file__).parent / "backend" / "ALL_ROLES_1800_QS" / "MASTER_ALL_1800_BACKEND.json"

print(f"Trying to open: {json_path}")
print(f"File exists? {json_path.exists()}")

with open(json_path, 'r', encoding='utf-8') as f:
    questions = json.load(f)

created = 0
for q in questions:
    obj, is_created = Question.objects.update_or_create(
        slug=q['slug'],
        defaults={
            'title': q['title'],
            'difficulty': q['difficulty'],
            'category': q['category'],
            'description': q.get('description', ''),
        }
    )
    if is_created:
        created += 1

print(f"Total: {len(questions)}, New Created: {created}")