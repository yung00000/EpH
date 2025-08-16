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

    # Run app.py when the container launches
    CMD ["python", "-h" ,"--host=0.0.0.0","--port=8080","app.py"]


# Use the official Python slim image for a smaller footprint
#FROM python:3.12-slim

# Set working directory in the container
#WORKDIR /app

# Copy the requirements file (if you have one) and install dependencies
#COPY requirements.txt .
#RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
#COPY app.py .

# Set environment variables for Cloud Run
#ENV PORT=8080

# Expose the port Cloud Run expects
#EXPOSE 8080

# Command to run the application
#CMD exec python app.py
