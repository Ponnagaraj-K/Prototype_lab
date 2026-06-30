
# StudyMate Pro - Smart Study Planner & Productivity Tracker

## PROJECT REPORT

**Submitted by**  
Nitharshana M - 727723EUCI034  
Nithin J - 727723EUCI035  
Ponnagaraj K - 727723EUCI036  
Sivakumar M - 727723EUCI048  

**In partial fulfillment for the award of the degree of**  
[Your Degree]  
[Your Department]  

**[Your College Name]**  
[College Address / City - PIN]

**[Month / Year]**

---

## BONAFIDE CERTIFICATE

Certified that this project report titled **"StudyMate Pro - Smart Study Planner & Productivity Tracker"** is the bonafide work of **Nitharshana M (727723EUCI034), Nithin J (727723EUCI035), Ponnagaraj K (727723EUCI036), Sivakumar M (727723EUCI048)**, who carried out the project work under my supervision.

**Supervisor:** Mr Ragunath, [Designation]  
**Head of Department:** [HOD Name]

Submitted for the Project viva-voce examination held on __________________

INTERNAL EXAMINER                              EXTERNAL EXAMINER

---

## ABSTRACT

StudyMate Pro is a smart study planning and productivity tracking web application that helps students organize academic goals, generate daily study tasks, and measure progress through analytics. The system combines an academic setup wizard, SGPA planning, personalized task scheduling, and focus sessions with a points and streak mechanism to promote consistency. It also integrates subject-wise PDF management and AI assistance for learning support, including AI-driven question generation for knowledge checks. The platform delivers real-time dashboards with weekly analytics, leaderboards, and personalized insights. Built using React and TypeScript for the frontend, Node.js and Express for the backend, and MongoDB for data storage, StudyMate Pro offers a scalable and user-centric solution that improves planning, time management, and learning outcomes.

---

## TABLE OF CONTENTS

1. INTRODUCTION  
   1.1 Project Overview  
   1.2 Background and Motivation  
   1.3 Problem Statement  
   1.4 Research Gap and Objectives  
   1.5 Scope and Significance  
   1.6 Applications  

2. LITERATURE SURVEY  
   2.1 Digital Study Planning Systems  
   2.2 Productivity Tracking and Goal Setting  
   2.3 AI in Education and Personalized Learning  
   2.4 Knowledge Assessment Tools  
   2.5 Summary of Findings  

3. PROBLEM STATEMENT  
   3.1 Existing System Limitations  
   3.2 Proposed Solution  
   3.3 Objectives  
   3.4 Functional Requirements  
   3.5 Non-Functional Requirements  

4. SYSTEM ANALYSIS AND REQUIREMENTS  
   4.1 Feasibility Study  
   4.2 Requirement Analysis  
   4.3 Use Case Overview  
   4.4 User Roles and Privileges  
   4.5 Constraints and Assumptions  

5. PROPOSED SOLUTION AND DESIGN  
   5.1 System Architecture  
   5.2 Module Design Overview  
   5.3 Database Design  
   5.4 Data Flow and Workflow  
   5.5 UI Design Principles  
   5.6 Security Design  

6. IMPLEMENTATION  
   6.1 Frontend Implementation  
   6.2 Backend Implementation  
   6.3 API Design and Endpoints  
   6.4 AI Features Implementation  
   6.5 Security and Authentication  

7. TESTING AND VALIDATION  
   7.1 Test Plan  
   7.2 Functional Test Cases  
   7.3 Integration Testing  
   7.4 Performance Testing  
   7.5 Usability Testing  

8. RESULTS AND DISCUSSION  
   8.1 Feature Verification  
   8.2 Performance Observations  
   8.3 Limitations  

9. TECHNOLOGIES USED  

10. SYSTEM REQUIREMENTS  
   10.1 Hardware Requirements  
   10.2 Software Requirements  

11. USER MANUAL  

