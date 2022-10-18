from .base import *

DEBUG = True

ALLOWED_HOSTS += ["*"]

INSTALLED_APPS += [
]

MIDDLEWARE += [
]

# SendGird configurations
SENDGRID_SANDBOX_MODE_IN_DEBUG = True

CORS_ALLOW_ALL_ORIGINS = True

# CORS_ALLOWED_ORIGINS = [
#     'http://localhost:3000',
#
# ]
CORS_ALLOW_CREDENTIALS = True

APPEND_SLASH = False
