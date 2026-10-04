// Per-module copy (English). Features are limited to what exists in the product today.

const modules = {
  audits: {
    name: 'Audits',
    summary: 'Build audit checklists, run audits on the floor and follow every finding until it is closed.',
    features: [
      'Audit grids with weighted sections and questions, scored by weighted total, conformity rate or maturity level (E to A)',
      '11 answer types: 0–5 and 0–10 scores, Conform / NC / NA, minor or major gap, numeric measures and more',
      'Field sessions with GPS, mandatory photos, auditor and auditee signatures, and QR codes per location',
      'Findings with 5-Why and Ishikawa root cause, effectiveness checks and auditor qualifications',
    ],
  },
  quality: {
    name: 'Quality / PDCA',
    summary: 'Record non-conformities and field findings, and run structured Plan-Do-Check-Act cycles to closure.',
    features: [
      'Non-conformities by source (customer, supplier, audit, inspection) and severity, with a raised → analysis → action → verification → closed workflow',
      'PDCA cycles: indicator, target and due date, root causes with 5M analysis, check of the objective and who validated it',
      'Act step that records the standard change — new document, revision, training or communication — with evidence and full history',
      'Gemba walks with rubrics and observations, and 5S audits scored per S',
    ],
  },
  kaizen: {
    name: 'Kaizen',
    summary: 'Collect improvement ideas from everyone, review them in committee and measure what they deliver.',
    features: [
      'Submit an idea in seconds by scanning a QR code on the floor',
      'Committee review with votes (anonymous if you want), plus employee votes and comments',
      'Estimated and actual savings, with ROI calculated automatically',
      'Campaigns, strategic goals, badges and a status history that cannot be edited',
    ],
  },
  documents: {
    name: 'Documents',
    summary: 'Controlled documents with versions, approval circuits and “read and understood” acknowledgements.',
    features: [
      'Spaces and folders with automatic numbering rules',
      'Versions and approval workflow templates: draft, review, approved',
      'Read acknowledgements signed and traceable for every reader',
      'Review and expiry dates, confidentiality levels, access rules and a document audit log',
    ],
  },
  meetings: {
    name: 'Meetings',
    summary: 'Plan and run meetings, and turn every decision into a tracked action.',
    features: [
      'Recurring meetings with participants and RSVP',
      'Timed agenda items, including KPI review items',
      'Minutes generated and sent automatically after the meeting',
      'Decisions, actions, a parking lot for side topics and feedback surveys',
    ],
  },
  tasks: {
    name: 'Tasks',
    summary: 'One inbox for everything assigned to you, whichever module it comes from.',
    features: [
      'A single work list with status and priority',
      'Pulls in PDCA actions, findings, project tasks, document approvals, Kaizen, meeting actions and audit plans',
      'Also receives evaluations, CRM activities, leave requests, maintenance orders and helpdesk tickets',
      'Available on the mobile app as “My Work”',
    ],
  },
  projects: {
    name: 'Projects',
    summary: 'Run projects with phases, milestones, tasks and a Gantt view.',
    features: [
      'Phases, milestones and tasks with checklists and blocker tracking',
      'Gantt chart view',
      'Issues log and project team',
      'Progress roll-up, status history, comments and attachments',
    ],
  },
  talents: {
    name: 'Talents',
    summary: 'A skills framework and versatility matrix, with certifications tracked before they expire.',
    features: [
      'Competency families, job profiles with required levels, versioned',
      'Employee competencies and gap analysis against the job profile',
      'Qualifications and certifications with expiry alerts at 90, 60, 30 and 7 days',
      'Succession plans, 9-box placement, workforce forecasts and onboarding playbooks',
    ],
  },
  evaluations: {
    name: 'Evaluations',
    summary: 'Annual and probation reviews, 360° feedback and development plans.',
    features: [
      'Evaluation campaigns: self, manager, peer, expert, Gemba observation and tests',
      '360° feedback, anonymous if needed, with calibration',
      'Continuous feedback: one-to-ones, check-ins and spot feedback',
      'Development plans and actions, with performance snapshots',
    ],
  },
  training: {
    name: 'Training',
    summary: 'Plan and track training sessions, budgets and attendance.',
    features: [
      'Training plans with total, spent and remaining budget',
      'Trainers with daily cost',
      'Internal, external, e-learning and on-the-job sessions linked to competencies',
      'Training needs raised by evaluations, enrolments with attendance and scores',
    ],
  },
  hr: {
    name: 'HR',
    summary: 'Employee records and day-to-day HR administration.',
    features: [
      'Sites, departments, zones, positions and salary grades',
      'Employees, contracts and internal moves',
      'Leave types, allocations and requests; attendance including overtime',
      'Payslips with allowance, deduction and tax lines',
    ],
  },
  recruitment: {
    name: 'Recruitment',
    summary: 'Hiring from the job request to the employee record, with nothing retyped.',
    features: [
      'Job requisitions with an approval workflow',
      'Job postings, candidates, talent pool and applications through hiring stages',
      'Interviews with structured feedback and recommendations',
      'Offers and negotiation — “hire” creates the HR employee automatically',
    ],
  },
  crm: {
    name: 'CRM',
    summary: 'Leads, accounts, contacts and your sales pipeline.',
    features: [
      'Leads with marketing and sales scores, and Excel import',
      'Accounts, contacts, territories and sales teams',
      'Pipelines and stages with probability, lost reasons and stage history',
      'Activities, quotes, customer health, renewals and automation rules',
    ],
  },
  marketing: {
    name: 'Marketing',
    summary: 'E-mail and WhatsApp campaigns and automated sequences that feed the CRM.',
    features: [
      'Drag-and-drop e-mail templates',
      'Audiences and automated multi-step sequences',
      'Campaigns with A/B variants and UTM tracking',
      'Open, click and bounce tracking, suppression list and WhatsApp sending',
    ],
  },
  sales: {
    name: 'Sales',
    summary: 'Products, price lists and customer orders.',
    features: [
      'Products with categories, variants and units',
      'Price lists with discounts, formulas and quantity breaks',
      'Sales orders from draft to done, with delivered and invoiced quantities',
      'Invoicing policy on order or on delivery',
    ],
  },
  purchase: {
    name: 'Purchase',
    summary: 'Supplier quotations and purchase orders.',
    features: [
      'Requests for quotation and purchase orders',
      'Approval workflow: pending, approved, rejected',
      'Received quantities tracked per line',
      'Supplier price lists',
    ],
  },
  accounting: {
    name: 'Accounting',
    summary: 'Bookkeeping, invoicing and financial reports.',
    features: [
      'Chart of accounts, taxes and payment terms',
      'Journals and entries with posting and reversal',
      'Customer invoices, supplier bills, credit notes and payments, multi-currency',
      'Profit and loss, aged receivables and aged payables',
    ],
  },
  reporting: {
    name: 'Reporting',
    summary: 'Build your own dashboards and indicators from any module’s data.',
    features: [
      'Dashboards with KPI cards, line, bar and pie charts and tables',
      'KPI definitions shared across the company',
      'Datasets, measures and multi-page reports',
      'Scheduled delivery as PDF, Excel or CSV',
    ],
  },
  inventory: {
    name: 'Inventory',
    summary: 'Warehouses, locations and stock.',
    features: [
      'Warehouses and locations',
      'Lots and serial numbers with expiry dates',
      'Transfers and stock moves',
      'Reorder rules and stock valuation (average cost or FIFO)',
    ],
  },
  manufacturing: {
    name: 'Manufacturing',
    summary: 'Production planning and execution.',
    features: [
      'Work centres with capacity, efficiency, hourly cost and OEE target',
      'Routings and operations',
      'Bills of materials and components',
      'Manufacturing orders, work orders and scrap orders',
    ],
  },
  maintenance: {
    name: 'Maintenance',
    summary: 'Keep equipment running with preventive plans and tracked work orders.',
    features: [
      'Equipment, categories and maintenance teams',
      'Preventive plans triggered by a fixed interval or a meter reading',
      'Preventive and corrective work orders with steps and parts',
      'Maintenance requests and a maintenance calendar',
    ],
  },
  iot: {
    name: 'IoT',
    summary: 'Connect machine sensors, watch live readings and get alerted.',
    features: [
      'Devices — sensors, meters, PLCs, cameras — over MQTT, HTTP or WebSocket',
      'Live data points streamed to the screen',
      'Alert rules: above, below, equal to or outside a range',
      'Alert events with notifications',
    ],
  },
  helpdesk: {
    name: 'Helpdesk',
    summary: 'Internal or customer support tickets with service levels.',
    features: [
      'Ticket types and support teams',
      'SLA policies with first-response and resolution deadlines per ticket',
      'E-mail, portal and phone channels, with internal notes',
      'Knowledge base with categories and articles',
    ],
  },
}

export default modules
