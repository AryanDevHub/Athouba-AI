import os
import sys
import json
import sqlite3
import numpy as np
from scipy import stats

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from database import get_db_connection, init_db
from scoring_engine import calculate_athlete_grade_and_radar

# Set reproducible random seed
np.random.seed(42)

# ==============================================================================
# 1. AUTHENTIC MANIPUR LOCALITIES & NAMES REPOSITORY
# ==============================================================================
MANIPUR_DISTRICTS = [
    "Imphal East", "Imphal West", "Bishnupur", "Churachandpur",
    "Thoubal", "Ukhrul", "Kakching", "Senapati", "Tamenglong", "Chandel", "Kangpokpi"
]

MEITEI_SURNAMES = [
    "Thokchom", "Yumkhaibam", "Khundrakpam", "Leimapokpam", "Ningthoujam",
    "Thounaojam", "Moirangthem", "Wangjam", "Laishram", "Sorokhaibam",
    "Khangembam", "Yumnam", "Pheiroijam", "Saikhom", "Konsam", "Naorem",
    "Salam", "Mayanglambam", "Keisham", "Huidrom", "Nongmaithem", "Waikhom",
    "Oinam", "Mutum", "Sapam", "Heikrujam", "Asem", "Irom"
]

KUKI_ZOMI_SURNAMES = [
    "Haokip", "Kipgen", "Gangte", "Baite", "Mate", "Lhungdim",
    "Touthang", "Singsit", "Vaiphei", "Guite", "Sitlhou", "Simte"
]

NAGA_TANGKHUL_SURNAMES = [
    "Shimray", "Luikham", "Horam", "Kasar", "Vashum", "Kamei",
    "Gangmei", "Panmei", "Zimik", "Muivah", "Rungsung", "Wonshim", "Thaimei"
]

MALE_FIRST_NAMES = [
    "Tomba", "Chaoba", "Sanjoy", "Naoba", "Borish", "Rakesh", "Chingkheinganba",
    "Malemnganba", "Amarjit", "Ronald", "Paominthang", "Mangminlen", "Thangminlun",
    "Somatai", "Ningrei", "Horam", "Dingku", "Linthoiba", "Nongthombam",
    "Devendra", "Kiran", "Bidyashagar", "Roshan", "Suraj", "Bikash", "Gouramangi",
    "Nilakanta", "Kothajit", "Chinglensana", "Nanao", "Niken", "Haridas", "Ronaldo"
]

FEMALE_FIRST_NAMES = [
    "Linthoingambi", "Bembem", "Mirabai", "Bindyarani", "Sanjita", "Ormila",
    "Sanathoi", "Bala", "Grace", "Tingneichong", "Vungneikim", "Ningreila",
    "Thelma", "Rinchon", "Shanti", "Chaobi", "Devi", "Chanu", "Manglembi",
    "Linthoi", "Sushila", "Sarita", "Mary", "Bombayla", "Lily"
]

# ==============================================================================
# 2. COMPREHENSIVE MULTI-SPORT CLUBS & ACADEMIES (32 TEAMS ACROSS 7 SPORTS)
# ==============================================================================
MULTI_SPORT_CLUBS = [
    # --- A. FOOTBALL (8 Clubs) ---
    {
        "name": "NEROCA FC (North Eastern Re-Organising Cultural Association)",
        "short_name": "NEROCA FC",
        "district": "Imphal East",
        "founded_year": 1965,
        "home_ground": "Khuman Lampak Main Stadium, Imphal",
        "primary_sport": "Football",
        "division": "Manipur Premier League / I-League 2",
        "head_coach": "Khogen Singh",
        "trophies_won": [
            {"trophy": "6th Manipur State League", "year": 2011},
            {"trophy": "58th Sir Churachand Singh Memorial (CC Meet)", "year": 2014},
            {"trophy": "I-League 2 Champions", "year": 2016},
            {"trophy": "Manipur Premier League", "year": 2023}
        ]
    },
    {
        "name": "TRAU FC (Tiddim Road Athletic Union)",
        "short_name": "TRAU FC",
        "district": "Imphal West",
        "founded_year": 1954,
        "home_ground": "Khuman Lampak Main Stadium, Imphal",
        "primary_sport": "Football",
        "division": "Manipur Premier League / I-League 2",
        "head_coach": "L. Nandakumar Singh",
        "trophies_won": [
            {"trophy": "CC Meet Champions", "year": 2005},
            {"trophy": "Manipur State League", "year": 2007},
            {"trophy": "I-League 2 Champions", "year": 2019},
            {"trophy": "Bordoloi Trophy", "year": 2018}
        ]
    },
    {
        "name": "KLASA FC Keinou",
        "short_name": "KLASA FC",
        "district": "Bishnupur",
        "founded_year": 1972,
        "home_ground": "Keinou Kangjeibung Ground, Bishnupur",
        "primary_sport": "Football",
        "division": "18th Manipur State League / I-League 3",
        "head_coach": "Bijen Singh",
        "trophies_won": [
            {"trophy": "14th Manipur State League Champions", "year": 2021},
            {"trophy": "15th Manipur State League Champions", "year": 2022},
            {"trophy": "CC Meet Runner-Up", "year": 2023}
        ]
    },
    {
        "name": "Eastern Sporting Union (ESU)",
        "short_name": "ESU Palace Compound",
        "district": "Imphal East",
        "founded_year": 1946,
        "home_ground": "ESU Ground, Palace Compound, Imphal",
        "primary_sport": "Football",
        "division": "18th Manipur State League (Reigning Champions)",
        "head_coach": "M. Hemanta Singh",
        "trophies_won": [
            {"trophy": "Indian Women's League (IWL) Champions", "year": 2017},
            {"trophy": "17th Manipur State League Champions", "year": 2024},
            {"trophy": "CC Meet Champions (3x)", "year": 1968}
        ]
    },
    {
        "name": "Anouba Imagi Mangal (AIM Khabam)",
        "short_name": "AIM Khabam",
        "district": "Imphal East",
        "founded_year": 1993,
        "home_ground": "Khabam Lamkhai Ground, Imphal",
        "primary_sport": "Football",
        "division": "18th Manipur State League",
        "head_coach": "S. Premjit Singh",
        "trophies_won": [
            {"trophy": "65th Sir Churachand Singh (CC Meet) Champions", "year": 2025},
            {"trophy": "Manipur State League (4x Champions)", "year": 2014}
        ]
    },
    {
        "name": "Southern Sporting Union (SSU Singjamei)",
        "short_name": "SSU Singjamei",
        "district": "Imphal West",
        "founded_year": 1955,
        "home_ground": "Kakwa Ground, Singjamei",
        "primary_sport": "Football",
        "division": "18th Manipur State League",
        "head_coach": "I. Nilakumar Singh",
        "trophies_won": [
            {"trophy": "CC Meet Champions (5x)", "year": 2010},
            {"trophy": "Manipur State League Champions", "year": 2012}
        ]
    },
    {
        "name": "Muvanlai Athletics (Kangpokpi / Sadar Hills)",
        "short_name": "Muvanlai Athletics",
        "district": "Kangpokpi",
        "founded_year": 2014,
        "home_ground": "Brigadier Thomas Ground, Kangpokpi",
        "primary_sport": "Football",
        "division": "18th Manipur State League (Hill District Giants)",
        "head_coach": "Kamminthang Kipgen",
        "trophies_won": [
            {"trophy": "Shirui Lily Cup Champions", "year": 2022},
            {"trophy": "Manipur State League 3rd Place", "year": 2021}
        ]
    },
    {
        "name": "Sagolband United (SU Imphal)",
        "short_name": "Sagolband United",
        "district": "Imphal West",
        "founded_year": 1968,
        "home_ground": "Sagolband Kangjeibung, Imphal",
        "primary_sport": "Football",
        "division": "18th Manipur State League",
        "head_coach": "A. Joykumar Singh",
        "trophies_won": [
            {"trophy": "Winners' Cup Manipur", "year": 2019},
            {"trophy": "Imphal West Super League", "year": 2022}
        ]
    },

    # --- B. WEIGHTLIFTING (4 Academies) ---
    {
        "name": "SAI National Centre of Excellence (NCOE) Weightlifting Academy",
        "short_name": "SAI NCOE Weightlifting",
        "district": "Imphal East",
        "founded_year": 1986,
        "home_ground": "Khuman Lampak Indoor Stadium, Imphal",
        "primary_sport": "Weightlifting",
        "division": "Olympic Core High Performance Centre",
        "head_coach": "L. Anita Chanu (Arjuna Awardee)",
        "trophies_won": [
            {"trophy": "National Senior Overall Championship (14x)", "year": 2024},
            {"trophy": "Khelo India Youth Games Weightlifting Champions", "year": 2024},
            {"trophy": "Tokyo 2020 Olympic Silver Feeder Centre", "year": 2021}
        ]
    },
    {
        "name": "Manipur Weightlifting Association (MWA) High-Performance Centre",
        "short_name": "MWA Training Centre",
        "district": "Imphal East",
        "founded_year": 1974,
        "home_ground": "MWA Lifting Complex, Wangkhei",
        "primary_sport": "Weightlifting",
        "division": "State Association Elite Squad",
        "head_coach": "Sunil Kumar Singh",
        "trophies_won": [
            {"trophy": "Manipur State Overall Weightlifting Trophy (12x)", "year": 2025},
            {"trophy": "North East Zone Weightlifting Championship", "year": 2023}
        ]
    },
    {
        "name": "Sports Authority of India Training Centre (STC) Utlou",
        "short_name": "STC Utlou Weightlifting",
        "district": "Bishnupur",
        "founded_year": 1998,
        "home_ground": "SAI Utlou Sports Complex, Bishnupur",
        "primary_sport": "Weightlifting",
        "division": "SAI Special Area Games (SAG) Academy",
        "head_coach": "M. Shyamo Singh",
        "trophies_won": [
            {"trophy": "National Junior Weightlifting Team Title", "year": 2023},
            {"trophy": "All Manipur Inter-District Weightlifting Meet", "year": 2024}
        ]
    },
    {
        "name": "Kakching SAG Weightlifting Training Hub",
        "short_name": "Kakching Weightlifting Hub",
        "district": "Kakching",
        "founded_year": 2005,
        "home_ground": "Kakching Multipurpose Sports Hall",
        "primary_sport": "Weightlifting",
        "division": "Grassroots Rural Talent Incubator",
        "head_coach": "Y. Somorendro Singh",
        "trophies_won": [
            {"trophy": "State Sub-Junior Lifting Trophy", "year": 2023},
            {"trophy": "Khelo India Talent Development Centre Award", "year": 2022}
        ]
    },

    # --- C. BOXING (4 Academies) ---
    {
        "name": "Mary Kom Regional Boxing Foundation (MKRBF)",
        "short_name": "Mary Kom Boxing Academy",
        "district": "Imphal West",
        "founded_year": 2006,
        "home_ground": "National Games Village, Langol, Imphal",
        "primary_sport": "Boxing",
        "division": "Elite National Residential Boxing Academy",
        "head_coach": "Chhote Lal Yadav & K. Onler Kom",
        "trophies_won": [
            {"trophy": "All India Inter-Academy Boxing Championship", "year": 2024},
            {"trophy": "National Youth Boxing Championship (8 Golds)", "year": 2023},
            {"trophy": "Asian Youth Boxing Selection Team Shield", "year": 2022}
        ]
    },
    {
        "name": "SAI NCOE Takyel Boxing Academy",
        "short_name": "SAI Takyel Boxing",
        "district": "Imphal West",
        "founded_year": 1982,
        "home_ground": "Takyelpat Sports Complex, Imphal",
        "primary_sport": "Boxing",
        "division": "SAI High Performance Olympic Wing",
        "head_coach": "Coach L. Ibomcha Singh (Dronacharya Awardee)",
        "trophies_won": [
            {"trophy": "Dingko Singh Memorial Cup (4x Champions)", "year": 2024},
            {"trophy": "National Senior Men's Boxing Championship", "year": 2023},
            {"trophy": "Asian Games Medals Contribution Shield", "year": 2014}
        ]
    },
    {
        "name": "Manipur Amateur Boxing Association (MABA) Centre",
        "short_name": "MABA Boxing Imphal",
        "district": "Imphal East",
        "founded_year": 1968,
        "home_ground": "Khuman Lampak Boxing Arena",
        "primary_sport": "Boxing",
        "division": "State Association Championship Wing",
        "head_coach": "E. Haridas Singh",
        "trophies_won": [
            {"trophy": "North East Boxing Championship (9x)", "year": 2024},
            {"trophy": "Manipur State Senior Boxing Trophy", "year": 2025}
        ]
    },
    {
        "name": "Churachandpur Boxing Ring & Sports Academy",
        "short_name": "CCPur Boxing Ring",
        "district": "Churachandpur",
        "founded_year": 2012,
        "home_ground": "Tuibong Indoor Sports Arena, Churachandpur",
        "primary_sport": "Boxing",
        "division": "Hill District Grassroots Boxing Ring",
        "head_coach": "Lalminlen Haokip",
        "trophies_won": [
            {"trophy": "Manipur State Sub-Junior Boxing Cup", "year": 2023},
            {"trophy": "All Tribal Games Boxing Championship", "year": 2024}
        ]
    },

    # --- D. ARCHERY (4 Academies) ---
    {
        "name": "Manipur Archery Association (MAA) Training Hub",
        "short_name": "MAA Archery Hub",
        "district": "Imphal East",
        "founded_year": 1978,
        "home_ground": "Khuman Lampak Archery Ground, Imphal",
        "primary_sport": "Archery",
        "division": "State Olympic Target Archery Centre",
        "head_coach": "H. Chaoba Singh",
        "trophies_won": [
            {"trophy": "Senior National Archery Overall Championship (16x)", "year": 2024},
            {"trophy": "Governor's Gold Cup Archery Trophy (10x)", "year": 2025}
        ]
    },
    {
        "name": "Assam Rifles Archery Academy (ARAA)",
        "short_name": "Assam Rifles Archery",
        "district": "Imphal East",
        "founded_year": 1992,
        "home_ground": "Mantripukhri Complex, Imphal",
        "primary_sport": "Archery",
        "division": "Paramilitary High-Performance Wing",
        "head_coach": "Subedar Major L. Angam",
        "trophies_won": [
            {"trophy": "All India Police Games Archery Championship", "year": 2024},
            {"trophy": "National Ranking Archery Tournament (NRAT)", "year": 2023}
        ]
    },
    {
        "name": "SAI NCOE Archery Centre Khuman Lampak",
        "short_name": "SAI NCOE Archery",
        "district": "Imphal East",
        "founded_year": 1989,
        "home_ground": "Khuman Lampak Sports Complex",
        "primary_sport": "Archery",
        "division": "SAI National Centre of Excellence",
        "head_coach": "RK Naobi Devi",
        "trophies_won": [
            {"trophy": "Khelo India National Archery Tournament", "year": 2024},
            {"trophy": "Asian Youth Archery Trials Gold", "year": 2023}
        ]
    },
    {
        "name": "Ukhrul Grassroots Archery Unit",
        "short_name": "Ukhrul Archery Unit",
        "district": "Ukhrul",
        "founded_year": 2011,
        "home_ground": "Tangkhul Naga Long Ground, Ukhrul",
        "primary_sport": "Archery",
        "division": "Hill District High-Altitude Archery Nursery",
        "head_coach": "AS Wungnaoshang",
        "trophies_won": [
            {"trophy": "Manipur State Junior Archery Trophy", "year": 2023},
            {"trophy": "North East Tribal Archery Festival Champions", "year": 2024}
        ]
    },

    # --- E. JUDO & MARTIAL ARTS / WUSHU (4 Academies) ---
    {
        "name": "SAI NCOE Judo Centre of Excellence",
        "short_name": "SAI NCOE Judo",
        "district": "Imphal East",
        "founded_year": 1991,
        "home_ground": "Khuman Lampak Multipurpose Indoor Dojo",
        "primary_sport": "Judo & Combat Sports",
        "division": "Olympic Combat Centre (World Champion Nursery)",
        "head_coach": "Jiwan Sharma & K. Tombi Devi",
        "trophies_won": [
            {"trophy": "World Cadet Judo Championship Gold (Linthoi Chanambam)", "year": 2022},
            {"trophy": "Senior National Judo Championship Overall Title (18x)", "year": 2024},
            {"trophy": "National Games Judo Overall Gold", "year": 2023}
        ]
    },
    {
        "name": "Mayang Imphal Judo Academy (MIJA)",
        "short_name": "Mayang Imphal Judo",
        "district": "Imphal West",
        "founded_year": 1996,
        "home_ground": "Mayang Imphal Sports Complex Dojo",
        "primary_sport": "Judo & Combat Sports",
        "division": "Grassroots Judo Capital of India",
        "head_coach": "N. Tombi Singh",
        "trophies_won": [
            {"trophy": "Manipur State Senior Judo Championship (11x)", "year": 2025},
            {"trophy": "Sub-Junior National Judo Trophy (14x)", "year": 2024}
        ]
    },
    {
        "name": "Mayai Lambi Sports Academy (MLSA) Wushu & Martial Arts",
        "short_name": "MLSA Wushu Centre",
        "district": "Thoubal",
        "founded_year": 2002,
        "home_ground": "Thoubal District Indoor Stadium",
        "primary_sport": "Wushu",
        "division": "National Sanda & Taolu Centre",
        "head_coach": "M. Sachidananda Singh",
        "trophies_won": [
            {"trophy": "National Wushu Championship Overall Gold (8x)", "year": 2024},
            {"trophy": "Asian Games Wushu Medals Shield", "year": 2014}
        ]
    },
    {
        "name": "Manipur Judo Association (MJA) Central Dojo",
        "short_name": "MJA Central Dojo",
        "district": "Imphal West",
        "founded_year": 1980,
        "home_ground": "Khuman Lampak Indoor Arena, Imphal",
        "primary_sport": "Judo & Combat Sports",
        "division": "State Association Central Dojo",
        "head_coach": "L. Brojen Singh",
        "trophies_won": [
            {"trophy": "State Olympic Games Judo Trophy (15x)", "year": 2024},
            {"trophy": "Khelo India University Judo Gold", "year": 2023}
        ]
    },

    # --- F. SEPAK TAKRAW (4 Academies - Undisputed Indian Capital) ---
    {
        "name": "All Manipur Sepak Takraw Association (AMSTA) Elite Academy",
        "short_name": "AMSTA Takraw Academy",
        "district": "Imphal West",
        "founded_year": 1985,
        "home_ground": "Khuman Lampak Sepak Takraw Court, Imphal",
        "primary_sport": "Sepak Takraw",
        "division": "National Feeding Nursery (Supplies 80% Team India)",
        "head_coach": "Muhindro Singh (National Coach)",
        "trophies_won": [
            {"trophy": "Senior National Sepak Takraw Championship (28x)", "year": 2024},
            {"trophy": "Asian Games Bronze Medal Contribution (Team India)", "year": 2018},
            {"trophy": "National Games Sepak Takraw Gold (Continuous)", "year": 2023}
        ]
    },
    {
        "name": "Social Union Club (SUC) Sepak Takraw Division",
        "short_name": "SUC Kakching Takraw",
        "district": "Kakching",
        "founded_year": 1978,
        "home_ground": "Kakching Municipal Indoor Court",
        "primary_sport": "Sepak Takraw",
        "division": "Premier Rural Sepak Takraw Powerhouse",
        "head_coach": "Ksh. Ratan Singh",
        "trophies_won": [
            {"trophy": "Manipur State Regu Championship (12x)", "year": 2024},
            {"trophy": "All India Inter-Club Sepak Takraw Trophy", "year": 2023}
        ]
    },
    {
        "name": "SAI STC Sepak Takraw Centre Khuman Lampak",
        "short_name": "SAI STC Sepak Takraw",
        "district": "Imphal East",
        "founded_year": 1994,
        "home_ground": "Khuman Lampak SAI Sports Complex",
        "primary_sport": "Sepak Takraw",
        "division": "SAI Special Area Games Academy",
        "head_coach": "W. Sanajaoba Singh",
        "trophies_won": [
            {"trophy": "National Junior Sepak Takraw Gold (10x)", "year": 2024},
            {"trophy": "Khelo India Youth Games Sepak Takraw Champions", "year": 2023}
        ]
    },
    {
        "name": "Eastern Sporting Union (ESU) Sepak Takraw Wing",
        "short_name": "ESU Sepak Takraw",
        "district": "Imphal East",
        "founded_year": 1988,
        "home_ground": "ESU Complex, Palace Compound, Imphal",
        "primary_sport": "Sepak Takraw",
        "division": "State Premier Regu Division",
        "head_coach": "L. Ibopishak Singh",
        "trophies_won": [
            {"trophy": "State Sepak Takraw League Champions", "year": 2023},
            {"trophy": "Governor's Sepak Takraw Cup", "year": 2022}
        ]
    },

    # --- G. FIELD HOCKEY (4 Academies - Olympic Medal Nursery) ---
    {
        "name": "Posterior Hockey Academy Manipur (PHAM)",
        "short_name": "PHAM Hockey Academy",
        "district": "Imphal West",
        "founded_year": 1986,
        "home_ground": "Khuman Lampak Hockey Astroturf Stadium, Imphal",
        "primary_sport": "Field Hockey",
        "division": "State Premier Olympian Nursery",
        "head_coach": "Ksh. Romesh Singh",
        "trophies_won": [
            {"trophy": "Tokyo 2020 Olympic Bronze Feeder (Nilakanta Sharma)", "year": 2021},
            {"trophy": "Manipur State Senior Hockey League (9x)", "year": 2024},
            {"trophy": "All India Beighton Cup Semifinalist", "year": 2019}
        ]
    },
    {
        "name": "Hockey Manipur State Development XI",
        "short_name": "Hockey Manipur XI",
        "district": "Imphal East",
        "founded_year": 1972,
        "home_ground": "Khuman Lampak Hockey Stadium",
        "primary_sport": "Field Hockey",
        "division": "State Association Core Development Team",
        "head_coach": "Brojen Singh",
        "trophies_won": [
            {"trophy": "North East Games Hockey Gold (12x)", "year": 2024},
            {"trophy": "Junior National Hockey Championship Silver", "year": 2023}
        ]
    },
    {
        "name": "SAI Takyel Hockey Academy",
        "short_name": "SAI Takyel Hockey",
        "district": "Imphal West",
        "founded_year": 1984,
        "home_ground": "Takyelpat Astroturf Arena, Imphal",
        "primary_sport": "Field Hockey",
        "division": "SAI National Centre of Excellence",
        "head_coach": "N. Shantikumar Singh",
        "trophies_won": [
            {"trophy": "All India SAI Inter-Centre Hockey Trophy (8x)", "year": 2024},
            {"trophy": "National Women's Hockey Championship Gold", "year": 2022}
        ]
    },
    {
        "name": "Meira Hockey Club Bishnupur",
        "short_name": "Meira Hockey Club",
        "district": "Bishnupur",
        "founded_year": 1995,
        "home_ground": "Bishnupur Stadium Ground",
        "primary_sport": "Field Hockey",
        "division": "Rural Grassroots Hockey Incubator",
        "head_coach": "M. Chaoba Singh",
        "trophies_won": [
            {"trophy": "State Sub-Junior Hockey Trophy", "year": 2023},
            {"trophy": "Dr. B.R. Ambedkar Memorial Hockey Cup", "year": 2024}
        ]
    }
]

