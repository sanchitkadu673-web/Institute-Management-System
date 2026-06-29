# LMS Entity Relationship Diagram (ERD)

**Project:** Learning Management System (LMS)  
**Document Type:** Entity Relationship Diagram and Data Model  
**Date:** 25 June 2026  

---

## 1. ERD Overview

This ERD covers the required LMS modules:

1. User, Role and Security
2. Student Admission and Profile
3. Parent and Guardian Mapping
4. Faculty Management
5. Course, Subject and Batch Management
6. Attendance Management
7. Live Classes and Recordings
8. Syllabus and Topic Progress
9. Test and Examination Management
10. Homework and Assignment Management
11. Fees, Payments, Receipts and Invoices
12. Notifications
13. Calendar and Parent Meetings
14. Offline Sync
15. Analytics and AI Recommendations
16. Reports and Activity Logs

---

## 2. Master ERD

```mermaid
erDiagram
    USERS ||--o{ USER_ROLES : has
    ROLES ||--o{ USER_ROLES : assigned_to
    ROLES ||--o{ ROLE_PERMISSIONS : has
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : included_in
    USERS ||--o{ OTP_LOGS : receives
    USERS ||--o{ LOGIN_SESSIONS : creates
    USERS ||--o{ ACTIVITY_LOGS : performs

    USERS ||--o| STUDENTS : student_account
    USERS ||--o| FACULTY : faculty_account
    USERS ||--o| PARENTS : parent_account

    STUDENTS ||--o{ STUDENT_ADDRESSES : has
    STUDENTS ||--o{ STUDENT_DOCUMENTS : uploads
    STUDENTS ||--o{ EMERGENCY_CONTACTS : has
    STUDENTS ||--o{ ADMISSIONS : admitted_by
    STUDENTS ||--o{ STUDENT_PARENT_LINKS : linked_to
    PARENTS ||--o{ STUDENT_PARENT_LINKS : linked_to

    COURSES ||--o{ SUBJECTS : contains
    COURSES ||--o{ BATCHES : has
    SUBJECTS ||--o{ BATCH_SUBJECTS : mapped_to
    BATCHES ||--o{ BATCH_SUBJECTS : contains
    CLASSROOMS ||--o{ BATCH_SCHEDULES : allocated_to
    BATCHES ||--o{ BATCH_SCHEDULES : has
    FACULTY ||--o{ FACULTY_ASSIGNMENTS : assigned
    BATCHES ||--o{ FACULTY_ASSIGNMENTS : has
    SUBJECTS ||--o{ FACULTY_ASSIGNMENTS : taught_for
    STUDENTS ||--o{ STUDENT_BATCHES : enrolled_in
    BATCHES ||--o{ STUDENT_BATCHES : contains

    BATCHES ||--o{ ATTENDANCE_SESSIONS : has
    SUBJECTS ||--o{ ATTENDANCE_SESSIONS : for
    FACULTY ||--o{ ATTENDANCE_SESSIONS : created_by
    ATTENDANCE_SESSIONS ||--o{ ATTENDANCE_RECORDS : contains
    STUDENTS ||--o{ ATTENDANCE_RECORDS : marked_for
    USERS ||--o{ ATTENDANCE_RECORDS : marked_by
    ATTENDANCE_SESSIONS ||--o{ QR_ATTENDANCE_TOKENS : generates
    STUDENTS ||--o{ QR_ATTENDANCE_SCANS : scans
    QR_ATTENDANCE_TOKENS ||--o{ QR_ATTENDANCE_SCANS : used_in

    BATCHES ||--o{ LIVE_CLASSES : scheduled_for
    SUBJECTS ||--o{ LIVE_CLASSES : for
    FACULTY ||--o{ LIVE_CLASSES : hosted_by
    LIVE_CLASSES ||--o{ LECTURE_RECORDINGS : has

    SUBJECTS ||--o{ SYLLABUS_UNITS : has
    SYLLABUS_UNITS ||--o{ CHAPTERS : has
    CHAPTERS ||--o{ TOPICS : contains
    TOPICS ||--o{ TOPIC_PROGRESS : tracked_in
    BATCHES ||--o{ TOPIC_PROGRESS : for
    FACULTY ||--o{ TOPIC_PROGRESS : updated_by

    COURSES ||--o{ TESTS : has
    BATCHES ||--o{ TESTS : assigned_to
    SUBJECTS ||--o{ TESTS : for
    FACULTY ||--o{ TESTS : created_by
    TESTS ||--o{ TEST_SECTIONS : has
    TEST_SECTIONS ||--o{ QUESTIONS : contains
    QUESTIONS ||--o{ QUESTION_OPTIONS : has
    QUESTIONS ||--o{ QUESTION_TOPIC_MAPPINGS : mapped_to
    TOPICS ||--o{ QUESTION_TOPIC_MAPPINGS : identifies
    TESTS ||--o{ TEST_ATTEMPTS : attempted_in
    STUDENTS ||--o{ TEST_ATTEMPTS : attempts
    TEST_ATTEMPTS ||--o{ STUDENT_ANSWERS : contains
    QUESTIONS ||--o{ STUDENT_ANSWERS : answered_for
    QUESTION_OPTIONS ||--o{ STUDENT_ANSWERS : selected_option
    TEST_ATTEMPTS ||--o| RESULTS : generates
    TESTS ||--o{ TEST_RANKS : ranks
    STUDENTS ||--o{ TEST_RANKS : receives
    TESTS ||--o{ OMR_UPLOADS : has
    STUDENTS ||--o{ OMR_UPLOADS : uploaded_for

    FACULTY ||--o{ HOMEWORK : creates
    BATCHES ||--o{ HOMEWORK : assigned_to
    SUBJECTS ||--o{ HOMEWORK : for
    HOMEWORK ||--o{ HOMEWORK_FILES : includes
    HOMEWORK ||--o{ HOMEWORK_SUBMISSIONS : receives
    STUDENTS ||--o{ HOMEWORK_SUBMISSIONS : submits
    HOMEWORK_SUBMISSIONS ||--o{ SUBMISSION_FEEDBACK : reviewed_with
    FACULTY ||--o{ SUBMISSION_FEEDBACK : reviewed_by

    COURSES ||--o{ FEE_STRUCTURES : has
    BATCHES ||--o{ FEE_STRUCTURES : may_have
    FEE_STRUCTURES ||--o{ FEE_INSTALLMENTS : contains
    STUDENTS ||--o{ FEE_ASSIGNMENTS : assigned
    FEE_STRUCTURES ||--o{ FEE_ASSIGNMENTS : applied_as
    FEE_ASSIGNMENTS ||--o{ PAYMENTS : paid_against
    PAYMENTS ||--o| RECEIPTS : generates
    PAYMENTS ||--o| INVOICES : may_generate
    FEE_ASSIGNMENTS ||--o{ DISCOUNTS : may_have

    USERS ||--o{ NOTIFICATIONS : receives
    NOTIFICATION_TEMPLATES ||--o{ NOTIFICATIONS : uses
    NOTIFICATIONS ||--o{ NOTIFICATION_DELIVERY_LOGS : delivery_status
    USERS ||--o{ USER_NOTIFICATION_PREFERENCES : configures

    CALENDAR_EVENTS ||--o{ NOTIFICATIONS : triggers
    CALENDAR_EVENTS ||--o{ PARENT_MEETINGS : may_create
    PARENTS ||--o{ PARENT_MEETING_ATTENDEES : attends
    STUDENTS ||--o{ PARENT_MEETING_ATTENDEES : related_student
    PARENT_MEETINGS ||--o{ PARENT_MEETING_ATTENDEES : has

    USERS ||--o{ OFFLINE_SYNC_RECORDS : owns
    OFFLINE_SYNC_RECORDS ||--o{ OFFLINE_SYNC_CONFLICTS : may_have

    STUDENTS ||--o{ STUDENT_PERFORMANCE_METRICS : has
    STUDENTS ||--o{ WEAK_TOPIC_ANALYSIS : has
    TOPICS ||--o{ WEAK_TOPIC_ANALYSIS : analyzed_for
    STUDENTS ||--o{ AI_PREDICTIONS : has
    STUDENTS ||--o{ AI_RECOMMENDATIONS : receives
    USERS ||--o{ CHATBOT_LOGS : asks
```

