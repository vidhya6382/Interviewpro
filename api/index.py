import os
import sys
# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'myproject', 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
from django.core.wsgi import get_wsgi_application
app = get_wsgi_application()