12. SCREENSHOTS  

13. CONCLUSION AND FUTURE ENHANCEMENTS  

14. REFERENCES  

15. SUSTAINABLE DEVELOPMENT GOALS (SDGs)  

16. APPENDICES  
   A. API Documentation  
   B. Database Schema Details  
   C. Sample Test Cases  
   D. Key Code Snippets  

---

## LIST OF TABLES

Table 2.1 Comparative Features of Existing Study Tools  
Table 3.1 System Objectives and Mapping to Features  
Table 4.1 Feasibility Analysis Summary  
Table 5.1 Core Modules and Responsibilities  
Table 5.2 Database Collections and Key Fields  
Table 6.1 API Endpoints Summary  
Table 7.1 Functional Test Cases  
Table 7.2 Performance Test Scenarios  
Table 10.1 Hardware Requirements  
Table 10.2 Software Requirements  

## LIST OF FIGURES

Figure 5.1 High-Level System Architecture  
Figure 5.2 Academic Setup Workflow  
Figure 5.3 Task Scheduling Flow  
Figure 5.4 Focus Session UI Flow  
Figure 5.5 AI Assistant Interaction Flow  
Figure 5.6 Knowledge Check Generation Flow  
Figure 12.1 Login Page  
Figure 12.2 Dashboard  
Figure 12.3 Academic Setup Wizard  
Figure 12.4 Tasks Page  
Figure 12.5 SGPA Planning  
Figure 12.6 Books Upload  
Figure 12.7 AI Assistant  
Figure 12.8 Knowledge Check Setup  
Figure 12.9 Knowledge Check Result  

## LIST OF ABBREVIATIONS

AI - Artificial Intelligence  
API - Application Programming Interface  
CGPA - Cumulative Grade Point Average  
SGPA - Semester Grade Point Average  
JWT - JSON Web Token  
UI - User Interface  
UX - User Experience  
DB - Database  
TTS - Text-To-Speech  
LLM - Large Language Model  

---
\newpage
# CHAPTER 1 - INTRODUCTION

## 1.1 Project Overview
StudyMate Pro is a full-stack web application designed to help students manage their academic workload efficiently. It provides an academic setup wizard for subject configuration, SGPA planning based on credits and exam dates, automated task generation, a focus session timer with reward points, and progress analytics. The system also includes AI-assisted learning support through subject-wise PDF books and quiz generation from selected page ranges.

The platform follows a plan -> study -> review cycle. Users begin by entering their academic details, then receive a customized daily study plan. As sessions are completed, analytics are updated and insights are generated, reinforcing consistency and targeted improvement. The system is centered on measurable progress and consistent study habits.

StudyMate Pro addresses the complete academic workflow. It integrates goal setting, task creation, execution, analytics, and feedback in a single experience, reducing the need for multiple tools. By combining time tracking with SGPA planning, the system aligns daily study behavior with long-term academic goals.

## 1.2 Background and Motivation
Students often face challenges such as poor study organization, inconsistent schedules, and limited feedback on progress. Traditional planners and to-do lists offer manual tracking but lack automation, personalization, and analytics. The widespread availability of web-based tools makes it possible to deliver personalized planning experiences at scale, but many tools do not integrate academic goals, subject priorities, and real-time performance indicators.

StudyMate Pro is motivated by the need for a single, integrated platform that provides smart scheduling, actionable progress indicators, and AI-driven learning assistance. The goal is to reduce the cognitive load of planning and help students focus on high-impact study activities.

A typical student workflow involves multiple separate tools: a planner, a timer, a spreadsheet for tracking, and a chat tool for help. StudyMate Pro consolidates these into one system with a clear flow, ensuring higher adoption and consistent use.

## 1.3 Problem Statement
There is a need for a single platform that can:
- Convert academic goals into actionable daily tasks.
- Provide measurable progress tracking and analytics.
- Encourage consistency through streaks and rewards.
- Offer AI-assisted learning support linked to study materials.

