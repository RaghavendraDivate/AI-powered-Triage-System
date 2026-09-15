"""
Hospital Appointment System Package

This package contains:
- Disease prediction functionality
- Appointment scheduling system
- API endpoints for integration

Modules:
- predictor: Disease prediction logic
- scheduler: Appointment booking system
- main: FastAPI application setup
"""

__version__ = "1.0.0"
__author__ = "Your Name"
__email__ = "your.email@example.com"

# Initialize logging
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)
logger.info("Hospital System Package initialized")