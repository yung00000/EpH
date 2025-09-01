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

def parse_distance(distance_str):
    """Convert distance string (e.g., '3KM', '8km') to kilometers."""
    try:
        # Remove 'KM' or 'km' and convert to float
        distance_str = distance_str.lower().replace('km', '').strip()
        return float(distance_str)
    except ValueError:
        raise ValueError("Invalid distance format. Use number followed by 'KM' or 'km' (e.g., '3KM', '8km').")

def calculate_times(pace_seconds, distance_km, split_distance_km=0.1):
    """Calculate total time, laps, and split times for given distance."""
    # Calculate number of 400m laps
    lap_distance_km = 0.4
    num_laps = int(distance_km // lap_distance_km)
    if distance_km % lap_distance_km != 0:
        num_laps += 1  # Partial lap counts as a full lap for calculation

    # Total time for full distance
    total_seconds = pace_seconds * distance_km
    total_minutes = int(total_seconds // 60)
    total_rem_seconds = int(total_seconds % 60)

    # Time per 400m lap
    lap_seconds = pace_seconds * lap_distance_km
    lap_minutes = int(lap_seconds // 60)
    lap_rem_seconds = int(lap_seconds % 60)

    # Time per 100m
    split_seconds = pace_seconds * split_distance_km

    return total_seconds, total_minutes, total_rem_seconds, lap_seconds, lap_minutes, lap_rem_seconds, split_seconds, num_laps

def format_time(minutes, seconds):
    """Format time as M:SS or M minutes."""
    if seconds == 0:
        return f"{minutes} minute{'s' if minutes != 1 else ''}"
    return f"{minutes} minute{'s' if minutes != 1 else ''} and {seconds} second{'s' if seconds != 1 else ''}"

def main():
    print("Running Pace Calculator")
    print("Enter pace per kilometer (e.g., '4:30' for 4 minutes 30 seconds, or '7' for 7 minutes):")
    
    pace_input = input("Pace: ").strip()
    print("Enter distance (e.g., '3KM', '8km', '10KM'):")
    distance_input = input("Distance: ").strip()
    
    try:
        pace_seconds = parse_pace(pace_input)
        distance_km = parse_distance(distance_input)
        total_seconds, total_minutes, total_rem_seconds, lap_seconds, lap_minutes, lap_rem_seconds, split_seconds, num_laps = calculate_times(pace_seconds, distance_km)
        
        total_time_str = format_time(total_minutes, total_rem_seconds)
        lap_time_str = format_time(lap_minutes, lap_rem_seconds)
        
        print(f"\nResults for {distance_km}km at {pace_input} min/km pace:")
        print(f"Total time for {distance_km}km: {total_time_str}")
        print(f"Number of 400m laps: {num_laps}")
        print(f"Time per 400m lap: {lap_time_str}")
        print(f"Time per 100m: {int(split_seconds)} second{'s' if split_seconds != 1 else ''}")
        
    except ValueError as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()