## 1.4 Research Gap and Objectives
**Research Gap:** Existing study planners rarely integrate automated scheduling, deep analytics, and AI-powered learning assistance in one application.

**Objectives:**
- Provide a structured academic setup workflow.
- Generate personalized daily study tasks.
- Deliver analytics for study time, weekly progress, and streaks.
- Integrate AI for concept clarification and quiz generation.
- Maintain secure, user-specific data storage.

## 1.5 Scope and Significance
StudyMate Pro supports academic planning, SGPA goal tracking, daily study scheduling, and AI-assisted learning. It is significant because it bridges planning, execution, and feedback in one platform, improving student productivity and learning outcomes. The solution is applicable for individual learners, peer learning groups, and institutions that want to promote structured study routines.

The scope includes web-based deployment for desktop and mobile browsers, support for multiple subjects, and user-specific analytics. The system does not attempt to replace institutional learning management systems but focuses on personal productivity and academic planning.

## 1.6 Applications
- University and school study planning.
- Exam preparation tracking.
- Self-study coaching and productivity improvement.
- Institutional learning analytics.
- Personal accountability and time management.

\newpage
# CHAPTER 2 - LITERATURE SURVEY

## 2.1 Digital Study Planning Systems
Digital planners provide task lists and reminders but often lack automated scheduling and adaptive recommendations. Many tools focus on general productivity rather than academic goals, which limits their effectiveness for students preparing for exams and credit-based assessments.

Existing systems typically allow manual entry of tasks, which creates friction and discourages consistent use. Automated task scheduling based on subject priorities is less common, but it significantly improves adherence to study plans. Research also indicates that automated reminders and progress tracking improve completion rates.

## 2.2 Productivity Tracking and Goal Setting
Goal-tracking systems emphasize metrics such as time spent and task completion but usually do not connect these metrics with academic outcomes like SGPA. Connecting time spent to credit weightage and exam proximity can improve goal alignment.

Productivity research emphasizes the importance of small, consistent tasks and immediate feedback. By breaking large academic goals into daily tasks, the system helps students avoid procrastination and track measurable outcomes.

## 2.3 AI in Education and Personalized Learning
AI-powered tutoring and question generation tools help personalize learning. Integration of AI with a study planner allows students to receive assistance in the exact context of their study material and current syllabus coverage.

AI can also provide curated resource suggestions, summarize content, and guide revision. These capabilities reduce the time spent searching for resources and improve conceptual understanding.

## 2.4 Knowledge Assessment Tools
MCQ-based assessments help measure understanding. Automated question generation from study materials reduces manual effort for self-testing and encourages frequent low-stakes assessment, which is proven to enhance retention.

Knowledge checks provide immediate feedback. This supports active learning, where students frequently evaluate and adjust their understanding rather than relying solely on passive reading.

## 2.5 Summary of Findings
A gap exists in systems that combine scheduling, analytics, and AI learning support. StudyMate Pro addresses this by integrating all three in a unified environment and tailoring the workflow to academic needs.

Table 2.1 Comparative Features of Existing Study Tools

| Tool Type | Scheduling | Analytics | AI Assistance | Limitation |
| --- | --- | --- | --- | --- |
| Traditional planners | Manual | Minimal | None | No automation |
| Generic productivity apps | Partial | Basic | None | Not academic focused |
| AI tutoring apps | None | None | Strong | No scheduling |
| StudyMate Pro | Automated | Detailed | Integrated | Requires setup |

\newpage
# CHAPTER 3 - PROBLEM STATEMENT

## 3.1 Existing System Limitations
- Manual task creation without automation.
- Limited analytics and weak progress visibility.
- Lack of integration with study content.
- No AI assistance for personalized learning.
- Minimal support for SGPA-focused planning.

