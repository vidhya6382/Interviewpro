import json, os, pathlib
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()
from students.models import Question

base = pathlib.Path("REAL_1800_DIFFERENT")
files = list(base.glob("*_backend_100.json"))
print(f"Found {len(files)} files")

Question.objects.all().delete()
print("Cleared DB")

total = 0
for filepath in files:
    print(f"\nLoading {filepath.name}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for item in data:
        try:
            Question.objects.create(
                slug=item.get('slug','')[:100],
                title=item.get('title','No Title')[:500],
                difficulty=item.get('difficulty','Easy')[:20],
                category=item.get('category','General')[:100],
                topic=item.get('topic','General')[:100],
                description=item.get('description','')[:5000],
                sample_input=str(item.get('sample_input',''))[:2000],
                sample_output=str(item.get('sample_output',''))[:2000],
                constraints=item.get('constraints','')[:2000],
                hints=item.get('hints','')[:2000],
                starter_code=item.get('starter_code','def solve():\n    pass'),
            )
            total += 1
        except Exception as e:
            print(f"  Error {item.get('slug')}: {e}")

print(f"\n=== DONE! Total {Question.objects.count()} ===")
for q in Question.objects.all()[:10]:
    print(q.slug, "-", q.title)