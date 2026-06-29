import os
import json

FILES = [
    os.path.abspath("Doc/DependencyMap.md"),
    os.path.abspath("Doc/ERD.md"),
    os.path.abspath("Doc/FDD.md"),
    os.path.abspath("Doc/ModuleMap.md"),
    os.path.abspath("Doc/UAT.md")
]

nodes = []
edges = []
hyperedges = []

modules_info = [
    ("user_role_security", "User, Role & Security", "Handles authentication, role-based access control, OTP login, and security policies."),
    ("student_admission_profile", "Student Admission & Profile", "Handles student profiles, document uploads, admissions processing, and status checks."),
    ("parent_portal_mapping", "Parent Portal & Mapping", "Enables parents to view child progress, pay fees, and communicate with the institution."),
    ("faculty_management", "Faculty Management", "Manages faculty profiles, workloads, subjects, and batch assignments."),
    ("course_batch_management", "Course & Batch Management", "Configures courses, subjects, batch details, timetables, and room allocations."),
    ("attendance_management", "Attendance Management", "Logs manual, biometric, and QR-based attendance for students and sessions."),
    ("live_classes_recordings", "Live Classes & Recordings", "Schedules live online lectures and logs attendance and recording links."),
    ("syllabus_management", "Syllabus Management", "Tracks topic-level course progress and hosts digital resource uploads."),
    ("test_examination", "Test & Examination", "Facilitates MCQs, subjective tests, OMR evaluation, and ranking results."),
    ("homework_assignments", "Homework & Assignments", "Logs homework submissions and houses faculty grading/feedback loops."),
    ("fees_management", "Fees Management", "Configures fee structures, payments, receipts, invoices, and discount policies."),
    ("notification_system", "Notification System", "Delivers automated transactional alerts across SMS, WhatsApp, and email."),
    ("calendar_meetings", "Calendar & Meetings", "Tracks academic events, parent-teacher meetings, and schedules."),
    ("offline_mode_sync", "Offline Mode & Sync", "Stores local changes on progressive web app and resolves cloud sync conflicts."),
    ("ai_analytics", "AI & Analytics", "Processes performance predictions, weak topic analysis, and recommendation logs."),
    ("reports_activity_logs", "Reports & Activity Logs", "Compiles audit logs, user actions, and system data exports.")
]

for file_path in FILES:
    filename = os.path.basename(file_path)
    stem = "doc_" + os.path.splitext(filename)[0].lower()
    for slug, label, desc in modules_info:
        nodes.append({
            "id": f"{stem}_{slug}", "label": f"{label} ({filename})", "file_type": "document",
            "source_file": file_path, "source_location": None, "source_url": None,
            "captured_at": None, "author": None, "contributor": None, "rationale": desc
        })

dependencies = {
    "student_admission_profile": ["user_role_security"],
    "parent_portal_mapping": ["user_role_security", "student_admission_profile"],
    "faculty_management": ["user_role_security"],
    "course_batch_management": ["student_admission_profile", "faculty_management"],
    "attendance_management": ["course_batch_management"],
    "live_classes_recordings": ["course_batch_management"],
    "syllabus_management": ["course_batch_management"],
    "test_examination": ["course_batch_management", "syllabus_management"],
    "homework_assignments": ["course_batch_management"],
    "fees_management": ["course_batch_management"],
    "notification_system": ["user_role_security", "calendar_meetings"],
    "calendar_meetings": ["course_batch_management", "parent_portal_mapping"],
    "offline_mode_sync": ["user_role_security"],
    "ai_analytics": ["student_admission_profile", "test_examination", "syllabus_management"],
    "reports_activity_logs": ["user_role_security", "attendance_management", "test_examination", "fees_management"]
}

dep_file = FILES[0]
dep_stem = "doc_dependencymap"
for src_slug, targets in dependencies.items():
    for target_slug in targets:
        edges.append({
            "source": f"{dep_stem}_{src_slug}", "target": f"{dep_stem}_{target_slug}",
            "relation": "references", "confidence": "EXTRACTED", "confidence_score": 1.0,
            "source_file": dep_file, "source_location": None, "weight": 1.0
        })

