const pptxgen = require('pptxgenjs');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'StudyMate Pro';
pptx.company = 'StudyMate Pro';
pptx.subject = 'Project Presentation';
pptx.title = 'StudyMate Pro Presentation';

// Theme-like tokens
const COLORS = {
  blue: '2F5FB3',
  blueDark: '24478A',
  grayDark: '2B2B2B',
  gray: '5B6470',
  grayLight: 'F2F4F8',
  white: 'FFFFFF',
  line: 'D5DAE1'
};

const SLIDE = {
  w: 13.333,
  h: 7.5
};

function addHeader(slide, title) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: SLIDE.w,
    h: 0.8,
    fill: { color: COLORS.blue },
    line: { color: COLORS.blue }
  });
  slide.addText(title, {
    x: 0.6,
    y: 0.12,
    w: 12.2,
    h: 0.56,
    fontFace: 'Calibri',
    fontSize: 28,
    color: COLORS.white,
    bold: true
  });
}

function addFooter(slide, text) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 7.18,
    w: SLIDE.w,
    h: 0.32,
    fill: { color: COLORS.grayLight },
    line: { color: COLORS.grayLight }
  });
  slide.addText(text, {
    x: 0.6,
    y: 7.2,
    w: 12.2,
    h: 0.25,
    fontFace: 'Calibri',
    fontSize: 12,
    color: COLORS.gray
  });
}

function addImagePlaceholder(slide, x, y, w, h, label = 'Image Placeholder') {
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w,
    h,
    fill: { color: COLORS.grayLight },
    line: { color: COLORS.line, dash: 'dash' }
  });
  slide.addText(label, {
    x,
    y: y + h / 2 - 0.2,
    w,
    h: 0.4,
    fontFace: 'Calibri',
    fontSize: 16,
    color: COLORS.gray,
    align: 'center',
    valign: 'mid'
  });
}

function addBullets(slide, textRuns, x, y, w, h) {
  slide.addText(textRuns, {
    x,
    y,
    w,
    h,
    fontFace: 'Calibri',
    fontSize: 20,
    color: COLORS.grayDark,
    bullet: { indent: 18 },
    paraSpaceAfter: 10
  });
}

// Slide 1: Title
{
  const slide = pptx.addSlide();
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: SLIDE.w,
    h: SLIDE.h,
    fill: { color: COLORS.white }
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: SLIDE.w,
    h: 2.1,
    fill: { color: COLORS.blue }
  });
  slide.addText('StudyMate Pro', {
    x: 0.8,
    y: 0.45,
    w: 11.7,
    h: 1,
    fontFace: 'Calibri',
    fontSize: 48,
    color: COLORS.white,
    bold: true
  });
  slide.addText('Smart Study Planner & Productivity Tracker', {
    x: 0.8,
    y: 1.25,
    w: 11.7,
    h: 0.6,
    fontFace: 'Calibri',
    fontSize: 20,
    color: COLORS.white
  });
  slide.addText('Project Presentation', {
    x: 0.8,
    y: 2.6,
    w: 11.7,
    h: 0.5,
    fontFace: 'Calibri',
    fontSize: 20,
    color: COLORS.grayDark,
    bold: true
  });
  addImagePlaceholder(slide, 0.8, 3.2, 11.7, 3.8, 'Hero Image Placeholder');
  addFooter(slide, 'StudyMate Pro');
}

// Slide 2: Agenda
{
  const slide = pptx.addSlide();
  addHeader(slide, 'Agenda');
  addBullets(
    slide,
    [
      { text: 'Problem & Opportunity' },
      { text: 'Solution Overview' },
      { text: 'Key Features' },
      { text: 'User Journey' },
      { text: 'Architecture & Data Model' },
      { text: 'API Highlights' },
      { text: 'Gamification & Insights' },
      { text: 'Roadmap' }
    ],
    1.0,
    1.2,
    11.5,
    5.5
  );
  addFooter(slide, 'StudyMate Pro');
}

