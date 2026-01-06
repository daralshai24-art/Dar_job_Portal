# Dar Al-Shai Job Portal

A modern, comprehensive Job Portal and Applicant Tracking System (ATS) built with Next.js 16, designed to streamline the hiring process from job creation to candidate selection.

![Dashboard](https://via.placeholder.com/800x400?text=Job+Portal+Dashboard+Preview)

## 🚀 Features

-   **Job Management**: Create, edit, and publish job listings using reusable templates.
-   **Applicant Tracking**: Visual timeline for tracking applications through various stages (Applied, Screening, Interview, Offered, Hired).
-   **Committee System**: Assign hiring committees to specific applications for collaborative review and scoring.
-   **Feedback & Scoring**: Committee members can submit detailed feedback and scores for candidates.
-   **Role-Based Access Control (RBAC)**: Secure access tailored for Super Admins, HR Managers, and Committee Members.
-   **Automated Notifications**: Email alerts for application status changes, interview scheduling, and feedback requests.
-   **Analytics Dashboard**: Insights into visitor logs, application trends, and hiring metrics.
-   **Rich Text Editing**: Integrated WYSIWYG editor for job descriptions and templates.
-   **Responsive Design**: Fully responsive UI built with Tailwind CSS and Shadcn UI.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Language**: JavaScript / React 19
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
-   **Database**: MongoDB (via Mongoose)
-   **Authentication**: [NextAuth.js](https://next-auth.js.org/)
-   **Email**: Nodemailer & Resend
-   **Containerization**: Docker & Docker Compose

## 📦 Getting Started

### Prerequisites

-   **Node.js**: v18 or higher
-   **Docker** (optional, for containerized deployment)
-   **MongoDB**: Local instance or Atlas URI

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd jop_portal
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory. You can use the `docker_env_template.txt` as a reference for keys.

```bash
cp .env.example .env.local
```

**Required Variables within `.env.local`:**

```env
# Database
MONGODB_URI=mongodb://localhost:27017/jobportal

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Email Service
EMAIL_SERVER_USER=your-email@example.com
EMAIL_SERVER_PASSWORD=your-email-password
EMAIL_FROM=noreply@example.com

# Google Integration (for Calendar/Meet)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REFRESH_TOKEN=...
```

### 3. Running Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🐳 Docker Deployment

For production-ready deployment with a self-hosted MongoDB instance:

1.  **Configure Docker Environment**:
    Review `docker-compose.yml` and `docker_env_template.txt`. Ensure your secrets are set in `.env.docker` (or your chosen env file).

2.  **Run with Docker Compose**:

    ```bash
    docker compose up -d --build
    ```

    This command spins up two containers:
    -   `jop-portal`: The Next.js application (Port 3000)
    -   `jop-portal-db`: MongoDB instance

    Data persistence is handled via Docker volumes:
    -   `./mongo-data`: Database storage
    -   `./uploads`: Applicant CV/Resume storage

    *For detailed deployment instructions, please refer to [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).*

## 📂 Project Structure

-   `src/app`: App Router pages and layouts.
-   `src/components`: Reusable UI components.
-   `src/models`: Mongoose database schemas (Job, Application, User, etc.).
-   `src/services`: Business logic (EmailService, ApplicationService).
-   `src/utils`: Helper functions and constants.
-   `public/uploads`: Directory for storing uploaded files.

## 🤝 Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)
