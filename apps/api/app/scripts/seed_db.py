from __future__ import annotations

import asyncio
import random
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from sqlalchemy import select

from app.core.security import get_password_hash
from app.db.session import AsyncSessionLocal
from app.models.alert import Alert
from app.models.report import FloodReport
from app.models.risk_zone import RiskZone
from app.models.shelter import Shelter
from app.models.user import User
from app.models.weather import WeatherSnapshot

WARDS = [
    ("Gajuwaka Industrial Zone", 14, 92, "Critical", 84000, 3.2, 68.0, 54.2),
    ("One Town Old City", 8, 88, "Critical", 112000, 2.8, 58.0, 49.0),
    ("Maharanipeta Coastal Belt", 3, 84, "Critical", 76000, 4.1, 45.0, 46.5),
    ("Sheela Nagar Lowlands", 22, 81, "Critical", 63000, 2.5, 52.0, 51.0),
    ("Seethammadhara", 11, 74, "High", 95000, 8.5, 28.0, 38.2),
    ("Muralinagar Drainage Basin", 16, 71, "High", 68000, 6.2, 34.0, 41.0),
    ("Dwaraka Nagar", 5, 65, "High", 104000, 11.0, 18.0, 32.5),
    ("Gopalapatnam", 19, 58, "Medium", 89000, 14.2, 12.0, 28.0),
    ("MVP Colony", 2, 52, "Medium", 120000, 16.5, 8.0, 24.5),
    ("Pendurthi Foothills", 25, 42, "Medium", 78000, 22.0, 5.0, 21.0),
    ("Rushikonda IT Park Area", 1, 28, "Low", 45000, 38.0, 2.0, 16.0),
    ("Simhachalam Ridge", 30, 12, "Very Low", 32000, 115.0, 0.0, 12.0),
    ("Akkayyapalem", 4, 62, "High", 72000, 9.1, 22.0, 35.0),
    ("Kancharapalem", 7, 79, "High", 81000, 5.4, 40.0, 44.0),
    ("Bheemunipatnam Coastal", 10, 83, "Critical", 54000, 3.0, 48.0, 48.0),
]