tables = {
    "users": ("USERS", "User accounts, core logins, security metadata."),
    "roles": ("ROLES", "System roles (Admin, Faculty, Student, Parent)."),
    "permissions": ("PERMISSIONS", "Granular functional permissions."),
    "user_roles": ("USER_ROLES", "Many-to-many relationship mapping Users to Roles."),
    "role_permissions": ("ROLE_PERMISSIONS", "Many-to-many relationship mapping Roles to Permissions."),
    "otp_logs": ("OTP_LOGS", "Temporary logs for OTP generation and validation."),
    "login_sessions": ("LOGIN_SESSIONS", "Active or historic login session states."),
    "students": ("STUDENTS", "Core student record profile."),
    "admissions": ("ADMISSIONS", "Student admission lifecycle details."),
    "student_addresses": ("STUDENT_ADDRESSES", "Residential addresses of students."),
    "student_documents": ("STUDENT_DOCUMENTS", "Verification document uploads (IDs, certificates)."),
    "emergency_contacts": ("EMERGENCY_CONTACTS", "Emergency contact info associated with students."),
    "parents": ("PARENTS", "Parent profiles linked to students."),
    "student_parent_links": ("STUDENT_PARENT_LINKS", "Many-to-many child-to-parent mapping."),
    "faculty": ("FACULTY", "Faculty profiles and specialization details."),
    "faculty_assignments": ("FACULTY_ASSIGNMENTS", "Associates faculty to batches/subjects."),
    "courses": ("COURSES", "Available courses / departments."),
    "subjects": ("SUBJECTS", "Subjects mapped to courses."),
    "batches": ("BATCHES", "Year/semester subdivisions for courses."),
    "batch_subjects": ("BATCH_SUBJECTS", "Subjects mapped to batches."),
    "student_batches": ("STUDENT_BATCHES", "Student enrollment into specific batches."),
    "classrooms": ("CLASSROOMS", "Physical/virtual rooms for lectures."),
    "batch_schedules": ("BATCH_SCHEDULES", "Weekly schedules/timetables."),
    "attendance_sessions": ("ATTENDANCE_SESSIONS", "Individual sessions marked for attendance."),
    "attendance_records": ("ATTENDANCE_RECORDS", "Student presence logs per session."),
    "qr_attendance_tokens": ("QR_ATTENDANCE_TOKENS", "Short-lived QR codes generated for session attendance."),
    "qr_attendance_scans": ("QR_ATTENDANCE_SCANS", "Scans matching student app to QR token."),
    "live_classes": ("LIVE_CLASSES", "Online lectures scheduled through conferencing APIs."),
    "lecture_recordings": ("LECTURE_RECORDINGS", "Saved cloud storage paths for finished classes."),
    "syllabus_units": ("SYLLABUS_UNITS", "Unit blocks for subjects."),
    "chapters": ("CHAPTERS", "Chapters inside units."),
    "topics": ("TOPICS", "Specific topics / lessons within chapters."),
    "topic_progress": ("TOPIC_PROGRESS", "Batch completion status of topics."),
    "tests": ("TESTS", "Scheduled online or offline examinations."),
    "test_sections": ("TEST_SECTIONS", "Categorized blocks of questions inside a test."),
    "questions": ("QUESTIONS", "Unique question pool items."),
    "question_options": ("QUESTION_OPTIONS", "MCQ choices."),
    "question_topic_mappings": ("QUESTION_TOPIC_MAPPINGS", "Syllabus topics tagged to questions."),
    "test_attempts": ("TEST_ATTEMPTS", "Students attempts logs."),
    "student_answers": ("STUDENT_ANSWERS", "Student selected answers."),
    "results": ("RESULTS", "Scored results per test attempt."),
    "homework": ("HOMEWORK", "Assigned assignments."),
    "homework_submissions": ("HOMEWORK_SUBMISSIONS", "Student file uploads / replies."),
    "fee_structures": ("FEE_STRUCTURES", "Defined fee templates."),
    "fee_installments": ("FEE_INSTALLMENTS", "Installment rules."),
    "payments": ("PAYMENTS", "Transactions logged."),
    "notifications": ("NOTIFICATIONS", "Triggered alerts."),
    "calendar_events": ("CALENDAR_EVENTS", "Scheduled institute-wide/batch events."),
    "offline_sync_records": ("OFFLINE_SYNC_RECORDS", "Queued database sync requests."),
    "ai_recommendations": ("AI_RECOMMENDATIONS", "Personalized study hints generated by AI.")
}

erd_file = FILES[1]
erd_stem = "doc_erd"
for tbl_slug, (tbl_label, tbl_desc) in tables.items():
    nodes.append({
        "id": f"{erd_stem}_{tbl_slug}", "label": f"{tbl_label} Table", "file_type": "concept",
        "source_file": erd_file, "source_location": None, "source_url": None,
        "captured_at": None, "author": None, "contributor": None, "rationale": tbl_desc
    })

module_table_mapping = {
    "user_role_security": ["users", "roles", "permissions", "user_roles", "role_permissions", "otp_logs", "login_sessions"],
    "student_admission_profile": ["students", "admissions", "student_addresses", "student_documents", "emergency_contacts"],
    "parent_portal_mapping": ["parents", "student_parent_links"],
    "faculty_management": ["faculty", "faculty_assignments"],
    "course_batch_management": ["courses", "subjects", "batches", "batch_subjects", "student_batches", "classrooms", "batch_schedules"],
    "attendance_management": ["attendance_sessions", "attendance_records", "qr_attendance_tokens", "qr_attendance_scans"],
    "live_classes_recordings": ["live_classes", "lecture_recordings"],
    "syllabus_management": ["syllabus_units", "chapters", "topics", "topic_progress"],
    "test_examination": ["tests", "test_sections", "questions", "question_options", "question_topic_mappings", "test_attempts", "student_answers", "results"],
    "homework_assignments": ["homework", "homework_submissions"],
    "fees_management": ["fee_structures", "fee_installments", "payments"],
    "notification_system": ["notifications"],
    "calendar_meetings": ["calendar_events"],
    "offline_mode_sync": ["offline_sync_records"],
    "ai_analytics": ["ai_recommendations"]
}

