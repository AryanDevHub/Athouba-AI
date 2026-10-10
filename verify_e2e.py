import urllib.request
import json

def test():
    # 1. Check frontend root
    res = urllib.request.urlopen('http://127.0.0.1:8000/').read().decode('utf-8')
    assert 'index-BdysB99A.js' in res, f'Bundle mismatch, got: {res[:200]}'
    print('[OK] Latest frontend bundle served correctly!')

    # 2. Test session start with only 'name' (simulating user button click)
    req = urllib.request.Request(
        'http://127.0.0.1:8000/api/sessions/start',
        data=json.dumps({
            'name': 'Heisnam Sanathoi',
            'age': 16,
            'gender': 'Male',
            'district': 'Bishnupur',
            'assigned_coach_id': 1
        }).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    sess1 = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
    print(f"[OK] Session started successfully with 'name': {sess1['session_id']} for {sess1['athlete_name']}")

    # 3. Test session start with empty body
    req2 = urllib.request.Request(
        'http://127.0.0.1:8000/api/sessions/start',
        data=b'{}',
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    sess2 = json.loads(urllib.request.urlopen(req2).read().decode('utf-8'))
    print(f"[OK] Session started with defaults: {sess2['session_id']} for {sess2['athlete_name']}")

    # 4. Test coaches endpoint
    coaches = json.loads(urllib.request.urlopen('http://127.0.0.1:8000/api/coaches').read().decode('utf-8'))
    print(f"[OK] Coaches found: {len(coaches)}")

if __name__ == '__main__':
    test()
