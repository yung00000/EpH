#!/usr/bin/env python3
"""
Test script to verify both EpH Calculator and Track Calculator applications
"""

import subprocess
import time
import requests
import sys
import os

def test_app_startup(app_name, app_file, port):
    """Test if an application can start successfully"""
    print(f"Testing {app_name}...")
    
    try:
        # Start the application
        process = subprocess.Popen(
            [sys.executable, app_file],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env={**os.environ, 'PORT': str(port)}
        )
        
        # Wait a bit for the app to start
        time.sleep(3)
        
        # Check if process is still running
        if process.poll() is None:
            print(f"✅ {app_name} started successfully on port {port}")
            
            # Test health endpoint
            try:
                response = requests.get(f"http://localhost:{port}/health", timeout=5)
                if response.status_code == 200:
                    print(f"✅ {app_name} health check passed")
                else:
                    print(f"⚠️  {app_name} health check failed: {response.status_code}")
            except requests.exceptions.RequestException as e:
                print(f"⚠️  {app_name} health check failed: {e}")
            
            # Terminate the process
            process.terminate()
            process.wait()
            return True
        else:
            stdout, stderr = process.communicate()
            print(f"❌ {app_name} failed to start")
            print(f"STDOUT: {stdout.decode()}")
            print(f"STDERR: {stderr.decode()}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing {app_name}: {e}")
        return False

def main():
    """Main test function"""
    print("Testing EpH Calculator Applications...")
    print("=" * 50)
    
    # Test EpH Calculator
    eph_success = test_app_startup("EpH Calculator", "app.py", 8080)
    
    print()
    
    # Test Track Calculator
    track_success = test_app_startup("Track Calculator", "app_track.py", 8081)
    
    print()
    print("=" * 50)
    
    if eph_success and track_success:
        print("🎉 All tests passed! Both applications can start successfully.")
        print("\nTo run the applications:")
        print("1. EpH Calculator: python app.py (runs on port 8080)")
        print("2. Track Calculator: python app_track.py (runs on port 8081)")
        print("\nOr run both simultaneously in separate terminals.")
    else:
        print("❌ Some tests failed. Please check the error messages above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
