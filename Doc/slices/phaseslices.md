# LMS Phase Slices

**Stack:** Next.js (Vercel) + Supabase
**Total:** 42 slices — 21 Backend + 21 Frontend — across 7 phases
**Rule:** BE slices first per phase, then matching FE slices. Frontend can start with mock data in parallel.

---

## Phase Summary

| Phase | Goal | Backend Slices | Frontend Slices |
|---|---|---|---|
| **Phase 0** — Project Initialization | One-time setup for both developers | BE-00 | FE-00 |
| **Phase 1** — Foundation | Auth, roles, student, faculty, parent | BE-01, BE-02, BE-03, BE-04 | FE-01, FE-02, FE-03, FE-04 |
| **Phase 2** — Course Infrastructure | Courses, batches, timetable | BE-05 | FE-05 |
| **Phase 3** — Academic Operations | Attendance, live classes, syllabus, homework | BE-06, BE-07, BE-08, BE-09, BE-10 | FE-06, FE-07, FE-08, FE-09, FE-10 |
| **Phase 4** — Examinations | Tests, MCQ engine, evaluation, results, ranks | BE-11, BE-12, BE-13, BE-14 | FE-11, FE-12, FE-13, FE-14 |
| **Phase 5** — Finance and Communications | Fees, notifications, calendar, meetings | BE-15, BE-16, BE-17 | FE-15, FE-16, FE-17 |
| **Phase 6** — Intelligence and Reporting | AI analytics, reports, audit logs | BE-18, BE-19 | FE-18, FE-19 |
| **Phase 7** — Offline and Sync | PWA, IndexedDB, offline sync engine | BE-20, BE-21 | FE-20, FE-21 |

---

## Dependency Order

Phase 1 must complete before any other phase. Within a phase, slices run in parallel.

```
Phase 1:  BE-01 → BE-02, BE-03, BE-04 (parallel)
Phase 2:  BE-05 (needs BE-02, BE-03)
Phase 3:  BE-06, BE-07, BE-08, BE-09, BE-10 (all need BE-05, run in parallel)
Phase 4:  BE-11, BE-12, BE-13, BE-14 (need BE-09; BE-12 needs BE-11; BE-13/14 need BE-12)
Phase 5:  BE-15, BE-16, BE-17 (need BE-05; run in parallel)
Phase 6:  BE-18, BE-19 (need BE-06, BE-14, BE-15)
Phase 7:  BE-20, BE-21 (need BE-06, BE-12)
```

Frontend slices can start with mock data immediately — wire to real backend after BE slice is Done.

---

## Repository Structure

**One repo. Both developers. Different folders.**

```
lms/
├── supabase/
│   └── migrations/          ← Backend dev (SQL migration files)
│
├── app/
│   ├── (auth)/              ← Auth pages
│   ├── (dashboard)/         ← Role-based dashboards
│   ├── api/
│   │   ├── notify/          ← POST /api/notify
│   │   ├── payment/webhook/ ← POST /api/payment/webhook
│   │   ├── ai/analyze/      ← POST /api/ai/analyze
│   │   ├── sync/            ← POST /api/sync
│   │   └── report/generate/ ← POST /api/report/generate
│   └── layout.tsx
│
├── components/              ← Shared UI components
├── lib/
│   └── supabase.ts          ← Supabase browser client
└── types/                   ← DB type definitions
```

| Developer | Owns | Never touches |
|---|---|---|
| Backend dev | `supabase/migrations/` + Supabase dashboard | `app/`, `components/` |
| Frontend dev | `app/`, `components/`, `lib/`, `app/api/` | `supabase/migrations/` |

> Supabase is the server. Backend dev writes SQL, not Node.js. No separate backend repo needed.

---


## Phase 0 - Project Initialization

Goal: One-time setup. Both developers do this before any slice work starts.

| Slice | Type | Name |
|---|---|---|
| BE-00 | Backend | Supabase Project Setup |
| FE-00 | Frontend | Next.js Project Setup |

---

### BE-00 - Supabase Project Setup

| Field | Detail |
|---|---|
| Slice ID | BE-00 |
| Phase | 0 - Initialization |
| Type | Backend |
| Depends On | None |
| Blocks | All BE slices |

**Steps:**
1. Create project at supabase.com → note `SUPABASE_URL` and `SUPABASE_ANON_KEY`
2. Enable extensions in SQL Editor: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
3. Create storage buckets: `student-documents` (private), `omr-sheets` (private), `reports` (private)
4. Set JWT secret in Supabase Auth settings
5. Create `.env` file:

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RAZORPAY_KEY_SECRET=...
MSG91_API_KEY=...
```

**Definition of Done:** [ ] Supabase project live [ ] Extensions enabled [ ] Storage buckets created [ ] .env ready

---

### FE-00 - Next.js Project Setup

| Field | Detail |
|---|---|
| Slice ID | FE-00 |
| Phase | 0 - Initialization |
| Type | Frontend |
| Depends On | BE-00 (for Supabase URL and key) |
| Blocks | All FE slices |

**Steps:**
```bash
npx create-next-app@latest . --typescript --app --eslint
npm install @supabase/supabase-js @supabase/ssr
```

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Create `lib/supabase.ts`:
```ts
import { createBrowserClient } from '@supabase/ssr'
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

**Folder structure:** (see Repository Structure section above for full tree)
```
supabase/migrations/   ← Backend dev writes SQL here
app/                   ← Frontend dev writes pages here
app/api/               ← 5 Vercel serverless functions
components/            ← shared UI
lib/supabase.ts        ← Supabase client (one file)
types/                 ← DB types
```

**Definition of Done:** [ ] `npm run dev` runs without errors [ ] Supabase client connects [ ] `.env.local` in .gitignore

---

## Phase 1 - Foundation

Goal: Auth, roles, student profile, faculty, parent portal.

| Slice | Type | Name |
|---|---|---|
| BE-01 | Backend | Auth and RBAC |
| BE-02 | Backend | Student Admission and Profile |
| BE-03 | Backend | Faculty Management |
| BE-04 | Backend | Parent Portal and Mapping |
| FE-01 | Frontend | Auth and Login Screens |
| FE-02 | Frontend | Student Registration and Profile Screens |
| FE-03 | Frontend | Faculty Management Screens |
| FE-04 | Frontend | Parent Portal Screens |

---

### BE-01 - Auth and RBAC

| Field | Detail |
|---|---|
| Slice ID | BE-01 |
| Phase | 1 - Foundation |
| Type | Backend |
| Supabase Tables | users, roles, user_roles |
| Vercel Function | None |
| Depends On | None |
| Blocks | All other slices |

**SQL Migrations:** users (id UUID, email, phone, is_active, created_at), roles (id, name: admin/faculty/student/parent), user_roles (user_id, role_id), Enable Supabase Auth with email + OTP phone

**RLS Policies:** User reads own row only. Role assignment admin-only. JWT role claims verified on every request.

