#!/usr/bin/env python3
"""
Startup script for EpH Calculator Applications
"""

import subprocess
import sys
import os
import signal
import time

def print_banner():
    """Print application banner"""
    print("=" * 60)
    print("🏃 EpH Calculator Applications")
    print("=" * 60)
    print("1. EpH Calculator (Port 8080)")
    print("2. Track Speed/Time Calculator (Port 8081)")
    print("3. Both Applications")
    print("4. Exit")
    print("=" * 60)

def start_app(app_name, app_file, port):
    """Start a single application"""
    print(f"🚀 Starting {app_name} on port {port}...")
    
    try:
        process = subprocess.Popen(
            [sys.executable, app_file],
            env={**os.environ, 'PORT': str(port)},
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        # Wait a moment to check if it started successfully
        time.sleep(2)
        
        if process.poll() is None:
            print(f"✅ {app_name} started successfully!")
            print(f"🌐 Access at: http://localhost:{port}")
            return process
        else:
            stdout, stderr = process.communicate()
            print(f"❌ Failed to start {app_name}")
            print(f"Error: {stderr.decode()}")
            return None
            
    except Exception as e:
        print(f"❌ Error starting {app_name}: {e}")
        return None

def start_both_apps():
    """Start both applications"""
    print("🚀 Starting both applications...")
    
    eph_process = start_app("EpH Calculator", "app.py", 8080)
    if not eph_process:
        print("❌ Failed to start EpH Calculator")
        return False
    
    time.sleep(1)  # Small delay between starts
    
    track_process = start_app("Track Calculator", "app_track.py", 8081)
    if not track_process:
        print("❌ Failed to start Track Calculator")
        eph_process.terminate()
        return False
    
    print("\n🎉 Both applications started successfully!")
    print("🌐 EpH Calculator: http://localhost:8080")
    print("🌐 Track Calculator: http://localhost:8081")
    print("\nPress Ctrl+C to stop both applications")
    
    try:
        # Keep both processes running
        while True:
            time.sleep(1)
            # Check if either process has stopped
            if eph_process.poll() is not None:
                print("⚠️  EpH Calculator stopped unexpectedly")
                track_process.terminate()
                break
            if track_process.poll() is not None:
                print("⚠️  Track Calculator stopped unexpectedly")
                eph_process.terminate()
                break
    except KeyboardInterrupt:
        print("\n🛑 Stopping applications...")
        eph_process.terminate()
        track_process.terminate()
        eph_process.wait()
        track_process.wait()
        print("✅ Applications stopped")
    
    return True

def main():
    """Main function"""
    while True:
        print_banner()
        
        try:
            choice = input("Select an option (1-4): ").strip()
            
            if choice == "1":
                print("\n🚀 Starting EpH Calculator...")
                process = start_app("EpH Calculator", "app.py", 8080)
                if process:
                    print("\nPress Ctrl+C to stop the application")
                    try:
                        process.wait()
                    except KeyboardInterrupt:
                        print("\n🛑 Stopping EpH Calculator...")
                        process.terminate()
                        process.wait()
                        print("✅ Application stopped")
                        
            elif choice == "2":
                print("\n🚀 Starting Track Calculator...")
                process = start_app("Track Calculator", "app_track.py", 8081)
                if process:
                    print("\nPress Ctrl+C to stop the application")
                    try:
                        process.wait()
                    except KeyboardInterrupt:
                        print("\n🛑 Stopping Track Calculator...")
                        process.terminate()
                        process.wait()
                        print("✅ Application stopped")
                        
            elif choice == "3":
                start_both_apps()
                
            elif choice == "4":
                print("👋 Goodbye!")
                break
                
            else:
                print("❌ Invalid option. Please select 1-4.")
                
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")
        
        print("\n" + "=" * 60 + "\n")

if __name__ == "__main__":
    main()