# ==============================================================================
# 3. PREMIER MANIPUR TOURNAMENTS (22 TOURNAMENTS ACROSS 7 SPORTS)
# ==============================================================================
MULTI_SPORT_TOURNAMENTS = [
    # Football
    {
        "name": "65th Sir Churachand Singh KCSI, CBE Memorial Football Tournament (CC Meet)",
        "short_name": "CC Meet",
        "edition": "65th Edition (2025-26)",
        "organizer": "All Manipur Football Association (AMFA)",
        "sport": "Football",
        "founded_year": 1950,
        "venue": "Khuman Lampak Main Stadium, Imphal",
        "current_champion": "AIM Khabam (Anouba Imagi Mangal)",
        "trophy_details": "Silver Rolling Trophy presented by the Maharaja of Manipur in 1950",
        "tournament_format": "Super League Group Stage followed by Direct Knockout Semis & Final"
    },
    {
        "name": "18th Manipur State League (MSL)",
        "short_name": "Manipur State League",
        "edition": "18th Edition (2025-26)",
        "organizer": "All Manipur Football Association (AMFA)",
        "sport": "Football",
        "founded_year": 2006,
        "venue": "Artificial Turf Ground, Khuman Lampak, Imphal",
        "current_champion": "Eastern Sporting Union (ESU)",
        "trophy_details": "AMFA State Championship Trophy & Qualification to I-League 3",
        "tournament_format": "16-Team Double Round-Robin League & Championship Playoff"
    },
    {
        "name": "Manipur Premier League (MPL)",
        "short_name": "Manipur Premier League",
        "edition": "3rd Edition (2025)",
        "organizer": "All Manipur Football Association (AMFA)",
        "sport": "Football",
        "founded_year": 2023,
        "venue": "Khuman Lampak Main Stadium, Imphal",
        "current_champion": "NEROCA FC (Orange Brigade)",
        "trophy_details": "Premier State Professional Trophy",
        "tournament_format": "Franchise & Professional Club League"
    },
    {
        "name": "Shirui Lily Cup (Ukhrul District Championship)",
        "short_name": "Shirui Lily Cup",
        "edition": "31st Edition",
        "organizer": "Tangkhul Naga Football Association (TNFA)",
        "sport": "Football",
        "founded_year": 1978,
        "venue": "Tangkhul Naga Long Ground, Ukhrul",
        "current_champion": "Muvanlai Athletics (Kangpokpi)",
        "trophy_details": "Shirui Lily Golden Cup",
        "tournament_format": "Knockout Championship for Hill & Valley Clubs"
    },

    # Weightlifting
    {
        "name": "54th Manipur State Weightlifting Championship",
        "short_name": "State Weightlifting Championship",
        "edition": "54th Edition (2025)",
        "organizer": "Manipur Weightlifting Association (MWA)",
        "sport": "Weightlifting",
        "founded_year": 1974,
        "venue": "Khuman Lampak Indoor Stadium, Imphal",
        "current_champion": "SAI NCOE Imphal Weightlifting Academy",
        "trophy_details": "MWA Rolling State Champions Trophy",
        "tournament_format": "Olympic Bodyweight Categories (Men 55kg to 109kg+, Women 45kg to 87kg+)"
    },
    {
        "name": "All Manipur Inter-District Weightlifting Meet",
        "short_name": "Inter-District Weightlifting Meet",
        "edition": "29th Edition",
        "organizer": "Directorate of Youth Affairs & Sports, Govt. of Manipur",
        "sport": "Weightlifting",
        "founded_year": 1995,
        "venue": "SAI STC Utlou Sports Complex, Bishnupur",
        "current_champion": "Imphal East District Association",
        "trophy_details": "Director of Sports Running Cup",
        "tournament_format": "Inter-District Snatch & Clean & Jerk Totals"
    },
    {
        "name": "North East Zone Weightlifting Championship (Manipur Leg)",
        "short_name": "NE Zone Weightlifting",
        "edition": "18th Edition",
        "organizer": "Indian Weightlifting Federation (IWLF) & MWA",
        "sport": "Weightlifting",
        "founded_year": 2004,
        "venue": "Khuman Lampak Indoor Arena, Imphal",
        "current_champion": "Manipur State Senior Team",
        "trophy_details": "North East Olympic Gold Shield",
        "tournament_format": "Zonal Selection Trials for National Championships"
    },

    # Boxing
    {
        "name": "Manipur State Amateur Boxing Championship",
        "short_name": "State Boxing Championship",
        "edition": "56th Edition",
        "organizer": "Manipur Amateur Boxing Association (MABA)",
        "sport": "Boxing",
        "founded_year": 1968,
        "venue": "Khuman Lampak Boxing Ring Arena",
        "current_champion": "Mary Kom Regional Boxing Foundation (MKRBF)",
        "trophy_details": "MABA State Boxing Championship Rolling Belt",
        "tournament_format": "Elite Senior & Youth Olympic Weight Classes"
    },
    {
        "name": "Dingko Singh Memorial Boxing Tournament",
        "short_name": "Dingko Singh Memorial Cup",
        "edition": "4th Edition (2025)",
        "organizer": "Sports Authority of India (SAI) & MABA",
        "sport": "Boxing",
        "founded_year": 2021,
        "venue": "SAI Takyelpat Boxing Arena, Imphal",
        "current_champion": "SAI NCOE Takyel Boxing Academy",
        "trophy_details": "Dingko Singh 1998 Asian Games Golden Gloves Trophy",
        "tournament_format": "Direct Knockout 3x3 min Bouts with Computerized Scoring"
    },
    {
        "name": "North East India Open Boxing Championship",
        "short_name": "NE Open Boxing",
        "edition": "22nd Edition",
        "organizer": "Boxing Federation of India & Manipur Chapter",
        "sport": "Boxing",
        "founded_year": 2001,
        "venue": "Tuibong Indoor Arena, Churachandpur",
        "current_champion": "Manipur Boxing Contingent",
        "trophy_details": "North East Champion of Champions Shield",
        "tournament_format": "Zonal Knockout Tournament"
    },

    # Archery
    {
        "name": "Governor's Gold Cup Archery Championship",
        "short_name": "Governor's Cup Archery",
        "edition": "37th Edition",
        "organizer": "Manipur Archery Association (MAA)",
        "sport": "Archery",
        "founded_year": 1988,
        "venue": "Khuman Lampak Archery Ground, Imphal",
        "current_champion": "Manipur Archery Association (MAA) Training Hub",
        "trophy_details": "Governor's Pure Gold Trophy",
        "tournament_format": "Recurve 70m & Compound 50m FITA Ranking & Elimination"
    },
    {
        "name": "Manipur State Target Archery Championship",
        "short_name": "State Archery Championship",
        "edition": "44th Edition",
        "organizer": "Manipur Archery Association (MAA)",
        "sport": "Archery",
        "founded_year": 1981,
        "venue": "Assam Rifles Ground, Mantripukhri",
        "current_champion": "Assam Rifles Archery Academy",
        "trophy_details": "MAA State Champions Shield",
        "tournament_format": "Senior, Junior & Sub-Junior WA Rules"
    },
    {
        "name": "All Manipur Inter-Club Recurve & Compound Meet",
        "short_name": "Inter-Club Archery Meet",
        "edition": "19th Edition",
        "organizer": "Directorate of Youth Affairs & Sports",
        "sport": "Archery",
        "founded_year": 2005,
        "venue": "Tangkhul Naga Long Ground, Ukhrul",
        "current_champion": "SAI NCOE Archery Centre",
        "trophy_details": "Hill-Valley Archery Solidarity Cup",
        "tournament_format": "Individual Set System & Mixed Team Knockout"
    },

    # Judo & Combat Sports
    {
        "name": "Manipur State Judo Championship",
        "short_name": "State Judo Championship",
        "edition": "45th Edition",
        "organizer": "Manipur Judo Association (MJA)",
        "sport": "Judo & Combat Sports",
        "founded_year": 1980,
        "venue": "Khuman Lampak Multipurpose Indoor Hall",
        "current_champion": "SAI NCOE Judo Centre of Excellence",
        "trophy_details": "MJA State Judo Rolling Trophy",
        "tournament_format": "IJF Weight Classes, Direct Knockout with Repechage"
    },
    {
        "name": "National Cadet & Junior Judo Selection Trials (Manipur Leg)",
        "short_name": "Cadet Judo Trials",
        "edition": "12th Edition",
        "organizer": "Judo Federation of India & MJA",
        "sport": "Judo & Combat Sports",
        "founded_year": 2013,
        "venue": "Mayang Imphal Sports Complex Dojo",
        "current_champion": "Mayang Imphal Judo Academy (MIJA)",
        "trophy_details": "National World Cadet Trials Shield",
        "tournament_format": "Cadet Age-Group Selection Trials"
    },
    {
        "name": "Manipur State Wushu Championship (Sanda & Taolu)",
        "short_name": "State Wushu Championship",
        "edition": "24th Edition",
        "organizer": "Wushu Association of Manipur",
        "sport": "Wushu",
        "founded_year": 2001,
        "venue": "Thoubal District Indoor Stadium",
        "current_champion": "Mayai Lambi Sports Academy (MLSA)",
        "trophy_details": "State Wushu Federation Cup",
        "tournament_format": "Sanda Full Contact Sparring & Taolu Routines"
    },

    # Sepak Takraw
    {
        "name": "Manipur State Sepak Takraw Championship (Regu & Team)",
        "short_name": "State Sepak Takraw Championship",
        "edition": "40th Edition",
        "organizer": "All Manipur Sepak Takraw Association (AMSTA)",
        "sport": "Sepak Takraw",
        "founded_year": 1985,
        "venue": "Khuman Lampak Sepak Takraw Indoor Court",
        "current_champion": "All Manipur Sepak Takraw Association (AMSTA) Elite Academy",
        "trophy_details": "AMSTA Golden Takraw Trophy",
        "tournament_format": "Premier Regu (Trio), Doubles & Team Event (Best of 3 Sets to 21)"
    },
    {
        "name": "All India Inter-State Sepak Takraw Championship (Manipur Leg)",
        "short_name": "Inter-State Takraw Championship",
        "edition": "33rd Edition",
        "organizer": "Sepak Takraw Federation of India & AMSTA",
        "sport": "Sepak Takraw",
        "founded_year": 1991,
        "venue": "Khuman Lampak Sports Complex, Imphal",
        "current_champion": "Manipur Senior National Regu",
        "trophy_details": "National Takraw Champions Trophy",
        "tournament_format": "National Inter-State League & Knockout"
    },
    {
        "name": "Kakching Open Regu Takraw Trophy",
        "short_name": "Kakching Regu Trophy",
        "edition": "16th Edition",
        "organizer": "Social Union Club (SUC) Kakching",
        "sport": "Sepak Takraw",
        "founded_year": 2008,
        "venue": "Kakching Municipal Indoor Court",
        "current_champion": "Social Union Club (SUC)",
        "trophy_details": "South Manipur Takraw Rolling Cup",
        "tournament_format": "Open Club Regu Competition"
    },

    # Field Hockey
    {
        "name": "Manipur State Senior Men & Women Hockey League",
        "short_name": "State Hockey League",
        "edition": "22nd Edition",
        "organizer": "Hockey Manipur",
        "sport": "Field Hockey",
        "founded_year": 2002,
        "venue": "Khuman Lampak Hockey Astroturf Stadium, Imphal",
        "current_champion": "Posterior Hockey Academy Manipur (PHAM)",
        "trophy_details": "Hockey Manipur State Championship Trophy",
        "tournament_format": "Four 15-Minute Quarters FIH Rules League"
    },
    {
        "name": "Dr. B.R. Ambedkar Memorial Hockey Tournament",
        "short_name": "Ambedkar Memorial Hockey",
        "edition": "18th Edition",
        "organizer": "Directorate of Youth Affairs & Sports & Hockey Manipur",
        "sport": "Field Hockey",
        "founded_year": 2006,
        "venue": "Khuman Lampak Hockey Astroturf Stadium",
        "current_champion": "Hockey Manipur State Development XI",
        "trophy_details": "Dr. B.R. Ambedkar State Silver Cup",
        "tournament_format": "Direct Knockout with Penalty Shootouts"
    },
    {
        "name": "Governor's Gold Cup Hockey Tournament",
        "short_name": "Governor's Cup Hockey",
        "edition": "28th Edition",
        "organizer": "Hockey Manipur",
        "sport": "Field Hockey",
        "founded_year": 1996,
        "venue": "SAI Takyelpat Astroturf Arena, Imphal",
        "current_champion": "SAI Takyel Hockey Academy",
        "trophy_details": "Governor's Pure Silver Hockey Stick Trophy",
        "tournament_format": "Senior Men & Women Zonal Cup"
    }
]

