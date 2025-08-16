 FROM python:3.13.3-slim-bookworm

 # Set working directory
 WORKDIR /app

 # Copy requirements file
 COPY requirements.txt .

 # Install dependencies
 RUN pip install --no-cache-dir -r requirements.txt

 # Copy the rest of the application
 COPY . .

 # Make port 8080 available to the world outside this container
 EXPOSE 8080

 # Run the application with gunicorn
 CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-8080} app:app"]