**Integration Tests:** Register user > assign role > login > verify JWT role. Wrong role access > verify 403.

**Definition of Done:** [ ] Migrations run [ ] OTP login works [ ] Role assignment works [ ] JWT claims verified

---

### FE-01 - Auth and Login Screens

| Field | Detail |
|---|---|
| Slice ID | FE-01 |
| Phase | 1 - Foundation |
| Type | Frontend |
| Depends On | BE-01 or local mock |
| Blocks | All other FE slices |

**Screens:** 1. Login Page (email+password) 2. OTP Verification 3. Forgot Password 4. Role Selection 5. Unauthorized 403 Page

**Key Buttons:** Login > supabase.auth.signInWithPassword() | Send OTP > supabase.auth.signInWithOtp() | Verify OTP > supabase.auth.verifyOtp() | Logout > supabase.auth.signOut() | Forgot Password > supabase.auth.resetPasswordForEmail()

**E2E Manual Test:** 1. Valid login > verify redirect to dashboard 2. Wrong password > verify error 3. OTP login full flow > verify success 4. Logout > verify session cleared and protected route blocked

**Definition of Done:** [ ] Login renders [ ] OTP works end-to-end [ ] Role redirect works [ ] Logout clears session

---

### BE-02 - Student Admission and Profile

| Field | Detail |
|---|---|
| Slice ID | BE-02 |
| Phase | 1 - Foundation |
| Type | Backend |
| Supabase Tables | students, student_addresses, student_documents, student_parent_links |
| Vercel Function | None |
| Depends On | BE-01 |
| Blocks | BE-05 BE-06 BE-09 BE-10 BE-11 BE-15 |

**SQL Migrations:** students (id, user_id FK, admission_number unique, first_name, last_name, gender, dob, blood_group, category, mobile, email, status, academic_year, created_at), student_addresses (id, student_id, type: current/permanent, address_line, city, state, pin_code), student_documents (id, student_id, doc_type, file_url, uploaded_at), student_parent_links (id, student_id, parent_id, relation, can_pay_fees bool, receives_notifications bool). Supabase Storage bucket: student-documents (private).

**RLS Policies:** Admin reads and writes all. Student reads own row only. Parent reads rows linked via student_parent_links. Documents accessible only to linked users.

**Integration Tests:** Create student > verify unique admission_number. Upload document > verify Supabase Storage file + URL. Student reads another student > verify blocked.

**Definition of Done:** [ ] Student creation with auto admission number [ ] Document upload works [ ] RLS cross-student block verified

---

### FE-02 - Student Registration and Profile Screens

| Field | Detail |
|---|---|
| Slice ID | FE-02 |
| Phase | 1 - Foundation |
| Type | Frontend |
| Depends On | BE-02 or mock student fixture |

**Screens:** 1. Student List (Admin, searchable table) 2. Registration Form (multi-step: Basic, Contact, Parent, Address, Documents, Review) 3. Student Profile View (read-only for Student/Parent) 4. Edit Student Profile (Admin only) 5. Document Upload Section

**Key Buttons:** Add New Student > open multi-step form | Upload Photo > supabase.storage.upload() | Submit Registration > supabase.from(students).insert() | Edit > supabase.from(students).update() | Deactivate > update status inactive | Search > supabase.from(students).select().ilike(first_name)

**E2E Manual Test:** 1. Admin adds student full form > verify in list with admission number 2. Upload Aadhaar > verify saved 3. Student login > verify only own profile, no edit button 4. Search by name > verify filtered results

**Definition of Done:** [ ] Multi-step form submits all sections [ ] Document upload works [ ] List search works [ ] Role visibility correct

---

### BE-03 - Faculty Management

| Field | Detail |
|---|---|
| Slice ID | BE-03 |
| Phase | 1 - Foundation |
| Type | Backend |
| Supabase Tables | faculty, faculty_subjects |
| Vercel Function | None |
| Depends On | BE-01 |
| Blocks | BE-05 |

**SQL Migrations:** faculty (id, user_id FK, employee_code unique, first_name, last_name, mobile, email, qualification, experience_years, joining_date, status, created_at), faculty_subjects (id, faculty_id, subject_id, specialization_notes)

**RLS Policies:** Admin reads and writes all. Faculty reads and updates own row only. Employee code unique DB constraint.

**Integration Tests:** Create faculty > verify employee_code generated and login created in users. Faculty reads another faculty profile > blocked.

**Definition of Done:** [ ] Faculty creation with unique code [ ] Login auto-created [ ] RLS cross-faculty block works

---

### FE-03 - Faculty Management Screens

| Field | Detail |
|---|---|
| Slice ID | FE-03 |
| Phase | 1 - Foundation |
| Type | Frontend |
| Depends On | BE-03 or mock faculty fixture |

**Screens:** 1. Faculty List (Admin) 2. Add Faculty Form 3. Faculty Profile Page 4. Subject Assignment Panel 5. Performance Summary (read-only counts)

**Key Buttons:** Add Faculty > supabase.from(faculty).insert() | Edit > supabase.from(faculty).update() | Assign Subject > supabase.from(faculty_subjects).insert() | Deactivate > update status inactive

**E2E Manual Test:** 1. Admin adds faculty > verify in list with employee code 2. Edit mobile > verify saved 3. Faculty login > verify only own profile editable

**Definition of Done:** [ ] List and form work [ ] Subject assignment saves [ ] Role-based edit restriction works

---

### BE-04 - Parent Portal and Mapping

| Field | Detail |
|---|---|
| Slice ID | BE-04 |
| Phase | 1 - Foundation |
| Type | Backend |
| Supabase Tables | parents, student_parent_links |
| Vercel Function | None |
| Depends On | BE-01 BE-02 |
| Blocks | BE-17 |

**SQL Migrations:** parents (id, user_id FK, first_name, last_name, relation_type, occupation, mobile, email, created_at), student_parent_links (id, student_id, parent_id, relation, can_pay_fees bool, receives_notifications bool). One parent can link to multiple students.

**RLS Policies:** Parent reads data only of linked students via student_parent_links. Admin manages all parent records. Parent cannot see unlinked students.

**Integration Tests:** Create parent > link to 2 students > verify both accessible. Fetch unlinked student as parent > blocked.

**Definition of Done:** [ ] Parent creation and student link works [ ] Multi-child access verified [ ] RLS cross-student block works

---

### FE-04 - Parent Portal Screens

| Field | Detail |
|---|---|
| Slice ID | FE-04 |
| Phase | 1 - Foundation |
| Type | Frontend |
| Depends On | BE-04 or mock parent fixture |

**Screens:** 1. Parent Dashboard (child selector) 2. Child Overview Card (attendance %, last score, pending fees) 3. Notification Preferences 4. Parent Profile View

