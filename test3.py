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

def calculate_times(pace_seconds, distance_km):
    """Calculate total time and split times for the given distance."""
    # Total time for the distance
    total_seconds = pace_seconds * distance_km
    
    # Calculate number of full 400m laps and remaining meters
    total_meters = distance_km * 1000
    full_laps = int(total_meters // 400)
    remaining_meters = int(total_meters % 400)
    
    # Time per 400m
    lap_time_seconds = pace_seconds * 0.4
    
    # Time per 100m
    hundred_time_seconds = pace_seconds * 0.1
    
    return (
        total_seconds,
        lap_time_seconds, hundred_time_seconds,
        full_laps, remaining_meters
    )

def format_time_seconds(total_seconds):
    """Format time as HH:MM:SS."""
    hours = int(total_seconds // 3600)
    minutes = int((total_seconds % 3600) // 60)
    seconds = int(total_seconds % 60)
    
    return f"{hours:02d}:{minutes:02d}:{seconds:02d}"

def format_seconds(seconds):
    """Format seconds to HH:MM:SS or MM:SS."""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    
    if hours > 0:
        return f"{hours:02d}:{minutes:02d}:{secs:02d}"
    else:
        return f"{minutes:02d}:{secs:02d}"

def main():
    print("Running Pace Calculator")
    print("Enter pace per kilometer (e.g., '4:30' for 4 minutes 30 seconds, or '7' for 7 minutes):")
    
    pace_input = input("Pace: ").strip()
    
    print("\nEnter distance (e.g., 3KM, 5KM, 10km):")
    distance_input = input("Distance: ").strip().upper()
    
    try:
        # Extract numeric value from distance input
        distance_km = float(''.join(filter(lambda x: x.isdigit() or x == '.', distance_input)))
        
        pace_seconds = parse_pace(pace_input)
        (
            total_seconds,
            lap_time_seconds, hundred_time_seconds,
            full_laps, remaining_meters
        ) = calculate_times(pace_seconds, distance_km)
        
        total_time_str = format_time_seconds(total_seconds)
        lap_time_str = format_seconds(lap_time_seconds)
        hundred_time_str = format_seconds(hundred_time_seconds)
        
        print(f"\nResults for {distance_km}KM at {pace_input} min/km pace:")
        print(f"Total time: {total_time_str}")
        
        # Display lap information
        if full_laps > 0:
            print(f"Number of 400m laps: {full_laps}")
            if remaining_meters > 0:
                print(f"Plus an additional {remaining_meters}m")
            print(f"Time per 400m lap: {lap_time_str}")
        
        print(f"Time per 100m: {hundred_time_str}")
        
        # Display split times for each 400m lap
        if full_laps > 0:
            print("\nSplit times for each 400m lap:")
            cumulative_time = 0
            for lap in range(1, full_laps + 1):
                cumulative_time += lap_time_seconds
                lap_time_formatted = format_time_seconds(cumulative_time)
                print(f"Lap {lap}: {lap_time_formatted}")
        
    except ValueError as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()