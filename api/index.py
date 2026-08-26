import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'myproject', 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
from backend.asgi import application as app