// Slide 3: Problem
{
  const slide = pptx.addSlide();
  addHeader(slide, 'Problem & Opportunity');
  slide.addText('Students struggle to sustain consistent study habits and track progress across subjects.', {
    x: 1.0,
    y: 1.1,
    w: 11.4,
    h: 0.8,
    fontFace: 'Calibri',
    fontSize: 22,
    color: COLORS.grayDark,
    bold: true
  });
  addBullets(
    slide,
    [
      { text: 'Planning is fragmented across tools or notebooks' },
      { text: 'Lack of feedback loops for streaks and weekly progress' },
      { text: 'No guidance on subject priority or CGPA targets' },
      { text: 'Motivation drops without gamified rewards' }
    ],
    1.0,
    2.1,
    7.5,
    4.8
  );
  addImagePlaceholder(slide, 9.0, 2.1, 3.8, 3.8, 'Problem Visual');
  addFooter(slide, 'StudyMate Pro');
}

// Slide 4: Solution
{
  const slide = pptx.addSlide();
  addHeader(slide, 'Solution Overview');
  slide.addText('StudyMate Pro unifies planning, execution, and insight into one streamlined platform.', {
    x: 1.0,
    y: 1.1,
    w: 11.4,
    h: 0.8,
    fontFace: 'Calibri',
    fontSize: 22,
    color: COLORS.grayDark,
    bold: true
  });
  addBullets(
    slide,
    [
      { text: 'Personalized study tasks based on CGPA goals' },
      { text: 'Focused study sessions with timer and bonus rewards' },
      { text: 'Analytics dashboards with weekly trends' },
      { text: 'AI-powered insights to prioritize effort' }
    ],
    1.0,
    2.1,
    7.5,
    4.8
  );
  addImagePlaceholder(slide, 9.0, 2.1, 3.8, 3.8, 'Solution Visual');
  addFooter(slide, 'StudyMate Pro');
}

// Slide 5: Key Features
{
  const slide = pptx.addSlide();
  addHeader(slide, 'Key Features');
  addBullets(
    slide,
    [
      { text: 'CGPA planning wizard with subject priorities' },
      { text: 'Task generation for daily study schedule' },
      { text: 'Focus session mode with pause/resume and bonus points' },
      { text: 'Dashboard analytics for today, week, total, streak' },
      { text: 'Weekly progress chart with persistence' },
      { text: 'AI insights and personalized recommendations' },
      { text: 'Leaderboard for weekly, monthly, and all-time ranking' }
    ],
    1.0,
    1.2,
    11.5,
    5.8
  );
  addFooter(slide, 'StudyMate Pro');
}

// Slide 6: User Journey
{
  const slide = pptx.addSlide();
  addHeader(slide, 'User Journey');
  slide.addText('From onboarding to sustained momentum', {
    x: 1.0,
    y: 1.1,
    w: 11.4,
    h: 0.6,
    fontFace: 'Calibri',
    fontSize: 20,
    color: COLORS.grayDark,
    bold: true
  });
  addBullets(
    slide,
    [
      { text: 'Sign up and set CGPA targets' },
      { text: 'Complete setup wizard with subjects and credits' },
      { text: 'Generate today?s tasks automatically' },
      { text: 'Enter full-screen focus session to study' },
      { text: 'Earn points, streaks, and celebration rewards' },
      { text: 'Review weekly stats and AI insights' },
      { text: 'Compete on leaderboard and improve' }
    ],
    1.0,
    1.9,
    7.6,
    5.2
  );
  addImagePlaceholder(slide, 9.0, 2.0, 3.8, 4.6, 'Journey Visual');
  addFooter(slide, 'StudyMate Pro');
}

// Slide 7: Architecture
{
  const slide = pptx.addSlide();
  addHeader(slide, 'Architecture');
  slide.addText('Modern MERN-based architecture with secure authentication', {
    x: 1.0,
    y: 1.1,
    w: 11.4,
    h: 0.6,
    fontFace: 'Calibri',
    fontSize: 20,
    color: COLORS.grayDark,
    bold: true
  });
  addBullets(
    slide,
    [
      { text: 'Frontend: React 18 + TypeScript + Vite + Tailwind + shadcn/ui' },
      { text: 'Backend: Node.js + Express with JWT authentication' },
      { text: 'Database: MongoDB with user-isolated collections' }
    ],
    1.0,
    2.0,
    11.5,
    2.2
  );
  addImagePlaceholder(slide, 1.0, 4.3, 11.3, 2.7, 'Architecture Diagram');
  addFooter(slide, 'StudyMate Pro');
}

