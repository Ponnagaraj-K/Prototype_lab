$root = "f:\New folder\study_Planner\studymate-pro-main\reference_pptx2\ppt\slides"

function Escape-Xml([string]$s) {
  if ($null -eq $s) { return "" }
  return $s.Replace('&','&amp;').Replace('<','&lt;').Replace('>','&gt;').Replace('"','&quot;').Replace("'",'&apos;')
}

function Replace-Texts($slidePath, $newTexts) {
  $xml = Get-Content $slidePath -Raw
  $matches = [regex]::Matches($xml, '<a:t>(.*?)</a:t>')
  $count = $matches.Count
  $list = New-Object System.Collections.Generic.List[string]
  for ($i=0; $i -lt $count; $i++) {
    if ($i -lt $newTexts.Count) { $list.Add((Escape-Xml $newTexts[$i])) }
    else { $list.Add("") }
  }
  $script:idx = 0
  $script:list = $list
  $updated = [regex]::Replace($xml, '<a:t>(.*?)</a:t>', {
    $val = $script:list[$script:idx]
    $script:idx++
    return "<a:t>$val</a:t>"
  })
  Set-Content -LiteralPath $slidePath -Value $updated -Encoding UTF8
}

# Slide 1 - Title
Replace-Texts "$root\slide1.xml" @(
  'StudyMate Pro',
  'Smart Study Planner & Productivity Tracker',
  'Project Presentation',
  'Guide:',
  'Project Mentor (Optional)',
  'Academic Year: 2025-2026',
  'Team Member 1',
  'ID 1',
  'Team Member 2',
  'ID 2',
  'Team Member 3',
  'ID 3'
)

# Slide 2 - Overview
Replace-Texts "$root\slide2.xml" @(
  'Project Overview',
  'StudyMate Pro is a smart study planner and productivity tracker.',
  'It generates daily tasks from CGPA goals and subject priorities.',
  'Students focus using a full-screen timer with bonus points.',
  'Built with React (frontend) and',
  'Node.js',
  '',
  '(backend).',
  'MongoDB stores user, task, and session data securely.',
  'Weekly analytics and AI insights guide improvements.',
  'Gamification boosts motivation through streaks and leaderboards.'
)

# Slide 3 - Image placeholder
Replace-Texts "$root\slide3.xml" @(
  'Project Image 1', '', '', '', '', '', ''
)

# Slide 4 - Problem/Importance
Replace-Texts "$root\slide4.xml" @(
  'Problem Statement',
  'Students lack a unified system to plan, track, and stay motivated.',
  'Why It Matters',
  'Consistent study habits directly affect academic outcomes.',
  'Manual tracking is time-consuming and inconsistent.',
  'Motivation drops without clear progress feedback.',
  'Key Challenges',
  'Fragmented planning tools',
  'No personalized CGPA guidance',
  'Low engagement without gamification',
  'Limited insight into weak subjects'
)

# Slide 5 - Image placeholder
Replace-Texts "$root\slide5.xml" @(
  'Project Image 2', '', '', '', '', '', '', '', '', ''
)

# Slide 6 - User Journey
Replace-Texts "$root\slide6.xml" @(
  'User Journey',
  'Sign up and set CGPA targets',
  'Add subjects and credits in setup',
  'How It Works',
  'System generates daily study tasks',
  'Focus session tracks time and points',
  'Benefits',
  'Weekly stats, insights, and streaks',
  'Leaderboard drives consistent progress'
)

# Slide 7 - Image placeholder
Replace-Texts "$root\slide7.xml" @(
  'Project Image 3', '', '', '', '', '', '', '', '', '', '', '', '', '', ''
)

# Slide 8 - Architecture & Flow
Replace-Texts "$root\slide8.xml" @(
  'System Architecture & Flow',
  'Frontend in React + TypeScript',
  'Backend APIs in Node.js + Express',
  'JWT-secured routes for academic data',
  'MongoDB stores profiles, tasks, sessions',
  'AI insights generated from study history',
  'Weekly stats aggregation for dashboards',
  'Deployment-ready structure',
  'Flow of Execution',
  'User Action -> API -> DB -> Analytics -> UI'
)

# Slide 9 - Image placeholder
Replace-Texts "$root\slide9.xml" @(
  'Project Image 4', '', '', '', '', '', ''
)

# Slide 10 - Tech Stack
Replace-Texts "$root\slide10.xml" @(
  '',
  'Frontend',
  'Backend',
  'Authentication',
  'Database',
  'Development Tools',
  'React 18',
  'Node.js',
  'JWT',
  'MongoDB',
  'VS Code',
  'TypeScript',
  'Express',
  'Git & GitHub',
  'Vite',
  'Tailwind CSS',
  '(Frontend Build)',
  'Render / Node',
  'Tools & Technologies'
)

# Slide 11 - Image placeholder
Replace-Texts "$root\slide11.xml" @(
  'Project Image 5', '', '', '', '', '', '', '', '', '', ''
)

# Slide 12 - Deliverables/Benefits/Roadmap
Replace-Texts "$root\slide12.xml" @(
  'Final Deliverables',
  'Working StudyMate Pro web app',
  'CGPA planner and task generator',
  'Focus session with points and streaks',
  'Dashboard analytics and insights',
  'Benefits to Users',
  'Clear daily study plan',
  'Motivation through rewards and streaks',
  'Actionable insights for improvement',
  'Better consistency and outcomes',
  'Future Impact',
  'Subject-wise breakdowns and reports',
  'Mobile app and notifications',
  'Study groups and peer challenges',
  'Adaptive scheduling and Pomodoro'
)

# Slide 13 - Image placeholder
Replace-Texts "$root\slide13.xml" @(
  'Project Image 6', ''
)