# ==============================================================================
# 4. STATISTICAL MATCH & TELEMETRY GENERATOR BY SPORT
# ==============================================================================

def generate_club_matches_and_season(club, all_clubs):
    sport = club["primary_sport"]
    club_name = club["name"]
    short_name = club["short_name"]

    # Other clubs in the same sport for realistic matchups
    peer_clubs = [c for c in all_clubs if c["primary_sport"] == sport and c["name"] != club_name]
    if not peer_clubs:
        peer_clubs = [c for c in all_clubs if c["name"] != club_name]

    historical_matches = []
    season_stats = {}

    if sport == "Football":
        wins = int(np.random.randint(12, 17))
        draws = int(np.random.randint(4, 7))
        losses = int(np.random.randint(1, 4))
        played = wins + draws + losses
        points = wins * 3 + draws
        gf = int(np.random.randint(34, 48))
        ga = int(np.random.randint(12, 22))
        poss_mean = float(np.round(52.0 + stats.truncnorm.rvs(-1.5, 2.0, loc=0, scale=3.5), 1))
        pass_acc = float(np.round(81.0 + stats.truncnorm.rvs(-1.5, 2.0, loc=0, scale=3.0), 1))

        season_stats = {
            "matches_played": played, "wins": wins, "draws": draws, "losses": losses, "points": points,
            "goals_for": gf, "goals_against": ga, "goal_difference": gf - ga, "clean_sheets": int(np.random.randint(6, 11)),
            "average_possession_pct": poss_mean, "pass_completion_pct": pass_acc,
            "expected_goals_xg_per_game": float(np.round(1.55 + stats.gamma.rvs(a=2.0, scale=0.18), 2)),
            "shots_on_target_per_game": float(np.round(5.8 + np.random.uniform(0.2, 1.4), 1)),
            "tackles_success_pct": float(np.round(68.0 + np.random.uniform(2, 10), 1)),
            "aerial_duels_win_pct": float(np.round(58.0 + np.random.uniform(2, 9), 1))
        }

        tourney_names = ["18th Manipur State League", "65th CC Meet", "Manipur Premier League"]
        for m_idx in range(5):
            opp = np.random.choice(peer_clubs)
            team_goals = int(stats.poisson.rvs(mu=1.7))
            opp_goals = int(stats.poisson.rvs(mu=0.9))
            res = "WON" if team_goals > opp_goals else ("DRAW" if team_goals == opp_goals else "LOST")
            p_team = int(np.clip(int(np.round(stats.beta.rvs(a=5, b=5) * 26 + 40)), 38, 65))
            p_opp = 100 - p_team
            team_shots = int(stats.poisson.rvs(mu=12))
            opp_shots = int(stats.poisson.rvs(mu=8))
            team_sot = min(team_shots, max(team_goals, int(stats.poisson.rvs(mu=5.5))))
            opp_sot = min(opp_shots, max(opp_goals, int(stats.poisson.rvs(mu=3.5))))
            xg_team = float(np.round(team_goals * 0.72 + stats.gamma.rvs(a=2.2, scale=0.25), 2))
            xg_opp = float(np.round(opp_goals * 0.72 + stats.gamma.rvs(a=2.0, scale=0.22), 2))

            historical_matches.append({
                "match_id": f"MN-FB-2024-M{m_idx+1:02d}",
                "date": f"{18 - m_idx * 12} Nov 2024",
                "tournament": np.random.choice(tourney_names),
                "opponent": opp["short_name"],
                "venue": "Khuman Lampak Main Stadium, Imphal",
                "result": f"{team_goals}-{opp_goals} ({res})",
                "scoreline": f"{team_goals} - {opp_goals}",
                "possession_team_pct": p_team,
                "possession_opponent_pct": p_opp,
                "team_shots": team_shots,
                "opponent_shots": opp_shots,
                "team_shots_on_target": team_sot,
                "opponent_shots_on_target": opp_sot,
                "expected_goals_xg_team": xg_team,
                "expected_goals_xg_opponent": xg_opp,
                "passes_completed_team": int(p_team * 7.8 + np.random.randint(10, 40)),
                "passes_completed_opponent": int(p_opp * 7.8 + np.random.randint(10, 30)),
                "key_performance_highlight": f"{p_team}% Ball Control, {team_sot} Shots on Target, xG {xg_team}"
            })

    elif sport == "Weightlifting":
        season_stats = {
            "total_lifters_enrolled": int(np.random.randint(24, 45)),
            "national_championship_golds": int(np.random.randint(6, 12)),
            "state_championship_medals": int(np.random.randint(18, 32)),
            "olympic_core_athletes": 2 if "SAI NCOE" in club_name else 1,
            "average_clean_jerk_kg": 138.5,
            "average_snatch_kg": 112.0,
            "clean_attempt_success_pct": float(np.round(84.0 + np.random.uniform(2, 8), 1)),
            "sinclair_team_coefficient": float(np.round(1840.0 + np.random.uniform(20, 90), 1))
        }

        tourneys = ["54th Manipur State Weightlifting Championship", "National Selection Trials", "NE Zone Lifting Championship"]
        for m_idx in range(4):
            opp = np.random.choice(peer_clubs)
            snatch = float(np.round(86.0 + np.random.uniform(2, 45), 1))
            cj = float(np.round(snatch * 1.34 + np.random.uniform(2, 10), 1))
            tot = float(np.round(snatch + cj, 1))
            res = "GOLD MEDAL 🥇" if m_idx < 2 else "SILVER MEDAL 🥈"

            historical_matches.append({
                "match_id": f"MN-WLT-2024-M{m_idx+1:02d}",
                "date": f"{14 - m_idx * 14} Nov 2024",
                "tournament": np.random.choice(tourneys),
                "opponent": opp["short_name"],
                "venue": "Khuman Lampak Indoor Stadium",
                "result": res,
                "scoreline": f"Total: {tot} kg",
                "possession_team_pct": 68,
                "possession_opponent_pct": 32,
                "team_shots": int(tot),
                "opponent_shots": int(tot - np.random.randint(4, 12)),
                "team_shots_on_target": int(cj),
                "opponent_shots_on_target": int(cj - 5),
                "expected_goals_xg_team": snatch,
                "expected_goals_xg_opponent": float(np.round(snatch - 4, 1)),
                "passes_completed_team": 6,
                "passes_completed_opponent": 5,
                "key_performance_highlight": f"{res} | Snatch {snatch}kg | C&J {cj}kg | Total {tot}kg (6/6 Clean Attempts)"
            })

    elif sport == "Boxing":
        season_stats = {
            "registered_boxers": int(np.random.randint(28, 50)),
            "bouts_won_season": int(np.random.randint(45, 68)),
            "bouts_lost_season": int(np.random.randint(8, 14)),
            "knockouts_and_rsc_count": int(np.random.randint(14, 24)),
            "strike_accuracy_team_pct": float(np.round(64.5 + np.random.uniform(2, 6), 1)),
            "guard_defense_efficiency_pct": float(np.round(78.0 + np.random.uniform(2, 7), 1)),
            "state_championship_golds": int(np.random.randint(7, 14))
        }

        tourneys = ["Manipur State Amateur Boxing Championship", "Dingko Singh Memorial Cup", "North East Open Boxing"]
        for m_idx in range(4):
            opp = np.random.choice(peer_clubs)
            res = "WON (Unanimous 5:0) 🥇" if m_idx < 2 else ("WON (RSC Rd 2) 🥊" if m_idx == 2 else "WON (Split 3:2)")
            landed = int(np.random.randint(72, 94))
            opp_landed = int(np.random.randint(28, 48))
            acc = int(np.random.randint(62, 74))

            historical_matches.append({
                "match_id": f"MN-BOX-2024-M{m_idx+1:02d}",
                "date": f"{20 - m_idx * 16} Nov 2024",
                "tournament": np.random.choice(tourneys),
                "opponent": opp["short_name"],
                "venue": "Khuman Lampak Boxing Arena",
                "result": res,
                "scoreline": "5 - 0 (Unanimous)",
                "possession_team_pct": 65,
                "possession_opponent_pct": 35,
                "team_shots": landed,
                "opponent_shots": opp_landed,
                "team_shots_on_target": landed,
                "opponent_shots_on_target": opp_landed,
                "expected_goals_xg_team": float(np.round(landed / 20.0, 2)),
                "expected_goals_xg_opponent": float(np.round(opp_landed / 20.0, 2)),
                "passes_completed_team": landed,
                "passes_completed_opponent": opp_landed,
                "key_performance_highlight": f"{res} | {landed} Clean Strikes Landed | {acc}% Accuracy"
            })

    elif sport == "Archery":
        season_stats = {
            "registered_archers": int(np.random.randint(20, 38)),
            "average_fita_720_score": float(np.round(668.0 + np.random.uniform(2, 14), 1)),
            "tens_and_x_per_stage": int(np.random.randint(28, 42)),
            "state_golds_won": int(np.random.randint(5, 11)),
            "national_podiums": int(np.random.randint(4, 8)),
            "average_arrow_score": float(np.round(9.28 + np.random.uniform(0.05, 0.25), 2))
        }

        tourneys = ["Governor's Gold Cup Archery Championship", "Manipur State Target Archery Championship", "All Manipur Inter-Club Meet"]
        for m_idx in range(4):
            opp = np.random.choice(peer_clubs)
            res = "WON (Set 6-2) 🥇" if m_idx < 2 else "WON (Set 6-0) 🥇"
            score720 = int(np.random.randint(674, 698))
            tens = int(np.random.randint(34, 44))
            avg_arrow = float(np.round(score720 / 72.0, 2))

            historical_matches.append({
                "match_id": f"MN-ARC-2024-M{m_idx+1:02d}",
                "date": f"{16 - m_idx * 15} Nov 2024",
                "tournament": np.random.choice(tourneys),
                "opponent": opp["short_name"],
                "venue": "Khuman Lampak Archery Ground",
                "result": res,
                "scoreline": "Set 6 - 2",
                "possession_team_pct": 62,
                "possession_opponent_pct": 38,
                "team_shots": score720,
                "opponent_shots": score720 - np.random.randint(15, 30),
                "team_shots_on_target": tens,
                "opponent_shots_on_target": tens - 6,
                "expected_goals_xg_team": avg_arrow,
                "expected_goals_xg_opponent": float(np.round(avg_arrow - 0.4, 2)),
                "passes_completed_team": 72,
                "passes_completed_opponent": 72,
                "key_performance_highlight": f"{res} | {score720}/720 FITA Score | {tens} Tens & X-Rings | Avg {avg_arrow}"
            })

    elif sport in ["Judo & Combat Sports", "Wushu"]:
        season_stats = {
            "active_judokas_wushu_athletes": int(np.random.randint(25, 42)),
            "ippon_win_rate_pct": float(np.round(76.0 + np.random.uniform(2, 9), 1)),
            "state_championship_golds": int(np.random.randint(8, 15)),
            "national_medals_won": int(np.random.randint(5, 10)),
            "groundwork_ne_waza_defense_pct": float(np.round(89.0 + np.random.uniform(2, 7), 1))
        }

        tourneys = ["Manipur State Judo Championship", "National Cadet Judo Selection Trials", "State Wushu Championship"]
        for m_idx in range(4):
            opp = np.random.choice(peer_clubs)
            res = "WON by Ippon (10-0) 🥇" if m_idx < 2 else "WON by Waza-ari (07-00) 🥇"
            duration = f"0{np.random.randint(1, 3)}:{np.random.randint(10, 58):02d}"

            historical_matches.append({
                "match_id": f"MN-JUD-2024-M{m_idx+1:02d}",
                "date": f"{19 - m_idx * 16} Nov 2024",
                "tournament": np.random.choice(tourneys),
                "opponent": opp["short_name"],
                "venue": "Khuman Lampak Multipurpose Indoor Dojo",
                "result": res,
                "scoreline": "Ippon (10 - 0)",
                "possession_team_pct": 70,
                "possession_opponent_pct": 30,
                "team_shots": 10,
                "opponent_shots": 0,
                "team_shots_on_target": 1,
                "opponent_shots_on_target": 0,
                "expected_goals_xg_team": 2.8,
                "expected_goals_xg_opponent": 0.3,
                "passes_completed_team": 4,
                "passes_completed_opponent": 1,
                "key_performance_highlight": f"{res} at {duration} | 0 Shido Penalties | Dominant Throw"
            })

    elif sport == "Sepak Takraw":
        season_stats = {
            "registered_regus": int(np.random.randint(12, 20)),
            "senior_national_titles": 28 if "AMSTA" in club_name else int(np.random.randint(5, 12)),
            "spike_kill_conversion_pct": float(np.round(82.0 + np.random.uniform(2, 7), 1)),
            "tekong_service_aces_avg": float(np.round(6.5 + np.random.uniform(0.5, 2.0), 1)),
            "block_success_rate_pct": float(np.round(68.0 + np.random.uniform(3, 8), 1))
        }

        tourneys = ["Manipur State Sepak Takraw Championship", "All India Inter-State Takraw Championship", "Kakching Open Regu Trophy"]
        for m_idx in range(4):
            opp = np.random.choice(peer_clubs)
            res = "WON 2-0 (21-18, 21-16) 🥇" if m_idx < 2 else "WON 2-1 (21-19, 18-21, 21-17) 🥇"
            spikes = int(np.random.randint(22, 34))
            aces = int(np.random.randint(5, 9))

            historical_matches.append({
                "match_id": f"MN-STK-2024-M{m_idx+1:02d}",
                "date": f"{17 - m_idx * 15} Nov 2024",
                "tournament": np.random.choice(tourneys),
                "opponent": opp["short_name"],
                "venue": "Khuman Lampak Sepak Takraw Court",
                "result": res,
                "scoreline": "Sets 2 - 0",
                "possession_team_pct": 58,
                "possession_opponent_pct": 42,
                "team_shots": 42,
                "opponent_shots": 34,
                "team_shots_on_target": spikes,
                "opponent_shots_on_target": spikes - 6,
                "expected_goals_xg_team": float(np.round(spikes / 10.0, 2)),
                "expected_goals_xg_opponent": float(np.round((spikes - 6) / 10.0, 2)),
                "passes_completed_team": spikes + aces,
                "passes_completed_opponent": spikes - 4,
                "key_performance_highlight": f"{res} | {spikes} Spike Kills | {aces} Service Aces"
            })

    elif sport == "Field Hockey":
        season_stats = {
            "matches_played": int(np.random.randint(14, 22)),
            "wins": int(np.random.randint(10, 15)),
            "goals_scored": int(np.random.randint(38, 54)),
            "penalty_corners_earned": int(np.random.randint(48, 72)),
            "penalty_corner_conversion_pct": float(np.round(34.0 + np.random.uniform(2, 6), 1)),
            "circle_penetrations_per_match": float(np.round(18.5 + np.random.uniform(1, 4), 1)),
            "clean_sheets": int(np.random.randint(5, 9))
        }

        tourneys = ["Manipur State Senior Hockey League", "Dr. B.R. Ambedkar Memorial Hockey", "Governor's Gold Cup Hockey"]
        for m_idx in range(4):
            opp = np.random.choice(peer_clubs)
            team_goals = int(stats.poisson.rvs(mu=2.4))
            opp_goals = int(stats.poisson.rvs(mu=1.1))
            res = "WON" if team_goals > opp_goals else ("DRAW" if team_goals == opp_goals else "LOST")
            circle_entries = int(np.random.randint(16, 26))

            historical_matches.append({
                "match_id": f"MN-HKY-2024-M{m_idx+1:02d}",
                "date": f"{15 - m_idx * 14} Nov 2024",
                "tournament": np.random.choice(tourneys),
                "opponent": opp["short_name"],
                "venue": "Khuman Lampak Hockey Astroturf Stadium",
                "result": f"{team_goals}-{opp_goals} ({res})",
                "scoreline": f"{team_goals} - {opp_goals}",
                "possession_team_pct": 56,
                "possession_opponent_pct": 44,
                "team_shots": circle_entries,
                "opponent_shots": int(circle_entries * 0.7),
                "team_shots_on_target": team_goals + 3,
                "opponent_shots_on_target": opp_goals + 2,
                "expected_goals_xg_team": float(np.round(team_goals * 0.8 + 0.4, 2)),
                "expected_goals_xg_opponent": float(np.round(opp_goals * 0.8 + 0.3, 2)),
                "passes_completed_team": int(np.random.randint(320, 410)),
                "passes_completed_opponent": int(np.random.randint(260, 340)),
                "key_performance_highlight": f"{team_goals}-{opp_goals} ({res}) | {circle_entries} Circle Entries | 1 PC Converted"
            })

    return season_stats, historical_matches

