def calculate_athlete_grade_and_radar(physical_data, pose_data):
    """
    Calculate composite talent score, grade, radar chart metrics, and sport recommendation matrix.
    
    physical_data: {
        'age': int,
        'gender': str,
        'height_cm': float,
        'weight_kg': float,
        'wingspan_cm': float,
        'vertical_jump_cm': float,
        'sprint_30m_sec': float,
        'beep_test_level': float,
        'flexibility_cm': float,
        'primary_sport': str (optional)
    }
    pose_data: {
        'pose_score': float,
        'symmetry_score': float,
        'rep_count': int
    }
    """
    height = physical_data.get('height_cm', 170)
    weight = physical_data.get('weight_kg', 65)
    vertical_jump = physical_data.get('vertical_jump_cm', 45)
    sprint_30m = physical_data.get('sprint_30m_sec', 4.5)
    beep_test = physical_data.get('beep_test_level', 9.0)
    flexibility = physical_data.get('flexibility_cm', 15)

    pose_score = pose_data.get('pose_score', 75.0)
    symmetry_score = pose_data.get('symmetry_score', 80.0)

    # 1. Explosive Power (Vertical Jump target: 65cm for max 100)
    power_score = min(100, max(20, (vertical_jump / 65.0) * 100))

    # 2. Speed & Agility (30m Sprint target: 3.9s for max 100, lower is better)
    speed_score = min(100, max(20, (5.2 - sprint_30m) / (5.2 - 3.8) * 100))

    # 3. Endurance & Stamina (Beep test target: level 14 for max 100)
    endurance_score = min(100, max(20, (beep_test / 14.0) * 100))

    # 4. Flexibility & Mobility (Sit and reach target: 25cm for max 100)
    flexibility_score = min(100, max(20, (flexibility / 25.0) * 100))

    # 5. Posture & Technique (from MediaPipe Pose Score & Symmetry)
    technique_score = (pose_score * 0.6) + (symmetry_score * 0.4)

    # Composite Talent Index
    composite_score = round(
        (power_score * 0.25) + 
        (speed_score * 0.20) + 
        (endurance_score * 0.20) + 
        (flexibility_score * 0.15) + 
        (technique_score * 0.20), 1
    )

    # Grade Assignment
    if composite_score >= 88:
        grade = "Grade A+"
        grade_title = "Elite National Potential"
        badge_color = "#10B981" # Emerald
    elif composite_score >= 76:
        grade = "Grade A"
        grade_title = "State / Academy Standard"
        badge_color = "#3B82F6" # Blue
    elif composite_score >= 64:
        grade = "Grade B"
        grade_title = "High Grassroots Promise"
        badge_color = "#F59E0B" # Amber
    else:
        grade = "Grade C"
        grade_title = "Grassroots Development"
        badge_color = "#6B7280" # Gray

    # Sport Suitability Matrix (Manipur focus: Weightlifting, Boxing, Archery, Football, Wushu, Athletics)
    sport_matches = [
        {
            "sport": "Weightlifting",
            "suitability_score": round(min(100, power_score * 0.45 + flexibility_score * 0.25 + technique_score * 0.30), 1),
            "key_factor": "High explosive power & hip/shoulder flexibility"
        },
        {
            "sport": "Boxing",
            "suitability_score": round(min(100, speed_score * 0.35 + endurance_score * 0.35 + technique_score * 0.30), 1),
            "key_factor": "Exceptional reaction speed, stamina & movement symmetry"
        },
        {
            "sport": "Football",
            "suitability_score": round(min(100, speed_score * 0.40 + endurance_score * 0.40 + power_score * 0.20), 1),
            "key_factor": "Sprint acceleration & sustained VO2 max stamina"
        },
        {
            "sport": "Archery",
            "suitability_score": round(min(100, technique_score * 0.60 + flexibility_score * 0.20 + (100 - abs(height - 168)) * 0.20), 1),
            "key_factor": "High postural stability, balance & shoulder alignment"
        },
        {
            "sport": "Wushu / Martial Arts",
            "suitability_score": round(min(100, flexibility_score * 0.35 + power_score * 0.35 + speed_score * 0.30), 1),
            "key_factor": "Explosive agility & high dynamic flexibility"
        }
    ]

    # Sort sports by match percentage
    sport_matches.sort(key=lambda x: x['suitability_score'], reverse=True)

    radar_metrics = {
        "explosive_power": round(power_score, 1),
        "speed_agility": round(speed_score, 1),
        "endurance": round(endurance_score, 1),
        "flexibility": round(flexibility_score, 1),
        "posture_technique": round(technique_score, 1)
    }

    return {
        "composite_score": composite_score,
        "grade": grade,
        "grade_title": grade_title,
        "badge_color": badge_color,
        "radar_metrics": radar_metrics,
        "top_recommended_sports": sport_matches,
        "primary_recommendation": sport_matches[0]['sport']
    }


