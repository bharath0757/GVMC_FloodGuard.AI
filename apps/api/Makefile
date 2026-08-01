.PHONY: dev test lint format clean

dev:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

test:
	pytest -v

lint:
	ruff check app/ tests/
	mypy app/

format:
	ruff check --fix app/ tests/
	ruff format app/ tests/

clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name '*.pyc' -delete
