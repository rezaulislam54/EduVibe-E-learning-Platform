# 🎓 EduVibe — Full-Stack MERN E-Learning Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-edu--vibe--e--learning--platform.vercel.app-6366F1?style=for-the-badge&logo=vercel&logoColor=white)](https://edu-vibe-e-learning-platform.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rezaulislam54/EduVibe-E-learning-Platform)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

> 🚀 **Live Production Application:** [https://edu-vibe-e-learning-platform.vercel.app](https://edu-vibe-e-learning-platform.vercel.app)

A production-grade, full-featured **Online Course Marketplace, Learning Management System (LMS), & Master Admin Control Center** built with **React (Vite), Tailwind CSS, Node.js, Express.js, MongoDB (Mongoose), Stripe, Socket.io, and Vercel Serverless Functions**.

---

## 🌐 Live Demo & Quick Access

| Resource | Link / Details |
|---|---|
| 🚀 **Live Website** | [https://edu-vibe-e-learning-platform.vercel.app](https://edu-vibe-e-learning-platform.vercel.app) |
| 🛡️ **Admin Console** | [https://edu-vibe-e-learning-platform.vercel.app/admin/dashboard](https://edu-vibe-e-learning-platform.vercel.app/admin/dashboard) |
| 👨‍🏫 **Instructor Hub** | [https://edu-vibe-e-learning-platform.vercel.app/instructors](https://edu-vibe-e-learning-platform.vercel.app/instructors) |
| 🏆 **Certificate Verification** | [https://edu-vibe-e-learning-platform.vercel.app/verify-certificate](https://edu-vibe-e-learning-platform.vercel.app/verify-certificate) |
| 💬 **Help & Support Center** | [https://edu-vibe-e-learning-platform.vercel.app/contact](https://edu-vibe-e-learning-platform.vercel.app/contact) |

---

## 🔑 1-Click Demo Login Credentials

You can log in instantly using the pre-configured 1-Click Demo buttons on the [Login Page](https://edu-vibe-e-learning-platform.vercel.app/login) or enter credentials manually:

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| 🛡️ **Super Admin** | `admin@eduvibe.com` | `password123` | Full 7-module platform control center, user roles, course approvals, transactions & database tools |
| 👨‍🏫 **Lead Instructor** | `sarah.instructor@eduvibe.com` | `password123` | Course authoring wizard, student analytics, revenue tracking, lesson management |
| 🎓 **Verified Student** | `student@eduvibe.com` | `password123` | My Learning classroom, video player with note-taking, live Q&A forum, certificate generation |

---

## 🌟 Feature Matrix & Architecture

### 1. 🛡️ Master Admin Control Center (7 Modules)
- **Real-Time KPI Dashboard**: Gross revenue, active student count, enrollment conversion rate, and course status breakdown.
- **Global Course Moderation**: Approve, reject, feature, or draft submissions with one-click instant toggles.
- **User Permission Manager**: Search, filter, and modify roles (`student` ⇄ `instructor` ⇄ `admin`) with active status control.
- **Financial Ledger & Invoices**: Real-time transaction history with Stripe invoice IDs, student billing records, and revenue share.
- **Review Moderation**: Direct moderation of student ratings and feedback with spam-flagging capabilities.
- **Database & System Diagnostics**: Instant demo data re-seeder, cache clear tools, and serverless health probes.

### 2. 🎥 Immersive Video Player & Real-Time Q&A Classroom
- **Custom HTML5 Video Player**: Multi-speed playback (`0.75x` to `2.0x`), full-screen mode, keyboard navigation, and auto-progress tracking.
- **Collapsible Curriculum Playlist**: Real-time completion checkmarks synced with server state.
- **Markdown Lesson Notes Notebook**: Write, format, and save timestamped personal study notes during video lectures.
- **Real-Time Socket.io Q&A Forum**: Ask questions with code snippets; instructors and peers receive instant live notifications.

### 3. 🏆 Cryptographic Certificate Verification Registry
- **Automated Generation**: Unlocked upon 100% course lecture completion with celebratory confetti.
- **Public Verification Tool (`/verify-certificate`)**: Publicly verifiable unique cryptographic hash (e.g. `CERT-MERN-89241`) for LinkedIn embedding and resume verification.
- **Print & PDF Export**: High-resolution print-ready styling.

### 4. 🧭 Career Transformation Roadmaps & Guided Paths
- **Structured Engineering Paths**: Full-Stack MERN Architect, Generative AI & LLM Engineer, Cloud & DevOps Specialist, and UI/UX Product Designer.
- **Student Outcome Testimonials**: Salary increase badges (+180%, +140%, +220%) and verified career transition stories.

### 5. 👨‍🏫 Instructor Directory & Earnings Potential Calculator
- **Faculty Directory (`/instructors`)**: Profiles of industry leaders (Ex-Google, Stanford AI Lab, AWS Hero).
- **Interactive Revenue Calculator**: Dynamic dual sliders (Student count & Course price) calculating estimated take-home revenue at an 85% creator share.
- **Instructor Application Portal**: Online application submission with automated verification feedback.

### 6. 💬 24/7 Global Help Center & Support Ticket Generator (`/contact`)
- **Direct Support Channels**: Student help, enterprise team training, live chat schedules, and global headquarters addresses.
- **Interactive Support Ticket Simulator**: Generates verifiable ticket IDs (e.g. `#TK-89423`) categorized by urgency and topic.

---

## 🛠️ Technology Stack

```
EduVibe (Full-Stack Monorepo)
├── client/ (Vite + React 18 + Tailwind CSS + Lucide Icons)
├── server/ (Node.js + Express.js + Mongoose + Socket.io + Stripe)
├── api/    (Vercel Serverless Function API Entrypoint)
└── vercel.json (Dual SPA Rewrites + Serverless Routing)
```

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS, Lucide Icons, Axios, React Router v6, Canvas Confetti |
| **Backend** | Node.js, Express.js, Socket.io, Stripe SDK, Multer, Morgan, Bcrypt.js |
| **Database** | MongoDB & Mongoose (Atlas Cloud Cluster + Zero-config local fallback) |
| **Authentication** | JSON Web Tokens (JWT) & Role-Based Access Control (RBAC) |
| **Deployment** | Vercel (Production CI/CD with Serverless API Functions) |

---

## 🚀 Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/rezaulislam54/EduVibe-E-learning-Platform.git
cd EduVibe-E-learning-Platform
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Environment Variables Configuration
Create a `.env` file in the `server/` directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/eduvibe_elearning
JWT_SECRET=eduvibe_super_secure_jwt_token_key_2026
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

### 4. Run Both Frontend & Backend Concurrently
```bash
npm run dev
```
- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📡 Key API Routes

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new student or instructor
- `POST /api/auth/login` — Authenticate and receive JWT token
- `POST /api/auth/demo-login` — 1-click test login by role
- `GET /api/auth/me` — Retrieve current authenticated user profile
- `PUT /api/auth/profile` — Update user bio, headline, social links

### 📚 Courses (`/api/courses`)
- `GET /api/courses` — Search, filter by category/price/level, and paginate courses
- `GET /api/courses/featured` — Retrieve top-rated courses
- `GET /api/courses/:id` — Course landing page with full curriculum details
- `POST /api/courses` — Create new course (Instructor/Admin)
- `PUT /api/courses/:id` — Update course curriculum & sections
- `DELETE /api/courses/:id` — Remove course from catalog

### 🎓 Enrollments & Learning Room (`/api/enrollments`)
- `POST /api/enrollments` — Enroll in course (Free or Paid)
- `GET /api/enrollments/my-learning` — Student enrolled courses & progress percentages
- `GET /api/enrollments/course/:courseId` — Learning room data & lesson videos
- `PUT /api/enrollments/course/:courseId/lesson/:lessonId` — Mark lecture complete/incomplete
- `POST /api/enrollments/course/:courseId/notes` — Save personal study note

### 🛡️ Admin Moderation (`/api/admin`)
- `GET /api/admin/stats` — High-level platform KPIs and revenue totals
- `GET /api/admin/courses` — Global course list across all instructors
- `PUT /api/admin/courses/:id/status` — Approve or reject course submissions
- `GET /api/admin/users` — User management directory
- `PUT /api/admin/users/:id/role` — Update user permission role

---

## 👨‍💻 Author & Credits

**Developed & Engineered by:**
- **Md. Rezaul Islam**
- **GitHub:** [@rezaulislam54](https://github.com/rezaulislam54)
- **Project Repository:** [EduVibe-E-learning-Platform](https://github.com/rezaulislam54/EduVibe-E-learning-Platform)

---

## 📄 License
This project is licensed under the **MIT License** — feel free to use it for learning, portfolios, and commercial extension.