# ==============================================================================
# 5. ATHLETE GENERATOR (CALIBRATED BY SPORT & LINKED TO TEAM)
# ==============================================================================

def generate_athlete_for_team(index, team, is_star=False, star_info=None):
    sport = team["primary_sport"]
    district = team["district"]
    club_name = team["name"]
    team_id = team["id"]

    if star_info:
        name = star_info["name"]
        age = star_info["age"]
        gender = star_info["gender"]
        score_target = star_info["score"]
        role_label = star_info.get("role", "Senior Star Starter")
    else:
        if district in ["Churachandpur", "Kangpokpi"]:
            surname = np.random.choice(KUKI_ZOMI_SURNAMES)
        elif district in ["Ukhrul", "Tamenglong", "Senapati"]:
            surname = np.random.choice(NAGA_TANGKHUL_SURNAMES)
        else:
            surname = np.random.choice(MEITEI_SURNAMES)

        is_female = sport in ["Weightlifting", "Archery"] and np.random.rand() > 0.4
        if is_female:
            first_name = np.random.choice(FEMALE_FIRST_NAMES)
            gender = "Female"
        else:
            first_name = np.random.choice(MALE_FIRST_NAMES)
            gender = "Male"

        name = f"{first_name} {surname}"
        age = int(np.random.choice([16, 17, 18, 19, 21, 23, 25], p=[0.25, 0.25, 0.2, 0.15, 0.08, 0.05, 0.02]))
        score_target = float(np.round(np.random.uniform(84.0, 94.5), 1))
        role_label = "Squad Regular / Talent Prospect"

    # Sport-specific Biometrics using Truncated Normal
    if sport == "Weightlifting":
        if gender == "Female":
            height = float(np.round(stats.truncnorm.rvs(-1.5, 1.5, loc=152.0, scale=4.0), 1))
            weight = float(np.round(stats.truncnorm.rvs(-1.5, 2.0, loc=51.0, scale=4.5), 1))
            v_jump = float(np.round(stats.truncnorm.rvs(-1.0, 2.5, loc=66.0, scale=5.0), 1))
            sprint_30m = float(np.round(stats.truncnorm.rvs(-1.5, 2.0, loc=4.15, scale=0.10), 2))
            flexibility = float(np.round(stats.truncnorm.rvs(-1.0, 2.5, loc=30.0, scale=3.0), 1))
        else:
            height = float(np.round(stats.truncnorm.rvs(-1.5, 1.5, loc=166.0, scale=5.0), 1))
            weight = float(np.round(stats.truncnorm.rvs(-1.5, 2.0, loc=69.0, scale=6.5), 1))
            v_jump = float(np.round(stats.truncnorm.rvs(-1.0, 2.5, loc=72.0, scale=5.5), 1))
            sprint_30m = float(np.round(stats.truncnorm.rvs(-1.5, 2.0, loc=3.95, scale=0.10), 2))
            flexibility = float(np.round(stats.truncnorm.rvs(-1.0, 2.5, loc=26.0, scale=3.0), 1))
        wingspan = float(np.round(height + np.random.normal(2.5, 1.5), 1))
        beep_level = float(np.round(stats.truncnorm.rvs(-1.0, 2.0, loc=12.5, scale=0.8), 1))

        snatch = float(np.round(weight * (1.68 if is_star else 1.45) + np.random.normal(0, 3), 1))
        cj = float(np.round(weight * (2.12 if is_star else 1.85) + np.random.normal(0, 4), 1))
        tot = float(np.round(snatch + cj, 1))
        season_stats = {
            "weight_category": f"{int(weight)}kg Class",
            "best_snatch_kg": snatch,
            "best_clean_and_jerk_kg": cj,
            "best_total_kg": tot,
            "sinclair_coefficient": float(np.round(tot * 1.38, 1)),
            "lift_success_rate_pct": float(np.round(88 + np.random.uniform(2, 9), 1)),
            "squad_role": f"Lifter ({int(weight)}kg Class)"
        }
        match_history = [
            {"date": "14 Nov 2024", "tournament": "54th Manipur State Weightlifting Championship", "opponent": "State Final Field", "result": "GOLD MEDAL 🥇", "minutes": 0, "stat": f"Snatch: {snatch}kg | C&J: {cj}kg | Total: {tot}kg (6/6 Clean)"},
            {"date": "22 Oct 2024", "tournament": "National Weightlifting Trials", "opponent": "National Selection Field", "result": "1st Rank 🥇", "minutes": 0, "stat": f"Clean Lift Series (PB Total: {tot}kg)"},
            {"date": "10 Aug 2024", "tournament": "North East Lifting Cup", "opponent": "Zonal Field", "result": "GOLD MEDAL 🥇", "minutes": 0, "stat": f"State Record Total: {tot}kg"}
        ]

    elif sport == "Boxing":
        height = float(np.round(stats.truncnorm.rvs(-1.5, 2.0, loc=168.0 if gender == "Male" else 158.0, scale=6.0), 1))
        weight = float(np.round(stats.truncnorm.rvs(-1.5, 2.0, loc=58.0 if gender == "Male" else 51.0, scale=5.0), 1))
        wingspan = float(np.round(height + np.random.normal(7.0, 2.0), 1))
        v_jump = float(np.round(stats.truncnorm.rvs(-1.0, 2.0, loc=64.0, scale=4.5), 1))
        sprint_30m = float(np.round(stats.truncnorm.rvs(-1.5, 2.0, loc=3.92, scale=0.10), 2))
        beep_level = float(np.round(stats.truncnorm.rvs(-1.0, 2.0, loc=14.2, scale=0.7), 1))
        flexibility = float(np.round(stats.truncnorm.rvs(-1.0, 2.0, loc=24.0, scale=2.5), 1))

        bouts_w = int(np.random.randint(12, 28) if is_star else np.random.randint(8, 16))
        bouts_l = int(np.random.randint(1, 4))
        season_stats = {
            "weight_category": f"{int(weight)}kg Division",
            "bouts_record": f"{bouts_w}-{bouts_l}-0",
            "knockouts_stoppages": int(bouts_w * 0.4),
            "strike_accuracy_pct": float(np.round(66.0 + np.random.uniform(2, 8), 1)),
            "punch_output_per_min": float(np.round(58.0 + np.random.uniform(2, 9), 1)),
            "squad_role": f"Boxer ({int(weight)}kg Division)"
        }
        match_history = [
            {"date": "20 Nov 2024", "tournament": "Manipur State Amateur Boxing Championship", "opponent": "State Finalist", "result": "GOLD MEDAL 🥇 (Unanimous 5:0)", "minutes": 9, "stat": "88 Significant Strikes Landed (71% Acc)"},
            {"date": "14 Oct 2024", "tournament": "Dingko Singh Memorial Cup", "opponent": "National Cadet Champion", "result": "WON (RSC Rd 2) 🥊", "minutes": 6, "stat": "Referee Stoppage via Right Cross Combination"},
            {"date": "02 Sep 2024", "tournament": "North East Boxing Championship", "opponent": "Assam State Finalist", "result": "GOLD MEDAL 🥇", "minutes": 9, "stat": "Clean Sweep 30-27 on All Judges Cards"}
        ]

    elif sport == "Archery":
        height = float(np.round(stats.truncnorm.rvs(-1.5, 2.0, loc=168.0, scale=6.0), 1))
        weight = float(np.round(stats.truncnorm.rvs(-1.5, 2.0, loc=60.0, scale=5.5), 1))
        wingspan = float(np.round(height + np.random.normal(5.0, 2.0), 1))
        v_jump = float(np.round(stats.truncnorm.rvs(-1.0, 2.0, loc=56.0, scale=4.0), 1))
        sprint_30m = float(np.round(stats.truncnorm.rvs(-1.5, 2.0, loc=4.20, scale=0.12), 2))
        beep_level = float(np.round(stats.truncnorm.rvs(-1.0, 2.0, loc=12.2, scale=0.6), 1))
        flexibility = float(np.round(stats.truncnorm.rvs(-1.0, 2.0, loc=27.0, scale=3.0), 1))

        score720 = int(np.random.randint(680, 706) if is_star else np.random.randint(658, 682))
        tens = int(np.round(score720 / 20.0))
        season_stats = {
            "bow_division": "Recurve 70m Olympic" if np.random.rand() > 0.35 else "Compound 50m",
            "personal_best_720": score720,
            "tens_and_x_count": tens,
            "arrow_grouping_radius_mm": float(np.round(32.0 + np.random.uniform(1, 8), 1)),
            "squad_role": "Recurve 70m Archer"
        }
        match_history = [
            {"date": "18 Nov 2024", "tournament": "Governor's Gold Cup Archery Championship", "opponent": "State Finalist", "result": "GOLD MEDAL 🥇 (6-2)", "minutes": 25, "stat": f"Shot 29, 29, 30, 28 in Sets (PB Score: {score720})"},
            {"date": "22 Oct 2024", "tournament": "National Archery Ranking Tournament", "opponent": "National Field", "result": "1st Rank 🥇", "minutes": 35, "stat": f"{tens} X-Ring Hits, Grouping Variance 28mm"}
        ]

    elif sport in ["Judo & Combat Sports", "Wushu"]:
        height = float(np.round(stats.truncnorm.rvs(-1.5, 2.0, loc=164.0 if gender == "Male" else 156.0, scale=5.5), 1))
        weight = float(np.round(stats.truncnorm.rvs(-1.5, 2.0, loc=64.0 if gender == "Male" else 54.0, scale=5.0), 1))
        wingspan = float(np.round(height + np.random.normal(3.5, 1.8), 1))
        v_jump = float(np.round(stats.truncnorm.rvs(-1.0, 2.0, loc=65.0, scale=4.5), 1))
        sprint_30m = float(np.round(stats.truncnorm.rvs(-1.5, 2.0, loc=4.02, scale=0.10), 2))
        beep_level = float(np.round(stats.truncnorm.rvs(-1.0, 2.0, loc=13.5, scale=0.7), 1))
        flexibility = float(np.round(stats.truncnorm.rvs(-1.0, 2.0, loc=31.0, scale=3.0), 1))

        season_stats = {
            "weight_category": f"{int(weight)}kg Division",
            "ippon_win_rate_pct": float(np.round(82.0 + np.random.uniform(2, 9), 1)),
            "waza_ari_count": int(np.random.randint(12, 24)),
            "groundwork_ne_waza_defense_pct": float(np.round(91.0 + np.random.uniform(2, 6), 1)),
            "squad_role": f"Judoka / Combat Athlete ({int(weight)}kg)"
        }
        match_history = [
            {"date": "15 Nov 2024", "tournament": "Manipur State Judo Championship", "opponent": "State Finalist", "result": "GOLD MEDAL 🥇 (Ippon)", "minutes": 3, "stat": "Ippon via Harai-Goshi at 02:18, 0 Shido Penalties"},
            {"date": "04 Oct 2024", "tournament": "National Cadet Judo Selection Trials", "opponent": "National Selection Pool", "result": "1st Rank 🥇", "minutes": 4, "stat": "Direct Qualification for World Cadet Championships"}
        ]

    elif sport == "Sepak Takraw":
        height = float(np.round(stats.truncnorm.rvs(-1.5, 2.0, loc=174.0 if gender == "Male" else 164.0, scale=5.5), 1))
        weight = float(np.round(stats.truncnorm.rvs(-1.5, 2.0, loc=66.0 if gender == "Male" else 55.0, scale=4.5), 1))
        wingspan = float(np.round(height + np.random.normal(5.0, 2.0), 1))
        v_jump = float(np.round(stats.truncnorm.rvs(-1.0, 2.5, loc=74.0, scale=5.5), 1))
        sprint_30m = float(np.round(stats.truncnorm.rvs(-1.5, 2.0, loc=3.90, scale=0.09), 2))
        beep_level = float(np.round(stats.truncnorm.rvs(-1.0, 2.0, loc=14.4, scale=0.7), 1))
        flexibility = float(np.round(stats.truncnorm.rvs(-1.0, 2.5, loc=34.0, scale=3.5), 1))

        role = np.random.choice(["Spiker (Killer)", "Tekong (Server)", "Feeder (Setter)"])
        season_stats = {
            "takraw_role": role,
            "spike_kill_pct": float(np.round(84.0 + np.random.uniform(2, 8), 1)),
            "service_aces": int(np.random.randint(18, 38)),
            "block_points": int(np.random.randint(14, 28)),
            "squad_role": role
        }
        match_history = [
            {"date": "17 Nov 2024", "tournament": "Manipur State Sepak Takraw Championship", "opponent": "State Regu Finalist", "result": "GOLD MEDAL 🥇 (2-0)", "minutes": 35, "stat": f"24 Spike Kills, 6 Service Aces, Roll Spike Masterclass"},
            {"date": "08 Oct 2024", "tournament": "Senior National Sepak Takraw Championship", "opponent": "National Regu Finalist", "result": "GOLD MEDAL 🥇 (2-0)", "minutes": 40, "stat": "Flawless Performance, Indian National Team Star"}
        ]

    elif sport == "Field Hockey":
        height = float(np.round(stats.truncnorm.rvs(-1.5, 2.0, loc=175.0 if gender == "Male" else 162.0, scale=5.5), 1))
        weight = float(np.round(stats.truncnorm.rvs(-1.5, 2.0, loc=69.0 if gender == "Male" else 56.0, scale=5.0), 1))
        wingspan = float(np.round(height + np.random.normal(4.0, 2.0), 1))
        v_jump = float(np.round(stats.truncnorm.rvs(-1.0, 2.0, loc=64.0, scale=4.5), 1))
        sprint_30m = float(np.round(stats.truncnorm.rvs(-1.5, 2.0, loc=3.88, scale=0.08), 2))
        beep_level = float(np.round(stats.truncnorm.rvs(-1.0, 2.0, loc=14.8, scale=0.7), 1))
        flexibility = float(np.round(stats.truncnorm.rvs(-1.0, 2.0, loc=23.0, scale=2.5), 1))

        pos = np.random.choice(["Central Midfielder", "Forward / Striker", "Defender", "Drag-Flicker"])
        goals = int(np.random.randint(6, 16))
        season_stats = {
            "hockey_position": pos,
            "goals_scored": goals,
            "penalty_corners_converted": int(np.random.randint(4, 10)),
            "circle_penetrations_avg": float(np.round(6.2 + np.random.uniform(0.5, 2.0), 1)),
            "aerial_pass_accuracy_pct": float(np.round(84.0 + np.random.uniform(2, 6), 1)),
            "squad_role": pos
        }
        match_history = [
            {"date": "15 Nov 2024", "tournament": "Manipur State Senior Hockey League", "opponent": "State Finalist", "result": "WON 3-1 🥇", "minutes": 60, "stat": "1 Goal, 2 Circle Assists, 88% Passing Accuracy"},
            {"date": "11 Oct 2024", "tournament": "Dr. B.R. Ambedkar Memorial Hockey", "opponent": "Tournament Finalist", "result": "WON 2-0 🥇", "minutes": 60, "stat": "Man of the Match, 1 Drag-Flick Goal from Penalty Corner"}
        ]

    else: # Football
        height = float(np.round(stats.truncnorm.rvs(-1.5, 2.0, loc=176.0 if gender == "Male" else 164.0, scale=6.0), 1))
        weight = float(np.round(stats.truncnorm.rvs(-1.5, 2.0, loc=69.0 if gender == "Male" else 56.0, scale=6.0), 1))
        wingspan = float(np.round(height + np.random.normal(3.5, 1.8), 1))
        v_jump = float(np.round(stats.truncnorm.rvs(-1.0, 2.0, loc=63.0, scale=5.0), 1))
        sprint_30m = float(np.round(stats.truncnorm.rvs(-1.5, 2.0, loc=3.95, scale=0.10), 2))
        beep_level = float(np.round(stats.truncnorm.rvs(-1.0, 2.0, loc=14.0, scale=0.8), 1))
        flexibility = float(np.round(stats.truncnorm.rvs(-1.0, 2.0, loc=21.0, scale=3.0), 1))

        pos = np.random.choice(["Central Midfielder", "Winger / Forward", "Centre Back", "Full Back", "Striker"])
        goals = int(stats.poisson.rvs(mu=3.8))
        assists = int(stats.poisson.rvs(mu=3.5))
        pass_acc = float(np.round(78 + 14 * stats.beta.rvs(a=8, b=4), 1))
        xg_val = float(np.round(goals * 0.78 + np.random.uniform(0.3, 0.9), 2))
        season_stats = {
            "football_position": pos,
            "matches_played": int(np.random.randint(14, 22)),
            "goals": goals,
            "assists": assists,
            "expected_goals_xG": xg_val,
            "passing_accuracy_pct": pass_acc,
            "distance_covered_avg_km": float(np.round(10.6 + np.random.uniform(-0.4, 0.8), 1)),
            "top_sprint_speed_kmh": float(np.round(32.4 + np.random.uniform(-0.8, 1.6), 1)),
            "tackles_won_pct": float(np.round(71.0 + np.random.uniform(2, 10), 1)),
            "squad_role": pos
        }
        match_history = [
            {"date": "18 Nov 2024", "tournament": "18th Manipur State League", "opponent": "State League Rival", "result": "2-1 (Won) 🥇", "minutes": 90, "team_possession_pct": 58, "stat": f"1 Goal (xG {float(np.round(np.random.uniform(0.3, 0.6), 2))}), 87% Pass Acc, 5 Recoveries"},
            {"date": "06 Nov 2024", "tournament": "65th CC Meet Quarterfinal", "opponent": "Tournament Rival", "result": "1-0 (Won)", "minutes": 88, "team_possession_pct": 54, "stat": "1 Assist, 6 Progressive Carries, 11.2km Covered"},
            {"date": "24 Oct 2024", "tournament": "18th Manipur State League", "opponent": "League Contender", "result": "1-1 (Draw)", "minutes": 90, "team_possession_pct": 51, "stat": "4 Key Passes, 7 Interceptions, 84% Pass Acc"}
        ]

    # Generate Khel ID & NSIS ID
    sport_codes = {
        "Football": "FB", "Weightlifting": "WLT", "Boxing": "BOX",
        "Judo & Combat Sports": "JUD", "Archery": "ARC", "Wushu": "WSH",
        "Sepak Takraw": "STK", "Field Hockey": "HKY"
    }
    code = sport_codes.get(sport, "GEN")
    year = 2025 - (22 - min(age, 22))
    khel_id = f"KHEL-IND-MN-{year}-{code}-{index:04d}"
    nsis_id = f"NSIS-MN-{80000 + index}"
    state_reg = f"YAS-MN-{year}-{code}{index:03d}"

    # Scoring Engine
    item = {
        "name": name, "age": age, "gender": gender, "district": district, "primary_sport": sport,
        "height_cm": height, "weight_kg": weight, "wingspan_cm": wingspan, "vertical_jump_cm": v_jump,
        "sprint_30m_sec": sprint_30m, "beep_test_level": beep_level, "flexibility_cm": flexibility
    }
    scoring = calculate_athlete_grade_and_radar(item, {"pose_score": 92.0, "symmetry_score": 93.0})

    if is_star and star_info:
        comp_score = star_info["score"]
        grade = "Grade A+"
        grade_title = "Elite Senior National Star / Olympian"
        badge_color = "#10b981"
        prospect_status = "International Podium Contender (TOPS)"
    else:
        comp_score = float(np.round(scoring["composite_score"], 1))
        grade = scoring["grade"]
        grade_title = scoring["grade_title"]
        badge_color = scoring["badge_color"]
        if comp_score >= 90:
            prospect_status = "High Breakthrough Prospect (Priority Scout)"
        elif comp_score >= 82:
            prospect_status = "State Academy Standard"
        else:
            prospect_status = "Grassroots Development Pool"

    prospect_rating = min(99.0, max(75.0, float(np.round(comp_score * np.random.uniform(0.98, 1.01), 1))))
    achievements = f"Manipur State {sport} Competitor, Representing {club_name}"

    ai_report = {
        "executive_summary": f"Official SAI Assessment for {name} ({khel_id}) representing {club_name} ({district}). Evaluated under YAS-01 protocol, registering a composite score of {comp_score}/100 ({grade}).",
        "key_strengths": [
            f"Kinematic Battery: 30m Sprint {sprint_30m}s, Vertical Jump {v_jump}cm, Aerobic Beep Test {beep_level}.",
            f"Club Pedigree: Active registered athlete with {club_name} ({district}).",
            f"Sport Suitability: Highly optimized biomechanics for {sport}."
        ],
        "technique_corrections": [
            "Incorporate bilateral symmetry training to avoid unilateral load imbalances.",
            "SAI NCOE high-performance nutrition and hydration protocol.",
            "Progressive power-output overload during championship tapering."
        ],
        "training_roadmap": [
            f"Phase 1: Club tactical training with {club_name}.",
            "Phase 2: Khuman Lampak high-performance lab assessment.",
            "Phase 3: National Selection trials tapering."
        ],
        "coach_verdict": f"OFFICIAL VERDICT: Strong mechanical kinetic chain. Recommended for SAI NCOE residential tracking."
    }

    return {
        "khel_id": khel_id,
        "nsis_id": nsis_id,
        "state_reg_no": state_reg,
        "name": name,
        "age": age,
        "gender": gender,
        "district": district,
        "primary_sport": sport,
        "current_club": club_name,
        "team_id": team_id,
        "former_clubs": ["State Youth Training Camp", "District Grassroots Centre"],
        "match_history": match_history,
        "season_stats": season_stats,
        "height_cm": height,
        "weight_kg": weight,
        "wingspan_cm": wingspan,
        "vertical_jump_cm": v_jump,
        "sprint_30m_sec": sprint_30m,
        "beep_test_level": beep_level,
        "flexibility_cm": flexibility,
        "composite_score": comp_score,
        "grade": grade,
        "grade_title": grade_title,
        "badge_color": badge_color,
        "ai_prospect_rating": prospect_rating,
        "ai_breakthrough_probability": prospect_status,
        "peer_rank": int(np.random.randint(1, 8)),
        "benchmark_percentile": float(np.round(comp_score * 0.99, 1)),
        "achievements": achievements,
        "verified_by_sai": 1 if np.random.rand() > 0.12 else 0,
        "radar_metrics": scoring["radar_metrics"],
        "pose_metrics": {"pose_score": 92.0, "symmetry_score": 93.0},
        "top_recommended_sports": scoring["top_recommended_sports"],
        "ai_report": ai_report,
        "media_url": "/demo_athlete.jpg"
    }