---

## 3. User, Role and Security ERD

```mermaid
erDiagram
    USERS ||--o{ USER_ROLES : has
    ROLES ||--o{ USER_ROLES : assigned_to
    ROLES ||--o{ ROLE_PERMISSIONS : has
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : assigned
    USERS ||--o{ OTP_LOGS : receives
    USERS ||--o{ LOGIN_SESSIONS : has
    USERS ||--o{ ACTIVITY_LOGS : performs

    USERS {
        bigint id PK
        varchar full_name
        varchar mobile UK
        varchar email UK
        varchar password_hash
        enum status
        boolean is_active
        datetime last_login_at
        datetime created_at
        datetime updated_at
    }

    ROLES {
        bigint id PK
        varchar role_name UK
        varchar description
        boolean is_system_role
        datetime created_at
        datetime updated_at
    }

    PERMISSIONS {
        bigint id PK
        varchar permission_code UK
        varchar module_name
        varchar action_name
        varchar description
        datetime created_at
        datetime updated_at
    }

    USER_ROLES {
        bigint id PK
        bigint user_id FK
        bigint role_id FK
        datetime assigned_at
        bigint assigned_by FK
    }

    ROLE_PERMISSIONS {
        bigint id PK
        bigint role_id FK
        bigint permission_id FK
        datetime created_at
    }

    OTP_LOGS {
        bigint id PK
        bigint user_id FK
        varchar destination
        varchar otp_hash
        enum purpose
        enum status
        datetime expires_at
        datetime verified_at
        datetime created_at
    }

    LOGIN_SESSIONS {
        bigint id PK
        bigint user_id FK
        varchar token_id
        varchar device_info
        varchar ip_address
        datetime login_at
        datetime logout_at
        enum status
    }

    ACTIVITY_LOGS {
        bigint id PK
        bigint user_id FK
        varchar module_name
        varchar action_name
        varchar entity_name
        bigint entity_id
        json old_value
        json new_value
        varchar ip_address
        datetime created_at
    }
```

### Notes

- `USERS` is the common login table for Admin, Faculty, Student and Parent.
- A user can have multiple roles if required.
- Permissions should control module-level and action-level access.
- OTP records should store OTP hash, not plain OTP.
- Activity logs should be generated for important actions.

