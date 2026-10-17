import os
import sys

CURRENT_DIR = os.path.dirname(__file__)
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
BACKEND_PATH = os.path.join(PROJECT_ROOT, 'backend', 'myproject')

sys.path.insert(0, BACKEND_PATH)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')

from django.core.wsgi import get_wsgi_application
app = get_wsgi_application()