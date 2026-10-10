import sqlite3
import json
import os

DB_PATH = "sports_talent.db"

def get_db_connection():
    conn = sqlite3.connect(DB_PATH, timeout=30.0)
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA busy_timeout=30000;")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'athlete',
        name TEXT NOT NULL,
        district TEXT NOT NULL,
        email TEXT
    );
    """)

    # Athlete DNA Profiles & Real-world Match Registry Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS athletes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        khel_id TEXT UNIQUE NOT NULL,
        nsis_id TEXT,
        state_reg_no TEXT,
        user_id INTEGER,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL,
        district TEXT NOT NULL,
        primary_sport TEXT NOT NULL,
        current_club TEXT,
        team_id INTEGER,
        former_clubs_json TEXT,
        match_history_json TEXT,
        season_stats_json TEXT,
        height_cm REAL,
        weight_kg REAL,
        wingspan_cm REAL,
        vertical_jump_cm REAL,
        sprint_30m_sec REAL,
        beep_test_level REAL,
        flexibility_cm REAL,
        composite_score REAL,
        grade TEXT,
        grade_title TEXT,
        badge_color TEXT,
        ai_prospect_rating REAL,
        ai_breakthrough_probability TEXT,
        peer_rank INTEGER,
        benchmark_percentile REAL,
        achievements TEXT,
        verified_by_sai INTEGER DEFAULT 1,
        radar_json TEXT,
        pose_json TEXT,
        sports_matrix_json TEXT,
        ai_report_json TEXT,
        media_url TEXT,
        profile_photo_url TEXT,
        documents_json TEXT,
        verification_status TEXT DEFAULT 'APPROVED',
        user_provided_khel_id TEXT,
        review_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    );
    """)

    # Teams & Clubs Table (Manipur State League, CC Meet, etc.)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        short_name TEXT NOT NULL,
        district TEXT NOT NULL,
        founded_year INTEGER,
        home_ground TEXT,
        primary_sport TEXT NOT NULL,
        division TEXT,
        head_coach TEXT,
        trophies_won_json TEXT,
        season_stats_json TEXT,
        historical_matches_json TEXT,
        logo_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Tournaments Table (CC Meet, Manipur State League, Shirui Lily Cup, etc.)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tournaments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        short_name TEXT NOT NULL,
        edition TEXT,
        organizer TEXT,
        sport TEXT NOT NULL,
        founded_year INTEGER,
        venue TEXT,
        current_champion TEXT,
        trophy_details TEXT,
        tournament_format TEXT,
        recent_matches_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Dedicated Matches & Competition Fixtures Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        match_code TEXT UNIQUE NOT NULL,
        tournament_id INTEGER,
        tournament_name TEXT NOT NULL,
        sport TEXT NOT NULL,
        stage TEXT NOT NULL,
        match_date TEXT NOT NULL,
        venue TEXT NOT NULL,
        home_team_id INTEGER,
        home_team_name TEXT NOT NULL,
        away_team_id INTEGER,
        away_team_name TEXT NOT NULL,
        scoreline TEXT NOT NULL,
        result_status TEXT NOT NULL,
        winner_team_name TEXT,
        details_json TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tournament_id) REFERENCES tournaments (id)
    );
    """)

    # Dedicated Coaches & Talent Scouts Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS coaches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT NOT NULL,
        sport_specialty TEXT NOT NULL,
        organization TEXT NOT NULL,
        district TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        bio TEXT,
        badge TEXT DEFAULT 'SAI State High Performance Coach',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Dedicated Multi-Drill Assessment Sessions Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS assessment_sessions (
        session_id TEXT PRIMARY KEY,
        athlete_id INTEGER,
        athlete_name TEXT NOT NULL,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL,
        district TEXT NOT NULL,
        state TEXT DEFAULT 'Manipur',
        assigned_coach_id INTEGER,
        status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed', 'shortlisted', 'trial_invited'
        drills_json TEXT DEFAULT '[]',
        composite_report_json TEXT DEFAULT '{}',
        coach_feedback_json TEXT DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Seed Default Coaches if empty
    cursor.execute("SELECT COUNT(*) FROM coaches")
    if cursor.fetchone()[0] == 0:
        default_coaches = [
            (
                1, 2, "Coach L. Ibomcha Singh (Dronacharya Awardee)",
                "Boxing & Combat Biomechanics", "SAI NCOE Takyel, Imphal", "Imphal West",
                "+91 98620 44521", "coach.ibomcha@sai.gov.in",
                "Dronacharya Awardee coach behind Mary Kom, Dingko Singh & Olympic boxers; Lead SAI Talent Scout",
                "Chief High-Performance Scout"
            ),
            (
                2, 4, "Coach N. Kunjarani Devi",
                "Weightlifting & Explosive Power", "MWA High-Performance Academy, Imphal East", "Imphal East",
                "+91 94360 88124", "kunjarani.devi@mwa.org.in",
                "Arjuna & Padma Shri awardee; Specialist in grassroots Olympic weightlifting kinematics and force development",
                "Olympic Power Technical Director"
            ),
            (
                3, 5, "Coach H. Chaoba Devi",
                "Football & Speed Endurance", "Assam Rifles / SAI Grassroots Centre", "Bishnupur",
                "+91 97740 12890", "chaoba.coach@amfa.in",
                "AFC 'A' License Coach; Specializes in speed cadence, multi-stage endurance, and field athletics talent ID",
                "State Grassroots Coordinator"
            )
        ]
        cursor.executemany("""
            INSERT INTO coaches (id, user_id, name, sport_specialty, organization, district, phone, email, bio, badge)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, default_coaches)

    conn.commit()
    conn.close()
    print("Database initialized successfully with coaches and assessment sessions schema.")

if __name__ == "__main__":
    init_db()