---

## 4. Student, Admission, Parent and Documents ERD

```mermaid
erDiagram
    USERS ||--o| STUDENTS : login_account
    USERS ||--o| PARENTS : login_account
    STUDENTS ||--o{ STUDENT_ADDRESSES : has
    STUDENTS ||--o{ STUDENT_DOCUMENTS : has
    STUDENTS ||--o{ EMERGENCY_CONTACTS : has
    STUDENTS ||--o{ ADMISSIONS : has
    STUDENTS ||--o{ STUDENT_PARENT_LINKS : linked_to
    PARENTS ||--o{ STUDENT_PARENT_LINKS : linked_to

    STUDENTS {
        bigint id PK
        bigint user_id FK
        varchar admission_no UK
        varchar first_name
        varchar middle_name
        varchar last_name
        enum gender
        date date_of_birth
        varchar blood_group
        varchar category
        varchar nationality
        varchar photo_url
        enum status
        datetime created_at
        datetime updated_at
    }

    ADMISSIONS {
        bigint id PK
        bigint student_id FK
        varchar admission_form_no UK
        date admission_date
        varchar academic_year
        varchar admission_type
        varchar referral_source
        enum status
        bigint created_by FK
        datetime created_at
        datetime updated_at
    }

    PARENTS {
        bigint id PK
        bigint user_id FK
        varchar parent_name
        enum relation_type
        varchar mobile
        varchar email
        varchar occupation
        varchar qualification
        boolean is_primary_contact
        datetime created_at
        datetime updated_at
    }

    STUDENT_PARENT_LINKS {
        bigint id PK
        bigint student_id FK
        bigint parent_id FK
        enum relation_type
        boolean can_receive_notifications
        boolean can_pay_fees
        datetime created_at
    }

    STUDENT_ADDRESSES {
        bigint id PK
        bigint student_id FK
        enum address_type
        text address_line_1
        text address_line_2
        varchar city
        varchar state
        varchar country
        varchar pin_code
        datetime created_at
        datetime updated_at
    }

    EMERGENCY_CONTACTS {
        bigint id PK
        bigint student_id FK
        varchar contact_name
        varchar relation
        varchar mobile
        text address
        boolean is_primary
        datetime created_at
        datetime updated_at
    }

    STUDENT_DOCUMENTS {
        bigint id PK
        bigint student_id FK
        varchar document_type
        varchar document_name
        varchar file_url
        varchar file_mime_type
        bigint file_size
        enum verification_status
        bigint uploaded_by FK
        datetime uploaded_at
    }
```

### Important Relationships

| Relationship | Description |
|---|---|
| User to Student | One user account may be linked to one student profile. |
| User to Parent | One user account may be linked to one parent profile. |
| Student to Parent | Many-to-many using `STUDENT_PARENT_LINKS`. |
| Student to Documents | One student can have multiple uploaded documents. |
| Student to Address | One student can have current/permanent addresses. |

---

## 5. Faculty, Course, Subject, Batch and Classroom ERD

```mermaid
erDiagram
    USERS ||--o| FACULTY : login_account
    COURSES ||--o{ SUBJECTS : contains
    COURSES ||--o{ BATCHES : has
    SUBJECTS ||--o{ BATCH_SUBJECTS : assigned
    BATCHES ||--o{ BATCH_SUBJECTS : contains
    STUDENTS ||--o{ STUDENT_BATCHES : enrolled
    BATCHES ||--o{ STUDENT_BATCHES : contains
    FACULTY ||--o{ FACULTY_ASSIGNMENTS : assigned
    BATCHES ||--o{ FACULTY_ASSIGNMENTS : has
    SUBJECTS ||--o{ FACULTY_ASSIGNMENTS : for_subject
    CLASSROOMS ||--o{ BATCH_SCHEDULES : allocated
    BATCHES ||--o{ BATCH_SCHEDULES : scheduled

    FACULTY {
        bigint id PK
        bigint user_id FK
        varchar employee_code UK
        varchar faculty_name
        varchar mobile
        varchar email
        varchar qualification
        varchar specialization
        date joining_date
        enum status
        datetime created_at
        datetime updated_at
    }

    COURSES {
        bigint id PK
        varchar course_code UK
        varchar course_name
        text description
        varchar academic_year
        int duration_months
        enum status
        datetime created_at
        datetime updated_at
    }

    SUBJECTS {
        bigint id PK
        bigint course_id FK
        varchar subject_code
        varchar subject_name
        text description
        enum status
        datetime created_at
        datetime updated_at
    }

    BATCHES {
        bigint id PK
        bigint course_id FK
        varchar batch_code UK
        varchar batch_name
        date start_date
        date end_date
        int capacity
        enum batch_type
        enum status
        datetime created_at
        datetime updated_at
    }

    BATCH_SUBJECTS {
        bigint id PK
        bigint batch_id FK
        bigint subject_id FK
        boolean is_active
        datetime created_at
    }

    STUDENT_BATCHES {
        bigint id PK
        bigint student_id FK
        bigint batch_id FK
        date enrollment_date
        date exit_date
        enum status
        datetime created_at
    }

    FACULTY_ASSIGNMENTS {
        bigint id PK
        bigint faculty_id FK
        bigint batch_id FK
        bigint subject_id FK
        date start_date
        date end_date
        enum status
        datetime created_at
        datetime updated_at
    }

    CLASSROOMS {
        bigint id PK
        varchar classroom_code UK
        varchar classroom_name
        varchar location
        int capacity
        text facilities
        enum status
        datetime created_at
        datetime updated_at
    }

    BATCH_SCHEDULES {
        bigint id PK
        bigint batch_id FK
        bigint subject_id FK
        bigint faculty_id FK
        bigint classroom_id FK
        enum day_of_week
        time start_time
        time end_time
        datetime effective_from
        datetime effective_to
        enum status
    }
```

