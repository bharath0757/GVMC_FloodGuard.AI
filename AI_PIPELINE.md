# HackYatra: Comprehensive AI/ML Pipeline Documentation

HackYatra leverages Artificial Intelligence and Machine Learning to provide a personalized, efficient, and highly engaging experience for both students and the Greater Visakhapatnam Municipal Corporation (GVMC). This document details the end-to-end AI architecture, data pipelines, model strategies, and MLOps practices that power HackYatra's intelligent features.

---

## 1. AI Features Overview

The platform incorporates four core AI-driven capabilities:

1.  **Smart Team Matching:** Intelligently pairs students into optimal hackathon teams.
2.  **Hackathon/Problem Recommendation Engine:** Suggests relevant GVMC problem statements to users.
3.  **AI Project Idea Generator:** Brainstorms and evaluates potential solutions for specific problems.
4.  **AI-Assisted Code Review & Submission Analysis:** Automates preliminary evaluation and plagiarism checks for project submissions.

---

## 2. AI Architecture Overview

The HackYatra AI architecture follows a microservices pattern, separating heavy machine learning inference from the core transactional backend.

```mermaid
graph TD
    subgraph Client [Client Applications]
        Web[Web App]
        Mobile[Mobile App]
    end

    subgraph CoreBackend [Core Backend API (Node.js/Spring Boot)]
        Gateway[API Gateway]
        UserSvc[User Service]
        HackSvc[Hackathon Service]
        SubSvc[Submission Service]
    end

    subgraph AIServices [AI Microservices (Python/FastAPI)]
        MatchAPI[Team Matching API]
        RecAPI[Recommendation API]
        GenAPI[Idea Generator API]
        CodeAPI[Code Review API]
    end

    subgraph Models [ML Models & LLMs]
        EmbModel[Embedding Models - SentenceTransformers]
        CollabFilt[Collaborative Filtering]
        LLM[LLM API - Gemini/GPT-4]
        StaticAnalyzer[Static Analysis Tools]
    end

    subgraph DataLayer [Data & Feature Store]
        PG[(PostgreSQL - Relational)]
        Redis[(Redis - Caching)]
        VectorDB[(Vector DB - Pinecone/Milvus)]
        S3[(Object Storage - S3)]
    end

    Client --> Gateway
    Gateway --> UserSvc
    Gateway --> HackSvc
    Gateway --> SubSvc

    UserSvc <--> MatchAPI
    UserSvc <--> RecAPI
    HackSvc <--> RecAPI
    HackSvc <--> GenAPI
    SubSvc <--> CodeAPI

    MatchAPI --> EmbModel
    RecAPI --> CollabFilt
    RecAPI --> EmbModel
    GenAPI --> LLM
    CodeAPI --> LLM
    CodeAPI --> StaticAnalyzer

    MatchAPI <--> VectorDB
    RecAPI <--> VectorDB
    RecAPI <--> PG

    CoreBackend <--> PG
    CoreBackend <--> Redis
```

---

## 3. Data Pipeline and Engineering

The data pipeline processes raw data into features suitable for model training and real-time inference.

### 3.1 Data Collection & Sources
- **User Profiles:** Demographics, self-reported skills, university, interests.
- **Platform Activity:** Problems viewed, hackathons participated in, teams joined, clickstream data.
- **Historical Performance:** Scores from past hackathons, peer reviews, code quality metrics.
- **GVMC Data:** Problem statement descriptions, tags, required technical domains, civic impact goals.

### 3.2 Preprocessing & Feature Engineering
- **Text Data (Profiles, Problem Statements):**
  - Tokenization, stop-word removal.
  - Embedding generation using pre-trained sentence transformers (e.g., `all-MiniLM-L6-v2`) to create dense vector representations of skills and problem descriptions.
- **Categorical Data:** One-hot encoding or learned embeddings for categorical features (e.g., tech stack).
- **Behavioral Data:** TF-IDF or Matrix Factorization on user-problem interaction matrices to build collaborative filtering features.

### 3.3 Feature Store
We utilize a Vector Database (e.g., Pinecone or Milvus) to store user skill embeddings and problem statement embeddings for fast similarity search during real-time inference.

---

## 4. Model Selection and Training Strategy

### 4.1 Smart Team Matching
- **Objective:** Maximize team compatibility and skill complementarity.
- **Input:** User skill vectors, interests, availability, past performance, and specified team roles.
- **Algorithm:**
  - **Phase 1 (Candidate Generation):** Cosine similarity on user embeddings in the Vector DB to find users with overlapping or complementary skills.
  - **Phase 2 (Constraint Optimization):** Apply a matching heuristic or bipartite matching algorithm (e.g., Gale-Shapley variant) considering hard constraints (timezone/availability, team size limits).
- **Training Strategy:** The embeddings are pre-trained but fine-tuned periodically using Triplet Loss based on successful past team formations (teams that scored highly).

### 4.2 Hackathon/Problem Recommendation Engine
- **Objective:** Increase user engagement by showing relevant problems.
- **Algorithm:** Hybrid approach.
  - **Content-Based:** Cosine similarity between the user's skill/interest embedding and the problem statement embedding.
  - **Collaborative Filtering:** Matrix Factorization (e.g., SVD or ALS) based on implicit feedback (views, likes, joins).
  - **Cold Start Handling:** For new users, rely purely on content-based filtering using their onboarding survey data, mixed with popular/trending problems.
- **Training Strategy:** Batch training weekly on the interaction matrix.

