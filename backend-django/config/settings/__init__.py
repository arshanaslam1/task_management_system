import environ
import os
from pathlib import Path

env = environ.Env()
# reading env file
BASE_DIR = Path(__file__).resolve().parent.parent
environ.Env.read_env(os.path.join(BASE_DIR, 'env'))

# Raises django's ImproperlyConfigured exception if SECRET_KEY not in os.environ
SECRET_KEY = env("SECRET_KEY")


if env('SERVER') == 'prod':
    from .prod import *
elif env('SERVER') == 'stage':
    from .stage import *
else:
    from .dev import *
