-- =============================================================================
-- OUROZ – Migration 052: Add screenshot brands (idempotent)
-- Ensures all brands shown in the provided screenshot exist in `brands`.
-- =============================================================================

INSERT INTO brands (slug, name, is_active)
VALUES
  ('aicha', 'Aicha', TRUE),
  ('alitkane', 'Alitkane', TRUE),
  ('alsa', 'Alsa', TRUE),
  ('amber', 'Amber', TRUE),
  ('asta-cafe', 'Asta Café', TRUE),
  ('bellar', 'Bellar', TRUE),
  ('bimo', 'Bimo', TRUE),
  ('dari', 'Dari', TRUE),
  ('delicia', 'Délicia', TRUE),
  ('leo', 'Leo', TRUE),
  ('ghadaq', 'Ghadaq', TRUE),
  ('hanouna-taste', 'Hanouna Taste', TRUE),
  ('henrys', 'Henry''s', TRUE),
  ('house-of-argan', 'House of Argan', TRUE),
  ('ideal', 'Idéal', TRUE),
  ('isabel', 'Isabel', TRUE),
  ('jibal', 'Jibal', TRUE),
  ('joly', 'Joly', TRUE),
  ('kenz', 'Kenz', TRUE),
  ('knorr', 'Knorr', TRUE),
  ('made-in-morocco', 'Made in Morocco', TRUE),
  ('moroccan-heritage', 'Moroccan Heritage', TRUE),
  ('oued-souss', 'Oued Souss', TRUE),
  ('rouh-dounia', 'Rouh Dounia', TRUE),
  ('star', 'Star', TRUE),
  ('sultan', 'Sultan', TRUE),
  ('taous', 'Taous', TRUE),
  ('tiyya-maroc', 'Tiyya Maroc', TRUE),
  ('topchef', 'TopChef', TRUE),
  ('yamfu', 'Yamfu', TRUE)
ON CONFLICT (slug)
DO UPDATE SET
  name = EXCLUDED.name,
  is_active = TRUE;
