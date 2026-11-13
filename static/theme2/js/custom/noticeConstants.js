/* =========================================================
   noticeConstants.js
   All mock data + configuration as plain global constants.
   Arrays are mutated in place (push / splice / unshift) elsewhere,
   never reassigned. Everything here is a normal global — usable
   directly from the console (e.g. ROLES, NOTICES, PRIO).
   ========================================================= */

const ROLES = [];

const ROLE_FIELD_META = {
  STUDENT: { fields: { session: true, grade: true, batch: true, course: true, enroll: true, registrationType: true } },
  PARENT: { fields: { session: true, grade: true, batch: true, course: true, enroll: true } },
  TEACHER: { fields: { grade: true } }
};

const REGISTRATION_TYPES = ["ONE_TO_ONE", "BATCH", "SCHOLARSHIP", "SSP", "CWS", "ONE_TO_ONE_FLEX", "DUAL_DIPLOMA"];

/** Display names aligned with Manage User → Student list “Select Enroll Type”. */
const REGISTRATION_TYPE_LABELS = {
  ONE_TO_ONE: "One-to-One Learning",
  BATCH: "Group Learning",
  SCHOLARSHIP: "Self Study Learning",
  SSP: "Self Study Plus",
  CWS: "CWS",
  ONE_TO_ONE_FLEX: "Flexy Learning Program",
  DUAL_DIPLOMA: "Dual Diploma"
};

const REGISTRATION_TYPE_OPTIONS = REGISTRATION_TYPES.map(function (code) {
  return { key: code, value: REGISTRATION_TYPE_LABELS[code] || code.replace(/_/g, " ") };
});

const ENROLLMENT_STATUS_OPTIONS = [
  { key: "1", value: "Withdrawn" },
  { key: "2", value: "Partial entry - New enrollment" },
  { key: "3", value: "Partial entry - Re-enrollment" },
  { key: "4", value: "Completed-New-Enrollment" },
  { key: "5", value: "Completed-Re-Enrollment" }
];

const PROFILE_STATUS_OPTIONS = [
  { key: "0", value: "Completed" },
  { key: "1", value: "Withdrawn" }
];

const COURSE_PROVIDER_ID_FOR_BATCH = 38;
const COURSE_PROVIDER_ID_DEFAULT = 37;

const SESSION_OPTIONS = [];
const GRADE_OPTIONS = [];
const BATCH_OPTIONS = [];
const COURSE_OPTIONS = [];
const COUNTRY_OPTIONS = [];

const CHANNELS = [
  { id: "inapp",    name: "In-app",   icon: "&#128241;", reachable: 1.00, opens: true },
  { id: "website",  name: "Website",  icon: "&#127760;", reachable: 1.00, opens: true },
  { id: "push",     name: "Push",     icon: "&#128276;", reachable: 0.72, opens: "delivered" },
  { id: "email",    name: "Email",    icon: "&#9993;",   reachable: 0.98, opens: "unreliable" },
  { id: "whatsapp", name: "WhatsApp", icon: "&#128172;", reachable: 0.54, opens: true }
];

const TYPES = [];

const PROFILE_SECTIONS = ["Personal Information", "Academic Information", "Contact Information", "Documents"];
const FIELD_TYPES = [["text", "Text"], ["date", "Date"], ["file", "File"], ["dropdown", "Dropdown"]];

const EXISTING_FIELDS = [];

const COMPOSE_CHANNELS = ["inapp", "website", "email", "whatsapp"];

/** When false, Compose hides acknowledgment & preference-override (sections 6–7) and never saves them. */
const COMPOSE_ACK_OVERRIDE_ENABLED = false;

/** When false, only “Attach to message (separate)” is available; embedded inline is hidden. */
const COMPOSE_ATTACHMENT_EMBEDDED_ENABLED = false;

/** When false, Common mode toggle is hidden; per-channel message fields are always used. */
const COMPOSE_COMMON_MODE_ENABLED = false;

const CHANNEL_NOTE = {
  inapp:    "It will show in the app as a pop-up and in the notice section.",
  website:  "It will show in the school management system as a pop-up and in the notice section.",
  email:    "It will send an email to the user.",
  whatsapp: "It will send the WhatsApp template mapped to the event you choose."
};

const WA_TEMPLATES = [];

const COMPOSE_TEMPLATES = [];