**Key Buttons:** Select Child > toggle active student context | View Attendance > navigate to FE-06 in parent view | View Fees > navigate to FE-15 | Download Report Card > navigate to FE-19 | Edit Preferences > supabase.from(parents).update()

**E2E Manual Test:** 1. Login as Parent > child selector shows > select child > overview appears 2. 2-child parent > toggle child > data switches 3. Verify parent cannot access admin sections

**Definition of Done:** [ ] Dashboard with child selector works [ ] Overview metrics visible [ ] Navigation to child sections works

---

## Phase 2 - Course Infrastructure

Goal: Courses, subjects, batches, classrooms, timetables.

| Slice | Type | Name |
|---|---|---|
| BE-05 | Backend | Course and Batch Management |
| FE-05 | Frontend | Course and Batch Screens |

---

### BE-05 - Course and Batch Management

| Field | Detail |
|---|---|
| Slice ID | BE-05 |
| Phase | 2 - Course Infrastructure |
| Type | Backend |
| Supabase Tables | courses, subjects, batches, batch_students, batch_faculty, classrooms, timetable_slots |
| Vercel Function | None |
| Depends On | BE-02 BE-03 |
| Blocks | BE-06 BE-07 BE-08 BE-09 BE-10 BE-11 BE-15 BE-17 |

**SQL Migrations:** courses (id, name, description, duration_months, academic_year, status), subjects (id, course_id, name, subject_code, status), batches (id, course_id, name, batch_code unique, start_date, end_date, capacity, status), batch_students (batch_id, student_id, enrolled_date, status), batch_faculty (batch_id, subject_id, faculty_id, start_date, end_date), classrooms (id, name, capacity, location), timetable_slots (id, batch_id, subject_id, faculty_id, classroom_id, day_of_week, start_time, end_time). DB constraint: prevent faculty double-booking on overlapping time slots.

**RLS Policies:** Admin full access. Faculty reads only assigned batches and students. Student reads only enrolled batches.

**Integration Tests:** Create course > subjects > batch > assign faculty > verify conflict check fires on overlap. Enroll student > verify batch_students row. Faculty reads non-assigned batch > blocked.

**Definition of Done:** [ ] Course to Batch hierarchy saves [ ] Conflict check works [ ] Student enrollment works [ ] RLS verified

---

### FE-05 - Course and Batch Screens

| Field | Detail |
|---|---|
| Slice ID | FE-05 |
| Phase | 2 - Course Infrastructure |
| Type | Frontend |
| Depends On | BE-05 or mock fixture |

**Screens:** 1. Course List 2. Create/Edit Course Form 3. Subject Panel (per course) 4. Batch List 5. Create/Edit Batch Form 6. Classroom Management 7. Timetable View (weekly grid) 8. Student Enrollment Page 9. Faculty Assignment Panel

**Key Buttons:** Create Course > supabase.from(courses).insert() | Add Subject > supabase.from(subjects).insert() | Create Batch > supabase.from(batches).insert() | Assign Faculty > supabase.from(batch_faculty).insert() | Enroll Student > supabase.from(batch_students).insert() | Transfer Student > deactivate old then insert new | Add Timetable Slot > supabase.from(timetable_slots).insert() | Conflict Warning > client-side slot conflict check before insert

**E2E Manual Test:** 1. Admin: Course > Subject > Batch > Faculty > 5 Students > verify batch dashboard shows all 2. Same faculty overlapping slot > conflict warning 3. Faculty login > only assigned batches visible 4. Student login > only enrolled batch visible

**Definition of Done:** [ ] Full creation flow works [ ] Conflict warning shown [ ] Role visibility correct

---

## Phase 3 - Academic Operations

Goal: Attendance, live classes, syllabus, homework.

| Slice | Type | Name |
|---|---|---|
| BE-06 | Backend | Attendance Daily and Online |
| BE-07 | Backend | Attendance QR Code and Offline |
| BE-08 | Backend | Live Classes and Recordings |
| BE-09 | Backend | Syllabus Management |
| BE-10 | Backend | Homework and Assignments |
| FE-06 | Frontend | Attendance Marking Screens |
| FE-07 | Frontend | QR Attendance Screens |
| FE-08 | Frontend | Live Classes Screens |
| FE-09 | Frontend | Syllabus Screens |
| FE-10 | Frontend | Homework Screens |

---

### BE-06 - Attendance Daily and Online

| Field | Detail |
|---|---|
| Slice ID | BE-06 |
| Phase | 3 - Academic Operations |
| Type | Backend |
| Supabase Tables | attendance_sessions, attendance_records |
| Vercel Function | None (absent trigger calls /api/notify) |
| Depends On | BE-05 |
| Blocks | BE-16 BE-18 BE-19 |

**SQL Migrations:** attendance_sessions (id, batch_id, subject_id, faculty_id, session_date, session_type, created_at), attendance_records (id, session_id, student_id, status: present/absent/late/half_day/leave, marked_by, marked_at, is_offline_sync bool, sync_status). Unique constraint: (session_id, student_id). DB trigger: absent INSERT calls /api/notify webhook.

**RLS Policies:** Faculty inserts/updates only for assigned batches. Admin reads and edits all. Student reads own records. Parent reads linked student records.

**Integration Tests:** Mark 5 students > verify 5 rows. Duplicate mark > unique constraint fires. Mark absent > notify trigger fires. Student reads another's record > blocked.

**Definition of Done:** [ ] Session and marking works [ ] Duplicate prevention works [ ] Absent trigger fires [ ] RLS verified

---

### BE-07 - Attendance QR Code and Offline

| Field | Detail |
|---|---|
| Slice ID | BE-07 |
| Phase | 3 - Academic Operations |
| Type | Backend |
| Supabase Tables | qr_tokens |
| Vercel Function | None - validation via Supabase RPC |
| Depends On | BE-06 |
| Blocks | BE-21 |

**SQL Migrations:** qr_tokens (id, session_id, token UUID, expires_at, is_used bool, created_at). Supabase RPC validate_qr_and_mark_attendance(token, student_id): checks not expired, not used, marks present, marks token used atomically.

**RLS Policies:** Only assigned faculty can create QR tokens. Any enrolled student can call the RPC with valid token.

**Integration Tests:** Generate QR > student calls RPC > attendance marked. Expired token > rejected. Same token twice > second rejected. Non-batch student > rejected.

**Definition of Done:** [ ] QR generation works [ ] RPC validates and marks atomically [ ] Expiry and single-use enforced

---

### FE-06 - Attendance Marking Screens

| Field | Detail |
|---|---|
| Slice ID | FE-06 |
| Phase | 3 - Academic Operations |
| Type | Frontend |
| Depends On | BE-06 or mock attendance fixture |

**Screens:** 1. Faculty Dashboard Mark Attendance entry 2. Batch + Date + Session Selector 3. Attendance Sheet (Present/Absent/Late/Leave toggle per student) 4. Submit Confirmation 5. History View (Faculty/Admin) 6. Student Monthly Calendar View 7. Parent Child Attendance View 8. Absent Student List (Admin/Faculty)

