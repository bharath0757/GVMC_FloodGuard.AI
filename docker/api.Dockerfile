# Stage 1: Builder
FROM python:3.9-slim AS builder

WORKDIR /build

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY apps/api/requirements.txt .
RUN pip install --user --no-warn-script-location -r requirements.txt

# Stage 2: Production
FROM python:3.9-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -u 1000 appuser

# Copy installed Python packages from builder
COPY --from=builder /root/.local /home/appuser/.local

# Ensure local bin is in PATH
ENV PATH=/home/appuser/.local/bin:$PATH
ENV PYTHONPATH=/app

# Copy application code
COPY apps/api/app ./app

# Set ownership
RUN chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