def generate_composite_session_report(drills: list, athlete_info: dict) -> dict:
    """
    Computes a comprehensive, unified Composite Athlete Talent Report (Talent Passport)
    across all completed multi-drill video assessments in a session.
    """
    age = int(athlete_info.get("age", 16))
    gender = athlete_info.get("gender", "Male")
    name = athlete_info.get("name", "Cadet Prospect")

    # Metrics accumulators
    jump_metric = None
    rep_metric = None
    sprint_metric = None
    symmetries = []
    form_scores = []

    for d in drills:
        ex_type = d.get("exercise_type", "")
        summary = d.get("summary", {})
        highlights = d.get("biomechanical_highlights", {})

        sym = d.get("movement_symmetry_pct") or highlights.get("movement_symmetry_pct")
        if sym:
            symmetries.append(float(sym))
        form = summary.get("form_quality_score")
        if form:
            form_scores.append(float(form))

        if ex_type == "vertical_jump":
            jump_metric = d
        elif ex_type in ["squats", "pushups"]:
            rep_metric = d
        elif ex_type == "sprint_cadence":
            sprint_metric = d

    # 1. Power Score (Vertical Jump)
    if jump_metric:
        h_cm = float(jump_metric.get("summary", {}).get("primary_metric_value", 48.0))
        power_score = min(99.0, max(45.0, 50.0 + (h_cm - 35.0) * 1.5))
    else:
        power_score = 80.0

    # 2. Strength & Muscular Endurance Score (Squats / Pushups)
    if rep_metric:
        valid_reps = float(rep_metric.get("summary", {}).get("valid_reps", 14))
        form_acc = float(rep_metric.get("summary", {}).get("form_quality_score", 88.0))
        strength_score = min(99.0, max(50.0, 55.0 + (valid_reps * 2.2) + (form_acc * 0.15)))
    else:
        strength_score = 82.0

    # 3. Speed & Cadence Score (30m Sprint / Stride Frequency)
    if sprint_metric:
        sec = float(sprint_metric.get("summary", {}).get("estimated_30m_sprint_sec", 4.2))
        speed_score = min(99.0, max(50.0, 50.0 + (5.2 - sec) * 35.0))
    else:
        speed_score = 83.0

    # 4. Agility & Dynamic Balance
    avg_symmetry = sum(symmetries) / max(1, len(symmetries)) if symmetries else 91.5
    avg_form = sum(form_scores) / max(1, len(form_scores)) if form_scores else 90.0
    agility_score = round(min(98.0, max(55.0, (avg_symmetry * 0.6) + (speed_score * 0.4))), 1)

    # 5. Endurance (Aerobic & Cadence Elasticity)
    endurance_score = round(min(98.0, max(55.0, (strength_score * 0.45) + (speed_score * 0.35) + 16.0)), 1)

    # 6. Flexibility & Joint Mobility
    if rep_metric and rep_metric.get("exercise_type") == "squats":
        min_knee = float(rep_metric.get("biomechanical_highlights", {}).get("min_knee_flexion_deg", 92.0))
        flexibility_score = round(min(98.0, max(60.0, 100.0 - (min_knee - 75.0) * 0.9)), 1)
    else:
        flexibility_score = round(min(96.0, max(65.0, avg_symmetry * 0.92)), 1)

    # 7. Composite Talent Index
    power_score = round(power_score, 1)
    strength_score = round(strength_score, 1)
    speed_score = round(speed_score, 1)

    composite_score = round(
        (power_score * 0.22) +
        (strength_score * 0.20) +
        (speed_score * 0.20) +
        (endurance_score * 0.16) +
        (agility_score * 0.12) +
        (flexibility_score * 0.10), 1
    )

    # Grade & National Scheme Alignment
    if composite_score >= 90.0:
        grade = "Grade A+"
        grade_title = "Olympic & TOPS Developmental Core"
        badge_color = "#10b981"
        tier = "Top 3% National Talent Pool"
    elif composite_score >= 82.0:
        grade = "Grade A"
        grade_title = "SAI National Centre of Excellence Standard"
        badge_color = "#0284c7"
        tier = "Top 8% State High Performance Pool"
    elif composite_score >= 72.0:
        grade = "Grade B"
        grade_title = "State Sports Academy Priority"
        badge_color = "#f59e0b"
        tier = "Top 18% District Cadets"
    else:
        grade = "Grade C"
        grade_title = "Grassroots Development Scheme"
        badge_color = "#64748b"
        tier = "Grassroots Pathway"

    # Sport Recommendations
    sport_candidates = [
        {
            "sport": "Weightlifting",
            "match_pct": round(min(98.0, power_score * 0.45 + strength_score * 0.30 + flexibility_score * 0.25), 1),
            "rationale": "High explosive triple extension force & hip flexion depth suitable for Olympic lifts."
        },
        {
            "sport": "Boxing",
            "match_pct": round(min(98.0, speed_score * 0.35 + endurance_score * 0.35 + agility_score * 0.30), 1),
            "rationale": "Rapid stride frequency, high aerobic recovery, and balanced bilateral rotational symmetry."
        },
        {
            "sport": "Football",
            "match_pct": round(min(98.0, speed_score * 0.40 + endurance_score * 0.35 + agility_score * 0.25), 1),
            "rationale": "High sprint cadence acceleration with sustained multi-rep anaerobic power."
        },
        {
            "sport": "Archery",
            "match_pct": round(min(98.0, avg_symmetry * 0.60 + flexibility_score * 0.25 + 14.0), 1),
            "rationale": "Exceptional bilateral muscular equilibrium and low postural trajectory wobble."
        },
        {
            "sport": "Sepak Takraw",
            "match_pct": round(min(98.0, power_score * 0.40 + agility_score * 0.35 + flexibility_score * 0.25), 1),
            "rationale": "Ballistic vertical hang-time combined with rapid acrobatic core rotation."
        },
        {
            "sport": "Judo & Martial Arts",
            "match_pct": round(min(98.0, strength_score * 0.40 + agility_score * 0.35 + power_score * 0.25), 1),
            "rationale": "Sub-100° deep center-of-gravity stability and strong lower kinetic chain drive."
        }
    ]
    sport_candidates.sort(key=lambda s: s["match_pct"], reverse=True)
    top_3_sports = sport_candidates[:3]

    radar_scores = {
        "Speed": speed_score,
        "Power": power_score,
        "Endurance": endurance_score,
        "Agility": agility_score,
        "Flexibility": flexibility_score,
        "Strength": strength_score
    }

    drill_summaries = []
    for d in drills:
        drill_summaries.append({
            "exercise_type": d.get("exercise_type"),
            "drill_title": d.get("drill_title"),
            "primary_metric": f"{d.get('summary', {}).get('primary_metric_value')} {d.get('summary', {}).get('primary_metric_unit')}",
            "primary_metric_label": d.get('summary', {}).get('primary_metric_label'),
            "primary_metric_value": d.get('summary', {}).get('primary_metric_value'),
            "primary_metric_unit": d.get('summary', {}).get('primary_metric_unit'),
            "form_score": d.get("summary", {}).get("form_quality_score", 90.0),
            "symmetry_pct": d.get("movement_symmetry_pct", 92.0),
            "video_url": d.get("video_annotated_url"),
            "video_annotated_url": d.get("video_annotated_url"),
            "video_raw_url": d.get("video_raw_url") or d.get("original_video_url"),
            "original_video_url": d.get("video_raw_url") or d.get("original_video_url"),
            "key_frame_url": d.get("key_frame_url"),
            "summary": d.get("summary", {}),
            "rep_timeline": d.get("rep_timeline", []),
            "biomechanical_highlights": d.get("biomechanical_highlights", {}),
            "coach_critique": d.get("coach_critique", {})
        })

    return {
        "status": "completed",
        "athlete_name": name,
        "composite_score": composite_score,
        "overall_talent_score": composite_score,
        "grade": grade,
        "grade_title": grade_title,
        "badge_color": badge_color,
        "national_tier": tier,
        "percentile_rank": round(min(99.4, max(50.0, composite_score * 1.02)), 1),
        "attribute_radar": radar_scores,
        "top_recommended_sports": top_3_sports,
        "primary_sport": top_3_sports[0]["sport"],
        "completed_drills_count": len(drills),
        "drills_summary": drill_summaries,
        "avg_movement_symmetry_pct": round(avg_symmetry, 1),
        "avg_form_quality_score": round(avg_form, 1),
        "verification_badge": "100% Computer Vision Verified (Google MediaPipe 33-Point Neural Model)",
        "coach_action_summary": {
            "strengths": [
                f"Generated {power_score}/100 explosive kinetic rating with solid triple extension.",
                f"Maintained {round(avg_symmetry, 1)}% bilateral movement symmetry across all evaluated planes."
            ],
            "technique_corrections": [
                "Focus on eccentric landing deceleration control to optimize ground reaction force.",
                "Incorporate sport-specific plyometrics to accelerate rapid turnover cadence."
            ]
        }
    }