### Important Constraints

1. A faculty member should not be assigned to two classes at the same time.
2. A classroom should not be allocated to two batches at the same time.
3. A student may be transferred from one batch to another using `STUDENT_BATCHES` history.
4. Subject-wise batch creation is supported through `BATCH_SUBJECTS`.

---

## 6. Attendance ERD

```mermaid
erDiagram
    BATCHES ||--o{ ATTENDANCE_SESSIONS : has
    SUBJECTS ||--o{ ATTENDANCE_SESSIONS : for
    FACULTY ||--o{ ATTENDANCE_SESSIONS : created_by
    ATTENDANCE_SESSIONS ||--o{ ATTENDANCE_RECORDS : contains
    STUDENTS ||--o{ ATTENDANCE_RECORDS : marked_for
    USERS ||--o{ ATTENDANCE_RECORDS : marked_by
    ATTENDANCE_SESSIONS ||--o{ QR_ATTENDANCE_TOKENS : generates
    QR_ATTENDANCE_TOKENS ||--o{ QR_ATTENDANCE_SCANS : scanned_by
    STUDENTS ||--o{ QR_ATTENDANCE_SCANS : scans
    ATTENDANCE_SESSIONS ||--o{ BIOMETRIC_ATTENDANCE_LOGS : future_logs

    ATTENDANCE_SESSIONS {
        bigint id PK
        bigint batch_id FK
        bigint subject_id FK
        bigint faculty_id FK
        date attendance_date
        varchar session_name
        time start_time
        time end_time
        enum mode
        enum status
        bigint created_by FK
        datetime created_at
        datetime updated_at
    }

    ATTENDANCE_RECORDS {
        bigint id PK
        bigint attendance_session_id FK
        bigint student_id FK
        enum attendance_status
        varchar remarks
        boolean is_offline_created
        varchar local_record_id
        bigint marked_by FK
        datetime marked_at
        datetime synced_at
        datetime updated_at
    }

    QR_ATTENDANCE_TOKENS {
        bigint id PK
        bigint attendance_session_id FK
        varchar token_hash UK
        datetime valid_from
        datetime valid_until
        enum status
        datetime created_at
    }

    QR_ATTENDANCE_SCANS {
        bigint id PK
        bigint qr_token_id FK
        bigint student_id FK
        varchar device_id
        varchar ip_address
        decimal latitude
        decimal longitude
        enum scan_status
        datetime scanned_at
    }

    BIOMETRIC_ATTENDANCE_LOGS {
        bigint id PK
        bigint attendance_session_id FK
        bigint student_id FK
        varchar device_code
        varchar biometric_ref
        datetime captured_at
        enum sync_status
        datetime created_at
    }
```

### Attendance Status Values

| Value | Description |
|---|---|
| PRESENT | Student attended the class. |
| ABSENT | Student was absent. |
| LATE | Student joined late. |
| HALF_DAY | Student attended partial session. |
| LEAVE | Approved leave. |

---

## 7. Live Class and Recording ERD

```mermaid
erDiagram
    BATCHES ||--o{ LIVE_CLASSES : scheduled_for
    SUBJECTS ||--o{ LIVE_CLASSES : for
    FACULTY ||--o{ LIVE_CLASSES : hosted_by
    LIVE_CLASSES ||--o{ LECTURE_RECORDINGS : has
    LIVE_CLASSES ||--o{ LIVE_CLASS_ATTENDANCE : tracks
    STUDENTS ||--o{ LIVE_CLASS_ATTENDANCE : attends

    LIVE_CLASSES {
        bigint id PK
        bigint batch_id FK
        bigint subject_id FK
        bigint faculty_id FK
        varchar class_title
        text description
        datetime scheduled_start
        datetime scheduled_end
        varchar meeting_platform
        text meeting_link
        varchar meeting_id
        varchar meeting_password
        enum status
        datetime created_at
        datetime updated_at
    }

    LECTURE_RECORDINGS {
        bigint id PK
        bigint live_class_id FK
        varchar title
        text recording_url
        varchar file_url
        int duration_minutes
        boolean is_downloadable
        enum visibility_status
        datetime uploaded_at
    }

    LIVE_CLASS_ATTENDANCE {
        bigint id PK
        bigint live_class_id FK
        bigint student_id FK
        datetime joined_at
        datetime left_at
        int duration_minutes
        enum attendance_status
    }
```

---

## 8. Syllabus Management ERD

