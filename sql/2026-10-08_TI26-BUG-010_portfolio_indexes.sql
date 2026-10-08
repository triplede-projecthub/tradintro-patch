-- TI26-BUG-010: Portfolio screen slow.
-- The portfolio list / dashboard (and the PHP crons) look rows up by stock code, by user + stock and
-- by user + alert type, but these tables had only their primary keys, so every lookup was a full
-- table scan (stock_history also a filesort for "latest day first"). Safe to run on a live DB
-- (InnoDB online DDL, no table lock); re-running fails with "Duplicate key name" - harmless.
-- Run on: test (tradintr_trade_test), then prod.

-- latest price row(s) of a stock: WHERE stock_history_code = ? ORDER BY stock_history_date DESC
-- (stock_history_code is TEXT, so a prefix; codes are <= 20 chars)
ALTER TABLE stock_history
  ADD INDEX idx_stock_history_code_date (stock_history_code(32), stock_history_date),
  ALGORITHM=INPLACE, LOCK=NONE;

-- a user's holdings / per-stock buy & sell totals: WHERE order_user_id = ? [AND order_stock_id = ?]
ALTER TABLE order_list
  ADD INDEX idx_order_list_user_stock (order_user_id, order_stock_id),
  ALGORITHM=INPLACE, LOCK=NONE;

-- a user's open alert per stock, alert list / badge count:
-- WHERE notification_user_id = ? AND notification_type = ? AND notification_status = ?
ALTER TABLE notification
  ADD INDEX idx_notification_user_type_status (notification_user_id, notification_type, notification_status),
  ALGORITHM=INPLACE, LOCK=NONE;
