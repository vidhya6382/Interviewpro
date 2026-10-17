import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend', 'myproject'))

from myproject.wsgi import application
app = application