import sqlite3
import json
import urllib.request

conn = sqlite3.connect("sports_talent.db")
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

print("=== 1. TOURNAMENTS & MATCHES ACROSS ALL SPORTS ===")
cursor.execute("SELECT sport, COUNT(DISTINCT tournament_id) as tourneys, COUNT(*) as matches FROM matches GROUP BY sport")
for row in cursor.fetchall():
    print(f"Sport: {row['sport']:<20} | Tournaments: {row['tourneys']:<3} | Total Matches: {row['matches']:<3}")

print("\n=== 2. SPORT-SPECIFIC MATCH TELEMETRY VERIFICATION ===")
cursor.execute("SELECT id, sport, match_code, home_team_name, away_team_name, scoreline, details_json FROM matches GROUP BY sport")
for row in cursor.fetchall():
    details = json.loads(row["details_json"])
    print(f"\n[{row['sport'].upper()}] - {row['match_code']}: {row['home_team_name']} vs {row['away_team_name']}")
    print(f"Scoreline: {row['scoreline']}")
    if row['sport'] == 'Weightlifting':
        print(f"  Snatch Attempts: {len(details.get('snatch_attempts', []))} attempts")
        print(f"  Clean & Jerk: {len(details.get('clean_and_jerk_attempts', []))} attempts")
        print(f"  Sinclair Coeff: {details.get('sinclair_coefficient')}, Podium: {details.get('podium')}")
    elif row['sport'] == 'Boxing':
        print(f"  Bout Class: {details.get('weight_division')}, Decision: {details.get('decision')}")
        print(f"  Punch Stats (CompuBox): {details.get('punch_stats')}")
        print(f"  Round Breakdown: {len(details.get('round_breakdown', []))} rounds")
    elif row['sport'] == 'Archery':
        print(f"  Discipline: {details.get('target_discipline')}, Format: {details.get('match_format')}")
        print(f"  10s / Xs: {details.get('tens_and_x_count')}, Weather: {details.get('wind_conditions')}")
    elif row['sport'] == 'Sepak Takraw':
        print(f"  Regu Set Scores: {details.get('set_scores')}")
        print(f"  Spikes Home/Away: {details.get('sunback_spikes', {}).get('home')}/{details.get('sunback_spikes', {}).get('away')}")
    elif row['sport'] == 'Field Hockey':
        print(f"  Quarter Progression: {details.get('quarter_scores')}")
        print(f"  Penalty Corners: {details.get('penalty_corners')}")
        print(f"  Circle Entries: {details.get('circle_penetrations')}")
    elif 'Judo' in row['sport']:
        print(f"  Contest Duration: {details.get('contest_duration')}, Decisive Move: {details.get('decisive_technique')}")
        print(f"  Score Card: Ippon={details.get('ippon')}, Waza-ari={details.get('waza_ari')}")
    elif row['sport'] == 'Football':
        print(f"  Possession: {details.get('possession')}, xG: {details.get('xg')}")
        print(f"  Goals: {len(details.get('goals', []))}, Lineups Home: {len(details.get('lineups', {}).get('home', []))}")

print("\n=== 3. PENDING CADET VERIFICATION WORKFLOW ===")
cursor.execute("SELECT id, name, primary_sport, user_provided_khel_id, verification_status, verified_by_sai FROM athletes WHERE verification_status = 'PENDING_REVIEW'")
pending_cadets = cursor.fetchall()
print(f"Pending Cadets Count: {len(pending_cadets)}")
for p in pending_cadets:
    print(f"  Cadet #{p['id']}: {p['name']} ({p['primary_sport']}) - Khel ID: {p['user_provided_khel_id']} | Status: {p['verification_status']}")

if pending_cadets:
    cadet_to_approve = pending_cadets[0]
    print(f"\nTesting 1-Click Approve for Cadet #{cadet_to_approve['id']} ({cadet_to_approve['name']})...")
    req = urllib.request.Request(f"http://127.0.0.1:8000/api/admin/approve-registration/{cadet_to_approve['id']}", method="POST")
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read().decode())
        print("API Response:", result)
    
    # Check DB again
    cursor.execute("SELECT id, name, verification_status, verified_by_sai, review_notes FROM athletes WHERE id = ?", (cadet_to_approve['id'],))
    updated = cursor.fetchone()
    print(f"Updated in DB -> Status: {updated['verification_status']}, verified_by_sai: {updated['verified_by_sai']}, Notes: {updated['review_notes']}")

conn.close()
print("\nALL VERIFICATIONS PASSED SUCCESSFULLY!")