**Key Buttons:** Mark Present/Absent > toggle local state | Submit > supabase.from(attendance_records).insert all records | View History > select by batch_id | Export Absent List > filter absent > download

**E2E Manual Test:** 1. Faculty: select batch > date > mark 4 present 1 absent > Submit > success toast 2. Reopen session > marked statuses shown 3. Student: monthly % shown 4. Parent: child attendance visible

**Definition of Done:** [ ] Sheet loads batch student list [ ] Submits all records in one call [ ] History view works

---

### FE-07 - QR Attendance Screens

| Field | Detail |
|---|---|
| Slice ID | FE-07 |
| Phase | 3 - Academic Operations |
| Type | Frontend |
| Depends On | BE-07 or mock QR fixture |

**Screens:** 1. Faculty: Generate QR Screen (countdown timer) 2. Student: QR Scanner Screen (camera) 3. Attendance Confirmed Screen 4. Error Screen (expired/invalid/already scanned) 5. Offline Pending Sync banner

**Key Buttons:** Generate QR > supabase.from(qr_tokens).insert() then show QR | Scan QR > camera API > decode > call Supabase RPC | Sync Now > POST /api/sync

**E2E Manual Test:** 1. Generate QR > student scans > Attendance Marked shown 2. Expired QR > error message 3. Scan twice > Already Marked error 4. Offline: mark > Pending Sync badge > reconnect > synced

**Definition of Done:** [ ] QR with countdown works [ ] Scanner validates correctly [ ] Offline indicator visible

---

### BE-08 - Live Classes and Recordings

| Field | Detail |
|---|---|
| Slice ID | BE-08 |
| Phase | 3 - Academic Operations |
| Type | Backend |
| Supabase Tables | live_classes, class_recordings, class_join_logs |
| Vercel Function | None |
| Depends On | BE-05 |
| Blocks | None |

**SQL Migrations:** live_classes (id, batch_id, subject_id, faculty_id, title, scheduled_at, duration_minutes, platform, meeting_link, meeting_password, status, created_at), class_recordings (id, class_id, title, recording_url, file_type, restricted_to_batch bool, uploaded_at), class_join_logs (id, class_id, student_id, joined_at, left_at).

**RLS Policies:** Faculty/Admin create and manage classes. Students read only enrolled batch classes. Recordings restricted to batch students when restricted_to_batch is true.

**Integration Tests:** Create class > enrolled student sees it, non-enrolled does not. Recording with batch restriction > non-batch student blocked.

**Definition of Done:** [ ] Class creation and listing works [ ] Recording batch restriction works [ ] Join log insertion works

---

### FE-08 - Live Classes Screens

| Field | Detail |
|---|---|
| Slice ID | FE-08 |
| Phase | 3 - Academic Operations |
| Type | Frontend |
| Depends On | BE-08 or mock fixture |

**Screens:** 1. Class Schedule List (Student/Faculty) 2. Create/Edit Class Form (Faculty/Admin) 3. Class Detail with Join button 4. Recordings Library 5. Recording Player

**Key Buttons:** Schedule Class > supabase.from(live_classes).insert() | Join Class > open meeting_link + log join | Upload Recording > supabase.storage.upload() + insert recording row | Watch > open recording URL

**E2E Manual Test:** 1. Faculty schedules class with Zoom link > appears on student dashboard 2. Student Join Class > external link opens 3. Faculty uploads recording > visible in library

**Definition of Done:** [ ] Class list renders [ ] Join opens link [ ] Recording upload and playback work

---

### BE-09 - Syllabus Management

| Field | Detail |
|---|---|
| Slice ID | BE-09 |
| Phase | 3 - Academic Operations |
| Type | Backend |
| Supabase Tables | syllabus_units, chapters, topics, topic_progress, syllabus_notes |
| Vercel Function | None |
| Depends On | BE-05 |
| Blocks | BE-11 BE-18 |

**SQL Migrations:** syllabus_units (id, subject_id, title, order_index), chapters (id, unit_id, title, order_index), topics (id, chapter_id, title, order_index), topic_progress (id, topic_id, batch_id, faculty_id, completed bool, completed_at) with unique(topic_id, batch_id), syllabus_notes (id, topic_id, batch_id, title, file_url, note_type: pdf/video/link, uploaded_at). View: syllabus_completion_pct per batch per subject.

**RLS Policies:** Admin creates/edits all structure. Faculty marks topic_progress only for assigned batch+subject. Students read syllabus and progress for enrolled batches. Notes accessible to enrolled students only.

**Integration Tests:** Create unit > chapter > topic > mark complete > verify % updates. Faculty marks topic outside batch > blocked. Student reads notes for enrolled batch > ok, other batch > blocked.

**Definition of Done:** [ ] Syllabus tree saves correctly [ ] Completion % calculated correctly [ ] Notes upload and batch restriction works

---

### FE-09 - Syllabus Screens

| Field | Detail |
|---|---|
| Slice ID | FE-09 |
| Phase | 3 - Academic Operations |
| Type | Frontend |
| Depends On | BE-09 or mock fixture |

**Screens:** 1. Syllabus Builder (Admin - tree view) 2. Faculty Progress Page (topic checklist with Mark Complete) 3. Student View (read-only with progress bars) 4. Admin Faculty Overview (% per faculty per subject) 5. Notes Upload (Faculty) 6. Notes Download (Student)

**Key Buttons:** Add Unit/Chapter/Topic > supabase.from(table).insert() | Mark Complete > supabase.from(topic_progress).upsert() | Upload Notes > storage.upload() + insert notes row | Download Notes > storage.getPublicUrl()

**E2E Manual Test:** 1. Admin: Unit > Chapter > 3 Topics > tree renders 2. Faculty marks 2/3 complete > progress bar 66% 3. Student views syllabus > completed topics marked 4. Faculty uploads PDF > student downloads it

**Definition of Done:** [ ] Tree renders correctly [ ] Mark complete updates progress bar [ ] Notes upload and download work

---

### BE-10 - Homework and Assignments

| Field | Detail |
|---|---|
| Slice ID | BE-10 |
| Phase | 3 - Academic Operations |
| Type | Backend |
| Supabase Tables | homework, homework_submissions |
| Vercel Function | None (deadline trigger calls /api/notify) |
| Depends On | BE-05 |
| Blocks | BE-16 BE-18 |

**SQL Migrations:** homework (id, batch_id, subject_id, faculty_id, title, description, deadline, attachment_url, created_at), homework_submissions (id, homework_id, student_id, file_url, comments, submitted_at, marks, faculty_remarks, graded_at, is_late bool). DB trigger: on homework INSERT calls /api/notify for batch students.

**RLS Policies:** Faculty creates homework for assigned batches only. Students submit only for enrolled batch homework. Faculty reads/grades submissions for their batches. Parent reads linked student submission status.

