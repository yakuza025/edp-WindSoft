CREATE DATABASE IF NOT EXISTS edp_windsoft
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE edp_windsoft;

CREATE TABLE IF NOT EXISTS systems (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  slug       VARCHAR(64) UNIQUE NOT NULL,
  name       VARCHAR(120) NOT NULL,
  tagline    TEXT NOT NULL,
  host       VARCHAR(200) NOT NULL,
  path       VARCHAR(200) NOT NULL DEFAULT '/',
  color      VARCHAR(20) NOT NULL DEFAULT '#3b82f6',
  icon       VARCHAR(10) NOT NULL DEFAULT '🚀',
  features   JSON NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active  TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_systems_sort (sort_order),
  INDEX idx_systems_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS settings (
  `key`      VARCHAR(64) PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO systems (slug, name, tagline, host, path, color, icon, features, sort_order) VALUES
  ('lending', 'Lending Manager', 'Loan origination, amortization schedules, and collections in one unified dashboard built for fast-moving lenders.', 'lending.edp.dpdns.org', '/demo', '#3b82f6', '💰', '["Origination","Amortization","Collections","Reports"]', 0),
  ('pos', 'POS + Inventory', 'Point-of-sale with live stock control across every branch — scan, sell, and sync inventory in real time.', 'pos.edp.dpdns.org', '/demo', '#f97316', '🛒', '["Barcode Sales","Stock Levels","Multi-branch","Receipts"]', 1),
  ('ticketing', 'Ticketing System', 'Support tickets, SLA rules, and a shared agent console that keeps every conversation on track.', 'ticketing.edp.dpdns.org', '/demo', '#a855f7', '🎫', '["Tickets","SLA Rules","Agent Console","Analytics"]', 2),
  ('rental', 'Rental Platform', 'Bookings, contracts, and fleet or equipment tracking — from reservation to return, all in one place.', 'rental.edp.dpdns.org', '/demo', '#10b981', '🚗', '["Booking Calendar","Contracts","Fleet Mgmt","Invoicing"]', 3);

INSERT IGNORE INTO settings (`key`, value) VALUES
  ('autoplay_ms', '6000'),
  ('brand_name', 'WindSoft Solutions'),
  ('brand_subtitle', 'Product Demo Showcase');
