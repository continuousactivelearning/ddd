Backend Philosophy for a Dopamine Dashboard
The core idea is to collect granular student interacƟon data, process it into
meaningful metrics, and serve these metrics quickly to the frontend. The
"dopamine" aspect means:
1. Immediate Feedback: Updates should be visible as soon as possible (e.g.,
streak counter, video progress).
2. GamificaƟon Logic: Rules for badges, levels, and leaderboard calculaƟons
must be robust.
3. PersonalizaƟon: Tailoring the experience based on individual progress and
performance.
4. Scalability: Designed to handle a growing number of students and data
points.
5. Reliability: Accurate tracking of all acƟviƟes.
I. Backend Workflow
The workflow describes how data flows through your system from collecƟon to
display.
1. Data IngesƟon Layer (Event Tracking):
o Source: Frontend (Web/Mobile App) sends events, or an external
LMS (Learning Management System) if integrated.
o Events: Every significant student acƟon is an "event." Examples:
 video_started: user_id, video_id, Ɵmestamp
 video_progress: user_id, video_id, progress_percentage,
Ɵmestamp
 video_completed: user_id, video_id, Ɵmestamp,
total_watch_Ɵme
 quiz_aƩempted: user_id, quiz_id, score, Ɵmestamp,
aƩempt_number
 quiz_completed: user_id, quiz_id, score, Ɵmestamp, passed
 lesson_accessed: user_id, lesson_id, Ɵmestamp
 daily_login: user_id, Ɵmestamp
 goal_set: user_id, goal_type, target_value, Ɵmestamp
 achievement_unlocked: user_id, achievement_id, Ɵmestamp
o Mechanism: Dedicated API endpoints for event logging. Could use a
message queue (e.g., KaŅa, RabbitMQ) for high-throughput,
asynchronous processing to avoid blocking the main applicaƟon.
2. Data Storage Layer:
o Primary Database (RelaƟonal - PostgreSQL/MySQL):
 Store core user profiles, course informaƟon, video metadata,
quiz quesƟons, badge definiƟons, level configuraƟons, daily
goals.
 Store granular event logs (e.g., user_video_progress,
user_quiz_aƩempts).
o Cache/In-Memory Database (Redis):
 For frequently accessed data (e.g., current streak, current
leaderboard, user sessions).
 For real-Ɵme aggregaƟons before persisƟng to the main DB.
3. Data Processing & AggregaƟon Layer (Backend Services/Workers):
o Real-Ɵme/Near Real-Ɵme AggregaƟons:
 Streak Counter: Triggered by daily_login or first acƟvity_event
of the day. Updates user's daily_streak field.
 Total Watch Time/Videos Completed: Updates
user_video_progress and aggregates total_watch_Ɵme and
videos_completed for the user.
 Recent AcƟvity: Appends new acƟviƟes to a user_acƟvity_log
table or Redis list.
 Video Progress: Updates specific user_video_progress record.
o Batch/Scheduled AggregaƟons:
 Average Quiz Score: Calculate periodically for all quizzes or per
course/topic.
 Topic-wise Mastery: Aggregate quiz scores and video
compleƟon rates per topic.
 Leaderboard Updates: Run periodically (e.g., hourly, daily) to
calculate and update leaderboard scores (e.g., based on XP,
compleƟon, quiz scores).
 Level CalculaƟon: Based on accumulated XP or compleƟon
rates.
 CompleƟon Rates: Calculate course_compleƟon_rate based on
videos_completed, quizzes_passed within a course.
 Daily Goals Progress: Check and update goal status.
 AcƟvity Calendar: Aggregate daily acƟvity status for