# ==============================================================================
# 6. MATCH GENERATION & PENDING VERIFICATION PIPELINE
# ==============================================================================

def generate_match_record(tourney_id, tourney, stage, match_idx, home_club, away_club, date_str):
    sport = tourney["sport"]
    match_code = f"M-{sport[:3].upper()}-{tourney_id:02d}-{match_idx:02d}"
    venue = tourney["venue"]
    
    if "football" in sport.lower():
        h_score = int(np.random.choice([1, 2, 3, 2, 1], p=[0.25, 0.35, 0.2, 0.1, 0.1]))
        a_score = int(np.random.choice([0, 1, 2, 1, 0], p=[0.3, 0.4, 0.15, 0.1, 0.05]))
        if "final" in stage.lower() and h_score == a_score:
            h_score += 1
        scoreline = f"{h_score} - {a_score}"
        winner = home_club["name"] if h_score > a_score else (away_club["name"] if a_score > h_score else "Draw")
        
        goals = []
        minutes_used = set()
        for i in range(h_score):
            m = int(np.random.randint(12, 89))
            while m in minutes_used: m = int(np.random.randint(5, 90))
            minutes_used.add(m)
            p_name = f"{np.random.choice(MALE_FIRST_NAMES)} {np.random.choice(MEITEI_SURNAMES)}"
            goals.append({"minute": m, "player": p_name, "team": home_club["short_name"], "type": "Open Play", "assist": f"{np.random.choice(MALE_FIRST_NAMES)} {np.random.choice(MEITEI_SURNAMES)}"})
        for i in range(a_score):
            m = int(np.random.randint(12, 89))
            while m in minutes_used: m = int(np.random.randint(5, 90))
            minutes_used.add(m)
            p_name = f"{np.random.choice(MALE_FIRST_NAMES)} {np.random.choice(KUKI_ZOMI_SURNAMES)}"
            goals.append({"minute": m, "player": p_name, "team": away_club["short_name"], "type": "Counter Attack", "assist": f"{np.random.choice(MALE_FIRST_NAMES)} {np.random.choice(NAGA_TANGKHUL_SURNAMES)}"})
        goals.sort(key=lambda x: x["minute"])

        details = {
            "sport": "Football",
            "attendance": f"{np.random.randint(8500, 18500):,}",
            "referee": "L. Priyobarta Singh (AMFA / AIFF Elite Referee)",
            "possession": {"home": 54, "away": 46},
            "shots": {"home": 14, "away": 8},
            "shots_on_target": {"home": 7, "away": 4},
            "corners": {"home": 6, "away": 3},
            "fouls": {"home": 11, "away": 13},
            "xg": {"home": round(h_score * 0.72 + 0.45, 2), "away": round(a_score * 0.68 + 0.32, 2)},
            "goals": goals,
            "cards": [
                {"minute": 34, "player": f"{np.random.choice(MALE_FIRST_NAMES)} {np.random.choice(MEITEI_SURNAMES)}", "team": home_club["short_name"], "type": "Yellow", "reason": "Tactical Foul"},
                {"minute": 67, "player": f"{np.random.choice(MALE_FIRST_NAMES)} {np.random.choice(NAGA_TANGKHUL_SURNAMES)}", "team": away_club["short_name"], "type": "Yellow", "reason": "Late Challenge"}
            ],
            "lineups": {
                "home": [{"no": 1, "name": "N. Borish Singh", "pos": "GK"}, {"no": 4, "name": "Th. Chinglensana", "pos": "DF"}, {"no": 8, "name": "Suresh Singh Wangjam", "pos": "MF"}, {"no": 10, "name": "Ronald Singh", "pos": "FW"}],
                "away": [{"no": 1, "name": "Paominlen Haokip", "pos": "GK"}, {"no": 3, "name": "M. Somatai Luikham", "pos": "DF"}, {"no": 7, "name": "Jeakson Singh Thounaojam", "pos": "MF"}, {"no": 9, "name": "P. Haokip", "pos": "FW"}]
            },
            "player_of_the_match": goals[0]["player"] if goals else home_club["head_coach"]
        }
    elif "weightlifting" in sport.lower():
        cat = "Women's 49kg Senior Division" if match_idx % 2 == 1 else "Men's 73kg Senior Division"
        lifter_h = "Saikhom Mirabai Chanu" if "SAI" in home_club["name"] else f"{np.random.choice(FEMALE_FIRST_NAMES if 'Women' in cat else MALE_FIRST_NAMES)} {np.random.choice(MEITEI_SURNAMES)}"
        lifter_a = f"{np.random.choice(FEMALE_FIRST_NAMES if 'Women' in cat else MALE_FIRST_NAMES)} {np.random.choice(KUKI_ZOMI_SURNAMES)}"
        
        snatch_h = 88 if "Women" in cat else 138
        cj_h = 115 if "Women" in cat else 168
        tot_h = snatch_h + cj_h

        snatch_a = snatch_h - np.random.randint(3, 7)
        cj_a = cj_h - np.random.randint(4, 8)
        tot_a = snatch_a + cj_a

        scoreline = f"{lifter_h} ({tot_h} kg) def. {lifter_a} ({tot_a} kg)"
        winner = home_club["name"]

        details = {
            "sport": "Weightlifting",
            "category": cat,
            "chief_referee": "N. Birendra Singh (Category 1 IWF Referee)",
            "lifters": [
                {
                    "rank": 1, "name": lifter_h, "team": home_club["name"], "body_weight": 48.6 if "Women" in cat else 72.4,
                    "snatch_attempts": [{"kg": snatch_h - 4, "result": "good"}, {"kg": snatch_h, "result": "good"}, {"kg": snatch_h + 3, "result": "fail"}],
                    "best_snatch": snatch_h,
                    "cj_attempts": [{"kg": cj_h - 5, "result": "good"}, {"kg": cj_h, "result": "good"}, {"kg": cj_h + 4, "result": "fail"}],
                    "best_cj": cj_h,
                    "total": tot_h, "sinclair_points": round(tot_h * 1.54, 1), "medal": "GOLD"
                },
                {
                    "rank": 2, "name": lifter_a, "team": away_club["name"], "body_weight": 48.9 if "Women" in cat else 72.8,
                    "snatch_attempts": [{"kg": snatch_a - 3, "result": "good"}, {"kg": snatch_a, "result": "good"}, {"kg": snatch_a + 3, "result": "fail"}],
                    "best_snatch": snatch_a,
                    "cj_attempts": [{"kg": cj_a - 4, "result": "good"}, {"kg": cj_a, "result": "good"}, {"kg": cj_a + 4, "result": "fail"}],
                    "best_cj": cj_a,
                    "total": tot_a, "sinclair_points": round(tot_a * 1.49, 1), "medal": "SILVER"
                }
            ]
        }
    elif "boxing" in sport.lower():
        w_class = "Elite Women's 51kg Flyweight" if match_idx % 2 == 1 else "Elite Men's 57kg Featherweight"
        boxer_h = "M. C. Mary Kom" if "Mary" in home_club["name"] else f"{np.random.choice(FEMALE_FIRST_NAMES if 'Women' in w_class else MALE_FIRST_NAMES)} {np.random.choice(MEITEI_SURNAMES)}"
        boxer_a = f"{np.random.choice(FEMALE_FIRST_NAMES if 'Women' in w_class else MALE_FIRST_NAMES)} {np.random.choice(NAGA_TANGKHUL_SURNAMES)}"
        
        dec = "Unanimous Decision (5:0)"
        scoreline = f"{boxer_h} def. {boxer_a} by {dec}"
        winner = home_club["name"]

        details = {
            "sport": "Boxing",
            "weight_class": w_class,
            "referee": "H. Chaoba Singh (AIBA 3-Star Referee)",
            "decision": dec,
            "boxer_red": {"name": boxer_h, "team": home_club["name"], "corner": "Red Corner"},
            "boxer_blue": {"name": boxer_a, "team": away_club["name"], "corner": "Blue Corner"},
            "judges_scorecards": [
                {"judge": "Judge 1 (Imphal)", "r1": "10-9", "r2": "10-9", "r3": "10-9", "total": "30-27"},
                {"judge": "Judge 2 (Thoubal)", "r1": "10-9", "r2": "10-9", "r3": "10-9", "total": "30-27"},
                {"judge": "Judge 3 (Bishnupur)", "r1": "10-9", "r2": "9-10", "r3": "10-9", "total": "29-28"},
                {"judge": "Judge 4 (Ukhrul)", "r1": "10-9", "r2": "10-9", "r3": "10-9", "total": "30-27"},
                {"judge": "Judge 5 (Churachandpur)", "r1": "10-9", "r2": "10-9", "r3": "10-9", "total": "30-27"}
            ],
            "punch_stats": {
                "home": {"total_landed": 68, "total_thrown": 142, "jabs": "34/72", "power_punches": "34/70", "accuracy": "48%"},
                "away": {"total_landed": 42, "total_thrown": 128, "jabs": "20/66", "power_punches": "22/62", "accuracy": "33%"}
            },
            "round_summaries": [
                "Round 1: Red corner established range with stiff left jabs and inside upper cuts.",
                "Round 2: Fierce trade of power hooks; Blue corner landed clean straight right.",
                "Round 3: High volume flurries from Red corner to seal unanimous cards."
            ]
        }
    elif "archery" in sport.lower():
        archer_h = "Bombayla Devi Laishram" if "MAA" in home_club["short_name"] else f"{np.random.choice(FEMALE_FIRST_NAMES)} {np.random.choice(MEITEI_SURNAMES)}"
        archer_a = f"{np.random.choice(FEMALE_FIRST_NAMES)} {np.random.choice(NAGA_TANGKHUL_SURNAMES)}"
        scoreline = "6 - 2 (Set Points: 28-26, 27-29, 29-27, 28-26)"
        winner = home_club["name"]

        details = {
            "sport": "Archery",
            "discipline": "70m Olympic Recurve Individual Target",
            "weather": "Wind 2.4 m/s NW, Temp 22°C, Humidity 54%",
            "target_distance": "70 Metres (122cm Target Face)",
            "archer_a": archer_h,
            "archer_b": archer_a,
            "sets": [
                {"set": 1, "home_arrows": [10, 9, 9], "home_total": 28, "away_arrows": [9, 9, 8], "away_total": 26, "home_pts": 2, "away_pts": 0},
                {"set": 2, "home_arrows": [9, 9, 9], "home_total": 27, "away_arrows": [10, 10, 9], "away_total": 29, "home_pts": 0, "away_pts": 2},
                {"set": 3, "home_arrows": [10, 10, 9], "home_total": 29, "away_arrows": [9, 9, 9], "away_total": 27, "home_pts": 2, "away_pts": 0},
                {"set": 4, "home_arrows": [10, 9, 9], "home_total": 28, "away_arrows": [9, 9, 8], "away_total": 26, "home_pts": 2, "away_pts": 0}
            ],
            "stats": {"home_10s": 6, "home_Xs": 3, "away_10s": 3, "away_Xs": 1, "home_avg": 9.33, "away_avg": 9.0}
        }
    elif "sepak" in sport.lower():
        scoreline = "2 - 1 (21-18, 19-21, 21-16)"
        winner = home_club["name"]

        details = {
            "sport": "Sepak Takraw",
            "discipline": "Premier Regu Championship (3 vs 3)",
            "referee": "W. Sanajaoba Singh (ASTAF Official)",
            "sets": [
                {"set": 1, "home": 21, "away": 18, "duration": "19m"},
                {"set": 2, "home": 19, "away": 21, "duration": "24m"},
                {"set": 3, "home": 21, "away": 16, "duration": "18m"}
            ],
            "telemetry": {
                "home": {"spike_kills": 24, "roll_spikes": 15, "sunback_spikes": 9, "service_aces": 5, "blocks": 7},
                "away": {"spike_kills": 19, "roll_spikes": 11, "sunback_spikes": 8, "service_aces": 4, "blocks": 5}
            },
            "lineups": {
                "home": {"tekong": "E. Haridas Singh", "spiker": "Kh. Niken Singh", "feeder": "O. Dorendro Singh"},
                "away": {"tekong": "S. Chongloi", "spiker": "Th. Ronald", "feeder": "M. Linthoiba"}
            }
        }
    elif "hockey" in sport.lower():
        h_score = 3
        a_score = 2
        scoreline = f"{h_score} - {a_score}"
        winner = home_club["name"]

        details = {
            "sport": "Field Hockey",
            "venue_surface": "Poligras Olympic Astroturf",
            "quarters": [
                {"q": "Q1", "home": 1, "away": 0},
                {"q": "Q2", "home": 1, "away": 1},
                {"q": "Q3", "home": 0, "away": 1},
                {"q": "Q4", "home": 1, "away": 0}
            ],
            "penalty_corners": {"home": "7 awarded (2 converted)", "away": "4 awarded (1 converted)"},
            "circle_entries": {"home": 27, "away": 16},
            "possession": {"home": 56, "away": 44},
            "goals": [
                {"minute": "11' (Q1)", "player": "Nilakanta Sharma", "team": home_club["short_name"], "type": "Field Goal"},
                {"minute": "24' (Q2)", "player": "Chinglensana Singh", "team": home_club["short_name"], "type": "PC Dragflick"},
                {"minute": "28' (Q2)", "player": "K. Bidyashagar", "team": away_club["short_name"], "type": "Field Goal"},
                {"minute": "39' (Q3)", "player": "Kothajit Singh", "team": away_club["short_name"], "type": "PC Rebound"},
                {"minute": "54' (Q4)", "player": "Sushila Chanu", "team": home_club["short_name"], "type": "Field Goal"}
            ]
        }
    else:
        scoreline = "Ippon (Harai-Goshi, 2:48)"
        winner = home_club["name"]

        details = {
            "sport": "Judo & Martial Arts",
            "category": "Senior -57kg Championship Bout",
            "mat_referee": "H. Birendra Singh (State A-Grade Mat Official)",
            "contestant_white": {"name": "Linthoi Chanambam" if "Judo" in home_club["name"] else "N. Borish Singh", "club": home_club["name"]},
            "contestant_blue": {"name": "N. Linthoingambi Devi" if "Judo" in away_club["name"] else "S. Tomba Singh", "club": away_club["name"]},
            "winning_technique": "Harai-Goshi (Sweeping Hip Throw)",
            "bout_duration": "2 mins 48 secs",
            "scoring_events": [
                {"time": "1:15", "score": "Waza-ari", "technique": "Seoi-nage (Shoulder Throw)"},
                {"time": "2:48", "score": "Ippon", "technique": "Harai-Goshi (Decisive Throw)"}
            ],
            "penalties_shido": {"white": 0, "blue": 1}
        }

    return {
        "match_code": match_code,
        "tournament_id": tourney_id,
        "tournament_name": tourney["name"],
        "sport": sport,
        "stage": stage,
        "match_date": date_str,
        "venue": venue,
        "home_team_id": home_club["id"],
        "home_team_name": home_club["name"],
        "away_team_id": away_club["id"],
        "away_team_name": away_club["name"],
        "scoreline": scoreline,
        "result_status": "COMPLETED",
        "winner_team_name": winner,
        "details_json": json.dumps(details)
    }

