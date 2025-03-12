from setuptools import setup, find_packages

setup(
    name="alzheimer-detection-platform",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi>=0.103.1",
        "uvicorn>=0.23.2",
        "python-multipart>=0.0.6",
        "email-validator>=2.0.0",
        "pydantic>=2.4.2",
        "spacy>=3.6.1",
        "scikit-learn>=1.3.1",
        "numpy>=1.25.2",
        "pandas>=2.1.1",
        "python-dotenv>=1.0.0",
        "requests>=2.31.0",
    ],
) 