visualizaƟon.
o Mechanism: Background jobs (e.g., Celery with Redis/RabbitMQ for
Python, BullMQ for Node.js), cron jobs, or dedicated microservices.
4. API Layer (Backend Service):
o Purpose: Expose processed data to the frontend.
o Endpoints: RESTful APIs are standard. GraphQL could be considered
for flexible data fetching.
o AuthenƟcaƟon/AuthorizaƟon: Secure endpoints to ensure users can
only access their own data (or public data like leaderboards).
o Response Format: JSON.
5. Frontend ConsumpƟon:
o The dashboard UI makes API calls to fetch data.
o For real-Ɵme updates (like streak incremenƟng instantly),
WebSockets (e.g., Socket.IO, Django Channels) can be used to push
data from the backend to the frontend without constant polling.
II. Key Data Models (Simplified Schemas)
These are the core enƟƟes you'll need in your relaƟonal database:
//IGNORE IT JUST FOR REFERENCE AND FLOW
SQL
-- Users Table
CREATE TABLE users (
id SERIAL PRIMARY KEY,
username VARCHAR(255) UNIQUE NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
password_hash VARCHAR(255) NOT NULL,
current_level_id INT REFERENCES levels(id),
xp INT DEFAULT 0,
daily_streak INT DEFAULT 0,
last_acƟve_date DATE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Courses Table
CREATE TABLE courses (
id SERIAL PRIMARY KEY,
Ɵtle VARCHAR(255) NOT NULL,
descripƟon TEXT,
total_videos INT DEFAULT 0,
total_quizzes INT DEFAULT 0
);
-- Modules/Topics within Courses
CREATE TABLE modules (
id SERIAL PRIMARY KEY,
course_id INT REFERENCES courses(id),
Ɵtle VARCHAR(255) NOT NULL,
order_in_course INT
);
-- Videos Table
CREATE TABLE videos (
id SERIAL PRIMARY KEY,
module_id INT REFERENCES modules(id),
Ɵtle VARCHAR(255) NOT NULL,
url VARCHAR(255) NOT NULL,
duraƟon_seconds INT NOT NULL
);
-- Quizzes Table
CREATE TABLE quizzes (
id SERIAL PRIMARY KEY,
module_id INT REFERENCES modules(id),
Ɵtle VARCHAR(255) NOT NULL,
pass_score INT DEFAULT 70
);
-- User Video Progress (for compleƟon, watch Ɵme, retake/rewatch)
CREATE TABLE user_video_progress (
id SERIAL PRIMARY KEY,
user_id INT REFERENCES users(id),
video_id INT REFERENCES videos(id),
watched_duraƟon_seconds INT DEFAULT 0,
is_completed BOOLEAN DEFAULT FALSE,
last_watched_at TIMESTAMP,
UNIQUE (user_id, video_id) -- Ensures only one progress record per user per
video
);
-- User Quiz AƩempts (for scores, retake)
CREATE TABLE user_quiz_aƩempts (
id SERIAL PRIMARY KEY,
user_id INT REFERENCES users(id),
quiz_id INT REFERENCES quizzes(id),
score INT NOT NULL,
aƩempt_number INT DEFAULT 1,
is_passed BOOLEAN DEFAULT FALSE,
aƩempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- User Course Enrollments & Progress
CREATE TABLE user_course_enrollments (
id SERIAL PRIMARY KEY,
user_id INT REFERENCES users(id),
course_id INT REFERENCES courses(id),
enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
compleƟon_percentage DECIMAL(5,2) DEFAULT 0.00,
is_completed BOOLEAN DEFAULT FALSE,
completed_at TIMESTAMP
);
-- Daily AcƟvity Log (for streak, acƟve days, total Ɵme)
CREATE TABLE user_daily_acƟvity (
id SERIAL PRIMARY KEY,
user_id INT REFERENCES users(id),
acƟvity_date DATE NOT NULL,
total_Ɵme_spent_seconds INT DEFAULT 0,
is_acƟve BOOLEAN DEFAULT TRUE, -- Simply logged in or performed an acƟon
UNIQUE (user_id, acƟvity_date)
);
-- Badges
CREATE TABLE badges (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
descripƟon TEXT,
image_url VARCHAR(255),
criteria_json JSONB -- E.g., {"type": "videos_completed", "value": 10}, {"type":
"quiz_score", "quiz_id": 5, "min_score": 90}
);
-- User Badges (Achievements)
CREATE TABLE user_badges (
id SERIAL PRIMARY KEY,
user_id INT REFERENCES users(id),
badge_id INT REFERENCES badges(id),
awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Levels (for gamificaƟon)
CREATE TABLE levels (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
min_xp INT NOT NULL,
max_xp INT, -- NULL for the highest level
descripƟon TEXT
);
-- Daily Goals
CREATE TABLE daily_goals (
id SERIAL PRIMARY KEY,
user_id INT REFERENCES users(id),
goal_type VARCHAR(50) NOT NULL, -- e.g., 'watch_Ɵme', 'videos_completed',
'quiz_score'
target_value INT NOT NULL,
current_value INT DEFAULT 0,
goal_date DATE NOT NULL,
is_completed BOOLEAN DEFAULT FALSE,
UNIQUE (user_id, goal_type, goal_date)
);
-- Recent AcƟvity Log
CREATE TABLE user_recent_acƟviƟes (
id SERIAL PRIMARY KEY,
user_id INT REFERENCES users(id),
acƟvity_type VARCHAR(50) NOT NULL, -- e.g., 'video_completed', 'quiz_passed',
'badge_unlocked'
descripƟon TEXT NOT NULL,
Ɵmestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Leaderboard (Can be a materialized view or calculated on the fly/cached)
-- For simplicity, let's assume a calculated view or Redis for real-Ɵme.
-- If stored, it would be a periodically updated table:
-- CREATE TABLE leaderboard (
-- user_id INT REFERENCES users(id),
-- score INT,
-- rank INT,
-- last_updated TIMESTAMP
-- );
III. Backend API Endpoints (Examples)
Here are some example RESTful API endpoints for the dashboard:
User-Specific Endpoints:
 GET /api/v1/dashboard/me
o Returns comprehensive data for the logged-in user:
 Profile info, current_level, daily_streak
 total_watch_Ɵme (aggregated from user_video_progress)
 average_quiz_score (aggregated from user_quiz_aƩempts)
 videos_completed (count from user_video_progress)
 no_of_sessions (count from user_daily_acƟvity)
 total_Ɵme (sum from user_daily_acƟvity)
 acƟve_days (count from user_daily_acƟvity)
 no_of_quizzes_taken (count from user_quiz_aƩempts)
 compleƟon_rate (overall, or per course)
 total_courses (count from user_course_enrollments)
 GET /api/v1/dashboard/me/score-chart
o Returns data for the score chart (e.g., historical quiz scores).
 GET /api/v1/dashboard/me/topic-mastery
o Returns data for topic-wise mastery (e.g., scores per topic).
 GET /api/v1/dashboard/me/achievements
o Returns a list of user_badges.
 GET /api/v1/dashboard/me/daily-goals
o Returns daily_goals for the user.
 GET /api/v1/dashboard/me/acƟvity-calendar
o Returns user_daily_acƟvity for a given month/year.
 GET /api/v1/dashboard/me/recent-acƟvity
o Returns user_recent_acƟviƟes.
 GET /api/v1/dashboard/me/courses
o Returns user_course_enrollments with compleƟon_percentage.
 GET /api/v1/courses/{course_id}/progress
o Returns detailed progress for a specific course (e.g., list of videos with
user_video_progress, quizzes with user_quiz_aƩempts).
AcƟon Endpoints:
 POST /api/v1/events/video-progress
o Payload: { user_id, video_id, watched_duraƟon_seconds,
is_completed }
o Updates user_video_progress. Triggers total_watch_Ɵme,
videos_completed, XP updates.
 POST /api/v1/events/quiz-aƩempt
o Payload: { user_id, quiz_id, score, aƩempt_number, is_passed }
o Updates user_quiz_aƩempts. Triggers average_quiz_score, XP
updates, badge checks.
 POST /api/v1/videos/{video_id}/retake (or rewatch)
o This is mostly a frontend acƟon, reseƫng local state. Backend might
log user_video_progress from 0 if you want to track mulƟple
complete watches.
 POST /api/v1/quizzes/{quiz_id}/retake
o Increments aƩempt_number in user_quiz_aƩempts.
 POST /api/v1/daily-goals/set
o Allows users to set new goals.
Global/Leaderboard Endpoints:
 GET /api/v1/leaderboard
o Returns top users based on XP/score.
 GET /api/v1/badges
o Returns a list of all available badges and their criteria.
IV. Specific Feature ImplementaƟon (Backend Logic)
 Streak Counter:
o Logic: On every daily_login or first_acƟvity_of_day event, check
last_acƟve_date for the user.
 If last_acƟve_date is yesterday: Increment daily_streak.
 If last_acƟve_date is today: Do nothing (already counted).
 If last_acƟve_date is before yesterday: Reset daily_streak to 1.
o Store last_acƟve_date in the users table.
 Total Watch Time:
o Logic: When video_progress event comes, update
watched_duraƟon_seconds in user_video_progress. Sum these
values for the user to get total_watch_Ɵme.
 Average Quiz Score:
o Logic: Aggregate score from user_quiz_aƩempts for a user and divide
by no_of_quizzes_taken.
o Consider if you want average of all aƩempts or only the best aƩempt
per quiz.
 Videos Completed:
o Logic: Count is_completed = TRUE records in user_video_progress for
a user.
 Score Chart:
o Logic: Query user_quiz_aƩempts for historical scores, filtered by date
range if needed.
 Topic-wise Mastery:
o Logic: For each topic/module, calculate the average quiz score and
video compleƟon rate for all videos/quizzes within that topic.
 No. of Sessions & Total Time:
o Logic:
 No. of Sessions: Count disƟnct acƟvity_date in
user_daily_acƟvity.
 Total Time: Sum total_Ɵme_spent_seconds in
user_daily_acƟvity.
o You'll need logic to calculate total_Ɵme_spent_seconds for each day
(e.g., tracking login/logout Ɵmes, or Ɵme between first and last
acƟvity event on a given day).
 Level of User:
o Logic: Assign XP (Experience Points) for compleƟng videos, quizzes,
courses, unlocking badges. Match user's xp against levels table
min_xp and max_xp to determine current_level_id. This can be a
background job.
 AcƟve Days:
o Logic: Count disƟnct acƟvity_date entries in user_daily_acƟvity.
 Achievements (Badges):
o Logic: Define badges with criteria_json. When a relevant event occurs
(e.g., video_completed, quiz_passed), trigger a check for all badges
whose criteria match that event. If criteria met, award user_badge.
 Video Progress (Retake/Rewatch):
o Logic: user_video_progress tracks watched_duraƟon_seconds.
 Retake Quiz: Simply allow a new quiz_aƩempt entry for the
same user_id, quiz_id, incremenƟng aƩempt_number.
 Rewatch Video: The user_video_progress will simply conƟnue
updaƟng. If you want to track full rewatches, you might add a
rewatch_count or reset watched_duraƟon_seconds when a
user starts a video they previously completed.
 Recent AcƟvity:
o Logic: When any significant event happens (video completed, quiz
passed, badge unlocked, goal achieved), log it to
user_recent_acƟviƟes.
 CompleƟon Rate:
o Logic: For a course, calculate (videos_completed_in_course /
total_videos_in_course) * 0.5 + (quizzes_passed_in_course /
total_quizzes_in_course) * 0.5 (weighted average). Store in
user_course_enrollments.
 Leaderboard:
o Logic: Periodically (e.g., hourly cron job) calculate total XP or a
composite score for all acƟve users and store in a leaderboard table
or in Redis sorted sets for fast retrieval.
 Daily Goals:
o Logic: When an event occurs (e.g., video_completed), check if it
contributes to the user_daily_goal for today. Update current_value. If
current_value >= target_value, mark is_completed = TRUE.
 AcƟvity Calendar:
o Logic: Query user_daily_acƟvity for a given month/year and return
acƟvity_date and is_acƟve status.
V. Extra "Dopamine" Features (Backend Enablers)
Beyond the core requirements, consider these to amplify engagement:
1. AdapƟve Learning Path SuggesƟons:
o Backend Logic: Based on topic_wise_mastery and quiz_scores,
idenƟfy areas of weakness or strength. Recommend next
videos/quizzes that fill gaps or challenge the user further. This
requires basic recommendaƟon engine logic.
2. Personalized "Nudges" & NoƟficaƟons:
o Backend Logic: Implement a noƟficaƟon service. Trigger noƟficaƟons
for:
 "You're close to unlocking a badge!" (check badges criteria
against current progress).
 "Your streak is X days, keep it up!"
 "You haven't logged in for Y days, here's a new video you might
like." (requires user inacƟvity tracking).
 "New course/video released relevant to your interests."
o Can use WebSockets for real-Ɵme in-app noƟficaƟons, or push
noƟficaƟons (requires integraƟon with FCM/APNs).
3. Virtual Currency & Rewards Store:
o Backend Logic: Introduce a virtual_currency field in the users table.
Award currency for achievements, daily goals, high scores.
o Create a rewards table (e.g., "unlock exclusive content," "avatar
customizaƟon"). Users can "spend" currency via API endpoints.
4. Peer-to-Peer Challenges:
o Backend Logic: Allow users to challenge friends (e.g., "who can
complete this course faster?"). Track progress of mulƟple users
against a shared goal.
o Requires user_challenge table and real-Ɵme progress updates for
parƟcipaƟng users.
5. AI-Powered Feedback on Quizzes:
o Backend Logic: If you integrate with an NLP model, aŌer a quiz,
analyze incorrect answers and provide specific micro-feedback or
point to relevant video segments for review. (More advanced, but
highly engaging).
6. "Daily Mission" or "Weekly Challenge":
o Backend Logic: Similar to daily_goals, but system-generated. A service
pushes new missions daily/weekly.
7. Gamified Milestones & XP:
o Backend Logic: Ensure a clear XP system. Every meaningful acƟon
(video watched, quiz passed, lesson finished) awards XP. Show
progress towards the next level visually.
8. Public/Private Sharing of Achievements:
o Backend Logic: API endpoints to allow users to share their badges or
progress on social media (e.g., generaƟng an image with their stats).
VI. How to Build the Backend
1. Choose Your Technology Stack:
o Language: Python (Django/Flask), Node.js (Express), Go, Java (Spring
Boot) are all excellent choices.
 Python (Django/Django REST Framework): Great for rapid
development, ORM, admin panel. Good for data processing
with libraries like Pandas.
 Node.js (Express): Excellent for real-Ɵme applicaƟons with
WebSockets (Socket.IO). Good for I/O-bound tasks.
o Database: PostgreSQL (highly recommended for relaƟonal data,
JSONB support for flexible criteria), MySQL.
o Caching/Real-Ɵme: Redis (for session management, real-Ɵme
leaderboard, quick lookups, message queues).
o Asynchronous Task Queue: Celery (Python) with Redis/RabbitMQ
backend, or BullMQ (Node.js). EssenƟal for offloading heavy
computaƟons (e.g., leaderboard updates, complex badge checks).
o Real-Ɵme CommunicaƟon: Django Channels (Python), Socket.IO
(Node.js).
o ContainerizaƟon: Docker for consistent development and deployment
environments.
o Cloud Plaƞorm: AWS, Google Cloud Plaƞorm (GCP), Azure for hosƟng
(EC2/Compute Engine, RDS, ElasƟCache/Memorystore,
SQS/Pub/Sub).
2. Architectural Approach:
o Monolithic (Start Simple): One codebase for all backend logic. Easier
to start, deploy, and manage for smaller teams.
o Microservices (Future Scale): Break down funcƟonaliƟes (e.g., User
Service, Course Service, GamificaƟon Service, AnalyƟcs Service).
More complex to set up iniƟally, but beƩer for long-term scalability
and independent development. For your first version, a well-
structured monolith is oŌen sufficient.
3. Development Steps:
o Phase 1: Core User & Course Management:
 Set up basic API for user registraƟon, login, profile
management.
 Define users, courses, modules, videos, quizzes tables.
 API endpoints for fetching course lists, video details, quiz
details.
o Phase 2: Progress Tracking:
 Implement user_video_progress, user_quiz_aƩempts,
user_course_enrollments tables.
 Develop API endpoints for video_progress events and
quiz_aƩempt submissions.
 Start calculaƟng videos_completed, no_of_quizzes_taken,
compleƟon_rate.
o Phase 3: GamificaƟon & Dopamine Features:
 Implement user_daily_acƟvity, badges, levels, user_badges
tables.
 Develop background workers for streak_counter, level
calculaƟon, badge awarding.
 Implement leaderboard logic (can be calculated on demand
iniƟally, then move to scheduled updates).
 Add daily_goals tables and logic.
o Phase 4: Real-Ɵme & AnalyƟcs:
 Integrate WebSockets for instant updates (streak, new
achievement, leaderboard rank changes).
 Develop API endpoints for score_chart, topic_wise_mastery,
acƟve_days, total_Ɵme. These will involve more complex
database queries and aggregaƟons.
 Implement user_recent_acƟviƟes for the acƟvity feed.
o Phase 5: Enhancements & OpƟmizaƟon:
 Implement caching strategies (Redis).
 OpƟmize database queries (indexing, proper relaƟonships).
 Add monitoring and logging.
 Consider the "Extra Features" like recommendaƟons or
virtual currency.
4. Best PracƟces:
o AuthenƟcaƟon & AuthorizaƟon: Use JWT (JSON Web Tokens) or
OAuth 2.0. Ensure robust access control.
o Data ValidaƟon: Validate all incoming API request data to prevent
errors and malicious input.
o Error Handling: Implement consistent and informaƟve error
responses.
o Logging & Monitoring: Crucial for debugging and understanding
system performance.
o TesƟng: Write unit, integraƟon, and end-to-end tests.
o DocumentaƟon: Document your API endpoints clearly.
o Version Control: Use Git.
o Asynchronous Processing: Leverage background tasks for heavy
computaƟons to keep your main API responsive.