**Integration Tests:** Create homework > notify trigger fires > visible to batch. Student submits > is_late calculated correctly. Faculty grades > marks saved.

**Definition of Done:** [ ] Homework creation works [ ] Submission with file upload works [ ] Late flag calculated correctly [ ] Faculty grading saves

---

### FE-10 - Homework Screens

| Field | Detail |
|---|---|
| Slice ID | FE-10 |
| Phase | 3 - Academic Operations |
| Type | Frontend |
| Depends On | BE-10 or mock fixture |

**Screens:** 1. Faculty: Create Homework Form 2. Faculty: Submissions Review with grading panel 3. Student: Homework List (pending/submitted/graded tabs) 4. Student: Homework Detail and Submit 5. Parent: Child Homework Status

**Key Buttons:** Create Homework > supabase.from(homework).insert() | Submit Assignment > storage.upload() + insert submission row | Grade Submission > update with marks and faculty_remarks | Download Attachment > storage.getPublicUrl()

**E2E Manual Test:** 1. Faculty creates HW with deadline > students see it 2. Student uploads file > Submit > Submitted shown 3. Faculty grades > student sees grade 4. Submit after deadline > Late badge shown

**Definition of Done:** [ ] Creation works [ ] File submission saves [ ] Grading saves and shows to student [ ] Late flag visible

---

## Phase 4 - Examinations

Goal: Test creation, MCQ engine, evaluation, results, ranks.

| Slice | Type | Name |
|---|---|---|
| BE-11 | Backend | Test Creation and Publishing |
| BE-12 | Backend | MCQ Online Test Engine |
| BE-13 | Backend | Subjective and OMR Evaluation |
| BE-14 | Backend | Results, Ranks and Topper List |
| FE-11 | Frontend | Test Creation Screens |
| FE-12 | Frontend | Student Test Attempt Screens |
| FE-13 | Frontend | Evaluation Screens |
| FE-14 | Frontend | Results and Ranks Screens |

---

### BE-11 - Test Creation and Publishing

| Field | Detail |
|---|---|
| Slice ID | BE-11 |
| Phase | 4 - Examinations |
| Type | Backend |
| Supabase Tables | tests, questions, question_options, question_topic_map |
| Vercel Function | None |
| Depends On | BE-05 BE-09 |
| Blocks | BE-12 BE-13 BE-14 |

**SQL Migrations:** tests (id, batch_id, subject_id, faculty_id, title, test_code unique, level, type, total_marks, duration_minutes, negative_marking_ratio, start_at, end_at, result_publish_at, shuffle_questions bool, show_result_immediately bool, status), questions (id, test_id, topic_id FK, question_text, question_type, marks, difficulty, order_index), question_options (id, question_id, option_text, is_correct bool), question_topic_map (question_id, topic_id).

**RLS Policies:** Faculty/Admin create tests for assigned batches. Published questions readable by enrolled students within test window only. After result_publish_at, answers readable by enrolled students.

**Integration Tests:** Create MCQ test > publish > visible to enrolled student at start_at. Questions not accessible before start_at. Draft test invisible to students.

**Definition of Done:** [ ] Test with questions and options saves [ ] Question-topic mapping saves [ ] Time-gated visibility works

---

### BE-12 - MCQ Online Test Engine

| Field | Detail |
|---|---|
| Slice ID | BE-12 |
| Phase | 4 - Examinations |
| Type | Backend |
| Supabase Tables | test_attempts, student_answers |
| Vercel Function | None - evaluation via Supabase RPC |
| Depends On | BE-11 |
| Blocks | BE-14 |

**SQL Migrations:** test_attempts (id, test_id, student_id, started_at, submitted_at, total_marks_obtained, status: in_progress/submitted/timed_out). Unique constraint (test_id, student_id). student_answers (id, attempt_id, question_id, selected_option_id, text_answer, is_correct, marks_awarded). Supabase RPC auto_evaluate_mcq(attempt_id): evaluates each MCQ, applies negative marking, sums total.

**RLS Policies:** Student creates one attempt per test only. Student reads/writes own attempt. Faculty/Admin read all attempts for their tests.

**Integration Tests:** Student attempts > submits > RPC evaluates correctly with negative marking. Second attempt same test > blocked. Duration exceeded > auto-submit.

**Definition of Done:** [ ] Single-attempt enforcement works [ ] MCQ evaluation correct [ ] Negative marking correct [ ] Auto-submit works

---

### BE-13 - Subjective and OMR Evaluation

| Field | Detail |
|---|---|
| Slice ID | BE-13 |
| Phase | 4 - Examinations |
| Type | Backend |
| Supabase Tables | omr_uploads, updates to student_answers |
| Vercel Function | None |
| Depends On | BE-12 |
| Blocks | BE-14 |

**SQL Migrations:** omr_uploads (id, test_id, file_url, processed bool, processed_at, uploaded_by). Add to student_answers: omr_upload_id, faculty_marks, faculty_remarks. Storage bucket: omr-sheets (admin/faculty only).

**RLS Policies:** Faculty uploads OMR and assigns manual marks for their tests. Students read evaluated answers only after result_publish_at. OMR files not accessible by students.

**Integration Tests:** Faculty uploads OMR > marks processed > assigns marks > verify saved. Subjective marks with remarks > verify saved. Student reads feedback after publish > accessible.

**Definition of Done:** [ ] OMR upload to Supabase Storage works [ ] Manual marks entry works [ ] Student feedback visible post-publish

---

### BE-14 - Results, Ranks and Topper List

| Field | Detail |
|---|---|
| Slice ID | BE-14 |
| Phase | 4 - Examinations |
| Type | Backend |
| Supabase Tables | test_results, test_ranks |
| Vercel Function | None - rank generation via Supabase RPC |
| Depends On | BE-12 BE-13 |
| Blocks | BE-18 |

**SQL Migrations:** test_results (id, test_id, student_id, total_marks_obtained, percentage, pass_fail, weak_topics JSONB array of topic_ids), test_ranks (id, test_id, student_id, rank, batch_rank). Supabase RPC generate_ranks(test_id): orders by marks DESC, assigns rank, saves to test_ranks, populates weak_topics from incorrect question-topic mappings.

**RLS Policies:** Student reads own result and rank only. Faculty/Admin read all results for their tests. Topper list (top N) visible to all enrolled students after publish date.

**Integration Tests:** 10-student rank generation > rank 1 is highest, no gaps. weak_topics correct for student with wrong topic answers. Student reads another's detailed result > blocked.

**Definition of Done:** [ ] Rank RPC works correctly [ ] Weak topic identification works [ ] Topper list vs detailed result access correct

---

### FE-11 - Test Creation Screens

| Field | Detail |
|---|---|
| Slice ID | FE-11 |
| Phase | 4 - Examinations |
| Type | Frontend |
| Depends On | BE-11 or mock fixture |