for mod_slug, tbl_list in module_table_mapping.items():
    for tbl_slug in tbl_list:
        edges.append({
            "source": f"{erd_stem}_{tbl_slug}", "target": f"{erd_stem}_{mod_slug}",
            "relation": "references", "confidence": "EXTRACTED", "confidence_score": 1.0,
            "source_file": erd_file, "source_location": None, "weight": 1.0
        })

fk_edges = [
    ("user_roles", "users"), ("user_roles", "roles"), ("role_permissions", "roles"),
    ("role_permissions", "permissions"), ("otp_logs", "users"), ("login_sessions", "users"),
    ("students", "users"), ("faculty", "users"), ("parents", "users"),
    ("student_addresses", "students"), ("student_documents", "students"),
    ("emergency_contacts", "students"), ("admissions", "students"),
    ("student_parent_links", "students"), ("student_parent_links", "parents"),
    ("subjects", "courses"), ("batches", "courses"), ("batch_subjects", "subjects"),
    ("batch_subjects", "batches"), ("batch_schedules", "classrooms"), ("batch_schedules", "batches"),
    ("faculty_assignments", "faculty"), ("faculty_assignments", "batches"), ("faculty_assignments", "subjects"),
    ("student_batches", "students"), ("student_batches", "batches"), ("attendance_sessions", "batches"),
    ("attendance_sessions", "subjects"), ("attendance_sessions", "faculty"), ("attendance_records", "attendance_sessions"),
    ("attendance_records", "students"), ("attendance_records", "users"), ("qr_attendance_tokens", "attendance_sessions"),
    ("qr_attendance_scans", "students"), ("qr_attendance_scans", "qr_attendance_tokens"), ("live_classes", "batches"),
    ("live_classes", "subjects"), ("live_classes", "faculty"), ("lecture_recordings", "live_classes"),
    ("syllabus_units", "subjects"), ("chapters", "syllabus_units"), ("topics", "chapters"),
    ("topic_progress", "topics"), ("topic_progress", "batches"), ("topic_progress", "faculty"),
    ("tests", "courses"), ("tests", "batches"), ("tests", "subjects"), ("tests", "faculty"),
    ("test_sections", "tests"), ("questions", "test_sections"), ("question_options", "questions"),
    ("question_topic_mappings", "questions"), ("question_topic_mappings", "topics"), ("test_attempts", "tests"),
    ("test_attempts", "students"), ("student_answers", "test_attempts"), ("results", "test_attempts"),
    ("homework", "batches"), ("homework_submissions", "homework"), ("homework_submissions", "students"),
    ("fee_installments", "fee_structures"), ("payments", "fee_installments")
]

for src_tbl, tgt_tbl in fk_edges:
    edges.append({
        "source": f"{erd_stem}_{src_tbl}", "target": f"{erd_stem}_{tgt_tbl}",
        "relation": "shares_data_with", "confidence": "EXTRACTED", "confidence_score": 1.0,
        "source_file": erd_file, "source_location": None, "weight": 1.0
    })

doc_types = ["dependencymap", "erd", "fdd", "modulemap", "uat"]
for slug, label, desc in modules_info:
    for i in range(len(doc_types)):
        for j in range(i + 1, len(doc_types)):
            edges.append({
                "source": f"doc_{doc_types[i]}_{slug}", "target": f"doc_{doc_types[j]}_{slug}",
                "relation": "semantically_similar_to", "confidence": "INFERRED", "confidence_score": 0.95,
                "source_file": FILES[3], "source_location": None, "weight": 1.0
            })

hyperedges.append({
    "id": "admission_flow", "label": "Student Admission and Verification Workflow",
    "nodes": [
        "doc_fdd_student_admission_profile", "doc_erd_admissions", "doc_erd_student_documents"
    ],
    "relation": "form", "confidence": "INFERRED", "confidence_score": 0.85, "source_file": FILES[2]
})

hyperedges.append({
    "id": "exams_ranking_analytics_flow", "label": "Examination Results and AI Analytics Workflow",
    "nodes": [
        "doc_fdd_test_examination", "doc_erd_results", "doc_fdd_ai_analytics", "doc_erd_ai_recommendations"
    ],
    "relation": "form", "confidence": "INFERRED", "confidence_score": 0.85, "source_file": FILES[2]
})

output_data = {
    "nodes": nodes, "edges": edges, "hyperedges": hyperedges, "input_tokens": 0, "output_tokens": 0
}

os.makedirs("graphify-out", exist_ok=True)
with open("graphify-out/.graphify_extract.json", "w", encoding="utf-8") as f:
    json.dump(output_data, f, indent=2, ensure_ascii=False)
print("Generated graphify-out/.graphify_extract.json")