// Slide 8: Data Model
{
  const slide = pptx.addSlide();
  addHeader(slide, 'Core Data Model');
  addBullets(
    slide,
    [
      { text: 'User: points, weeklyPoints, monthlyPoints, currentStreak, lastStudyDate' },
      { text: 'Task: userId, subject, duration, priority, completed, pointsEarned' },
      { text: 'StudySession: userId, subject, date, duration, points' },
      { text: 'AcademicProfile: subjects, currentCGPA, targetCGPA, examDate' }
    ],
    1.0,
    1.4,
    11.5,
    3.6
  );
  addImagePlaceholder(slide, 1.0, 5.0, 11.3, 2.2, 'Entity Diagram');
  addFooter(slide, 'StudyMate Pro');
}

// Slide 9: API Highlights
{
  const slide = pptx.addSlide();
  addHeader(slide, 'API Highlights');
  addBullets(
    slide,
    [
      { text: 'POST /api/auth/signup, POST /api/auth/signin' },
      { text: 'GET /api/academic/profile, POST /api/academic/profile' },
      { text: 'POST /api/academic/tasks/generate' },
      { text: 'GET /api/academic/tasks/today' },
      { text: 'PATCH /api/academic/tasks/:id/complete' },
      { text: 'GET /api/academic/leaderboard?period=weekly|monthly|all' },
      { text: 'GET /api/academic/stats/weekly, GET /api/academic/stats/dashboard' },
      { text: 'GET /api/academic/insights' }
    ],
    1.0,
    1.2,
    11.5,
    5.8
  );
  addFooter(slide, 'StudyMate Pro');
}

// Slide 10: Gamification & Insights
{
  const slide = pptx.addSlide();
  addHeader(slide, 'Gamification & Insights');
  addBullets(
    slide,
    [
      { text: 'Points system by priority: high 2x, medium 1.5x, low 1x' },
      { text: 'Bonus points for extra study time (every 3 minutes)' },
      { text: 'Streak tracking based on consecutive study days' },
      { text: 'AI insights for weakest subject and required daily minutes' },
      { text: 'Risk alerts when exams are near' }
    ],
    1.0,
    1.4,
    7.6,
    5.6
  );
  addImagePlaceholder(slide, 9.0, 1.6, 3.8, 4.8, 'Insights Visual');
  addFooter(slide, 'StudyMate Pro');
}

// Slide 11: Reliability & Fixes
{
  const slide = pptx.addSlide();
  addHeader(slide, 'Reliability & Fixes');
  addBullets(
    slide,
    [
      { text: 'User isolation across tasks and sessions' },
      { text: 'Leaderboard now uses database points, not local storage' },
      { text: 'Weekly graph persists and shows zero days' },
      { text: 'Streak logic validated on task completion' },
      { text: 'CGPA planner guards against divide-by-zero' },
      { text: 'JWT authentication enforced on all academic routes' }
    ],
    1.0,
    1.2,
    11.5,
    5.8
  );
  addFooter(slide, 'StudyMate Pro');
}

// Slide 12: Roadmap
{
  const slide = pptx.addSlide();
  addHeader(slide, 'Future Roadmap');
  addBullets(
    slide,
    [
      { text: 'Subject-wise study breakdowns and exportable reports' },
      { text: 'Mobile experience with offline support' },
      { text: 'Push notifications and reminders' },
      { text: 'Study groups and peer challenges' },
      { text: 'Pomodoro and adaptive scheduling modes' }
    ],
    1.0,
    1.4,
    11.5,
    4.8
  );
  addImagePlaceholder(slide, 1.0, 5.3, 11.3, 1.9, 'Roadmap Visual');
  addFooter(slide, 'StudyMate Pro');
}

// Slide 13: Closing
{
  const slide = pptx.addSlide();
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: SLIDE.w,
    h: SLIDE.h,
    fill: { color: COLORS.white }
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: SLIDE.w,
    h: 2.1,
    fill: { color: COLORS.blue }
  });
  slide.addText('Thank You', {
    x: 0.8,
    y: 0.45,
    w: 11.7,
    h: 1,
    fontFace: 'Calibri',
    fontSize: 44,
    color: COLORS.white,
    bold: true
  });
  slide.addText('Questions?', {
    x: 0.8,
    y: 2.7,
    w: 11.7,
    h: 0.8,
    fontFace: 'Calibri',
    fontSize: 28,
    color: COLORS.grayDark,
    bold: true
  });
  addImagePlaceholder(slide, 0.8, 3.6, 11.7, 3.0, 'Closing Image Placeholder');
  addFooter(slide, 'StudyMate Pro');
}

pptx.writeFile({ fileName: 'StudyMate_Pro_Presentation.pptx' });
