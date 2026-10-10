import urllib.request
import json

def test():
    def get(path):
        req = urllib.request.urlopen("http://127.0.0.1:8000" + path)
        return req.getcode(), req.read().decode("utf-8")

    code, html = get("/")
    print(f"Root index status: {code}, html length: {len(html)}")

    code, data = get("/api/tournaments")
    tourneys = json.loads(data)
    print(f"Tournaments count: {len(tourneys.get('tournaments', []))}")

    code, data = get("/api/tournaments/1/matches")
    matches = json.loads(data)
    match_list = matches.get("matches", [])
    print(f"Tournament 1 matches count: {len(match_list)}")
    if match_list:
        m = match_list[0]
        print(f"Sample Match: [{m.get('match_code')}] {m.get('sport')}: {m.get('home_team_name')} vs {m.get('away_team_name')} -> {m.get('scoreline')}")

    code, data = get("/api/admin/pending-registrations")
    pending = json.loads(data)
    pend_list = pending.get("pending_athletes", [])
    print(f"Pending registrations count: {len(pend_list)}")
    if pend_list:
        p = pend_list[0]
        print(f"Sample Pending Cadet: {p.get('name')} ({p.get('primary_sport')}), Khel ID: {p.get('khel_id')}, status: {p.get('verification_status')}")

if __name__ == "__main__":
    test()
