# 🏛️ Athouba AI (अथौबा)
### Grassroots Sports Talent Identification & Biomechanical Kinematics Portal
**Built for the AI4Seva Hackathon**  
*Official AI Solution for Ministry of Youth Affairs & Sports (MYAS) & Sports Authority of India (SAI) Regional Centre, Imphal*  
*Addressing Problem Statements: **YAS-01** (Grassroots Talent Identification) & **YAS-02** (Biomechanical Performance Analysis)*

> **Note on Name:** *"Athouba"* (अथौबा) is the Meiteilon (Manipuri) word for **"hero"**, **"champion"**, or **"brave warrior"** — representing the grassroots athletic talent across Manipur. **AI4Seva** is the hackathon challenge under which this platform was architected.

---

## 🇮🇳 Government Scheme & Authority Alignment
- **Apex Body**: Ministry of Youth Affairs & Sports (MYAS), Government of India
- **Execution Agency**: Sports Authority of India (SAI) National Centre of Excellence (NCOE) & STC Imphal
- **State Department**: Department of Youth Affairs & Sports, Government of Manipur
- **National Frameworks**: 
  - National Sports Talent Search Scheme (NSTSS)
  - Khelo India Talent Identification (KITI)
  - Target Olympic Podium Scheme (TOPS) Developmental Pathway
  - National Sports Information System (NSIS) Athlete Registry

---

## 🎯 How Athouba AI Solves the Problem Statements

### 1. YAS-01: AI-Based Sports Talent Identification
- **Standardized Unique Identification**: Every athlete receives an official **Khel ID** (`KHEL-IND-MN-YYYY-XXXX`) and **NSIS ID**, preventing duplicate profiles and standardizing records across state clubs, school games, and national championships.
- **Grassroots Hill District Discovery**: Specifically targets talent discovery in under-scouted hill districts (*Churachandpur, Ukhrul, Tamenglong, Chandel, Senapati*) alongside the valley districts (*Imphal East, Imphal West, Thoubal, Bishnupur, Kakching*).
- **SAI Standard Battery of Tests (Form K-01)**: Stature/Height, Weight, Wingspan, 30m Acceleration Sprint, Sargent Vertical Jump, Multistage Beep Test (VO2 max), Sit & Reach Flexibility.
- **AI Head-to-Head Comparative Scouting**: Allows scouts to benchmark an emerging 16-year-old grassroots prospect directly against established international stars (e.g. comparing V. Paominthang Haokip against Suresh Singh Wangjam) with direct biometric deltas and AI scout verdicts.
- **AI Breakthrough Prospect Engine**: Identifies top candidates with high `AI Prospect Rating (0-99)` and `Breakthrough Probability (%)` based on age-adjusted physical metrics and match performance trajectories.

### 2. YAS-02: AI-Based Athlete Performance & Technique Analysis
- **Match Performance Analytics**: Tracks real-world competition statistics: current club, former clubs played for, career appearances, goals/points, and the **last 5 competitive matches** with opponent, result, minutes played, and sport-specific key metrics.
- **Computer Vision Pose Kinematics**: Tracks joint angles (knees, hips, elbows, shoulders), bilateral posture symmetry (%), and movement repetitions.
- **National Biomechanics Coach**: Powered by Google Gemini AI, providing biomechanical corrections, peer benchmark percentiles, and structured 12-week NCOE training roadmaps.

---

## 🌐 Live Sports APIs Research & Architecture

To integrate real-world athlete data and tournament statistics into AI4Seva, the platform interfaces with several specialized sports data providers:

| Sport / Domain | Recommended API Source | Registration / API Key | Free Tier Quota | What It Ingests |
|---|---|---|---|---|
| **Football** (ISL & National Team) | **API-Football** (`api-sports.io` / RapidAPI) | Free account registration required | 100 requests / day (Free tier) | Live & historical fixtures, squads, goals, minutes played, clubs played for. |
| **Multi-Sport & Club Data** | **TheSportsDB** (`thesportsdb.com`) | Free test key available (`3`), premium key for full catalog | Unlimited basic queries | Player biographical data, past clubs, career contracts, trophies. |
| **Weightlifting** | **IWF Technical Bulletins & Records** | No public REST API; structured via official federation bulletins | Public records | Snatch, Clean & Jerk, Bodyweight categories, National/Commonwealth records. |
| **Boxing & Combat Sports** | **BoxRec / AIBA Records** | Scraped / Structured Federation Records | Open Records | Bout records, win/loss KO ratios, division weight ranking. |
| **National Identity (Khel ID)** | **NSIS / Khelo India Portal** | Government NIC intranet endpoint | Restricted to official SAI officers | Verified Khel ID (`KHEL-IND-MN-XXXX`), Aadhaar-linked verification status. |

*A transparent live API documentation modal is accessible directly in the application navbar via the **"Live Sports APIs"** link.*

---

## 🌟 Real-World Manipur Athletes Registry