```mermaid
erDiagram
    SUBJECTS ||--o{ SYLLABUS_UNITS : has
    SYLLABUS_UNITS ||--o{ CHAPTERS : has
    CHAPTERS ||--o{ TOPICS : contains
    TOPICS ||--o{ TOPIC_PROGRESS : tracked
    BATCHES ||--o{ TOPIC_PROGRESS : for_batch
    FACULTY ||--o{ TOPIC_PROGRESS : updated_by
    TOPICS ||--o{ SYLLABUS_FILES : has

    SYLLABUS_UNITS {
        bigint id PK
        bigint subject_id FK
        varchar unit_name
        int display_order
        text description
        enum status
        datetime created_at
        datetime updated_at
    }

    CHAPTERS {
        bigint id PK
        bigint syllabus_unit_id FK
        varchar chapter_name
        int display_order
        text description
        enum status
        datetime created_at
        datetime updated_at
    }

    TOPICS {
        bigint id PK
        bigint chapter_id FK
        varchar topic_name
        int display_order
        int estimated_hours
        text description
        enum difficulty_level
        enum status
        datetime created_at
        datetime updated_at
    }

    TOPIC_PROGRESS {
        bigint id PK
        bigint topic_id FK
        bigint batch_id FK
        bigint faculty_id FK
        enum completion_status
        date planned_completion_date
        date actual_completion_date
        decimal completion_percentage
        text remarks
        datetime updated_at
    }

    SYLLABUS_FILES {
        bigint id PK
        bigint topic_id FK
        varchar file_name
        varchar file_url
        varchar file_type
        boolean available_offline
        datetime uploaded_at
    }
```

---

## 9. Test and Examination ERD

```mermaid
erDiagram
    COURSES ||--o{ TESTS : has
    BATCHES ||--o{ TESTS : assigned_to
    SUBJECTS ||--o{ TESTS : for_subject
    FACULTY ||--o{ TESTS : created_by
    TESTS ||--o{ TEST_SECTIONS : has
    TEST_SECTIONS ||--o{ QUESTIONS : contains
    QUESTIONS ||--o{ QUESTION_OPTIONS : has
    QUESTIONS ||--o{ QUESTION_TOPIC_MAPPINGS : mapped_to
    TOPICS ||--o{ QUESTION_TOPIC_MAPPINGS : identifies
    TESTS ||--o{ TEST_ATTEMPTS : has
    STUDENTS ||--o{ TEST_ATTEMPTS : attempts
    TEST_ATTEMPTS ||--o{ STUDENT_ANSWERS : contains
    QUESTIONS ||--o{ STUDENT_ANSWERS : answered
    QUESTION_OPTIONS ||--o{ STUDENT_ANSWERS : selected
    TEST_ATTEMPTS ||--o| RESULTS : generates
    TESTS ||--o{ TEST_RANKS : ranks
    STUDENTS ||--o{ TEST_RANKS : receives
    TESTS ||--o{ OMR_UPLOADS : has
    STUDENTS ||--o{ OMR_UPLOADS : uploaded_for
    FACULTY ||--o{ EVALUATION_LOGS : evaluates
    TEST_ATTEMPTS ||--o{ EVALUATION_LOGS : evaluated

    TESTS {
        bigint id PK
        bigint course_id FK
        bigint batch_id FK
        bigint subject_id FK
        bigint created_by_faculty_id FK
        varchar test_code UK
        varchar test_name
        enum test_level
        enum test_type
        enum exam_pattern
        decimal total_marks
        int duration_minutes
        boolean negative_marking_enabled
        decimal negative_marks
        datetime start_datetime
        datetime end_datetime
        datetime result_publish_datetime
        enum status
        datetime created_at
        datetime updated_at
    }

    TEST_SECTIONS {
        bigint id PK
        bigint test_id FK
        varchar section_name
        int display_order
        decimal section_marks
        int question_count
        datetime created_at
    }

    QUESTIONS {
        bigint id PK
        bigint test_section_id FK
        text question_text
        enum question_type
        enum difficulty_level
        decimal marks
        decimal negative_marks
        text explanation
        int display_order
        datetime created_at
        datetime updated_at
    }

    QUESTION_OPTIONS {
        bigint id PK
        bigint question_id FK
        text option_text
        boolean is_correct
        int display_order
    }

    QUESTION_TOPIC_MAPPINGS {
        bigint id PK
        bigint question_id FK
        bigint topic_id FK
        decimal weightage
    }

    TEST_ATTEMPTS {
        bigint id PK
        bigint test_id FK
        bigint student_id FK
        datetime started_at
        datetime submitted_at
        int time_taken_minutes
        enum attempt_status
        boolean is_offline_created
        varchar local_attempt_id
    }

    STUDENT_ANSWERS {
        bigint id PK
        bigint test_attempt_id FK
        bigint question_id FK
        bigint selected_option_id FK
        text subjective_answer
        varchar answer_file_url
        boolean is_correct
        decimal marks_obtained
        text evaluator_remarks
        datetime answered_at
    }

    RESULTS {
        bigint id PK
        bigint test_attempt_id FK
        decimal total_marks
        decimal marks_obtained
        decimal percentage
        varchar grade
        enum result_status
        datetime evaluated_at
        datetime published_at
    }

    TEST_RANKS {
        bigint id PK
        bigint test_id FK
        bigint student_id FK
        int rank_no
        decimal marks_obtained
        decimal percentage
        boolean is_topper
        datetime generated_at
    }

    OMR_UPLOADS {
        bigint id PK
        bigint test_id FK
        bigint student_id FK
        varchar omr_file_url
        enum processing_status
        json extracted_answers
        json corrected_answers
        datetime uploaded_at
        datetime processed_at
    }

    EVALUATION_LOGS {
        bigint id PK
        bigint test_attempt_id FK
        bigint faculty_id FK
        enum evaluation_type
        decimal marks_before
        decimal marks_after
        text remarks
        datetime evaluated_at
    }
```