const NOTICES = [
  { id: "NT-1048", title: "Semester 1 report cards are now available", type: "report", prio: "normal", status: "sent", roles: ["student", "parent"], channels: ["inapp", "email", "push"], created: "12 Jul 2026 09:12", when: "12 Jul 2026 09:15", sent: 14320, delivered: 14002, opened: 9840, clicked: 5120, failed: 318, ack: false },
  { id: "NT-1047", title: "Updated Child Protection & Safeguarding Policy 2026", type: "legal", prio: "high", status: "sending", roles: ["parent", "staff", "teacher"], channels: ["inapp", "email"], created: "14 Jul 2026 08:00", when: "14 Jul 2026 08:00", sent: 1968, delivered: 1740, opened: 0, clicked: 0, failed: 12, ack: true, enforce: "soft", skips: 2 },
  { id: "NT-1046", title: "Fee payment is due in 7 days", type: "fee", prio: "high", status: "scheduled", roles: ["parent"], channels: ["inapp", "email", "whatsapp"], created: "13 Jul 2026 16:40", when: "18 Jul 2026 09:00 (recipient local)", sent: 0, delivered: 0, opened: 0, clicked: 0, failed: 0, ack: false },
  { id: "NT-1045", title: "Grade 10 live class starts in 30 minutes", type: "class", prio: "normal", status: "sent", roles: ["student"], channels: ["push", "inapp"], created: "14 Jul 2026 07:30", when: "14 Jul 2026 07:30", sent: 842, delivered: 640, opened: 610, clicked: 388, failed: 16, ack: false },
  { id: "NT-1044", title: "AP Exam registration is now open", type: "exam", prio: "normal", status: "draft", roles: ["student", "parent"], channels: ["inapp", "email"], created: "14 Jul 2026 06:10", when: "—", sent: 0, delivered: 0, opened: 0, clicked: 0, failed: 0, ack: false },
  { id: "NT-1043", title: "Annual Data Processing Consent (GDPR/DPA)", type: "legal", prio: "high", status: "sent", roles: ["parent"], channels: ["inapp", "email"], created: "01 Jul 2026 10:00", when: "01 Jul 2026 10:00", sent: 1727, delivered: 1701, opened: 1520, clicked: 0, failed: 26, ack: true, enforce: "hard" },
  { id: "NT-1042", title: "Campus closure — severe weather warning", type: "emergency", prio: "critical", status: "sent", roles: ["student", "parent", "teacher", "staff"], channels: ["inapp", "push", "email", "whatsapp"], created: "28 Jun 2026 05:44", when: "28 Jun 2026 05:44", sent: 8721, delivered: 8480, opened: 8100, clicked: 0, failed: 241, ack: false },
  { id: "NT-1041", title: "Scholarship applications closing soon", type: "scholar", prio: "info", status: "scheduled", roles: ["student"], channels: ["inapp", "email"], created: "20 Jun 2026 11:00", when: "Weekly (Mon 09:00)", sent: 0, delivered: 0, opened: 0, clicked: 0, failed: 0, ack: false },
  { id: "NT-1040", title: "Graduation registration closes tomorrow", type: "grad", prio: "info", status: "draft", roles: ["student"], channels: ["inapp", "email"], created: "15 Jun 2026 09:00", when: "—", sent: 0, delivered: 0, opened: 0, clicked: 0, failed: 0, ack: false },
  { id: "NT-1039", title: "Library system maintenance tonight", type: "enroll", prio: "info", status: "partially", roles: ["student", "teacher"], channels: ["inapp", "email"], created: "10 Jun 2026 18:00", when: "10 Jun 2026 22:00", sent: 6900, delivered: 5210, opened: 2800, clicked: 0, failed: 1690, ack: false },
  { id: "NT-1038", title: "Welcome to the 2026-27 academic year", type: "enroll", prio: "info", status: "sent", roles: ["student", "parent", "teacher", "staff"], channels: ["inapp", "email"], created: "01 Apr 2026 08:00", when: "01 Apr 2026 08:00", sent: 8600, delivered: 8410, opened: 6200, clicked: 1200, failed: 190, ack: false }
];

const WORKSPACE_NOTICES = [];

const LEDGER = [
  { notice: "NT-1043", title: "Annual Data Processing Consent", user: "Fatima Al-Rashid", role: "Parent", action: "accepted", ver: "v2.0", when: "01 Jul 2026 10:22:14 UTC", local: "01 Jul 2026 14:22 (GST)", ip: "94.200.14.72", loc: "Dubai, UAE", device: "iOS 17 · Safari", skips: 0 },
  { notice: "NT-1043", title: "Annual Data Processing Consent", user: "Rahul Mehta", role: "Parent", action: "accepted", ver: "v2.0", when: "01 Jul 2026 11:05:41 UTC", local: "01 Jul 2026 16:35 (IST)", ip: "49.36.220.11", loc: "Mumbai, India", device: "Android 14 · Chrome", skips: 0 },
  { notice: "NT-1043", title: "Annual Data Processing Consent", user: "Grace Okafor", role: "Parent", action: "declined", ver: "v2.0", when: "02 Jul 2026 09:14:03 UTC", local: "02 Jul 2026 10:14 (WAT)", ip: "105.112.9.240", loc: "Lagos, Nigeria", device: "Android 13 · Chrome", skips: 1 },
  { notice: "NT-1047", title: "Child Protection & Safeguarding Policy", user: "James Whitfield", role: "Staff", action: "skipped", ver: "v3.1", when: "14 Jul 2026 08:31:52 UTC", local: "14 Jul 2026 09:31 (BST)", ip: "81.157.44.19", loc: "London, UK", device: "macOS · Chrome", skips: 2 },
  { notice: "NT-1047", title: "Child Protection & Safeguarding Policy", user: "Aisha Kamau", role: "Teacher", action: "accepted", ver: "v3.1", when: "14 Jul 2026 09:02:11 UTC", local: "14 Jul 2026 12:02 (EAT)", ip: "197.232.15.88", loc: "Nairobi, Kenya", device: "Windows · Edge", skips: 0 },
  { notice: "NT-1047", title: "Child Protection & Safeguarding Policy", user: "Chen Wei", role: "Parent", action: "pending", ver: "v3.1", when: "—", local: "—", ip: "—", loc: "—", device: "—", skips: 1 }
];

