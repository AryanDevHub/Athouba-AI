import sqlite3
import json

conn = sqlite3.connect('sports_talent.db')
c = conn.cursor()

def insert_athlete(item, photo):
    c.execute('''
        INSERT INTO athletes (
            khel_id, nsis_id, state_reg_no,
            name, age, gender, district, primary_sport,
            current_club, former_clubs_json, match_history_json, season_stats_json,
            height_cm, weight_kg, wingspan_cm, vertical_jump_cm, sprint_30m_sec, beep_test_level, flexibility_cm,
            composite_score, grade, grade_title, badge_color,
            ai_prospect_rating, ai_breakthrough_probability, peer_rank, benchmark_percentile,
            achievements, verified_by_sai,
            radar_json, pose_json, sports_matrix_json, ai_report_json, media_url, profile_photo_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        item['khel_id'], item['nsis_id'], item['state_reg_no'],
        item['name'], item['age'], item['gender'], item['district'], item['primary_sport'],
        item['current_club'], json.dumps(item['former_clubs']), json.dumps(item['match_history']), json.dumps(item['season_stats']),
        item['height_cm'], item['weight_kg'], item['wingspan_cm'], item['vertical_jump_cm'], item['sprint_30m_sec'], item['beep_test_level'], item['flexibility_cm'],
        item['composite_score'], 'Grade A', 'State Excellence Squad', '#0284c7',
        item['ai_prospect_rating'], 'Hill District Grassroots Prospect', 2, 91.0,
        item['achievements'], 1,
        json.dumps({'explosive_power': 85, 'speed_agility': 88, 'endurance': 92, 'flexibility': 80, 'posture_technique': 88}),
        json.dumps({'symmetry_score': 94.0, 'movement_notes': ['Consistent stride cadence', 'High bilateral balance']}),
        json.dumps([{'sport': item['primary_sport'], 'suitability_pct': 94.0}]),
        json.dumps({'executive_summary': f"Promising grassroots prospect from {item['district']}."}),
        photo, photo
    ))

insert_athlete({
    'khel_id': 'KHEL-IND-MN-2024-FB-0981', 'nsis_id': 'NSIS-MN-9981', 'state_reg_no': 'MFA-MN-2024-SP01',
    'name': 'L. Timothy Paomai', 'age': 16, 'gender': 'Male', 'district': 'Senapati', 'primary_sport': 'Football',
    'current_club': 'Senapati District Sports Association FC', 'former_clubs': ['Mao Grassroots Academy'],
    'season_stats': {'position': 'Centre Midfield', 'matches_played': 14, 'goals': 5, 'assists': 8},
    'match_history': [{'date': '12 Jan 2026', 'tournament': 'Hill District Youth Cup', 'opponent': 'Ukhrul FC', 'result': '2-1 (Won)', 'minutes': 90, 'stat': '1 Goal, 1 Assist'}],
    'height_cm': 174.0, 'weight_kg': 64.0, 'wingspan_cm': 178.0, 'vertical_jump_cm': 58.0, 'sprint_30m_sec': 4.08, 'beep_test_level': 12.5, 'flexibility_cm': 24.0,
    'composite_score': 91.8, 'ai_prospect_rating': 89.5, 'achievements': 'Hill District Youth Cup Golden Ball'
}, '/athletes/football_cadet_male.jpg')

insert_athlete({
    'khel_id': 'KHEL-IND-MN-2024-ATH-0982', 'nsis_id': 'NSIS-MN-9982', 'state_reg_no': 'AFI-MN-2024-TM01',
    'name': 'Gaiphunliu Kamei', 'age': 15, 'gender': 'Female', 'district': 'Tamenglong', 'primary_sport': 'Athletics',
    'current_club': 'Tamenglong Hill Athletics Cell', 'former_clubs': ['Rongmei Youth Sports'],
    'season_stats': {'events': '400m & 800m Sprint', 'best_400m': '57.8s', 'state_medals': 3},
    'match_history': [{'date': '18 Jan 2026', 'tournament': 'State Inter-District Junior Athletics', 'opponent': '400m Final', 'result': 'SILVER MEDAL 🥈', 'minutes': 1, 'stat': 'Time: 57.8s'}],
    'height_cm': 165.0, 'weight_kg': 52.0, 'wingspan_cm': 169.0, 'vertical_jump_cm': 56.5, 'sprint_30m_sec': 4.12, 'beep_test_level': 13.0, 'flexibility_cm': 26.0,
    'composite_score': 90.4, 'ai_prospect_rating': 88.0, 'achievements': 'State Inter-District 400m Silver Medalist'
}, '/athletes/athletics_cadet.jpg')

insert_athlete({
    'khel_id': 'KHEL-IND-MN-2024-ARC-0983', 'nsis_id': 'NSIS-MN-9983', 'state_reg_no': 'AAI-MN-2024-CD01',
    'name': 'Th. Khamba Maring', 'age': 16, 'gender': 'Male', 'district': 'Chandel', 'primary_sport': 'Archery',
    'current_club': 'Chandel District Sports Youth Club', 'former_clubs': ['Komlathabi Village Club'],
    'season_stats': {'discipline': 'Recurve Junior Men', 'best_720_score': 668, 'arrow_avg': 9.28},
    'match_history': [{'date': '20 Jan 2026', 'tournament': 'North East Youth Archery', 'opponent': 'Recurve Final', 'result': 'BRONZE MEDAL 🥉', 'minutes': 0, 'stat': 'Score 668/720'}],
    'height_cm': 168.0, 'weight_kg': 58.0, 'wingspan_cm': 173.0, 'vertical_jump_cm': 51.0, 'sprint_30m_sec': 4.35, 'beep_test_level': 10.5, 'flexibility_cm': 23.0,
    'composite_score': 88.5, 'ai_prospect_rating': 86.5, 'achievements': 'North East Youth Archery Bronze Medalist'
}, '/athletes/archery_cadet.jpg')

conn.commit()
print('Athletes in database now:', c.execute('SELECT COUNT(*) FROM athletes').fetchone()[0])
conn.close()