def seed_pending_cadets(cursor):
    """
    Seeds 6 realistic grassroots cadets who have self-registered on the portal
    and uploaded authentic verification documents awaiting Coach/Admin review.
    """
    pending_list = [
        {
            "name": "Khemchand Thokchom",
            "age": 17,
            "gender": "Male",
            "district": "Imphal West",
            "primary_sport": "Boxing",
            "current_club": "Local District Youth Boxing Nursery",
            "khel_id": "KHEL-IND-MN-2026-BOX-9142",
            "user_provided_khel_id": "KHEL-IND-MN-2026-BOX-9142",
            "nsis_id": "NSIS-MN-94102",
            "state_reg_no": "MN-CADET-2026-412",
            "height_cm": 168.0,
            "weight_kg": 54.0,
            "wingspan_cm": 174.0,
            "vertical_jump_cm": 52.0,
            "sprint_30m_sec": 4.15,
            "beep_test_level": 11.8,
            "flexibility_cm": 18.0,
            "composite_score": 88.4,
            "grade": "Grade A",
            "grade_title": "State Academy Standard",
            "badge_color": "#2563eb",
            "ai_prospect_rating": 89.2,
            "ai_breakthrough_probability": "High Breakthrough Prospect (Priority Scout)",
            "peer_rank": 3,
            "benchmark_percentile": 91.5,
            "achievements": "Manipur State Sub-Junior Boxing Gold Medalist (54kg), Best Boxer Trophy 2025",
            "verified_by_sai": 0,
            "verification_status": "PENDING_REVIEW",
            "review_notes": "Grassroots applicant submitted self-registration portal dossier for Khelo India talent battery evaluation and SAI State Academy empanelment.",
            "documents": [
                {"name": "Aadhaar_Card_Verified_Scan.pdf", "type": "Government Identity Proof", "url": "/demo_doc_aadhaar.pdf", "upload_date": "14 Feb 2026", "verified": False},
                {"name": "Manipur_State_Sub_Junior_Gold_Certificate.pdf", "type": "State Sports Certificate", "url": "/demo_doc_sports_cert.pdf", "upload_date": "14 Feb 2026", "verified": False},
                {"name": "Birth_Certificate_Form5_Imphal_West.pdf", "type": "Official Age Verification Form 5", "url": "/demo_doc_birth.pdf", "upload_date": "14 Feb 2026", "verified": False}
            ]
        },
        {
            "name": "Haobam Linthoi Devi",
            "age": 16,
            "gender": "Female",
            "district": "Bishnupur",
            "primary_sport": "Weightlifting",
            "current_club": "Moirang Grassroots Weightlifting Nursery",
            "khel_id": "KHEL-IND-MN-2026-WLT-5521",
            "user_provided_khel_id": "KHEL-IND-MN-2026-WLT-5521",
            "nsis_id": "NSIS-MN-94103",
            "state_reg_no": "MN-CADET-2026-413",
            "height_cm": 150.0,
            "weight_kg": 44.5,
            "wingspan_cm": 152.0,
            "vertical_jump_cm": 48.0,
            "sprint_30m_sec": 4.40,
            "beep_test_level": 10.5,
            "flexibility_cm": 22.0,
            "composite_score": 87.2,
            "grade": "Grade A",
            "grade_title": "State Academy Standard",
            "badge_color": "#2563eb",
            "ai_prospect_rating": 88.0,
            "ai_breakthrough_probability": "State Academy Standard",
            "peer_rank": 4,
            "benchmark_percentile": 89.0,
            "achievements": "Bishnupur District Weightlifting Championship Silver (45kg class)",
            "verified_by_sai": 0,
            "verification_status": "PENDING_REVIEW",
            "review_notes": "Grassroots weightlifting applicant submitted credentials. SAI NCOE Coach review pending.",
            "documents": [
                {"name": "Aadhaar_Haobam_Linthoi.pdf", "type": "Government Identity Proof", "url": "/demo_doc_aadhaar.pdf", "upload_date": "16 Feb 2026", "verified": False},
                {"name": "Bishnupur_District_Silver_Medal_Certificate.pdf", "type": "District Sports Certificate", "url": "/demo_doc_sports_cert.pdf", "upload_date": "16 Feb 2026", "verified": False},
                {"name": "Medical_Fitness_Bishnupur_Hospital.pdf", "type": "Medical Fitness Certificate", "url": "/demo_doc_med.pdf", "upload_date": "16 Feb 2026", "verified": False}
            ]
        },
        {
            "name": "Thanglenlal Haokip",
            "age": 18,
            "gender": "Male",
            "district": "Churachandpur",
            "primary_sport": "Football",
            "current_club": "Tuibong Youth Football Club",
            "khel_id": "KHEL-IND-MN-2026-FBL-3829",
            "user_provided_khel_id": "KHEL-IND-MN-2026-FBL-3829",
            "nsis_id": "NSIS-MN-94104",
            "state_reg_no": "MN-CADET-2026-414",
            "height_cm": 176.0,
            "weight_kg": 66.0,
            "wingspan_cm": 178.0,
            "vertical_jump_cm": 58.0,
            "sprint_30m_sec": 3.92,
            "beep_test_level": 12.6,
            "flexibility_cm": 19.0,
            "composite_score": 89.1,
            "grade": "Grade A",
            "grade_title": "State Academy Standard",
            "badge_color": "#2563eb",
            "ai_prospect_rating": 90.5,
            "ai_breakthrough_probability": "High Breakthrough Prospect (Priority Scout)",
            "peer_rank": 2,
            "benchmark_percentile": 92.8,
            "achievements": "Churachandpur Hill District Inter-High School Football Gold, 8 Goals in 5 matches",
            "verified_by_sai": 0,
            "verification_status": "PENDING_REVIEW",
            "review_notes": "High pace hill district winger prospect. Awaiting AMFA / SAI Grassroots scout sign-off.",
            "documents": [
                {"name": "Aadhaar_Thanglenlal_Haokip.pdf", "type": "Government Identity Proof", "url": "/demo_doc_aadhaar.pdf", "upload_date": "17 Feb 2026", "verified": False},
                {"name": "Hill_District_Inter_School_Gold.pdf", "type": "District Sports Certificate", "url": "/demo_doc_sports_cert.pdf", "upload_date": "17 Feb 2026", "verified": False},
                {"name": "Birth_Certificate_CCPur_Council.pdf", "type": "Official Age Verification Form 5", "url": "/demo_doc_birth.pdf", "upload_date": "17 Feb 2026", "verified": False}
            ]
        },
        {
            "name": "Rinchon Kasar",
            "age": 16,
            "gender": "Female",
            "district": "Ukhrul",
            "primary_sport": "Archery",
            "current_club": "Ukhrul Archery Nursery",
            "khel_id": "KHEL-IND-MN-2026-ARC-7714",
            "user_provided_khel_id": "KHEL-IND-MN-2026-ARC-7714",
            "nsis_id": "NSIS-MN-94105",
            "state_reg_no": "MN-CADET-2026-415",
            "height_cm": 162.0,
            "weight_kg": 52.0,
            "wingspan_cm": 166.0,
            "vertical_jump_cm": 44.0,
            "sprint_30m_sec": 4.35,
            "beep_test_level": 11.2,
            "flexibility_cm": 24.0,
            "composite_score": 86.5,
            "grade": "Grade A",
            "grade_title": "State Academy Standard",
            "badge_color": "#2563eb",
            "ai_prospect_rating": 87.8,
            "ai_breakthrough_probability": "State Academy Standard",
            "peer_rank": 5,
            "benchmark_percentile": 88.5,
            "achievements": "Tangkhul Traditional & Modern Recurve Junior Archery Bronze, State Ranking 6th",
            "verified_by_sai": 0,
            "verification_status": "PENDING_REVIEW",
            "review_notes": "High altitude hill archer with exceptional shoulder steadiness and release consistency.",
            "documents": [
                {"name": "Aadhaar_Rinchon_Kasar.pdf", "type": "Government Identity Proof", "url": "/demo_doc_aadhaar.pdf", "upload_date": "18 Feb 2026", "verified": False},
                {"name": "Ukhrul_Junior_Archery_Bronze_Certificate.pdf", "type": "State Sports Certificate", "url": "/demo_doc_sports_cert.pdf", "upload_date": "18 Feb 2026", "verified": False}
            ]
        },
        {
            "name": "Khangembam Ronald Singh",
            "age": 17,
            "gender": "Male",
            "district": "Thoubal",
            "primary_sport": "Sepak Takraw",
            "current_club": "Thoubal Regu Coaching Cell",
            "khel_id": "KHEL-IND-MN-2026-SPT-4210",
            "user_provided_khel_id": "KHEL-IND-MN-2026-SPT-4210",
            "nsis_id": "NSIS-MN-94106",
            "state_reg_no": "MN-CADET-2026-416",
            "height_cm": 172.0,
            "weight_kg": 62.0,
            "wingspan_cm": 174.0,
            "vertical_jump_cm": 61.0,
            "sprint_30m_sec": 4.02,
            "beep_test_level": 12.1,
            "flexibility_cm": 25.0,
            "composite_score": 85.8,
            "grade": "Grade A",
            "grade_title": "State Academy Standard",
            "badge_color": "#2563eb",
            "ai_prospect_rating": 86.9,
            "ai_breakthrough_probability": "State Academy Standard",
            "peer_rank": 6,
            "benchmark_percentile": 87.0,
            "achievements": "Manipur State School Games Sepak Takraw Silver, Elite Roll Spiker Trainee",
            "verified_by_sai": 0,
            "verification_status": "PENDING_REVIEW",
            "review_notes": "Phenomenal acrobatic flexibility and jump height. Recommended for AMSTA Youth Trials.",
            "documents": [
                {"name": "Aadhaar_Ronald_Singh.pdf", "type": "Government Identity Proof", "url": "/demo_doc_aadhaar.pdf", "upload_date": "19 Feb 2026", "verified": False},
                {"name": "School_Games_Sepak_Takraw_Certificate.pdf", "type": "State Sports Certificate", "url": "/demo_doc_sports_cert.pdf", "upload_date": "19 Feb 2026", "verified": False}
            ]
        },
        {
            "name": "Laishram Malemnganba",
            "age": 18,
            "gender": "Male",
            "district": "Imphal East",
            "primary_sport": "Field Hockey",
            "current_club": "Luwangsangbam Junior Hockey Cell",
            "khel_id": "KHEL-IND-MN-2026-HCK-6302",
            "user_provided_khel_id": "KHEL-IND-MN-2026-HCK-6302",
            "nsis_id": "NSIS-MN-94107",
            "state_reg_no": "MN-CADET-2026-417",
            "height_cm": 175.0,
            "weight_kg": 67.0,
            "wingspan_cm": 176.0,
            "vertical_jump_cm": 55.0,
            "sprint_30m_sec": 3.98,
            "beep_test_level": 12.8,
            "flexibility_cm": 20.0,
            "composite_score": 88.0,
            "grade": "Grade A",
            "grade_title": "State Academy Standard",
            "badge_color": "#2563eb",
            "ai_prospect_rating": 89.4,
            "ai_breakthrough_probability": "High Breakthrough Prospect (Priority Scout)",
            "peer_rank": 3,
            "benchmark_percentile": 90.5,
            "achievements": "Manipur State Sub-Junior Hockey Championship Gold (Central Midfield Playmaker)",
            "verified_by_sai": 0,
            "verification_status": "PENDING_REVIEW",
            "review_notes": "High aerobic stamina and vision. Self-submitted Khel ID for PHAM Academy entrance.",
            "documents": [
                {"name": "Aadhaar_Malemnganba.pdf", "type": "Government Identity Proof", "url": "/demo_doc_aadhaar.pdf", "upload_date": "20 Feb 2026", "verified": False},
                {"name": "Sub_Junior_Hockey_State_Gold.pdf", "type": "State Sports Certificate", "url": "/demo_doc_sports_cert.pdf", "upload_date": "20 Feb 2026", "verified": False},
                {"name": "Age_Affidavit_Executive_Magistrate.pdf", "type": "Official Age Verification Form 5", "url": "/demo_doc_birth.pdf", "upload_date": "20 Feb 2026", "verified": False}
            ]
        }
    ]

    for c in pending_list:
        radar = {
            "explosive_power": round(c["vertical_jump_cm"] * 1.5, 1),
            "speed_agility": round((5.5 - c["sprint_30m_sec"]) * 45, 1),
            "endurance": round(c["beep_test_level"] * 6.5, 1),
            "biomechanical_symmetry": 88.5,
            "flexibility": round(c["flexibility_cm"] * 3.6, 1),
            "tactical_iq": round(c["composite_score"] * 0.96, 1)
        }
        pose = {
            "pose_score": 88.0,
            "symmetry_score": 91.0,
            "movement_notes": ["Grassroots self-assessment telemetry recorded via official video kinematics."]
        }
        recs = [
            {"sport": c["primary_sport"], "affinity_score": round(c["composite_score"], 1), "category": "Olympic Classification"},
            {"sport": "Athletics (Sprints)", "affinity_score": 82.5, "category": "Secondary Discipline"}
        ]
        ai_report = {
            "executive_summary": f"Cadet {c['name']} demonstrates promising talent profile in {c['primary_sport']}. Verification pending official review.",
            "strengths": ["Excellent physical baseline", "District competition exposure"],
            "development_areas": ["Requires formal SAI Academy coaching curriculum"]
        }
        matches = [
            {"date": "10 Jan 2026", "tournament": "Manipur District Grassroots Trials", "opponent": "Official Battery", "result": f"Score: {c['composite_score']}", "stat": f"Jump: {c['vertical_jump_cm']}cm, Sprint: {c['sprint_30m_sec']}s"}
        ]
        season_stats = {
            "district_evaluations": 1,
            "composite_score": c["composite_score"],
            "status": "Pending State Verification"
        }

        cursor.execute("""
            INSERT INTO athletes (
                khel_id, nsis_id, state_reg_no,
                name, age, gender, district, primary_sport,
                current_club, team_id, former_clubs_json, match_history_json, season_stats_json,
                height_cm, weight_kg, wingspan_cm, vertical_jump_cm, sprint_30m_sec, beep_test_level, flexibility_cm,
                composite_score, grade, grade_title, badge_color,
                ai_prospect_rating, ai_breakthrough_probability, peer_rank, benchmark_percentile,
                achievements, verified_by_sai,
                radar_json, pose_json, sports_matrix_json, ai_report_json, media_url,
                profile_photo_url, documents_json, verification_status, user_provided_khel_id, review_notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            c["khel_id"], c["nsis_id"], c["state_reg_no"],
            c["name"], c["age"], c["gender"], c["district"], c["primary_sport"],
            c["current_club"], None, json.dumps(["Local District Youth Cell"]), json.dumps(matches), json.dumps(season_stats),
            c["height_cm"], c["weight_kg"], c["wingspan_cm"], c["vertical_jump_cm"], c["sprint_30m_sec"], c["beep_test_level"], c["flexibility_cm"],
            c["composite_score"], c["grade"], c["grade_title"], c["badge_color"],
            c["ai_prospect_rating"], c["ai_breakthrough_probability"], c["peer_rank"], c["benchmark_percentile"],
            c["achievements"], c["verified_by_sai"],
            json.dumps(radar), json.dumps(pose), json.dumps(recs), json.dumps(ai_report),
            "/demo_athlete.jpg", "/demo_athlete.jpg", json.dumps(c["documents"]),
            c["verification_status"], c["user_provided_khel_id"], c["review_notes"]
        ))

# ==============================================================================
# 7. MAIN MULTI-SPORT SEEDING PIPELINE
# ==============================================================================

def run_synthetic_generation():
    print("=" * 80)
    print("Generating Comprehensive Manipur Multi-Sport Ecosystem (All 7 Sports)...")
    print("=" * 80)

    conn = get_db_connection()
    cursor = conn.cursor()

    # Reset tables
    cursor.execute("DROP TABLE IF EXISTS matches;")
    cursor.execute("DROP TABLE IF EXISTS tournaments;")
    cursor.execute("DROP TABLE IF EXISTS teams;")
    cursor.execute("DROP TABLE IF EXISTS athletes;")
    cursor.execute("DROP TABLE IF EXISTS users;")
    conn.commit()
    conn.close()

    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Seed Users
    users = [
        ("athlete", "password123", "athlete", "Saikhom Mirabai Chanu", "Imphal East", "mirabai.chanu@olympic.gov.in"),
        ("coach", "coach123", "coach", "Coach L. Ibomcha Singh (Dronacharya Awardee, SAI Imphal)", "Imphal West", "ibomcha.sai@gov.in"),
        ("admin", "admin123", "admin", "Director of Youth Affairs & Sports, Govt. of Manipur", "Imphal West", "director.yas@manipur.gov.in")
    ]
    for u in users:
        cursor.execute("INSERT INTO users (username, password, role, name, district, email) VALUES (?, ?, ?, ?, ?, ?)", u)

    # 2. Seed Teams & Clubs across ALL 7 sports
    print(f"\n[1/4] Generating {len(MULTI_SPORT_CLUBS)} Multi-Sport Clubs/Academies with historical derbies...")
    club_id_map = {}
    for club in MULTI_SPORT_CLUBS:
        season_stats, historical_matches = generate_club_matches_and_season(club, MULTI_SPORT_CLUBS)

        cursor.execute("""
            INSERT INTO teams (
                name, short_name, district, founded_year, home_ground,
                primary_sport, division, head_coach,
                trophies_won_json, season_stats_json, historical_matches_json, logo_url
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            club["name"], club["short_name"], club["district"], club["founded_year"], club["home_ground"],
            club["primary_sport"], club["division"], club["head_coach"],
            json.dumps(club["trophies_won"]), json.dumps(season_stats),
            json.dumps(historical_matches), "/demo_athlete.jpg"
        ))
        club_id_map[club["name"]] = cursor.lastrowid
        club["id"] = cursor.lastrowid

    # 3. Seed Premier Multi-Sport Manipur Tournaments & Comprehensive Matches
    print(f"[2/4] Seeding {len(MULTI_SPORT_TOURNAMENTS)} Premier Manipur Tournaments and authentic matches across all 7 sports...")
    total_matches_seeded = 0
    for tourney in MULTI_SPORT_TOURNAMENTS:
        sport = tourney["sport"]
        cursor.execute("""
            INSERT INTO tournaments (
                name, short_name, edition, organizer, sport, founded_year,
                venue, current_champion, trophy_details, tournament_format, recent_matches_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            tourney["name"], tourney["short_name"], tourney["edition"], tourney["organizer"],
            tourney["sport"], tourney["founded_year"], tourney["venue"],
            tourney["current_champion"], tourney["trophy_details"],
            tourney["tournament_format"], json.dumps([])
        ))
        tourney_id = cursor.lastrowid

        # Generate 3 to 4 comprehensive matches for this tournament
        sport_clubs = [c for c in MULTI_SPORT_CLUBS if c["primary_sport"].strip().lower() == sport.strip().lower()]
        if len(sport_clubs) >= 2:
            stages_info = [
                ("Championship Final", 1, sport_clubs[0], sport_clubs[1], "18 Jan 2026"),
                ("Semifinal 1", 2, sport_clubs[0], sport_clubs[2] if len(sport_clubs) > 2 else sport_clubs[1], "14 Jan 2026"),
                ("Semifinal 2", 3, sport_clubs[1], sport_clubs[3] if len(sport_clubs) > 3 else (sport_clubs[2] if len(sport_clubs) > 2 else sport_clubs[0]), "13 Jan 2026"),
                ("Quarterfinal", 4, sport_clubs[2] if len(sport_clubs) > 2 else sport_clubs[0], sport_clubs[3] if len(sport_clubs) > 3 else sport_clubs[1], "09 Jan 2026")
            ]
            tourney_matches_summary = []
            for stage_name, m_idx, h_club, a_club, m_date in stages_info:
                rec = generate_match_record(tourney_id, tourney, stage_name, m_idx, h_club, a_club, m_date)
                cursor.execute("""
                    INSERT INTO matches (
                        match_code, tournament_id, tournament_name, sport, stage,
                        match_date, venue, home_team_id, home_team_name, away_team_id, away_team_name,
                        scoreline, result_status, winner_team_name, details_json
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    rec["match_code"], rec["tournament_id"], rec["tournament_name"], rec["sport"], rec["stage"],
                    rec["match_date"], rec["venue"], rec["home_team_id"], rec["home_team_name"], rec["away_team_id"], rec["away_team_name"],
                    rec["scoreline"], rec["result_status"], rec["winner_team_name"], rec["details_json"]
                ))
                total_matches_seeded += 1
                tourney_matches_summary.append({
                    "match_code": rec["match_code"],
                    "match": stage_name,
                    "teams": f"{h_club['short_name']} vs {a_club['short_name']}",
                    "score": rec["scoreline"],
                    "date": m_date,
                    "venue": rec["venue"],
                    "winner": rec["winner_team_name"]
                })
            cursor.execute("UPDATE tournaments SET recent_matches_json = ? WHERE id = ?", (json.dumps(tourney_matches_summary), tourney_id))

    # 4. Generate Athletes Linked to Each Team
    print("[3/3] Generating real stars and statistical squads for all 32 clubs...")
    
    # Real Star Mapping to Academies
    REAL_STARS = [
        # Weightlifting
        {"team_name": "SAI National Centre of Excellence (NCOE) Weightlifting Academy", "name": "Saikhom Mirabai Chanu", "age": 30, "gender": "Female", "score": 99.4, "role": "Olympic Silver Medalist & World Champion (49kg)"},
        {"team_name": "SAI National Centre of Excellence (NCOE) Weightlifting Academy", "name": "S. Bindyarani Devi", "age": 25, "gender": "Female", "score": 94.6, "role": "Commonwealth Silver Medalist (55kg)"},
        {"team_name": "Manipur Weightlifting Association (MWA) High-Performance Centre", "name": "K. Sanjita Chanu", "age": 30, "gender": "Female", "score": 93.8, "role": "2x Commonwealth Games Gold Medalist (53kg)"},
        {"team_name": "Manipur Weightlifting Association (MWA) High-Performance Centre", "name": "Nongthombam Bidyasagar Singh", "age": 22, "gender": "Male", "score": 91.2, "role": "Senior National Champion (67kg)"},
        {"team_name": "Sports Authority of India Training Centre (STC) Utlou", "name": "Mayengbam Ronaldo Singh", "age": 20, "gender": "Male", "score": 90.8, "role": "National Junior Gold Medalist (73kg)"},
        {"team_name": "Kakching SAG Weightlifting Training Hub", "name": "Lhingkim Haokip", "age": 16, "gender": "Female", "score": 89.2, "role": "Hill District Grassroots Prodigy (45kg)"},

        # Boxing
        {"team_name": "Mary Kom Regional Boxing Foundation (MKRBF)", "name": "M. C. Mary Kom", "age": 41, "gender": "Female", "score": 99.8, "role": "6x World Champion & Olympic Medalist (51kg)"},
        {"team_name": "Mary Kom Regional Boxing Foundation (MKRBF)", "name": "Chungreng Koren", "age": 28, "gender": "Male", "score": 94.8, "role": "MFN Bantamweight Champion / Combat Powerhouse"},
        {"team_name": "SAI NCOE Takyel Boxing Academy", "name": "Laishram Sarita Devi", "age": 42, "gender": "Female", "score": 96.2, "role": "World Champion & Asian Games Gold Medalist (60kg)"},
        {"team_name": "SAI NCOE Takyel Boxing Academy", "name": "Thokchom Nanao Singh", "age": 33, "gender": "Male", "score": 92.4, "role": "World Youth Champion (48kg)"},
        {"team_name": "Manipur Amateur Boxing Association (MABA) Centre", "name": "Haobam James Singh", "age": 19, "gender": "Male", "score": 88.6, "role": "State Senior Champion (54kg)"},
        {"team_name": "Churachandpur Boxing Ring & Sports Academy", "name": "T. Grace Gangte", "age": 17, "gender": "Female", "score": 87.4, "role": "Hill District Youth Champion (52kg)"},

        # Archery
        {"team_name": "Manipur Archery Association (MAA) Training Hub", "name": "Bombayla Devi Laishram", "age": 39, "gender": "Female", "score": 96.0, "role": "Olympian, Arjuna Awardee (Recurve 70m)"},
        {"team_name": "Assam Rifles Archery Academy (ARAA)", "name": "Paonam Lily Chanu", "age": 26, "gender": "Female", "score": 94.2, "role": "World Cup Medalist (Compound 50m)"},
        {"team_name": "SAI NCOE Archery Centre Khuman Lampak", "name": "Priyanshu Moirangthem", "age": 19, "gender": "Male", "score": 91.0, "role": "Junior National Champion (Recurve 70m)"},
        {"team_name": "Ukhrul Grassroots Archery Unit", "name": "R. Ningrei Shimray", "age": 16, "gender": "Male", "score": 88.8, "role": "Hill District High-Altitude Prodigy (Recurve)"},

        # Judo & Wushu
        {"team_name": "SAI NCOE Judo Centre of Excellence", "name": "Linthoi Chanambam", "age": 18, "gender": "Female", "score": 99.2, "role": "World Cadet Judo Champion (Historic 1st for India, 57kg)"},
        {"team_name": "Mayang Imphal Judo Academy (MIJA)", "name": "N. Linthoingambi Devi", "age": 18, "gender": "Female", "score": 93.6, "role": "Senior National Judo Champion (52kg)"},
        {"team_name": "Mayai Lambi Sports Academy (MLSA) Wushu & Martial Arts", "name": "Yumnam Sanathoi Devi", "age": 33, "gender": "Female", "score": 95.8, "role": "World Wushu Silver & Asian Games Bronze Medalist (52kg Sanda)"},
        {"team_name": "Manipur Judo Association (MJA) Central Dojo", "name": "Khundrakpam Borish Singh", "age": 21, "gender": "Male", "score": 89.6, "role": "State Judo Champion (66kg)"},

        # Sepak Takraw
        {"team_name": "All Manipur Sepak Takraw Association (AMSTA) Elite Academy", "name": "Khangembam Niken Singh", "age": 28, "gender": "Male", "score": 95.2, "role": "National Spiker & Asian Games Bronze Medalist"},
        {"team_name": "All Manipur Sepak Takraw Association (AMSTA) Elite Academy", "name": "Elangbam Haridas Singh", "age": 27, "gender": "Male", "score": 93.8, "role": "Indian National Team Tekong (Server)"},
        {"team_name": "Social Union Club (SUC) Sepak Takraw Division", "name": "Oinam Dorendro Singh", "age": 23, "gender": "Male", "score": 90.4, "role": "State Champion Feeder / Setter"},
        {"team_name": "SAI STC Sepak Takraw Centre Khuman Lampak", "name": "Seigouthang Chongloi", "age": 18, "gender": "Male", "score": 89.0, "role": "Hill District Spiker Prospect"},

        # Field Hockey
        {"team_name": "Posterior Hockey Academy Manipur (PHAM)", "name": "Nilakanta Sharma", "age": 29, "gender": "Male", "score": 98.2, "role": "Tokyo 2020 Olympic Bronze Medalist (Central Midfielder)"},
        {"team_name": "Posterior Hockey Academy Manipur (PHAM)", "name": "Chinglensana Singh Kangujam", "age": 32, "gender": "Male", "score": 94.0, "role": "Olympian & National Halfback"},
        {"team_name": "Hockey Manipur State Development XI", "name": "Kothajit Singh Khadangbam", "age": 32, "gender": "Male", "score": 94.4, "role": "Olympian & National Defender"},
        {"team_name": "SAI Takyel Hockey Academy", "name": "Puyam Sushila Chanu", "age": 32, "gender": "Female", "score": 95.4, "role": "Olympian & Former Indian Women's Captain"},

        # Football
        {"team_name": "NEROCA FC (North Eastern Re-Organising Cultural Association)", "name": "Suresh Singh Wangjam", "age": 24, "gender": "Male", "score": 95.6, "role": "Indian National Team Central Midfielder"},
        {"team_name": "TRAU FC (Tiddim Road Athletic Union)", "name": "Jeakson Singh Thounaojam", "age": 23, "gender": "Male", "score": 94.8, "role": "India World Cup Goalscorer & National Midfielder"},
        {"team_name": "KLASA FC Keinou", "name": "Dheeraj Singh Moirangthem", "age": 24, "gender": "Male", "score": 95.0, "role": "AFC Champions League Star Goalkeeper"},
        {"team_name": "Muvanlai Athletics (Kangpokpi / Sadar Hills)", "name": "V. Paominthang Haokip", "age": 17, "gender": "Male", "score": 89.6, "role": "Hill District Breakthrough Striker"}
    ]

    all_generated_athletes = []
    athlete_idx = 1

    # First, generate athletes for each team
    # 1-2 real stars if available, plus 2-3 squad players per club so every club has 3-4 athletes
    for team in MULTI_SPORT_CLUBS:
        team_stars = [s for s in REAL_STARS if s["team_name"] == team["name"]]
        
        # Add real stars
        for star in team_stars:
            ath = generate_athlete_for_team(athlete_idx, team, is_star=True, star_info=star)
            all_generated_athletes.append(ath)
            athlete_idx += 1

        # Add 2 squad players per club
        num_squad = 3 if len(team_stars) == 0 else 2
        for _ in range(num_squad):
            ath = generate_athlete_for_team(athlete_idx, team, is_star=False)
            all_generated_athletes.append(ath)
            athlete_idx += 1

    # Insert into Database
    for ath in all_generated_athletes:
        sample_docs = [
            {"name": "Official_SAI_Empanelment_Card.pdf", "type": "SAI Verified Identity Document", "url": "/demo_doc_aadhaar.pdf", "upload_date": "2025-08-10", "verified": True},
            {"name": "State_Association_License.pdf", "type": "Manipur State Association License", "url": "/demo_doc_sports_cert.pdf", "upload_date": "2025-08-10", "verified": True}
        ]
        cursor.execute("""
            INSERT INTO athletes (
                khel_id, nsis_id, state_reg_no,
                name, age, gender, district, primary_sport,
                current_club, team_id, former_clubs_json, match_history_json, season_stats_json,
                height_cm, weight_kg, wingspan_cm, vertical_jump_cm, sprint_30m_sec, beep_test_level, flexibility_cm,
                composite_score, grade, grade_title, badge_color,
                ai_prospect_rating, ai_breakthrough_probability, peer_rank, benchmark_percentile,
                achievements, verified_by_sai,
                radar_json, pose_json, sports_matrix_json, ai_report_json, media_url,
                profile_photo_url, documents_json, verification_status, user_provided_khel_id, review_notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            ath['khel_id'], ath['nsis_id'], ath['state_reg_no'],
            ath['name'], ath['age'], ath['gender'], ath['district'], ath['primary_sport'],
            ath['current_club'], ath['team_id'], json.dumps(ath['former_clubs']), json.dumps(ath['match_history']), json.dumps(ath['season_stats']),
            ath['height_cm'], ath['weight_kg'], ath['wingspan_cm'], ath['vertical_jump_cm'], ath['sprint_30m_sec'], ath['beep_test_level'], ath['flexibility_cm'],
            ath['composite_score'], ath['grade'], ath['grade_title'], ath['badge_color'],
            ath['ai_prospect_rating'], ath['ai_breakthrough_probability'], ath['peer_rank'], ath['benchmark_percentile'],
            ath['achievements'], 1,
            json.dumps(ath['radar_metrics']),
            json.dumps(ath['pose_metrics']),
            json.dumps(ath['top_recommended_sports']),
            json.dumps(ath['ai_report']),
            ath['media_url'],
            ath['media_url'],
            json.dumps(sample_docs),
            "APPROVED",
            ath['khel_id'],
            "Verified by SAI / Directorate of Sports state selection panel."
        ))

    # Seed 6 Grassroots Pending Review Cadets with Uploaded Verification Documents
    print(f"[4/4] Seeding self-registered cadets with uploaded credentials for Coach/Admin Review Queue...")
    seed_pending_cadets(cursor)

    conn.commit()
    conn.close()

    print(f"\n[SUCCESS] Successfully seeded Manipur Multi-Sport Database:")
    print(f"  - {len(MULTI_SPORT_CLUBS)} Multi-Sport Clubs & Academies across 7 Olympic Disciplines")
    print(f"  - {len(MULTI_SPORT_TOURNAMENTS)} Premier Manipur Tournaments")
    print(f"  - ~{len(MULTI_SPORT_TOURNAMENTS) * 4} Match Fixtures across all sports in 'matches' table")
    print(f"  - {len(all_generated_athletes)} Real & Statistical Cadets linked directly to their clubs")
    print(f"  - 6 Self-Registered Cadets in 'PENDING_REVIEW' verification queue with uploaded documents")
    print("=" * 80)

if __name__ == "__main__":
    run_synthetic_generation()