## 3.2 Proposed Solution
StudyMate Pro offers automated task scheduling, SGPA planning, progress analytics, and AI-based learning support. It provides a full cycle: plan -> study -> measure -> improve.

The system generates tasks based on subject priorities and available daily hours. It tracks study sessions, calculates points, and updates streaks to motivate consistent study habits.

## 3.3 Objectives
- Automate task creation based on subject priorities.
- Provide a focus session timer with points and streaks.
- Generate AI-assisted quizzes from PDF study materials.
- Offer dashboards with weekly charts and leaderboards.
- Maintain secure, user-specific data isolation.

## 3.4 Functional Requirements
- User authentication with signup and signin.
- Academic setup wizard with subject list, credits, target SGPA, daily hours, and exam date.
- Task generation and task completion tracking.
- Focus session timer with point awards.
- AI assistant chat per subject.
- PDF book management per subject.
- Knowledge check quiz generation and results view.
- Dashboard analytics with weekly chart, stats, leaderboard, and insights.

## 3.5 Non-Functional Requirements
- Secure data isolation per user.
- Scalable and modular architecture.
- Responsive UI for desktop and mobile.
- Fast API responses with clear error handling.
- Stable storage of study data and analytics.

Table 3.1 System Objectives and Mapping to Features

| Objective | Feature |
| --- | --- |
| Consistent planning | Setup wizard and daily tasks |
| Measurable progress | Dashboard stats and weekly chart |
| Motivation | Points, streaks, leaderboard |
| Learning support | AI assistant and knowledge check |
| Resource management | Subject-wise book uploads |

\newpage
# CHAPTER 4 - SYSTEM ANALYSIS AND REQUIREMENTS

## 4.1 Feasibility Study
Table 4.1 provides the feasibility summary.

Table 4.1 Feasibility Analysis Summary

| Feasibility Type | Observation | Conclusion |
| --- | --- | --- |
| Technical | Web stack and AI integration are mature | Feasible |
| Operational | Students can adopt with minimal training | Feasible |
| Economic | Uses open-source tools and free tiers | Feasible |
| Schedule | Modular development allows phased delivery | Feasible |

## 4.2 Requirement Analysis
The system must support registration, academic setup, task scheduling, focus sessions, and analytics. Each requirement is designed to meet the academic workflow. The backend supports data persistence, while the frontend offers responsive dashboards.

Detailed requirements include subject creation, credit allocation, daily hours selection, exam date tracking, and automatic task scheduling. The system must also handle scenarios where the exam date has passed, resetting the setup to maintain accurate planning.

## 4.3 Use Case Overview
Key use cases include:
- User registers and completes setup.
- User views tasks and starts a focus session.
- User views dashboards and AI insights.
- User uploads books and generates tests.
- User changes study preferences and regenerates tasks.

## 4.4 User Roles and Privileges
- Student: full access to personal planning, tasks, and AI features.
- System: automates task generation and analytics.

## 4.5 Constraints and Assumptions
- Internet access is required for AI services.
- Users will enter accurate subject data for planning.
- Study hours are assumed to be available daily except on Sundays (configurable in future).
- The system is optimized for individual users rather than institutional multi-admin workflows.

\newpage
# CHAPTER 5 - PROPOSED SOLUTION AND DESIGN

## 5.1 System Architecture
The system follows a client-server architecture.
- Frontend: React + TypeScript, Vite, Tailwind CSS.
- Backend: Node.js + Express REST API.
- Database: MongoDB for persistent storage.
- AI Services: Groq LLM for tutoring and question generation.

The architecture separates concerns between UI, API, and storage. This improves maintainability and scalability. It also supports future upgrades such as mobile apps and additional analytics modules.

## 5.2 Module Design Overview
Table 5.1 summarizes the modules.

Table 5.1 Core Modules and Responsibilities

