-- ═══════════════════════════════════════════════════════════════════
-- 006 — FAQ items for the landing page
-- Safe to re-run: CREATE TABLE IF NOT EXISTS + INSERT IGNORE
-- ═══════════════════════════════════════════════════════════════════
USE `edp_windsoft`;

CREATE TABLE IF NOT EXISTS `faq_items` (
  `id`          int(11) NOT NULL AUTO_INCREMENT,
  `question`    varchar(300) NOT NULL,
  `answer`      text NOT NULL,
  `sort_order`  int(11) NOT NULL DEFAULT 0,
  `is_active`   tinyint(1) NOT NULL DEFAULT 1,
  `created_at`  datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at`  datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_faq_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `faq_items` (`question`, `answer`, `sort_order`, `is_active`)
SELECT * FROM (SELECT
  'How long does implementation take?' AS q,
  'Most deployments go live in 2-6 weeks, depending on your data volume and integration needs. We provide a dedicated onboarding engineer for the full duration.' AS a,
  1 AS s, 1 AS active
) x
WHERE NOT EXISTS (SELECT 1 FROM `faq_items` LIMIT 1);

INSERT IGNORE INTO `faq_items` (`question`, `answer`, `sort_order`, `is_active`)
SELECT * FROM (SELECT
  'Can I try before buying?' AS q,
  'Yes — every solution has a live interactive demo you can explore directly from this page. For a guided trial with your own data, request a demo and we will set up a sandbox environment within 24 hours.' AS a,
  2 AS s, 1 AS active
) x
WHERE (SELECT COUNT(*) FROM `faq_items`) = 1;

INSERT IGNORE INTO `faq_items` (`question`, `answer`, `sort_order`, `is_active`)
SELECT * FROM (SELECT
  'What integrations are available?' AS q,
  'Native integrations with Slack, Microsoft Teams, QuickBooks, Xero, and Stripe. For everything else, we provide a REST API, webhooks, and CSV import/export.' AS a,
  3 AS s, 1 AS active
) x
WHERE (SELECT COUNT(*) FROM `faq_items`) = 2;

INSERT IGNORE INTO `faq_items` (`question`, `answer`, `sort_order`, `is_active`)
SELECT * FROM (SELECT
  'How is pricing structured?' AS q,
  'Per-seat subscription with volume discounts. Enterprise plans support custom SLAs, dedicated infrastructure, and on-premise deployment. No setup fees, no surprise invoices — talk to us for a quote tailored to your team.' AS a,
  4 AS s, 1 AS active
) x
WHERE (SELECT COUNT(*) FROM `faq_items`) = 3;

INSERT IGNORE INTO `faq_items` (`question`, `answer`, `sort_order`, `is_active`)
SELECT * FROM (SELECT
  'What does support include?' AS q,
  'Standard support is 24/5 (Mon-Fri, UTC-5) with 4-hour response SLA. Enterprise plans include 24/7 coverage, a named account manager, and quarterly business reviews.' AS a,
  5 AS s, 1 AS active
) x
WHERE (SELECT COUNT(*) FROM `faq_items`) = 4;

INSERT IGNORE INTO `faq_items` (`question`, `answer`, `sort_order`, `is_active`)
SELECT * FROM (SELECT
  'Is my data secure?' AS q,
  'Yes — SOC 2 Type II certified, GDPR compliant, encrypted at rest and in transit (TLS 1.3). Daily backups, geo-redundant storage, and regular third-party penetration tests.' AS a,
  6 AS s, 1 AS active
) x
WHERE (SELECT COUNT(*) FROM `faq_items`) = 5;
