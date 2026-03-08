from fastapi import APIRouter
import pandas as pd
import os

router = APIRouter()

# Load timetable (path relative to this file)
_base = os.path.dirname(os.path.abspath(__file__))
_df_path = os.path.join(_base, "schedule_data", "student_timetable.csv")
df = pd.read_csv(_df_path, sep=";")

df = df.dropna(subset=["weekday","start_time","room_address"])

weekday_order = [
    "Monday","Tuesday","Wednesday",
    "Thursday","Friday","Saturday","Sunday"
]

# -------------------------
# Calendar Summary
# -------------------------

@router.get("/calendar-summary")
def calendar_summary():

    counts = df.groupby("weekday").size().to_dict()

    max_day = max(counts, key=counts.get)

    result = []

    for day in weekday_order:

        c = counts.get(day,0)

        if c == 0:
            status = "free"

        elif day == max_day:
            status = "peak"

        else:
            status = "normal"

        result.append({
            "day": day,
            "classes": int(c),
            "status": status
        })

    return result


# -------------------------
# Daily trends
# -------------------------

@router.get("/daily-trends")
def daily_trends():

    trends = {}

    for day in weekday_order:

        day_df = df[df["weekday"] == day]

        if len(day_df) == 0:
            continue

        trend = (
            day_df.groupby("start_time")
            .size()
            .reset_index(name="classes")
        )

        trends[day] = trend.to_dict(orient="records")

    return trends


# -------------------------
# Room peak occupancy
# -------------------------

@router.get("/room-peaks")
def room_peaks():

    rooms = {}

    for room, group in df.groupby("room_address"):

        trend = (
            group.groupby("start_time")
            .size()
            .reset_index(name="classes")
        )

        peak = trend.loc[trend["classes"].idxmax()]

        rooms[room] = {
            "peak_time": peak["start_time"],
            "classes": int(peak["classes"])
        }

    return rooms


# -------------------------
# Peak hours per weekday (for calendar UI: which hours = high energy)
# -------------------------
PEAK_TOP_N = 4  # number of busiest hours to mark as peak per day


@router.get("/peak-hours")
def peak_hours():
    """
    For each weekday, returns hourly class counts and which hours are peak (top N busiest).
    Frontend uses this to show red peak hours and predict higher energy use.
    """
    result = {}
    for day in weekday_order:
        day_df = df[df["weekday"] == day]
        if len(day_df) == 0:
            result[day] = {"hourly": [], "peak_times": []}
            continue
        trend = (
            day_df.groupby("start_time")
            .size()
            .reset_index(name="classes")
        )
        trend = trend.sort_values("classes", ascending=False)
        peak_times = trend.head(PEAK_TOP_N)["start_time"].tolist()
        hourly = [
            {
                "time": row["start_time"],
                "classes": int(row["classes"]),
                "is_peak": row["start_time"] in peak_times,
            }
            for _, row in trend.sort_values("time").iterrows()
        ]
        result[day] = {"hourly": hourly, "peak_times": peak_times}
    return result


SCHEDULE_CHUNK_SIZE = 24


@router.get("/day-schedule")
def day_schedule(weekday: str):
    if weekday not in weekday_order:
        return []
    day_df = df[df["weekday"] == weekday]
    if len(day_df) == 0:
        return []
    agg = (
        day_df.groupby(["start_time", "end_time", "room_address", "course"], dropna=False)
        .agg(students=("student_id", "nunique"))
        .reset_index()
    )
    agg = agg.sort_values(["start_time", "room_address"])
    return agg.head(SCHEDULE_CHUNK_SIZE).to_dict(orient="records")


def _occupancy_level(classes: int, max_classes: int) -> str:
    if max_classes == 0:
        return "low"
    r = classes / max_classes
    if r >= 0.6:
        return "high"
    if r >= 0.25:
        return "medium"
    return "low"


@router.get("/day-trends")
def day_trends_endpoint(weekday: str):
    if weekday not in weekday_order:
        return {"hourly": [], "peak_times": []}
    day_df = df[df["weekday"] == weekday]
    if len(day_df) == 0:
        return {"hourly": [], "peak_times": []}
    trend = (
        day_df.groupby("start_time")
        .agg(classes=("student_id", "count"), students=("student_id", "nunique"))
        .reset_index()
    )
    trend = trend.sort_values("start_time")
    max_classes = trend["classes"].max() if len(trend) else 0
    peak_times = trend.nlargest(PEAK_TOP_N, "classes")["start_time"].tolist()
    hourly = []
    for _, row in trend.iterrows():
        level = _occupancy_level(int(row["classes"]), max_classes)
        is_peak = row["start_time"] in peak_times
        power_phase = "high" if level == "high" else ("medium" if level == "medium" else "low")
        ac_suggestion = "setback" if level == "low" else ("peak_cooling" if is_peak else ("pre_cool" if level == "high" else "normal"))
        hourly.append({
            "time": row["start_time"],
            "classes": int(row["classes"]),
            "students": int(row["students"]),
            "occupancy_level": level,
            "power_phase": power_phase,
            "ac_suggestion": ac_suggestion,
            "is_peak": is_peak,
        })
    return {"hourly": hourly, "peak_times": peak_times}


@router.get("/day-recommendations")
def day_recommendations(weekday: str):
    if weekday not in weekday_order:
        return []
    day_df = df[df["weekday"] == weekday]
    if len(day_df) == 0:
        return [{"type": "info", "title": "No schedule", "detail": "No classes this day; minimal HVAC and lighting needed."}]
    recs = []
    by_time = day_df.groupby("start_time").agg(
        classes=("student_id", "count"),
        students=("student_id", "nunique"),
        rooms=("room_address", "nunique"),
    ).reset_index()
    by_time = by_time.sort_values("start_time")
    max_classes = by_time["classes"].max()
    low_threshold = max(1, max_classes // 4)
    peak_times = set(by_time.nlargest(PEAK_TOP_N, "classes")["start_time"].tolist())
    low_slots = by_time[by_time["classes"] <= low_threshold]
    if len(low_slots) > 0:
        times = low_slots["start_time"].tolist()[:5]
        recs.append({"type": "hvac", "title": "Low occupancy in some slots", "detail": f"Slots at {', '.join(times)} have few classes. Consider HVAC setback or zone-level reduction."})
    if peak_times:
        pt_list = sorted(peak_times)[:4]
        recs.append({"type": "ac", "title": "Peak occupancy periods", "detail": f"Peak at {', '.join(pt_list)}. Pre-cool 1 hour before and optimize setpoints during peak."})
    slot_room = day_df.groupby(["start_time", "room_address"]).agg(students=("student_id", "nunique")).reset_index()
    low_room = slot_room[slot_room["students"] <= 5]
    if len(low_room) > 0:
        rooms = low_room["room_address"].str.strip().unique().tolist()[:2]
        recs.append({"type": "hvac", "title": "Small classes in some rooms", "detail": f"Rooms like {', '.join(rooms)} have low enrolment. Suggest zone-level HVAC or consolidate rooms."})
    midday = by_time[by_time["start_time"].isin(["10:00", "11:00", "12:00", "13:00", "14:00"])]
    if len(midday) > 0 and midday["classes"].sum() > 0:
        recs.append({"type": "solar", "title": "Use solar for midday load", "detail": "Classes between 10–14. Align IT/lab usage with peak solar to reduce grid draw."})
    if by_time["classes"].max() > 10:
        recs.append({"type": "stagger", "title": "Stagger start times", "detail": "High concentration at same hour. Offset some start times by 15–20 min to flatten demand."})
    return recs[:6]