| Module | Responsibility |
| --- | --- |
| Authentication | Signup, signin, JWT session management |
| Academic Setup | Subject creation, target SGPA, exam date |
| Task Scheduler | Daily task generation based on priority |
| Focus Session | Timer, points, streak updates |
| Dashboard | Stats, charts, leaderboard, insights |
| Books | Upload and manage PDFs per subject |
| AI Assistant | Subject-wise tutoring and guidance |
| Knowledge Check | MCQ generation from PDF pages |
| SGPA Planning | Grade targets and priority scores |

## 5.3 Database Design
Table 5.2 summarizes the collections.

Table 5.2 Database Collections and Key Fields

| Collection | Key Fields |
| --- | --- |
| User | email, password, points, streak, setupCompleted |
| Subject | userId, name, credits, targetGrade, priorityScore |
| Task | userId, subjectId, type, duration, priority, completed |
| StudySession | userId, subject, duration, date, points |
| Book | userId, subjectId, name, url |
| AcademicProfile | userId, subjects, targetSGPA, examDate |
| KnowledgeTest | userId, bookId, questions, score, percentage |

## 5.4 Data Flow and Workflow
1. User registers and completes academic setup.
2. System generates daily tasks and priorities.
3. User completes tasks via focus session.
4. Sessions update analytics, streaks, and points.
5. AI assistant and knowledge check support subject learning.

## 5.5 UI Design Principles
The UI is designed with the following principles:
- Clarity through consistent typography and spacing.
- Actionable call-to-action buttons for study flow.
- Calm gradients and soft shadows to reduce stress.
- Accessible forms with clear validation feedback.

## 5.6 Security Design
Security is based on JWT authentication, password hashing, and user-specific database filtering. Each API route is protected by middleware that validates the token and assigns the userId to the request context.

\newpage
# CHAPTER 6 - IMPLEMENTATION

## 6.1 Frontend Implementation
The frontend uses React with TypeScript and Vite. Major pages include authentication, dashboard, tasks, AI assistant, books, knowledge check, SGPA planning, and focus session. Components are modular and optimized for reusability. Animations are handled using Framer Motion for smooth transitions.

Key components include:
- DashboardStats: shows today, week, streak, and goal progress.
- WeeklyChart: bar chart showing the last 7 days of study time.
- Leaderboard: ranks users by points for weekly, monthly, and all-time.
- TaskList: displays scheduled tasks with priority badges.
- StudyTimer and FocusSession: timer flow with pause and completion logic.

## 6.2 Backend Implementation
The backend is built using Node.js and Express. Key routes include authentication, academic setup, task generation, sessions, AI services, and knowledge check. JWT middleware ensures authenticated access and user isolation for all resources.

The backend uses Mongoose for schema modeling and data validation. Each API route handles validation and error management to avoid system failures. Business logic for streaks, points, and analytics is implemented on the server side.

## 6.3 API Design and Endpoints
Table 6.1 summarizes core endpoints.

Table 6.1 API Endpoints Summary

| Endpoint | Method | Purpose |
| --- | --- | --- |
| /api/auth/signup | POST | Register new user |
| /api/auth/signin | POST | Login user |
| /api/auth/me | GET | Get current user |
| /api/academic/profile | GET | Get academic profile |
| /api/academic/profile | POST | Create/update profile |
| /api/academic/tasks/generate | POST | Generate tasks |
| /api/academic/tasks/today | GET | Get today’s tasks |
| /api/academic/tasks/:id/complete | PATCH | Complete task |
| /api/academic/leaderboard | GET | Leaderboard |
| /api/academic/stats/weekly | GET | Weekly stats |
| /api/academic/stats/dashboard | GET | Dashboard stats |
| /api/academic/insights | GET | AI insights |
| /api/books | GET | Get books |
| /api/books/upload | POST | Upload PDF |
| /api/knowledge-check/generate | POST | Generate quiz |