### Test Level Values

| Level | Meaning |
|---|---|
| PRIMARY | Basic tests and topic-wise tests. |
| INTERMEDIATE | Unit tests and subject tests. |
| ADVANCED | Full syllabus mocks and competitive exam pattern tests. |

---

## 10. Homework and Assignment ERD

```mermaid
erDiagram
    FACULTY ||--o{ HOMEWORK : creates
    BATCHES ||--o{ HOMEWORK : assigned_to
    SUBJECTS ||--o{ HOMEWORK : for_subject
    TOPICS ||--o{ HOMEWORK : related_topic
    HOMEWORK ||--o{ HOMEWORK_FILES : includes
    HOMEWORK ||--o{ HOMEWORK_SUBMISSIONS : receives
    STUDENTS ||--o{ HOMEWORK_SUBMISSIONS : submits
    HOMEWORK_SUBMISSIONS ||--o{ SUBMISSION_FEEDBACK : has
    FACULTY ||--o{ SUBMISSION_FEEDBACK : reviewed_by

    HOMEWORK {
        bigint id PK
        bigint batch_id FK
        bigint subject_id FK
        bigint topic_id FK
        bigint faculty_id FK
        varchar title
        text description
        datetime assigned_at
        datetime due_datetime
        decimal total_marks
        enum submission_type
        enum status
        datetime created_at
        datetime updated_at
    }

    HOMEWORK_FILES {
        bigint id PK
        bigint homework_id FK
        varchar file_name
        varchar file_url
        varchar file_type
        boolean available_offline
        datetime uploaded_at
    }

    HOMEWORK_SUBMISSIONS {
        bigint id PK
        bigint homework_id FK
        bigint student_id FK
        text submission_text
        varchar submission_file_url
        datetime submitted_at
        enum submission_status
        boolean is_late
        decimal marks_obtained
        datetime created_at
        datetime updated_at
    }

    SUBMISSION_FEEDBACK {
        bigint id PK
        bigint homework_submission_id FK
        bigint faculty_id FK
        decimal marks_given
        text feedback_text
        datetime reviewed_at
    }
```

---

## 11. Fees, Payments, Receipts and Invoice ERD

```mermaid
erDiagram
    COURSES ||--o{ FEE_STRUCTURES : has
    BATCHES ||--o{ FEE_STRUCTURES : may_have
    FEE_STRUCTURES ||--o{ FEE_INSTALLMENTS : contains
    STUDENTS ||--o{ FEE_ASSIGNMENTS : assigned
    FEE_STRUCTURES ||--o{ FEE_ASSIGNMENTS : applied
    FEE_ASSIGNMENTS ||--o{ PAYMENTS : paid_against
    PAYMENTS ||--o| RECEIPTS : generates
    PAYMENTS ||--o| INVOICES : may_generate
    FEE_ASSIGNMENTS ||--o{ DISCOUNTS : has

    FEE_STRUCTURES {
        bigint id PK
        bigint course_id FK
        bigint batch_id FK
        varchar fee_name
        varchar academic_year
        decimal total_amount
        enum fee_type
        boolean gst_applicable
        decimal gst_percentage
        enum status
        datetime created_at
        datetime updated_at
    }

    FEE_INSTALLMENTS {
        bigint id PK
        bigint fee_structure_id FK
        varchar installment_name
        decimal amount
        date due_date
        int display_order
        enum status
    }

    FEE_ASSIGNMENTS {
        bigint id PK
        bigint student_id FK
        bigint fee_structure_id FK
        decimal total_amount
        decimal discount_amount
        decimal payable_amount
        decimal paid_amount
        decimal pending_amount
        enum payment_status
        datetime assigned_at
    }

    DISCOUNTS {
        bigint id PK
        bigint fee_assignment_id FK
        varchar discount_name
        enum discount_type
        decimal discount_value
        decimal discount_amount
        text reason
        bigint approved_by FK
        datetime approved_at
    }

    PAYMENTS {
        bigint id PK
        bigint fee_assignment_id FK
        decimal amount
        enum payment_mode
        varchar transaction_id UK
        varchar gateway_name
        enum payment_status
        date payment_date
        text remarks
        bigint collected_by FK
        datetime created_at
        datetime updated_at
    }

    RECEIPTS {
        bigint id PK
        bigint payment_id FK
        varchar receipt_no UK
        varchar receipt_file_url
        datetime generated_at
        bigint generated_by FK
    }

    INVOICES {
        bigint id PK
        bigint payment_id FK
        varchar invoice_no UK
        varchar gst_number
        decimal taxable_amount
        decimal gst_amount
        decimal total_invoice_amount
        varchar invoice_file_url
        datetime generated_at
    }
```

### Fees Rules