const APPROVAL_REQUIRED_ROLES = ["TEACHER", "STAFF", "FINANCE", "COUNSELOR"];
const MASS_SEND_THRESHOLD = 1000;

const KNOWN_VARS = ["student_name", "guardian_name", "grade"];

const TIMEZONE_OPTIONS = [];

const OVERRIDES = [
  { role: "director", user: "",                       applies: "Critical + High", effect: "Override quiet hours", by: "IT Team" },
  { role: "itteam",   user: "",                       applies: "Critical",        effect: "Override quiet hours", by: "IT Team" },
  { role: "staff",    user: "Priya Nair (Principal)", applies: "Critical + High", effect: "Override quiet hours", by: "Admin" },
  { role: "staff",    user: "Facilities Lead",        applies: "Critical",        effect: "Override quiet hours", by: "Admin" }
];

const ACK_SUMMARY = {
  "NT-1043": {
    title: "Annual Data Processing Consent", required: 1727, accepted: 1520, declined: 14, skipped: 0, pending: 193, enforce: "hard",
    versions: [
      { v: "v2.0", date: "01 Jul 2026", note: "Current — added biometric-data clause (material change → skip counter reset)", acc: 1520 },
      { v: "v1.4", date: "12 Mar 2026", note: "Cosmetic wording fix", acc: 0 },
      { v: "v1.0", date: "05 Sep 2025", note: "Initial policy", acc: 0 }
    ],
    byRole: [["Parent", 1727, 1520, 14, 0, 193]],
    byCountry: [["UAE", 640, 590], ["India", 512, 470], ["UK", 210, 188], ["Nigeria", 180, 150], ["Other", 185, 122]]
  },
  "NT-1047": {
    title: "Child Protection & Safeguarding Policy", required: 1968, accepted: 912, declined: 3, skipped: 641, pending: 412, enforce: "soft", soft: 3,
    versions: [
      { v: "v3.1", date: "14 Jul 2026", note: "Current — clarified reporting line (cosmetic, skip counter carried over)", acc: 912 },
      { v: "v3.0", date: "02 Jun 2026", note: "Added online-safety section (material change)", acc: 0 }
    ],
    byRole: [["Parent", 1200, 540, 2, 401, 257], ["Teacher", 530, 290, 1, 160, 79], ["Staff", 238, 82, 0, 80, 76]],
    byCountry: [["UAE", 700, 360], ["India", 520, 240], ["UK", 300, 180], ["Kenya", 120, 60], ["Other", 328, 72]]
  }
};

/* Priority metadata. `cls` maps to a Bootstrap contextual colour. */
const PRIO = {
  critical: { cls: "danger",  l: "Critical",      d: "&#128308;" },
  high:     { cls: "warning", l: "High",          d: "&#128992;" },
  normal:   { cls: "warning", l: "Normal",        d: "&#128993;" },
  info:     { cls: "success", l: "Informational", d: "&#128994;" }
};

/* Notice lifecycle status -> [Bootstrap badge colour, label]. */
const STATUS_MAP = {
  draft:             ["secondary", "Draft"],
  pending_approval:  ["warning",   "Pending approval"],
  scheduled:         ["info",      "Scheduled"],
  sending:           ["primary",   "Sending"],
  sent:              ["success",   "Sent"],
  partially_failed:  ["danger",    "Partially failed"],
  paused:            ["warning",   "Paused"],
  cancelled:         ["dark",      "Cancelled"],
  archived:          ["secondary", "Archived"],
  pending:           ["warning",   "Pending"],
  failed_final:      ["danger",    "Failed (final)"],
  failed:            ["warning",   "Failed"]
};

const DELIVERY_STATUS_MAP = {
  PENDING: ["warning", "Pending"],
  SENT: ["info", "Sent"],
  DELIVERED: ["success", "Delivered"],
  FAILED: ["danger", "Failed"],
  FAILED_FINAL: ["dark", "Failed (final)"]
};

/* Global application state (data, not a namespace). */
const S = {
  view: "dashboard",
  compose: null,      // seeded by blankCompose() at boot
  noticeTab: "all",
  communicationInbox: {
    page: 1,
    channel: "",
    subjectContains: "",
    noticeQuery: "",
    statusFilters: []
  },
  prefs: null,
  previewExpired: false
};
