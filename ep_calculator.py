"""
EpH (Effort per Hour) Calculator

Definition:
    1 km of road = 1 EP
    100 m of climbing = 1 EP

EP per hour = (distance_km + climbing_m / 100) / hours
"""

from __future__ import annotations
import argparse
import sys
from typing import Tuple


def calculate_ep(distance_km: float, climb_m: float) -> float:
    """
    Calculate total EP for a given distance and climbing.

    Parameters
    ----------
    distance_km : float
        Distance travelled in kilometres.
    climb_m : float
        Vertical climb in metres.

    Returns
    -------
    float
        Total EP.
    """
    return distance_km + climb_m / 100.0


def calculate_ep_hour(distance_km: float, climb_m: float, hours: float) -> float:
    """
    Calculate EpH (EP per hour) for a given distance, climb and time.

    Parameters
    ----------
    distance_km : float
        Distance travelled in kilometres.
    climb_m : float
        Vertical climb in metres.
    hours : float
        Time spent in hours.

    Returns
    -------
    float
        EpH value.
    """
    if hours <= 0:
        raise ValueError("Hours must be greater than zero.")
    ep = calculate_ep(distance_km, climb_m)
    return ep / hours


def calculate_hours(distance_km: float, climb_m: float, ep_hour: float) -> float:
    """
    Calculate the time required to achieve a target EpH.

    Parameters
    ----------
    distance_km : float
        Distance travelled in kilometres.
    climb_m : float
        Vertical climb in metres.
    ep_hour : float
        Desired EpH.

    Returns
    -------
    float
        Time in hours.
    """
    if ep_hour <= 0:
        raise ValueError("EpH must be greater than zero.")
    ep = calculate_ep(distance_km, climb_m)
    return ep / ep_hour


def _parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Calculate EpH, EP, or required time for a hike."
    )
    sub = parser.add_subparsers(dest="command", required=True)

    # Sub‑command: ep
    ep_parser = sub.add_parser("ep", help="Calculate total EP.")
    ep_parser.add_argument("distance_km", type=float, help="Distance in km.")
    ep_parser.add_argument("climb_m", type=float, help="Climb in metres.")

    # Sub‑command: eph
    eph_parser = sub.add_parser("eph", help="Calculate EpH.")
    eph_parser.add_argument("distance_km", type=float, help="Distance in km.")
    eph_parser.add_argument("climb_m", type=float, help="Climb in metres.")
    eph_parser.add_argument("hours", type=float, help="Time in hours.")

    # Sub‑command: time
    time_parser = sub.add_parser("time", help="Calculate required time for a target EpH.")
    time_parser.add_argument("distance_km", type=float, help="Distance in km.")
    time_parser.add_argument("climb_m", type=float, help="Climb in metres.")
    time_parser.add_argument("ep_hour", type=float, help="Target EpH.")

    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> None:
    args = _parse_args(argv)

    if args.command == "ep":
        ep = calculate_ep(args.distance_km, args.climb_m)
        print(f"Total EP: {ep:.2f}")

    elif args.command == "eph":
        eph = calculate_ep_hour(args.distance_km, args.climb_m, args.hours)
        print(f"EpH: {eph:.2f}")

    elif args.command == "time":
        hours = calculate_hours(args.distance_km, args.climb_m, args.ep_hour)
        print(f"Required time: {hours:.2f} hours")


if __name__ == "__main__":
    main(sys.argv[1:])