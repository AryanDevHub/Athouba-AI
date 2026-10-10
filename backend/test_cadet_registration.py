import urllib.request
import urllib.parse
import json

def test_registration():
    url = "http://127.0.0.1:8000/api/athletes/assess"
    
    # Multipart boundary for Form upload
    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
    
    import random
    test_id = f"KHEL-IND-MN-2026-ARC-{random.randint(2000, 8999)}"
    fields = {
        "name": f"Priyobarta Naorem {random.randint(10, 99)}",
        "age": "17",
        "gender": "Male",
        "district": "Bishnupur",
        "primary_sport": "Archery",
        "current_club": "Bishnupur District Archery Training Hub",
        "user_provided_khel_id": test_id,
        "submit_for_review": "true",
        "height_cm": "174.5",
        "weight_kg": "66.0",
        "vertical_jump_cm": "68.0",
        "sprint_30m_sec": "4.15",
        "beep_test_level": "13.5",
        "flexibility_cm": "29.0",
        "wingspan_cm": "178.0"
    }

    body = bytearray()
    for k, v in fields.items():
        body.extend(f"--{boundary}\r\n".encode())
        body.extend(f'Content-Disposition: form-data; name="{k}"\r\n\r\n'.encode())
        body.extend(f"{v}\r\n".encode())
    body.extend(f"--{boundary}--\r\n".encode())

    req = urllib.request.Request(
        url,
        data=bytes(body),
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            print("Successfully submitted registration!")
            print(f"Created Cadet ID: {data.get('id')}")
            print(f"Name: {data.get('name')}")
            print(f"Khel ID: {data.get('khel_id')}")
            print(f"Verification Status: {data.get('verification_status')}")
            print(f"SAI Verified Flag: {data.get('verified_by_sai')}")
            
            # Now verify it appears in pending registrations
            p_req = urllib.request.urlopen("http://127.0.0.1:8000/api/admin/pending-registrations")
            p_data = json.loads(p_req.read().decode())
            pending = p_data if isinstance(p_data, list) else p_data.get("pending_athletes", [])
            match = [p for p in pending if p.get("id") == data.get("id")]
            if match:
                print(f"\nCONFIRMED: Cadet #{data.get('id')} appears in Admin/Coach Pending Verification Queue!")
                print(f"Candidate details in queue: {match[0]['name']} | {match[0]['khel_id']} | Status: {match[0]['verification_status']}")
            else:
                print("\nWARNING: Cadet not found in pending queue.")
    except Exception as e:
        print("Error during test:", e)

if __name__ == "__main__":
    test_registration()
