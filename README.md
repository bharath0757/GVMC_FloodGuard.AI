<div align="center">
  <img src="https://via.placeholder.com/200x200?text=HackYatra+Logo" alt="HackYatra Logo" width="200" height="200">

# HackYatra 🚀

**Empowering Student Innovators to Solve Real-World Civic Challenges at Scale.**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg?style=for-the-badge)](https://github.com/GVMC/HackYatra/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Contributors](https://img.shields.io/github/contributors/GVMC/HackYatra?style=for-the-badge)](https://github.com/GVMC/HackYatra/graphs/contributors)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](#contributing)
</div>

---

HackYatra is a premier, large-scale civic innovation platform designed to bridge the Greater Visakhapatnam Municipal Corporation (GVMC) with bright student innovators. By curating real-world civic problems—like pothole detection, solid waste management, water supply optimization, and drainage monitoring—HackYatra provides an ecosystem where students can form teams, build solutions, and deploy impactful tech.

Built to scale for **100,000+ concurrent users**, HackYatra leverages modern web technologies and state-of-the-art AI to streamline team formation, solution judging, and project development.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)
- [Team & Contact](#-team--contact)
- [Acknowledgments](#-acknowledgments)

---

## ✨ Features

Our MVP is packed with tools for students, mentors, and administrators:

- **🔐 Robust Authentication:** Secure, scalable login and RBAC (Role-Based Access Control) for Students, Mentors, and Admins.
- **📋 Problem Browsing:** Interactive dashboard to explore live civic issues posted by GVMC.
- **🤝 AI-Powered Team Formation:** Smart algorithms to match students based on complementary skills and interests.
- **💡 Idea & Solution Submission:** Seamless pipelines for submitting pitches, prototypes, and code repositories.
- **🧠 AI Assistance:** Built-in recommendations, idea generation workflows, and automated code reviews.
- **👩‍🏫 Mentorship Portal:** Dedicated spaces for mentors to review submissions and provide actionable feedback.
- **📈 Progress Tracking:** Real-time dashboards visualizing team milestones and project health.
- **⚖️ Judging & Evaluation:** Automated rubrics and manual scoring systems for final evaluations.
- **🏆 Live Leaderboard:** Dynamic ranking system fostering healthy competition among participants.
- **💬 Community Forums:** Discussion boards for troubleshooting, networking, and announcements.
- **⚙️ Admin Panel:** Comprehensive command center for GVMC officials to manage users, problems, and events.

---

## 🛠 Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

- **Frontend:** Next.js (React), Tailwind CSS
- **Backend:** Python, FastAPI
- **Database:** PostgreSQL (Primary), Redis (Caching & Session management)
- **AI Integration:** OpenAI / Custom HuggingFace Models
- **Infrastructure:** Docker, Kubernetes (for handling 100K+ concurrent users)

---

## 🏗 System Architecture

```mermaid
graph TD
    User([Students / Mentors / Admins]) --> |HTTPS| LB[Cloudflare Load Balancer / CDN]
    LB --> FE[Next.js Frontend Cluster]
    FE --> |REST & WebSockets| API[API Gateway]
    API --> BE1[FastAPI Auth Service]
    API --> BE2[FastAPI Core Service]
    API --> BE3[FastAPI AI Service]

    BE1 --> DB[(PostgreSQL)]
    BE2 --> DB[(PostgreSQL)]
    BE2 --> Cache[(Redis Cache)]
    BE3 --> AI_Models[AI Inference Engine]

    subgraph Data Layer
        DB
        Cache
    end
```

---

## 🚀 Getting Started

Follow these steps to set up the HackYatra platform locally for development.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [Python](https://www.python.org/) (v3.10 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v14 or higher)
- [Redis](https://redis.io/) (Local or Docker)

### Installation

**1. Clone the repository:**

```bash
git clone https://github.com/GVMC/HackYatra.git
cd HackYatra
```

**2. Backend Setup (FastAPI):**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
alembic upgrade head      # Run database migrations
uvicorn main:app --reload
```

_The backend will be available at `http://localhost:8000`_

**3. Frontend Setup (Next.js):**

```bash
cd frontend
npm install
npm run dev
```

_The frontend will be available at `http://localhost:3000`_

---

## 🔐 Environment Variables

Create `.env` files in both `frontend` and `backend` directories based on the `.env.example` provided.

**Backend (`backend/.env`):**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/hackyatra
REDIS_URL=redis://localhost:6379/0
JWT_SECRET_KEY=your_super_secret_key
AI_API_KEY=your_openai_or_custom_api_key
CORS_ORIGINS=http://localhost:3000
```

**Frontend (`frontend/.env.local`):**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

---

## 📁 Project Structure

```text
HackYatra/
├── frontend/                # Next.js Application
│   ├── public/              # Static assets (images, icons)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Next.js routes/pages
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Helper functions & API clients
│   └── package.json
│
├── backend/                 # FastAPI Application
│   ├── alembic/             # Database migrations
│   ├── app/
│   │   ├── api/             # API routing and endpoints
│   │   ├── core/            # Config, security, and constants
│   │   ├── models/          # SQLAlchemy DB models
│   │   ├── schemas/         # Pydantic validation schemas
│   │   └── services/        # Business logic and AI integrations
│   ├── main.py              # Application entry point
│   └── requirements.txt
│
├── docs/                    # Additional Architecture & API Docs
├── scripts/                 # CI/CD and DB seeding scripts
├── docker-compose.yml       # Local deployment setup
└── README.md
```

---

## 📚 API Documentation

Once the backend is running locally, you can access the interactive API documentation automatically generated by FastAPI:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

---

## 🤝 Contributing

We welcome contributions from the community to make HackYatra better!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read our [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👥 Team & Contact

**HackYatra Core Team**

- [Name/Role] - [@TwitterHandle] - email@example.com
- [Name/Role] - [@TwitterHandle] - email@example.com

**Project Link:** [https://github.com/GVMC/HackYatra](https://github.com/GVMC/HackYatra)

---

## 🙏 Acknowledgments

- **GVMC** for providing the platform and real-world problem statements.
- **Open Source Community** for the incredible tools that power this platform.
- **Mentors & Evaluators** for their time and guidance.