### 4.3 AI Project Idea Generator
- **Objective:** Brainstorm starting points for GVMC problems.
- **Algorithm:** Large Language Model (LLM) orchestration (e.g., Google Gemini Pro or OpenAI GPT-4).
- **Pipeline:**
  - **Prompt Engineering:** Inject the GVMC problem context, constraints (budget, timeline), and target demographic into a structured prompt.
  - **Guardrails:** Output validation to ensure the idea is civic-focused, non-offensive, and technically structured.
  - **Scoring:** The LLM is prompted to self-score the generated ideas based on Feasibility, Impact, and Innovation before presenting them to the user.

### 4.4 AI-Assisted Code Review / Submission Analysis
- **Objective:** Provide automated preliminary scoring and feedback.
- **Pipeline:**
  - **Static Analysis:** Run tools (e.g., SonarQube, ESLint, Pylint) to extract cyclomatic complexity, code smells, and security vulnerabilities.
  - **Plagiarism Detection:** Compute AST (Abstract Syntax Tree) fingerprints and compare submissions using Jaccard similarity or tools like MOSS.
  - **LLM Assessment:** Feed the problem statement and a summary of the codebase to an LLM to assess "Innovation" and "Completeness".
- **Output:** A composite preliminary score and a markdown feedback report for human judges to review.

---

## 5. API Integration

AI services are exposed via internal REST/gRPC APIs built with FastAPI (Python) to integrate with the core backend.

- **Endpoint Example (`/api/v1/ai/match`):**
  - **Request:** `{"user_id": "123", "required_skills": ["react", "node"], "limit": 5}`
  - **Response:** `{"matches": [{"user_id": "456", "score": 0.92, "reason": "High skill overlap"}]}`
- The core backend handles authentication, authorization, and caching (Redis) of AI API responses to reduce load on the ML models.

---

## 6. MLOps Pipeline

We implement standard MLOps practices to ensure model reliability.

```mermaid
graph LR
    Dev[Data Scientists] --> Git[Version Control]
    Git --> CI[CI/CD Pipeline (GitHub Actions)]
    CI --> Train[Model Training Job]
    Train --> Registry[Model Registry (MLflow)]
    Registry --> CD[Continuous Deployment]
    CD --> Prod[Production Inference Servers]
    Prod --> Monitor[Monitoring & Logging]
    Monitor -.->|Concept Drift Alert| Train
```

- **Model Registry:** MLflow is used to track experiments, parameters, and model versions.
- **A/B Testing:** New recommendation algorithms are deployed to a subset of users (e.g., 10%) to compare metrics (click-through rate) against the baseline before full rollout.
- **Monitoring:** Track prediction latency, error rates, and data drift (e.g., if users suddenly start using new skill keywords).

---

## 7. Evaluation Metrics

| AI Feature | Offline Metrics | Online Business Metrics |
| :--- | :--- | :--- |
| **Team Matching** | Hit Rate, MRR (Mean Reciprocal Rank) | % of matched teams that submit a project, Average team score |
| **Recommendation** | NDCG, Precision@K | Click-Through Rate (CTR) on problems, Hackathon signup rate |
| **Idea Generator** | ROUGE/BLEU (vs human ideas), LLM-as-a-judge score | Idea adoption rate (users selecting generated ideas) |
| **Code Review** | Precision/Recall of bug detection | Correlation of AI score with final Human Judge score |

---

## 8. Scalability & Performance

- **Inference Strategy:**
  - **Real-time:** Idea generation, search, and cold-start recommendations.
  - **Batch:** Complex team matching calculations and collaborative filtering updates run asynchronously via Celery workers.
- **Hardware:**
  - Embedding generation and matching run on standard CPU instances (or small GPUs if throughput demands increase).
  - External API calls (Gemini/GPT) handle the heavy LLM lifting, abstracting GPU management.
- **Caching:** Redis heavily caches recommendation lists and generated ideas to minimize redundant compute.

---

## 9. Ethical Considerations & Bias

- **Fairness in Matching:** Ensure the matching algorithm does not inadvertently segregate users based on university prestige or demographics. Embeddings should focus strictly on technical skills and problem domains.
- **Transparency:** The platform will provide "Explainable AI" snippets (e.g., "Recommended because you know React").
- **LLM Guardrails:** Strict system prompts to prevent the generation of harmful, biased, or politically sensitive project ideas.

---

## 10. Cost Analysis and Optimization

- **Compute:** Fast vector similarity search (Pinecone/Milvus) is highly cost-effective compared to brute-force DB queries.
- **LLM API Costs:** Implement semantic caching (e.g., using GPTCache) for the Idea Generator. If a user requests ideas for a common problem statement, retrieve cached LLM responses instead of making a new API call.
- **Open Source:** Where possible (e.g., embedding models, static analysis), use self-hosted open-source models rather than paid APIs to control costs.

---

## 11. Fallback Strategies

To ensure platform resilience when AI services degrade:
- **Matching Fallback:** Revert to simple SQL-based filtering (e.g., exact match on self-reported tags) if the Vector DB or Embedding service is down.
- **Recommendation Fallback:** Display the most popular or recently added hackathons.
- **LLM Fallback:** Display a curated, static list of generic project ideas for the problem domain.
- **Code Review Fallback:** Skip AI analysis and rely entirely on human judges; mark the submission as "Pending Manual Review".

---

## 12. Privacy & Data Handling

- **Data Anonymization:** Personally Identifiable Information (PII) is stripped before data enters the ML training pipeline.
- **Consent:** Users explicitly opt-in to AI-assisted matching and resume parsing.
- **Compliance:** All data handling complies with local data protection regulations (e.g., DPDP Act, India). No user code submissions are used to train public foundational models.
