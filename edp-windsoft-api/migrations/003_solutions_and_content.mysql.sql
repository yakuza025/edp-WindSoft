/*!40101 SET NAMES utf8mb4 */;
SET NAMES utf8mb4;
/*!40101 SET NAMES utf8mb4 */;
SET NAMES utf8mb4;
-- ═══════════════════════════════════════════════════════════════════
-- 003 — Solutions, Site Content, Contact Messages
-- MySQL / MariaDB (matches `edp_windsoft` schema style)
-- Safe to re-run: uses IF NOT EXISTS + INSERT IGNORE
-- ═══════════════════════════════════════════════════════════════════

USE `edp_windsoft`;

-- ─────────────────────────────────────────────────────────────────
-- TABLE: solutions
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `solutions` (
  `id`          int(11) NOT NULL AUTO_INCREMENT,
  `slug`        varchar(64) NOT NULL,
  `title`       varchar(200) NOT NULL,
  `subtitle`    text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `icon`        varchar(10) NOT NULL DEFAULT '?',
  `color`       varchar(20) NOT NULL DEFAULT '#4f46e5',
  `category`    varchar(80) DEFAULT NULL,
  `features`    longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`features`)),
  `cta_label`   varchar(80) DEFAULT 'Learn more',
  `cta_href`    varchar(255) DEFAULT NULL,
  `sort_order`  int(11) NOT NULL DEFAULT 0,
  `is_active`   tinyint(1) NOT NULL DEFAULT 1,
  `created_at`  datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at`  datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_solutions_sort` (`sort_order`),
  KEY `idx_solutions_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────
-- TABLE: site_content (single row, id = 1)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `site_content` (
  `id`                  int(11) NOT NULL DEFAULT 1,
  `about_title`         text DEFAULT NULL,
  `about_body`          text DEFAULT NULL,
  `highlight_1_icon`    varchar(10) DEFAULT NULL,
  `highlight_1_title`   varchar(200) DEFAULT NULL,
  `highlight_1_text`    text DEFAULT NULL,
  `highlight_2_icon`    varchar(10) DEFAULT NULL,
  `highlight_2_title`   varchar(200) DEFAULT NULL,
  `highlight_2_text`    text DEFAULT NULL,
  `highlight_3_icon`    varchar(10) DEFAULT NULL,
  `highlight_3_title`   varchar(200) DEFAULT NULL,
  `highlight_3_text`    text DEFAULT NULL,
  `contact_headline`    varchar(200) DEFAULT NULL,
  `contact_description` text DEFAULT NULL,
  `contact_email`       varchar(200) DEFAULT NULL,
  `contact_phone`       varchar(60) DEFAULT NULL,
  `contact_address`     text DEFAULT NULL,
  `contact_hours`       varchar(200) DEFAULT NULL,
  `contact_cta_label`   varchar(80) DEFAULT NULL,
  `contact_cta_href`    varchar(255) DEFAULT NULL,
  `social_linkedin`     varchar(255) DEFAULT NULL,
  `social_twitter`      varchar(255) DEFAULT NULL,
  `social_facebook`     varchar(255) DEFAULT NULL,
  `social_github`       varchar(255) DEFAULT NULL,
  `footer_text`         text DEFAULT NULL,
  `updated_at`          datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  CONSTRAINT `site_content_singleton` CHECK (`id` = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────
-- TABLE: contact_messages
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id`         int(11) NOT NULL AUTO_INCREMENT,
  `name`       varchar(120) NOT NULL,
  `email`      varchar(200) NOT NULL,
  `phone`      varchar(60) DEFAULT NULL,
  `subject`    varchar(200) DEFAULT NULL,
  `message`    text NOT NULL,
  `is_read`    tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_messages_created` (`created_at`),
  KEY `idx_messages_unread` (`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────
