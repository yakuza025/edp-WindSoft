SET NAMES utf8mb4;
USE `edp_windsoft`;

INSERT INTO `solutions`
  (`slug`, `title`, `subtitle`, `description`, `icon`, `color`, `category`,
   `features`, `cta_label`, `cta_href`, `sort_order`, `is_active`)
VALUES
(
  'pos-inventory',
  'POS & Inventory',
  'Point of sale with live stock control',
  'Sell anywhere, sync everywhere. Real-time inventory tracking across every branch, barcode scanning at the register, receipts that print themselves, and stock alerts before you run out. Built for retailers that cannot afford downtime.',
  '🛒', '#ea580c', 'Retail',
  '["Barcode checkout","Multi-branch sync","Live stock levels","Purchase orders","Supplier management","Sales analytics","Receipt printing","Offline mode"]',
  'See the demo', '/#contact-form', 5, 1
),
(
  'ticketing-helpdesk',
  'Ticketing & Helpdesk',
  'Support that scales with your team',
  'Support tickets, SLA rules, and a shared agent console that keeps every conversation on track. Route by skill, escalate by priority, measure by first-response and resolution time — without the spreadsheet chaos.',
  '🎫', '#a855f7', 'Support',
  '["Ticket routing","SLA rules","Agent console","Email & chat integration","Knowledge base","CSAT surveys","Time tracking","Analytics dashboard"]',
  'Explore features', '/#contact-form', 6, 1
),
(
  'rental-platform',
  'Rental Platform',
  'Bookings, contracts, and fleet tracking',
  'From reservation to return, all in one place. Manage fleet or equipment bookings, digital contracts, availability calendars, invoicing, and damage reports. Handles multi-location and multi-currency out of the box.',
  '🚗', '#10b981', 'Operations',
  '["Booking calendar","Digital contracts","Fleet management","Availability rules","Automatic invoicing","Damage reports","Multi-location","Customer portal"]',
  'Start a trial', '/#contact-form', 7, 1
),
(
  'payroll-benefits',
  'Payroll & Benefits',
  'Compliance-grade payroll, zero spreadsheets',
  'Automated payroll runs, tax filing, benefits administration, and payslip distribution — all compliant with local regulations. Handles multi-currency, multi-entity, and contractor vs employee mixes.',
  '💼', '#0891b2', 'Finance',
  '["Automated payroll","Tax compliance","Benefits admin","Payslip distribution","Multi-entity","Contractor payments","Time-off sync","Audit trail"]',
  'Request a demo', '/#contact-form', 8, 1
)
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `subtitle` = VALUES(`subtitle`),
  `description` = VALUES(`description`),
  `icon` = VALUES(`icon`),
  `color` = VALUES(`color`),
  `category` = VALUES(`category`),
  `features` = VALUES(`features`),
  `cta_label` = VALUES(`cta_label`),
  `cta_href` = VALUES(`cta_href`),
  `sort_order` = VALUES(`sort_order`),
  `is_active` = VALUES(`is_active`);