**Screens:** 1. Test List (Faculty/Admin, status filters) 2. Create Test Form 3. Question Builder (add questions, options, mark correct, assign topic) 4. Test Settings (shuffle, show result, negative marking, window) 5. Publish Confirmation

**Key Buttons:** Create Test > supabase.from(tests).insert() | Add Question > supabase.from(questions).insert() | Add Option > supabase.from(question_options).insert() | Mark Correct > update is_correct true | Publish > update status published

**E2E Manual Test:** 1. Faculty: 3 MCQ questions, 4 options each, 1 correct each, 60min, Publish > status Published 2. Enrolled student sees it at start time 3. Draft test > student cannot see

**Definition of Done:** [ ] Test with questions creates correctly [ ] Question-topic mapping saves [ ] Publish controls student visibility

---

### FE-12 - Student Test Attempt Screens

| Field | Detail |
|---|---|
| Slice ID | FE-12 |
| Phase | 4 - Examinations |
| Type | Frontend |
| Depends On | BE-12 or mock fixture |

**Screens:** 1. Upcoming Tests List 2. Test Instructions Page 3. Test Taking Screen (navigator, timer, options) 4. Submit Confirmation Dialog 5. Time's Up / Submitted Screen

**Key Buttons:** Start Test > test_attempts.insert() then load questions | Select Option > local state | Submit > student_answers.insert all + call auto_evaluate_mcq RPC | Auto-submit > timer=0 same as submit

**E2E Manual Test:** 1. Student starts, answers all, Submit, result shown immediately (if enabled) 2. Leave 2 unanswered > shown as skipped 3. Timer expires > auto-submit, status timed_out

**Definition of Done:** [ ] Questions load correctly [ ] Timer auto-submits [ ] Evaluation runs on submit

---

### FE-13 - Evaluation Screens

| Field | Detail |
|---|---|
| Slice ID | FE-13 |
| Phase | 4 - Examinations |
| Type | Frontend |
| Depends On | BE-13 or mock fixture |

**Screens:** 1. Submission Review List (per test, per student) 2. Subjective Evaluation Panel (answer + marks + remarks) 3. OMR Upload Page 4. OMR Results Review Table

**Key Buttons:** Upload OMR > storage.upload() + insert omr_uploads row | Enter Marks > update student_answers with faculty_marks and remarks | Save Evaluation > student_answers.update()

**E2E Manual Test:** 1. Faculty views student subjective answer > enters 8/10 marks + remark > Save > verified 2. Upload OMR > mark processed > enter parsed marks > results update

**Definition of Done:** [ ] Subjective marks entry works [ ] OMR upload works [ ] Remarks saved and visible post-publish

---

### FE-14 - Results and Ranks Screens

| Field | Detail |
|---|---|
| Slice ID | FE-14 |
| Phase | 4 - Examinations |
| Type | Frontend |
| Depends On | BE-14 or mock fixture |

**Screens:** 1. Student: My Result Page (marks, %, rank, weak topics) 2. Topper List Page (top 10) 3. Faculty: Batch Result Overview 4. Admin: Test Performance Report 5. Student: Answer Review (post-publish)

**Key Buttons:** View My Result > test_results.select().eq(student_id) | View Topper List > test_ranks.select().order(rank).limit(10) | Generate Ranks > call generate_ranks RPC (Admin/Faculty)

**E2E Manual Test:** 1. Admin generates ranks > list appears 2. Student views result > marks, rank, weak topics shown 3. Topper list shows top 3 with marks

**Definition of Done:** [ ] Result page correct [ ] Topper list visible to all enrolled [ ] Weak topics highlighted

---

## Phase 5 - Finance and Communications

Goal: Fees, notifications, calendar, meetings.

| Slice | Type | Name |
|---|---|---|
| BE-15 | Backend | Fees Management |
| BE-16 | Backend | Notification System |
| BE-17 | Backend | Calendar and Meetings |
| FE-15 | Frontend | Fees Screens |
| FE-16 | Frontend | Notification Screens |
| FE-17 | Frontend | Calendar Screens |

---

### BE-15 - Fees Management

| Field | Detail |
|---|---|
| Slice ID | BE-15 |
| Phase | 5 - Finance and Communications |
| Type | Backend |
| Supabase Tables | fee_structures, fee_assignments, fee_payments, fee_receipts |
| Vercel Function | POST /api/payment/webhook |
| Depends On | BE-05 |
| Blocks | BE-16 BE-19 |

**SQL Migrations:** fee_structures (id, name, course_id, batch_id, academic_year, total_amount, installments JSONB, created_at), fee_assignments (id, fee_structure_id, student_id, discount_amount, payable_amount, assigned_at), fee_payments (id, assignment_id, student_id, amount_paid, payment_mode, transaction_id, razorpay_payment_id, status, paid_at), fee_receipts (id, payment_id, receipt_number unique, generated_at, receipt_url). DB trigger: on paid payment INSERT > generate receipt.

**Vercel Function /api/payment/webhook:** Verify Razorpay signature > update payment status to paid > trigger receipt generation.

**RLS Policies:** Admin/Accountant full access. Parent reads only linked student fee data. Student reads own fee status. Receipt URLs accessible to linked parent and student only.

**Integration Tests:** Create structure > assign > verify payable after discount. Simulate Razorpay webhook > status updated + receipt generated. Parent reads unlinked student fee > blocked.

**Definition of Done:** [ ] Fee structure and assignment works [ ] Razorpay webhook updates status [ ] Receipt generated and stored [ ] RLS verified

---

### FE-15 - Fees Screens

| Field | Detail |
|---|---|
| Slice ID | FE-15 |
| Phase | 5 - Finance and Communications |
| Type | Frontend |
| Depends On | BE-15 or mock fees fixture |

**Screens:** 1. Admin: Fee Structure List and Creator 2. Fee Assignment Page 3. Collect Payment (cash/cheque) 4. Pending Fees List 5. Student/Parent: Fee Status Page 6. Download Receipt Page 7. Online Payment (Razorpay checkout)

**Key Buttons:** Create Fee Structure > fee_structures.insert() | Assign Fee > fee_assignments.insert() | Record Cash > fee_payments.insert(mode cash) | Pay Online > Razorpay > webhook updates DB | Download Receipt > storage.getPublicUrl() > download PDF

**E2E Manual Test:** 1. Admin creates structure > assigns > student sees pending amount 2. Admin records cash payment > receipt generated > pending zeroed 3. Parent views fee > downloads receipt > PDF opens

**Definition of Done:** [ ] Fee structure and assignment works [ ] Cash payment + receipt generation works [ ] Parent downloads receipt

---

### BE-16 - Notification System

| Field | Detail |
|---|---|
| Slice ID | BE-16 |
| Phase | 5 - Finance and Communications |
| Type | Backend |
| Supabase Tables | notification_templates, notification_logs, user_notification_preferences |
| Vercel Function | POST /api/notify |
| Depends On | BE-01 BE-06 BE-10 BE-15 |
| Blocks | None |

