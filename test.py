def parse_pace(pace_str):
    """Convert pace string (M:SS or M) to seconds per kilometer."""
    try:
        if ":" in pace_str:
            minutes, seconds = map(int, pace_str.split(":"))
            return minutes * 60 + seconds
        else:
            return int(pace_str) * 60
    except ValueError:
        raise ValueError("Invalid pace format. Use M:SS (e.g., '4:30') or M (e.g., '7').")

def calculate_times(pace_seconds, distance_km=0.4, split_distance_km=0.1):
    """Calculate total time for 400m and time per 100m."""
    # Total time for 400 meters
    total_seconds = pace_seconds * distance_km
    total_minutes = int(total_seconds // 60)
    total_rem_seconds = int(total_seconds % 60)
    
    # Time per 100 meters
    split_seconds = pace_seconds * split_distance_km
    
    return total_seconds, total_minutes, total_rem_seconds, split_seconds

def format_time(minutes, seconds):
    """Format time as M:SS or M minutes."""
    if seconds == 0:
        return f"{minutes} minute{'s' if minutes != 1 else ''}"
    return f"{minutes} minute{'s' if minutes != 1 else ''} and {seconds} second{'s' if seconds != 1 else ''}"

def main():
    print("400m Pace Calculator")
    print("Enter pace per kilometer (e.g., '4:30' for 4 minutes 30 seconds, or '7' for 7 minutes):")
    
    pace_input = input("Pace: ").strip()
    
    try:
        pace_seconds = parse_pace(pace_input)
        total_seconds, total_minutes, total_rem_seconds, split_seconds = calculate_times(pace_seconds)
        
        total_time_str = format_time(total_minutes, total_rem_seconds)
        print(f"\nResults for 400m at {pace_input} min/km pace:")
        print(f"Total time for 400m: {total_time_str}")
        print(f"Time per 100m: {int(split_seconds)} second{'s' if split_seconds != 1 else ''}")
        
    except ValueError as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()