-- SEED: site_content (id = 1)
-- ─────────────────────────────────────────────────────────────────
INSERT IGNORE INTO `site_content` (
  `id`, `about_title`, `about_body`,
  `highlight_1_icon`, `highlight_1_title`, `highlight_1_text`,
  `highlight_2_icon`, `highlight_2_title`, `highlight_2_text`,
  `highlight_3_icon`, `highlight_3_title`, `highlight_3_text`,
  `contact_headline`, `contact_description`,
  `contact_email`, `contact_phone`, `contact_address`, `contact_hours`,
  `contact_cta_label`, `contact_cta_href`,
  `social_linkedin`, `social_twitter`, `social_facebook`, `social_github`,
  `footer_text`
) VALUES (
  1,
  'Software built for the way you work',
  'For over a decade we have been crafting enterprise-grade solutions that help organizations streamline operations, unlock data-driven insights, and scale with confidence. Every product we ship is backed by deep industry expertise, modern engineering, and a support team that actually answers the phone. No bloat. No surprise invoices. Just software that works.',
  '?', 'Mission-driven', 'Every line of code serves a real user need. We build what works, not what looks good in a pitch deck.',
  '?', 'Battle-tested', 'Deployed at hundreds of organizations — from lean startups to public companies. Proven at scale.',
  '?', 'Global reach', 'Serving clients across 20+ countries with localized support in 8 languages.',
  'Let us build something great together',
  'Whether you are exploring a new project, need a consultation, or want a tailored demo of any solution below — we would love to hear from you. Response times are typically under 4 business hours.',
  'hello@windsoft.example',
  '+1 (555) 000-0000',
  '123 Innovation Way, Suite 400, Tech City, TC 00000',
  'Mon–Fri, 9:00–18:00 (UTC-5)',
  'Send a message',
  '#contact-form',
  'https://linkedin.com/company/windsoft',
  'https://twitter.com/windsoft',
  'https://facebook.com/windsoft',
  'https://github.com/windsoft',
  '© 2025 WindSoft Solutions. All rights reserved.'
);

-- ─────────────────────────────────────────────────────────────────
-- SEED: solutions (4 demo entries)
-- ─────────────────────────────────────────────────────────────────
INSERT IGNORE INTO `solutions`
  (`slug`, `title`, `subtitle`, `description`, `icon`, `color`, `category`,
   `features`, `cta_label`, `cta_href`, `sort_order`, `is_active`)
VALUES
(
  'lending-suite',
  'Lending Suite',
  'End-to-end loan origination and servicing',
  'A comprehensive platform for modern lenders — from application capture and underwriting to disbursement, amortization, and collections. Automate the busywork, eliminate spreadsheets, and give your team real-time visibility into every loan in your portfolio.',
  '?', '#4f46e5', 'Finance',
  '["Loan origination","Automated underwriting","Amortization schedules","Collections management","Regulatory reporting","Borrower self-service","Multi-currency support","Audit trail"]',
  'Explore the suite', '/#contact-form', 1, 1
),
(
  'hr-workforce',
  'HR & Workforce',
  'Modern people management for growing teams',
  'Everything you need to attract, onboard, and retain great people — recruitment pipeline, onboarding workflows, payroll, attendance, performance reviews, and leave management, all unified in one intuitive workspace. Stop juggling five different HR tools.',
  '?', '#059669', 'Human Resources',
  '["Recruitment pipeline","Onboarding workflows","Payroll processing","Attendance tracking","Performance reviews","Leave management","Document vault","Employee self-service"]',
  'See how it works', '/#contact-form', 2, 1
),
(
  'erp-core',
  'ERP Core',
  'Unified operations for enterprises',
  'Bring finance, inventory, procurement, and production under one roof. Our ERP is built for scale, compliance, and deep integration with your existing stack. Native support for multi-entity, multi-currency, and complex approval hierarchies — without the six-month implementation timeline.',
  '?', '#dc2626', 'Enterprise',
  '["Financial accounting","Inventory control","Procurement workflows","Production planning","Multi-currency ledgers","Custom reports & dashboards","Role-based approvals","SOC 2 compliant"]',
  'Request a demo', '/#contact-form', 3, 1
),
(
  'analytics-hub',
  'Analytics Hub',
  'Turn raw data into action',
  'Connect your data sources, build dashboards in minutes, and share insights across the organization — without writing SQL. Pre-built templates for common metrics, anomaly detection out of the box, and row-level security so the right people see the right data.',
  '?', '#7c3aed', 'Data & BI',
  '["500+ connectors","No-code dashboard builder","Scheduled reports","Anomaly detection","Embedded analytics","Row-level security","Natural-language queries","Slack & Teams alerts"]',
  'Try it free', '/#contact-form', 4, 1
);