**SQL Migrations:** notification_templates (id, event_type, channel: sms/whatsapp/email/inapp, template_text with placeholders, is_active), notification_logs (id, recipient_user_id, event_type, channel, message_text, status: sent/delivered/failed, sent_at, retry_count), user_notification_preferences (user_id, sms_enabled, whatsapp_enabled, email_enabled, inapp_enabled).

**Vercel Function /api/notify:** Receive event_type + student_id + params > fetch template > interpolate > check preferences > dispatch via MSG91 or Resend > log result.

**Integration Tests:** Absent event > /api/notify called > log created status sent. WhatsApp disabled for parent > event fires > WhatsApp skipped. SMS failure > retry_count incremented > status failed.

**Definition of Done:** [ ] All 3 channels dispatch [ ] Template interpolation works [ ] Preferences respected [ ] Delivery logged

---

### FE-16 - Notification Screens

| Field | Detail |
|---|---|
| Slice ID | FE-16 |
| Phase | 5 - Finance and Communications |
| Type | Frontend |
| Depends On | BE-16 or mock fixture |

**Screens:** 1. In-App Notification Bell (all roles header) 2. Notification List Page 3. Template Manager (Admin) 4. User Preferences Page 5. Admin: Send Manual Notification Form 6. Admin: Delivery Logs Page

**Key Buttons:** View Notifications > notification_logs.select().eq(recipient_user_id) | Save Preferences > user_notification_preferences.upsert() | Send Manual > POST /api/notify | View Logs > notification_logs.select() Admin only

**E2E Manual Test:** 1. Mark absent > parent in-app notification appears > SMS received 2. Disable WhatsApp > next event > WhatsApp not sent 3. Admin manual send > delivery log shows sent

**Definition of Done:** [ ] Bell shows unread count [ ] Preference toggle saves [ ] Manual send and delivery log work

---

### BE-17 - Calendar and Meetings

| Field | Detail |
|---|---|
| Slice ID | BE-17 |
| Phase | 5 - Finance and Communications |
| Type | Backend |
| Supabase Tables | calendar_events, parent_meetings, meeting_attendees |
| Vercel Function | None |
| Depends On | BE-05 BE-04 |
| Blocks | BE-16 meeting reminder trigger |

**SQL Migrations:** calendar_events (id, title, event_type, event_date, end_date, description, audience: all/students/faculty/parents, batch_id nullable, created_by), parent_meetings (id, faculty_id, parent_id, student_id, scheduled_at, duration_minutes, location, notes, status), meeting_attendees (id, meeting_id, user_id, attended bool, remarks).

**RLS Policies:** Admin creates any event. Faculty creates for their batches. All roles read events filtered by audience+batch_id. Parent meetings visible only to linked faculty and parent.

**Integration Tests:** Holiday audience=all > all roles read it. Batch-specific event > only that batch sees it. Parent meeting > only linked parent and faculty see it.

**Definition of Done:** [ ] Event creation with audience filter works [ ] Parent meeting scheduling works [ ] Role-filtered access works

---

### FE-17 - Calendar Screens

| Field | Detail |
|---|---|
| Slice ID | FE-17 |
| Phase | 5 - Finance and Communications |
| Type | Frontend |
| Depends On | BE-17 or mock fixture |

**Screens:** 1. Academic Calendar (monthly view, all roles) 2. Admin: Add Event Form 3. Admin: Schedule Parent Meeting Form 4. Parent: My Meetings 5. Faculty: Meeting Schedule 6. Holiday List

**Key Buttons:** Add Event > calendar_events.insert() | Schedule Meeting > parent_meetings.insert() | Mark Complete > parent_meetings.update(status: completed) | View Calendar > calendar_events.select() filtered by role+date

**E2E Manual Test:** 1. Admin adds holiday > all users see it 2. Admin schedules parent meeting > parent sees in My Meetings 3. Faculty marks meeting complete > admin sees updated status

**Definition of Done:** [ ] Calendar renders by month [ ] Parent meeting scheduling works [ ] Audience visibility correct

---

## Phase 6 - Intelligence and Reporting

Goal: AI analytics, performance predictions, PDF reports, audit logs.

| Slice | Type | Name |
|---|---|---|
| BE-18 | Backend | AI and Analytics Engine |
| BE-19 | Backend | Reports and Activity Logs |
| FE-18 | Frontend | Analytics Dashboard Screens |
| FE-19 | Frontend | Reports Screens |

---

### BE-18 - AI and Analytics Engine

| Field | Detail |
|---|---|
| Slice ID | BE-18 |
| Phase | 6 - Intelligence and Reporting |
| Type | Backend |
| Supabase Tables | performance_snapshots, ai_recommendations |
| Vercel Function | POST /api/ai/analyze |
| Depends On | BE-06 BE-09 BE-10 BE-14 |
| Blocks | None |

**SQL Migrations:** performance_snapshots (id, student_id, batch_id, snapshot_date, attendance_pct, avg_test_score, homework_completion_pct, weak_topics JSONB, predicted_final_score, created_at), ai_recommendations (id, student_id, recommendation_type: practice_test/revision/lecture/faculty_alert, content JSONB, generated_at, is_read).

**Vercel Function /api/ai/analyze:** Fetch last 90 days data > calculate weak topics (accuracy below 50%) > weighted average for score prediction (ponytail: weighted avg first, ML when data volume justifies) > save snapshot > if high-risk (attendance below 60% AND score below 40%) trigger faculty alert via /api/notify.

**Integration Tests:** Analysis for known student > weak_topics match expected. predicted_final_score within plausible range. High-risk student triggers faculty alert.

**Definition of Done:** [ ] Analysis saves snapshot [ ] Weak topics identified correctly [ ] High-risk alert fires

---

### FE-18 - Analytics Dashboard Screens

| Field | Detail |
|---|---|
| Slice ID | FE-18 |
| Phase | 6 - Intelligence and Reporting |
| Type | Frontend |
| Depends On | BE-18 or mock analytics fixture |

**Screens:** 1. Student: My Analytics (attendance %, avg score, chart, weak topics, predicted score) 2. Student: AI Recommendations Panel 3. Faculty: Batch Analytics (avg, weak students list, subject-wise) 4. Admin: Institute Overview Dashboard 5. Parent: Child Performance Summary

**Key Buttons:** Refresh Analysis > POST /api/ai/analyze then reload | View Weak Topics > read from performance_snapshots.weak_topics | Mark Recommendation Read > ai_recommendations.update(is_read true) | View Weak Students > performance_snapshots.select().lt(avg_test_score, 40)

**E2E Manual Test:** 1. Student views Analytics > all metrics shown 2. Refresh > chart updates 3. Faculty sees weak students list 4. Parent sees child summary

**Definition of Done:** [ ] All key metrics render [ ] Weak topics from test data [ ] Predicted score with advisory label