## 6.4 AI Features Implementation
AI features are implemented using Groq LLM. The AI assistant provides subject-wise tutoring responses, while the knowledge check module extracts text from PDFs and generates MCQ questions with explanations. If a PDF is image-based, a fallback generic question generator is used to ensure continuity.

The AI assistant is designed to provide concise explanations and structured guidance. It can also suggest external resources when a user requests videos or references.

## 6.5 Security and Authentication
- Password hashing is used before storage.
- JWT tokens ensure authenticated API access.
- Each query is filtered by userId for data isolation.
- API endpoints validate required fields and handle errors gracefully.

\newpage
# CHAPTER 7 - TESTING AND VALIDATION

## 7.1 Test Plan
Testing includes unit testing of key modules, integration testing between frontend and backend, and manual UI testing for flows such as setup wizard and focus session.

## 7.2 Functional Test Cases
Table 7.1 shows selected test cases.

Table 7.1 Functional Test Cases

| Test Case | Input | Expected Output |
| --- | --- | --- |
| Signup | Valid email and password | User created and token issued |
| Setup Wizard | Subject list and SGPA | Profile saved and tasks generated |
| Task Complete | Task ID and duration | Task completed and points awarded |
| AI Assistant | Valid question | AI response returned |
| Knowledge Check | PDF and page range | Quiz generated |
| Book Upload | Valid PDF file | Book stored and visible |
| Leaderboard | Study sessions completed | Ranking updated |
| Streak | Daily completion | Streak incremented |

## 7.3 Integration Testing
Integration testing verifies that backend APIs connect properly with frontend components. API failures are caught and displayed to the user with friendly messages.

## 7.4 Performance Testing
Table 7.2 shows performance scenarios.

Table 7.2 Performance Test Scenarios

| Scenario | Metric | Observation |
| --- | --- | --- |
| Task generation | Response time | Acceptable for 60-day schedule |
| Weekly stats | Query time | Aggregation within seconds |
| AI response | Latency | Dependent on LLM availability |

## 7.5 Usability Testing
Students were asked to complete key workflows. They reported that the setup wizard and task list were intuitive, and the dashboard improved visibility of study habits.

\newpage
# CHAPTER 8 - RESULTS AND DISCUSSION

## 8.1 Feature Verification
All key features were implemented, including automated task generation, dashboard analytics, AI assistant, and knowledge check. The system successfully stores and displays study sessions and provides weekly analytics.

## 8.2 Performance Observations
System responsiveness is acceptable for typical usage. AI features are dependent on API latency, which is within acceptable thresholds for educational scenarios.

## 8.3 Limitations
- AI features require a configured Groq API key.
- Large PDF files may take longer to process.
- Knowledge check quality depends on PDF text extractability.

\newpage
# CHAPTER 9 - TECHNOLOGIES USED

- Frontend: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion, Recharts.
- Backend: Node.js, Express.js.
- Database: MongoDB, Mongoose.
- AI and NLP: Groq LLM API, pdfjs-dist.
- Auth: JWT.
- File Uploads: Multer.

\newpage
# CHAPTER 10 - SYSTEM REQUIREMENTS

Table 10.1 Hardware Requirements

| Component | Minimum |
| --- | --- |
| Processor | Intel i3 or above |
| RAM | 4 GB (8 GB recommended) |
| Storage | 2 GB free space |

Table 10.2 Software Requirements

| Software | Version |
| --- | --- |
| OS | Windows 10/11 or Linux |
| Node.js | 18+ |
| MongoDB | Local or Atlas |
| Browser | Chrome/Edge |

\newpage
# CHAPTER 11 - USER MANUAL

1. Register an account using email and password.
2. Complete academic setup by entering subjects, credits, SGPA target, daily hours, and exam date.
3. View generated tasks in the Tasks page.
4. Start a focus session to complete a task and earn points.
5. Upload PDFs in the Books page for each subject.
6. Use AI Assistant for subject queries.
7. Generate quizzes in Knowledge Check and review results.
8. Monitor progress in Dashboard with weekly analytics and leaderboard.
9. Update profile information as needed.
10. Review streak and points in the dashboard to stay motivated.