1. `FEE_ASSIGNMENTS.pending_amount = payable_amount - paid_amount`.
2. Partial payment is supported through multiple `PAYMENTS` against one `FEE_ASSIGNMENT`.
3. Receipt is generated after successful payment.
4. Invoice is optional and generated only when GST is applicable.

---

## 12. Notification ERD

```mermaid
erDiagram
    NOTIFICATION_TEMPLATES ||--o{ NOTIFICATIONS : uses
    USERS ||--o{ NOTIFICATIONS : receives
    NOTIFICATIONS ||--o{ NOTIFICATION_DELIVERY_LOGS : has
    USERS ||--o{ USER_NOTIFICATION_PREFERENCES : configures

    NOTIFICATION_TEMPLATES {
        bigint id PK
        varchar template_code UK
        varchar template_name
        enum channel
        varchar subject
        text body_template
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    NOTIFICATIONS {
        bigint id PK
        bigint template_id FK
        bigint recipient_user_id FK
        varchar module_name
        varchar event_type
        bigint reference_id
        varchar title
        text message
        enum priority
        enum status
        datetime scheduled_at
        datetime sent_at
        datetime created_at
    }

    NOTIFICATION_DELIVERY_LOGS {
        bigint id PK
        bigint notification_id FK
        enum channel
        varchar destination
        enum delivery_status
        varchar provider_message_id
        text error_message
        int retry_count
        datetime delivered_at
        datetime created_at
    }

    USER_NOTIFICATION_PREFERENCES {
        bigint id PK
        bigint user_id FK
        boolean sms_enabled
        boolean whatsapp_enabled
        boolean email_enabled
        boolean in_app_enabled
        datetime updated_at
    }
```

---

## 13. Calendar and Parent Meeting ERD

```mermaid
erDiagram
    CALENDAR_EVENTS ||--o{ PARENT_MEETINGS : creates
    PARENT_MEETINGS ||--o{ PARENT_MEETING_ATTENDEES : has
    PARENTS ||--o{ PARENT_MEETING_ATTENDEES : attends
    STUDENTS ||--o{ PARENT_MEETING_ATTENDEES : related_to
    FACULTY ||--o{ PARENT_MEETINGS : hosted_by

    CALENDAR_EVENTS {
        bigint id PK
        varchar event_title
        text description
        enum event_type
        datetime start_datetime
        datetime end_datetime
        varchar audience_type
        bigint course_id FK
        bigint batch_id FK
        enum status
        bigint created_by FK
        datetime created_at
        datetime updated_at
    }

    PARENT_MEETINGS {
        bigint id PK
        bigint calendar_event_id FK
        bigint faculty_id FK
        varchar meeting_title
        text agenda
        datetime meeting_datetime
        varchar meeting_mode
        varchar meeting_link
        varchar location
        enum status
        datetime created_at
        datetime updated_at
    }

    PARENT_MEETING_ATTENDEES {
        bigint id PK
        bigint parent_meeting_id FK
        bigint parent_id FK
        bigint student_id FK
        enum attendance_status
        text remarks
        datetime created_at
    }
```

---

## 14. Offline Sync ERD

```mermaid
erDiagram
    USERS ||--o{ OFFLINE_SYNC_RECORDS : creates
    OFFLINE_SYNC_RECORDS ||--o{ OFFLINE_SYNC_CONFLICTS : may_have

    OFFLINE_SYNC_RECORDS {
        bigint id PK
        bigint user_id FK
        varchar device_id
        varchar local_record_id UK
        varchar entity_name
        varchar operation_type
        json payload
        enum sync_status
        datetime local_created_at
        datetime local_updated_at
        datetime synced_at
        text error_message
        datetime created_at
        datetime updated_at
    }

    OFFLINE_SYNC_CONFLICTS {
        bigint id PK
        bigint offline_sync_record_id FK
        varchar entity_name
        bigint server_record_id
        json local_payload
        json server_payload
        enum conflict_status
        varchar resolution_strategy
        bigint resolved_by FK
        datetime resolved_at
        datetime created_at
    }
```

### Offline Sync Status Values

| Status | Meaning |
|---|---|
| PENDING | Saved locally and waiting for sync. |
| SYNCED | Successfully synced to server. |
| FAILED | Sync failed due to validation/network/server issue. |
| CONFLICT | Conflict found between local and server data. |
| RESOLVED | Conflict resolved manually or automatically. |

---

## 15. Analytics and AI ERD

