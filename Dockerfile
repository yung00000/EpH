    # Use an official Python runtime as a parent image
   FROM python:3.13.3-slim-bookworm

    # Set the working directory in the container
    WORKDIR /app

    # Copy the current directory contents into the container at /app
    COPY . /app

    COPY . /templates/index

    # Install any needed packages specified in requirements.txt
    RUN pip install --no-cache-dir -r requirements.txt

    # Make port 8080 available to the world outside this container
    EXPOSE 8080

    # Run app.py when the container launches
    #CMD ["python", "app.py"]


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
CMD exec python app.py