\newpage
# CHAPTER 12 - SCREENSHOTS

\newpage
Figure 12.1 Login Page
![](F:/New%20folder/study_Planner/images/login.png)

\newpage
Figure 12.3 Academic Setup Wizard
![](F:/New%20folder/study_Planner/images/setup%20for%20scheduling%20studies.png)

\newpage
Figure 12.4 Tasks Page
![](F:/New%20folder/study_Planner/images/tasks.png)

\newpage
Figure 12.5 SGPA Planning
![](F:/New%20folder/study_Planner/images/sgpa%20planning.png)

\newpage
Figure 12.6 Books Upload
![](F:/New%20folder/study_Planner/images/books.png)

\newpage
Figure 12.7 AI Assistant
![](F:/New%20folder/study_Planner/images/Ai%20assistant.png)

\newpage
Figure 12.8 Knowledge Check Setup
![](F:/New%20folder/study_Planner/images/quiz%20setup.png)

\newpage
Figure 12.9 Knowledge Check Result
![](F:/New%20folder/study_Planner/images/quiz%20result.png)

\newpage
# CHAPTER 14 - REFERENCES

1. MongoDB Documentation.
2. React Documentation.
3. Express.js Documentation.
4. Groq API Documentation.
5. pdfjs-dist Documentation.

\newpage
# CHAPTER 15 - SUSTAINABLE DEVELOPMENT GOALS (SDGs)

SDG 4 - Quality Education: Supports structured learning and accessible AI tutoring.  
SDG 9 - Industry, Innovation, and Infrastructure: Encourages innovation in educational technology.  
SDG 10 - Reduced Inequalities: Provides affordable digital learning support for students.

\newpage
# CHAPTER 16 - APPENDICES

## Appendix A - API Documentation

Authentication API:
- POST /api/auth/signup
- POST /api/auth/signin
- GET /api/auth/me

Academic API:
- GET /api/academic/profile
- POST /api/academic/profile
- POST /api/academic/tasks/generate
- GET /api/academic/tasks/today
- PATCH /api/academic/tasks/:id/complete
- GET /api/academic/leaderboard
- GET /api/academic/stats/weekly
- GET /api/academic/stats/dashboard
- GET /api/academic/insights

Books API:
- GET /api/books
- POST /api/books/upload
- DELETE /api/books/:id

Knowledge Check API:
- POST /api/knowledge-check/generate
- POST /api/knowledge-check/submit
- GET /api/knowledge-check/history

AI API:
- POST /api/ai/chat
- GET /api/ai/chat-history/:subjectId

## Appendix B - Database Schema Details

User:
- email, password, name, points, weeklyPoints, monthlyPoints, currentStreak, lastStudyDate

Subject:
- userId, name, credits, targetGrade, examDate, priorityScore

Task:
- userId, subjectId, type, title, duration, scheduledDate, completed, pointsEarned, priority

StudySession:
- userId, subject, duration, points, date, startTime, endTime, isActive

Book:
- userId, subjectId, name, url

AcademicProfile:
- userId, subjects, currentCGPA, targetCGPA, semesterExamDate, setupCompleted

KnowledgeTest:
- userId, bookId, pageFrom, pageTo, questions, score, percentage

## Appendix C - Sample Test Cases

1. Register a new user and verify JWT token is returned.
2. Complete setup wizard and verify tasks are generated.
3. Start focus session and verify points update.
4. Upload PDF and verify AI assistant unlocks.
5. Generate quiz and verify results view.

## Appendix D - Key Code Snippets

Authentication flow includes JWT validation in middleware and user isolation on all routes. Task scheduling includes priority-based duration allocation and streak updates on completion. Knowledge check uses pdfjs-dist to extract text and Groq LLM to generate questions.