async def seed_data():
    async with AsyncSessionLocal() as db:
        # 1. Seed 15 Risk Zones
        risk_zones = []
        for name, num, score, cat, pop, elev, water, rain in WARDS:
            stmt = select(RiskZone).where(RiskZone.ward_number == num)
            res = await db.execute(stmt)
            if not res.scalar_one_or_none():
                rz = RiskZone(
                    ward_number=num,
                    ward_name=name,
                    risk_score=score,
                    risk_category=cat,
                    population=pop,
                    elevation_meters=elev,
                    water_level_cm=water,
                    rainfall_mm_hr=rain,
                    active_alerts_count=1 if cat == "Critical" else 0,
                )
                db.add(rz)
                risk_zones.append(rz)
        await db.commit()

        # 2. Seed 50 Users
        default_pw = get_password_hash("Password123!")
        users = []

        # Admin & Officers
        admin = User(
            email="admin@floodguard.gov.in",
            password_hash=default_pw,
            full_name="Admin Director",
            role="admin",
        )
        officer = User(
            email="officer@gvmc.gov.in",
            password_hash=default_pw,
            full_name="Dr. Suresh Kumar",
            role="government",
            phone="+91 891 270 4000",
        )
        db.add(admin)
        db.add(officer)
        users.extend([admin, officer])

        for i in range(1, 49):
            email = f"citizen_{i}@example.com"
            stmt = select(User).where(User.email == email)
            res = await db.execute(stmt)
            if not res.scalar_one_or_none():
                role = "government" if i <= 5 else "citizen"
                u = User(
                    email=email,
                    password_hash=default_pw,
                    full_name=f"Citizen User {i}",
                    role=role,
                    language_pref=random.choice(["en", "te", "hi"]),
                    phone=f"+91 98480 {10000 + i}",
                )
                db.add(u)
                users.append(u)
        await db.commit()

        # Re-query users to get assigned IDs
        stmt = select(User)
        res = await db.execute(stmt)
        all_users = res.scalars().all()

        # 3. Seed 25 Shelters
        shelters_data = [
            (
                "GVMC High School Relief Center",
                "Gajuwaka Industrial Zone",
                "Main Rd, Ward 14",
                1200,
                1050,
                "+91 891 270 4123",
                True,
                17.6868,
                83.2185,
            ),
            (
                "St. Aloysius High School Shelter",
                "One Town Old City",
                "Beach Rd, Old City",
                800,
                780,
                "+91 891 256 8921",
                True,
                17.7012,
                83.3021,
            ),
            (
                "Andhra University Indoor Stadium",
                "Maharanipeta Coastal Belt",
                "AU Campus",
                3500,
                1820,
                "+91 891 284 4000",
                True,
                17.7289,
                83.3184,
            ),
            (
                "Swarna Bharathi Indoor Arena",
                "Dwaraka Nagar",
                "Resapu vanipalem",
                2500,
                1100,
                "+91 891 275 1122",
                True,
                17.7215,
                83.3045,
            ),
            (
                "Government Junior College Relief Camp",
                "Sheela Nagar Lowlands",
                "Bypass Highway Rd",
                1000,
                980,
                "+91 891 254 9911",
                False,
                17.6954,
                83.2412,
            ),
            (
                "VIMS Super Specialty Complex",
                "Muralinagar Drainage Basin",
                "Hanumanthawaka",
                1500,
                450,
                "+91 891 286 7000",
                True,
                17.7512,
                83.3321,
            ),
        ]
        for idx in range(1, 26):
            if idx <= len(shelters_data):
                s = shelters_data[idx - 1]
                sh = Shelter(
                    name=s[0],
                    ward_name=s[1],
                    address=s[2],
                    capacity=s[3],
                    current_occupancy=s[4],
                    contact_phone=s[5],
                    is_accessible=s[6],
                    lat=s[7],
                    lng=s[8],
                    amenities=["Food Station", "Medical Desk", "Power Backup"],
                )
            else:
                w_name, _, _, _, _, _, _, _ = random.choice(WARDS)
                sh = Shelter(
                    name=f"Community Relief Shelter #{idx}",
                    ward_name=w_name,
                    address=f"Sector {idx}, {w_name}",
                    capacity=random.randint(500, 2000),
                    current_occupancy=random.randint(100, 400),
                    contact_phone=f"+91 891 270 {1000 + idx}",
                    is_accessible=True,
                    lat=17.7 + (idx * 0.01),
                    lng=83.2 + (idx * 0.01),
                )
            db.add(sh)
        await db.commit()

        # 4. Seed 100 Flood Reports
        severities = ["Low", "Medium", "High", "Critical"]
        statuses = ["Pending", "Verified", "Resolved", "Rejected"]
        labels = [
            ["Submerged Road"],
            ["Blocked Drain", "Waterlogging"],
            ["High Water", "Trapped Person"],
            ["Fallen Tree", "Power Hazard"],
        ]

        for i in range(1, 101):
            w_name, _, _, _, _, _, water, _ = random.choice(WARDS)
            u = random.choice(all_users)
            rep = FloodReport(
                user_id=u.id,
                reporter_name=u.full_name,
                ward_name=w_name,
                title=f"Flood Incident Report #{i} - {w_name}",
                description=f"Water accumulation reported in {w_name}. Current level approx {water}cm.",
                severity=random.choice(severities),
                status=random.choice(statuses),
                water_depth_cm=float(random.randint(10, 90)),
                lat=17.68 + (i * 0.001),
                lng=83.21 + (i * 0.001),
                image_url="https://images.unsplash.com/photo-1547683905-f686c993aae5?w=500",
                ai_labels=random.choice(labels),
                ai_confidence=round(random.uniform(0.85, 0.98), 2),
                upvotes=random.randint(1, 50),
            )
            db.add(rep)
        await db.commit()

        # 5. Seed 20 Alerts
        for i in range(1, 21):
            alt = Alert(
                title=f"Emergency Advisory Broadcast #{i}",
                severity=random.choice(
                    ["Information", "Warning", "Severe", "Critical"]
                ),
                affected_wards=[
                    "Gajuwaka (Ward 14)",
                    "One Town (Ward 8)",
                    "Maharanipeta (Ward 3)",
                ],
                message="Heavy rainfall warning issued for coastal wards. Exercise caution near low-lying streams.",
                issued_by="GVMC Flood Control Room",
                active=i <= 5,
            )
            db.add(alt)
        await db.commit()

        # 6. Seed Weather Snapshot
        ws = WeatherSnapshot(
            temperature_c=27.4,
            humidity_percent=89.0,
            rainfall_mm_hr=42.8,
            rainfall_cumulative_24h=184.2,
            wind_speed_kmh=34.5,
            wind_direction="SSW",
            tide_level_m=2.15,
            sea_level_trend="Rising (+0.12m/hr)",
            forecast_summary="Heavy to very heavy rainfall expected in coastal wards.",
        )
        db.add(ws)
        await db.commit()


if __name__ == "__main__":
    asyncio.run(seed_data())