---

### BE-19 - Reports and Activity Logs

| Field | Detail |
|---|---|
| Slice ID | BE-19 |
| Phase | 6 - Intelligence and Reporting |
| Type | Backend |
| Supabase Tables | activity_logs, generated_reports |
| Vercel Function | POST /api/report/generate |
| Depends On | BE-06 BE-14 BE-15 BE-01 |
| Blocks | None |

**SQL Migrations:** activity_logs (id, user_id, role, action: create/update/delete/login/export, entity_type, entity_id, old_value JSONB, new_value JSONB, ip_address, created_at), generated_reports (id, report_type, requested_by, status: queued/processing/ready/failed, file_url, created_at, completed_at). DB hook on major mutations > insert to activity_logs.

**Vercel Function /api/report/generate:** Accept report_type (student_report_card/attendance/fee_collection/batch_performance) > fetch data from Supabase > generate PDF via pdfkit > upload to Supabase Storage > update generated_reports.status to ready with file_url.

**Integration Tests:** Request report card > generated_reports row created > PDF URL returned. Admin modifies student > activity_logs row with old+new values. Large report > async processing + status polling works.

**Definition of Done:** [ ] Report generation runs and uploads PDF [ ] Activity log captures mutations [ ] Download URL accessible

---

### FE-19 - Reports Screens

| Field | Detail |
|---|---|
| Slice ID | FE-19 |
| Phase | 6 - Intelligence and Reporting |
| Type | Frontend |
| Depends On | BE-19 or mock report fixture |

**Screens:** 1. Admin: Reports Hub 2. Generate Report Form (type, date range, filters) 3. Report Status Page (polling) 4. Report Download Page 5. Admin: Activity Logs Page 6. Student/Parent: Report Card Download

**Key Buttons:** Generate Report > POST /api/report/generate > poll status | Download > storage.getPublicUrl() > download PDF | View Activity Logs > activity_logs.select() with filters Admin only | Download Report Card > same scoped to student

**E2E Manual Test:** 1. Admin generates Attendance Report > Processing > Ready > Download > PDF correct data 2. Admin modifies student > Activity Logs > old+new values shown 3. Student downloads report card > PDF has marks, attendance, rank

**Definition of Done:** [ ] Report request saves to DB [ ] Status polling updates UI [ ] PDF download works [ ] Activity logs Admin-only visible

---

## Phase 7 - Offline and Sync

Goal: PWA installation, IndexedDB caching, offline attendance and marks, sync engine.

| Slice | Type | Name |
|---|---|---|
| BE-20 | Backend | PWA and Cache Strategy |
| BE-21 | Backend | Offline Sync Engine |
| FE-20 | Frontend | Offline UI and Sync Indicator Screens |
| FE-21 | Frontend | PWA Install Flow |

---

### BE-20 - PWA and Cache Strategy

| Field | Detail |
|---|---|
| Slice ID | BE-20 |
| Phase | 7 - Offline and Sync |
| Type | Backend |
| Supabase Tables | No new tables - confirms columns in existing tables |
| Vercel Function | None |
| Depends On | BE-06 BE-12 |
| Blocks | BE-21 |

**What Backend Sets Up:** Confirm sync_status (pending/synced/conflict) and local_created_at columns exist in attendance_records and student_answers. Create Supabase views: student_batch_roster, upcoming_tests_summary, syllabus_offline_pack. These views fetched at login and cached locally by service worker.

**Integration Tests:** student_batch_roster view returns correct data for faculty user. sync_status defaults to synced for online-created records.

**Definition of Done:** [ ] Offline views return correct data shape [ ] sync_status column present and defaulted correctly

---

### BE-21 - Offline Sync Engine

| Field | Detail |
|---|---|
| Slice ID | BE-21 |
| Phase | 7 - Offline and Sync |
| Type | Backend |
| Supabase Tables | sync_conflicts |
| Vercel Function | POST /api/sync |
| Depends On | BE-07 BE-20 |
| Blocks | None |

**SQL Migrations:** sync_conflicts (id, record_type: attendance/marks, local_record JSONB, server_record JSONB, resolution: server_wins/client_wins/admin_review, resolved_at, resolved_by).

**Vercel Function /api/sync:** Accept array of pending offline records > for each: check server conflict > no conflict: insert with sync_status synced > conflict: server wins by default + log to sync_conflicts > return report: synced N, conflicts N, failed N.

**Integration Tests:** 5 offline records no conflict > all synced. Conflicting record > sync_conflicts row + server wins. Duplicate (same session+student) > rejected and logged.

**Definition of Done:** [ ] Sync endpoint processes batch records [ ] Conflict detection and logging works [ ] Sync report returned correctly

---

### FE-20 - Offline UI and Sync Indicator Screens

| Field | Detail |
|---|---|
| Slice ID | FE-20 |
| Phase | 7 - Offline and Sync |
| Type | Frontend |
| Depends On | BE-20 or IndexedDB mock |

**Screens:** 1. Offline Banner (all pages, top bar when no internet) 2. Pending Sync Badge (unsynced count, Faculty dashboard) 3. Offline Attendance Sheet (saves to IndexedDB when offline) 4. Sync Now Button and Status Modal 5. Conflict Resolution Screen

**Key Buttons:** Save Offline > save to IndexedDB with sync_status pending | Sync Now > read pending from IndexedDB > POST /api/sync > update IndexedDB status | Resolve Conflict > accept server version or flag for Admin

**E2E Manual Test:** 1. Offline: mark attendance > Submit > Saved Offline shown, badge=1 2. Reconnect > auto-sync > badge disappears > record in Supabase 3. Conflict: absent offline, admin marks present online > sync > conflict shown > accept server version > resolved

**Definition of Done:** [ ] Offline banner appears when disconnected [ ] Attendance saves to IndexedDB [ ] Auto-sync on reconnection [ ] Conflict screen shown when needed

---

### FE-21 - PWA Install Flow

| Field | Detail |
|---|---|
| Slice ID | FE-21 |
| Phase | 7 - Offline and Sync |
| Type | Frontend |
| Depends On | FE-20 |

**Screens:** 1. PWA Install Prompt Banner (Faculty/Admin first visit) 2. iOS Install Instructions (Add to Home Screen guide) 3. App Manifest (icon, name, theme, display standalone) 4. Service Worker (network-first for API, cache-first for static assets)

**Key Buttons:** Install App > deferredPrompt.prompt() | Dismiss > hide banner, remember in localStorage 7 days

**E2E Manual Test:** 1. Chrome desktop: Install prompt appears > Install > opens as standalone window 2. iOS Safari: instructions shown > add to home screen > fullscreen 3. Disconnect internet > open PWA > loads from cache

**Definition of Done:** [ ] Service worker registered and caching static assets [ ] App manifest configured correctly [ ] Install prompt on eligible browsers [ ] App loads offline from cache
