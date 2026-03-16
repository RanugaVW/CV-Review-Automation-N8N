# 🏢 RYSERA HR — AI-Powered Talent Intelligence

RYSERA HR is a premium, next-generation recruitment platform that leverages Artificial Intelligence to automate the initial stages of candidate screening. Built with a stunning **Glassmorphic UI**, it provides a seamless experience for both applicants and HR professionals.

![RYSERA HR Banner](https://img.shields.io/badge/RYSERA_HR-AI_Recruitment-08CB00?style=for-the-badge&logo=openai&logoColor=white)

## ✨ Features

- **Premium Glassmorphic UI**: A modern, high-end aesthetic using a custom neon green and deep black palette.
- **AI CV Extraction**: High-precision data extraction from PDF resumes using OpenAI's GPT-4o Mini.
- **Intelligence Dashboard**: Real-time admin dashboard for talent evaluation with AI scoring (1-10) and detailed candidate summaries.
- **Dynamic Job Matching**: Automatically matches candidates' skills and education against specific job profiles stored in Google Sheets.
- **Automated Workflow**: seamless integration between the Next.js frontend and n8n for data processing.
- **Cloud Storage**: Automatic upload of CVs to Google Drive and candidate data to Google Sheets.

## 🛠️ Technical Stack

- **Frontend**: Next.js 14, React, Vanilla CSS (Glassmorphism)
- **Automation**: n8n
- **AI Engine**: OpenAI (GPT-4o Mini)
- **Data & Storage**: Google Sheets API, Google Drive API

## 🚀 Getting Started

### 1. Prerequisite

- Node.js installed
- An active n8n instance

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Setup Environment Variables
# Create a .env.local file with:
# N8N_WEBHOOK_URL=your_n8n_webhook_url
# N8N_FETCH_CANDIDATES_URL=your_n8n_fetch_url
# ADMIN_PASSWORD=your_password

# Run development server
npm run dev
```

### 3. Automation Setup

- Import the provided JSON workflows into your n8n instance:
  - `hr-workflow.json`: Handles CV submissions and AI grading.
  - `fetch-candidates.json`: Serves live data to the Admin Dashboard.

---

© 2026 **RYSERA HR** — Redefining Global Recruitment Intelligence