```mermaid
erDiagram
    STUDENTS ||--o{ STUDENT_PERFORMANCE_METRICS : has
    SUBJECTS ||--o{ STUDENT_PERFORMANCE_METRICS : measured_for
    BATCHES ||--o{ STUDENT_PERFORMANCE_METRICS : batch_context
    STUDENTS ||--o{ WEAK_TOPIC_ANALYSIS : has
    TOPICS ||--o{ WEAK_TOPIC_ANALYSIS : identified
    STUDENTS ||--o{ AI_PREDICTIONS : has
    STUDENTS ||--o{ AI_RECOMMENDATIONS : receives
    USERS ||--o{ CHATBOT_LOGS : asks

    STUDENT_PERFORMANCE_METRICS {
        bigint id PK
        bigint student_id FK
        bigint batch_id FK
        bigint subject_id FK
        varchar academic_year
        varchar period_name
        decimal attendance_percentage
        decimal test_average
        decimal homework_completion_percentage
        decimal syllabus_completion_percentage
        decimal improvement_rate
        decimal overall_score
        datetime calculated_at
    }

    WEAK_TOPIC_ANALYSIS {
        bigint id PK
        bigint student_id FK
        bigint topic_id FK
        decimal accuracy_percentage
        decimal average_marks
        int total_questions_attempted
        int incorrect_count
        enum weakness_level
        text reason
        datetime analyzed_at
    }

    AI_PREDICTIONS {
        bigint id PK
        bigint student_id FK
        varchar prediction_type
        decimal predicted_score
        decimal confidence_score
        json input_features
        text explanation
        datetime predicted_at
    }

    AI_RECOMMENDATIONS {
        bigint id PK
        bigint student_id FK
        enum recommendation_type
        varchar title
        text description
        bigint related_subject_id FK
        bigint related_topic_id FK
        enum priority
        enum status
        datetime created_at
        datetime completed_at
    }

    CHATBOT_LOGS {
        bigint id PK
        bigint user_id FK
        text user_query
        text bot_response
        varchar intent
        json context_used
        datetime created_at
    }
```

---

## 16. Reports ERD

```mermaid
erDiagram
    USERS ||--o{ REPORT_REQUESTS : requests
    REPORT_REQUESTS ||--o{ REPORT_FILES : generates

    REPORT_REQUESTS {
        bigint id PK
        bigint requested_by FK
        varchar report_type
        json filters
        enum status
        datetime requested_at
        datetime completed_at
        text error_message
    }

    REPORT_FILES {
        bigint id PK
        bigint report_request_id FK
        varchar file_name
        varchar file_url
        enum file_format
        datetime generated_at
        datetime expires_at
    }
```

---

## 17. Recommended Unique Keys and Indexes

| Table | Recommended Unique / Index |
|---|---|
| USERS | `mobile`, `email` |
| STUDENTS | `admission_no` |
| FACULTY | `employee_code` |
| COURSES | `course_code` |
| BATCHES | `batch_code` |
| ATTENDANCE_RECORDS | `attendance_session_id + student_id` |
| QR_ATTENDANCE_TOKENS | `token_hash` |
| TESTS | `test_code` |
| TEST_ATTEMPTS | `test_id + student_id + attempt_no` if multiple attempts are allowed |
| RESULTS | `test_attempt_id` |
| TEST_RANKS | `test_id + student_id` |
| FEE_ASSIGNMENTS | `student_id + fee_structure_id` |
| PAYMENTS | `transaction_id` |
| RECEIPTS | `receipt_no` |
| INVOICES | `invoice_no` |
| OFFLINE_SYNC_RECORDS | `local_record_id` |

---

## 18. Key Cardinality Summary

| Relationship | Cardinality |
|---|---|
| User to Roles | Many-to-many |
| User to Student | One-to-one optional |
| User to Faculty | One-to-one optional |
| User to Parent | One-to-one optional |
| Student to Parent | Many-to-many |
| Course to Subject | One-to-many |
| Course to Batch | One-to-many |
| Batch to Student | Many-to-many |
| Batch to Faculty | Many-to-many through subject assignment |
| Batch to Attendance Session | One-to-many |
| Attendance Session to Attendance Records | One-to-many |
| Subject to Syllabus Units | One-to-many |
| Syllabus Unit to Chapters | One-to-many |
| Chapter to Topics | One-to-many |
| Test to Questions | One-to-many through test sections |
| Student to Test Attempts | One-to-many |
| Test Attempt to Result | One-to-one |
| Fee Structure to Fee Assignments | One-to-many |
| Fee Assignment to Payments | One-to-many |
| Payment to Receipt | One-to-one |
| Notification to Delivery Logs | One-to-many |

---

## 19. Implementation Notes

1. Use `created_at`, `updated_at`, and optionally `deleted_at` in most tables.
2. Use soft delete for students, faculty, courses, batches, tests, and fee structures.
3. Store uploaded files in object storage or secure file storage; keep only file URLs and metadata in DB.
4. For offline mode, every offline-created record should include:
   - `local_record_id`
   - `device_id`
   - `is_offline_created`
   - `synced_at`
   - `sync_status`
5. For reports, generate large reports asynchronously and store output in `REPORT_FILES`.
6. For AI, keep explainable outputs in `AI_PREDICTIONS.explanation` and `AI_RECOMMENDATIONS.description`.
7. For security, all sensitive access should be checked using role permissions and entity ownership.

---

## 20. Suggested Database Naming Convention

| Item | Convention | Example |
|---|---|---|
| Table names | plural snake_case | `student_documents` |
| Primary key | `id` | `id` |
| Foreign key | singular table name + `_id` | `student_id` |
| Boolean fields | `is_`, `has_`, `can_` prefix | `is_active` |
| Enum fields | descriptive name | `payment_status` |
| Date-time fields | suffix `_at` | `created_at` |
| Date fields | suffix `_date` | `admission_date` |

---

## 21. Conclusion

This ERD provides the complete database structure for the LMS FDD. It supports student management, attendance, batches, faculty, live classes, syllabus, tests, homework, fees, notifications, calendar, offline sync, AI analytics, reports, and security.

The ERD can be used by developers to create database migrations in Laravel, Node.js/NestJS, MySQL, or PostgreSQL.