The portal is seeded with real Manipur athletes, Olympians, Commonwealth champions, and SAI cadets:
- **Saikhom Mirabai Chanu** (Weightlifting, 49kg — Tokyo Olympics Silver, 2x Commonwealth Gold — Nongpok Kakching, Imphal East)
- **Suresh Singh Wangjam** (Football — India Senior National Team & Bengaluru FC — Imphal West)
- **Jeakson Singh Thounaojam** (Football — India Senior National Team & East Bengal / Kerala Blasters — Thoubal)
- **Dheeraj Singh Moirangthem** (Football — India National Team Goalkeeper & Mohun Bagan SG — Moirang, Bishnupur)
- **N. Linthoingambi Devi** (Judo — World Cadet Judo Championship Gold Medalist — Mayang Imphal, Imphal West)
- **Khangembam Sanjita Chanu** (Weightlifting — 2x Commonwealth Gold — Kakching)
- **Bindyarani Devi Sorokhaibam** (Weightlifting — Commonwealth Games Silver — Imphal East)
- **Bombayla Devi Laishram** (Archery — 3x Olympian, Arjuna Awardee — Imphal East)
- **Yumnam Sanathoi Devi** (Wushu — World Wushu Championships Silver, Asian Games Bronze — Thoubal)
- **Chungreng Koren** (Boxing / MMA — MFN Bantamweight Champion — Churachandpur)
- **V. Paominthang Haokip** (Grassroots Football Prospect — Churachandpur — 16 yrs)
- **T. Ronald Kamei** (Grassroots Weightlifting Prospect — Tamenglong — 17 yrs)
- **R. Ningrei Shimray** (Grassroots Archery Prospect — Ukhrul — 16 yrs)
- **L. Amarjit Luwang** (Grassroots Football Prospect — Chandel — 16 yrs)
- **H. Bembem Devi** (Grassroots Boxing Prospect — Bishnupur — 17 yrs)

---

## 🚀 Live Access & Verification

👉 **`http://127.0.0.1:8000`**

### Official Login Credentials (1-Click in UI)
| Official Designation | Username | Password | Role |
|---|---|---|---|
| **Senior Cadet Athlete** | `athlete` | `password123` | Saikhom Mirabai Chanu |
| **SAI Senior Coach / Scout** | `coach` | `coach123` | Coach L. Ibomcha Singh (Dronacharya Awardee, SAI Imphal) |
| **Directorate of Sports** | `admin` | `admin123` | Director of Youth Affairs & Sports, Govt. of Manipur |

*(Note: The login popup includes **1-Click Demo Buttons** so judges and evaluators can test instantly without typing.)*

---

## 🏛️ Government Portal Features (Non-Gimmick Design)

1. **Official Government Branding**:
   - High-resolution SVG logos of the **Ministry of Youth Affairs & Sports (MYAS)** and **Sports Authority of India (SAI)** downloaded directly from official `sportsauthorityofindia.nic.in` servers.
   - National tricolor ribbon header and Government of Manipur Department of Youth Affairs & Sports seal.
2. **Dual Theme System**:
   - **Official Government Light Mode** (Default): Clean, authoritative, NIC/Gov.in style with deep navy headers, saffron accents, and crisp contrast.
   - **High-Contrast Dark Mode**: For low-light stadium scouting and indoor arena analysis.
3. **Player Dossier & Match Records**:
   - Complete competition logs showing the last 5 matches with opponents, scores, minutes played, and key metrics.
   - Current club, former clubs, and youth academy history.
   - Printable athlete dossier button for talent scouting committees.
4. **AI Head-to-Head Comparison Tool**:
   - Direct physical delta comparison between any two athletes.
   - Radar charts, fixture stats comparisons, and AI comparative scouting verdict.
5. **Grassroots Breakthrough Prospects View**:
   - Dedicated filter to surface young prodigies from hill districts with exceptional VO2 max, sprint acceleration, or strength-to-weight ratios.

---

## 🎙️ 3-Minute Hackathon Pitch Script for Judges

> **Opening (30s)**:
> *"Respected Judges, Manipur is India’s sports powerhouse, producing Olympic legends like Mirabai Chanu and national football heroes like Suresh Singh. Yet, dozens of extraordinary talents in hill districts like Ukhrul, Churachandpur, and Tamenglong never get scouted due to geographic isolation and fragmented club records. That is the core challenge of Problem Statement **YAS-01**.*
>
> **The Solution (60s)**:
> *"We built **Athouba AI (अथौबा)** for the **AI4Seva Hackathon** — the National Sports Talent Identification & Biomechanical Kinematics Portal, engineered strictly to the standards of the Ministry of Youth Affairs & Sports and the Sports Authority of India.*
> *'Athouba' in Meiteilon means 'the brave champion' — and our mission is to empower every young champion in Manipur.*
> *First, we establish a single source of truth using standardized **Khel IDs** (`KHEL-IND-MN-XXXX`).*
> *Second, we integrate real-world match performance histories — showing clubs played for, goals, appearances, and verified match cards.*
> *Third, our computer vision and AI scoring engine benchmarks an athlete's physical battery test against national norms to calculate a Composite Talent Index and identify **Grassroots Breakthrough Prospects**.*
>
> **The Live Demo (60s)**:
> *(Open `http://127.0.0.1:8000`)*
> *1. Show the official SAI & MYAS header with the Light/Dark mode toggle and Athouba AI brand.*
> *2. Click on **'AI Comparison'** and compare 16-year-old grassroots prospect **V. Paominthang Haokip** from Churachandpur against senior India star **Suresh Singh Wangjam**. Show how the AI scout highlights that Paominthang’s 30m sprint (3.78s) and VO2 max (59.2) already rival senior national standards.*
> *3. Click on **'Breakthrough Prospects'** to show the top talent prospects flagged across Manipur’s hill districts.*
> *4. Click on **'Live Sports APIs'** to show judges our transparent API integration strategy with API-Football, TheSportsDB, and NSIS.*
>
> **Closing (30s)**:
> *"Athouba AI turns grassroots sports talent identification from subjective guesswork into an objective, data-backed national pipeline. It is not a gimmick — it is built with official government design standards, real athlete records, and an actionable roadmap for the Khelo India and TOPS pathways. Thank you!"*
