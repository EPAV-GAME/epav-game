-- Execute via migrate-firestore-to-neon.mjs migrate-types.
-- The import tool verifies the round trip before dropping the historical column.
DROP VIEW IF EXISTS epav_migration.current_documents;

ALTER TABLE epav_migration.snapshots
  ALTER COLUMN source_database TYPE varchar(512);

ALTER TABLE epav_migration.documents
  ALTER COLUMN path TYPE varchar(6144),
  ALTER COLUMN collection_path TYPE varchar(6144),
  ALTER COLUMN document_id TYPE varchar(1500),
  ADD COLUMN row_id bigint GENERATED ALWAYS AS IDENTITY UNIQUE;

CREATE TYPE epav_migration.firestore_kind AS ENUM (
  'nullValue', 'stringValue', 'integerValue', 'doubleValue', 'booleanValue',
  'timestampValue', 'bytesValue', 'referenceValue', 'geoPointValue', 'mapValue', 'arrayValue'
);

CREATE TABLE epav_migration.document_fields (
  document_row_id bigint NOT NULL REFERENCES epav_migration.documents(row_id) ON DELETE CASCADE,
  node_no integer NOT NULL CHECK (node_no > 0),
  parent_no integer CHECK (parent_no > 0 AND parent_no < node_no),
  field_name varchar(1500),
  array_index integer CHECK (array_index >= 0),
  kind epav_migration.firestore_kind NOT NULL,
  string_value varchar(1048487),
  integer_value bigint,
  double_value double precision,
  boolean_value boolean,
  timestamp_value timestamptz,
  bytes_value bytea,
  reference_value varchar(6144),
  latitude double precision CHECK (latitude BETWEEN -90 AND 90),
  longitude double precision CHECK (longitude BETWEEN -180 AND 180),
  members_present boolean,
  PRIMARY KEY (document_row_id, node_no),
  FOREIGN KEY (document_row_id, parent_no)
    REFERENCES epav_migration.document_fields(document_row_id, node_no),
  CHECK (num_nonnulls(field_name, array_index) = 1 AND (parent_no IS NOT NULL OR array_index IS NULL)),
  CHECK (
    (string_value IS NOT NULL) = (kind = 'stringValue')
    AND (integer_value IS NOT NULL) = (kind = 'integerValue')
    AND (double_value IS NOT NULL) = (kind = 'doubleValue')
    AND (boolean_value IS NOT NULL) = (kind = 'booleanValue')
    AND (timestamp_value IS NOT NULL) = (kind = 'timestampValue')
    AND (bytes_value IS NOT NULL) = (kind = 'bytesValue')
    AND (reference_value IS NOT NULL) = (kind = 'referenceValue')
    AND (latitude IS NOT NULL) = (kind = 'geoPointValue')
    AND (longitude IS NOT NULL) = (kind = 'geoPointValue')
    AND (members_present IS NOT NULL) = (kind IN ('mapValue', 'arrayValue'))
  )
);

CREATE UNIQUE INDEX document_fields_member_idx
  ON epav_migration.document_fields(document_row_id, parent_no, field_name) NULLS NOT DISTINCT
  WHERE field_name IS NOT NULL;

CREATE UNIQUE INDEX document_fields_array_index_idx
  ON epav_migration.document_fields(document_row_id, parent_no, array_index)
  WHERE array_index IS NOT NULL;

CREATE VIEW epav_migration.current_documents AS
SELECT d.snapshot_id, d.path, d.collection_path, d.document_id, d.created_at, d.updated_at, d.row_id
FROM epav_migration.documents AS d
JOIN (
  SELECT DISTINCT ON (source_database) id
  FROM epav_migration.snapshots
  ORDER BY source_database, source_read_time DESC
) AS latest ON latest.id = d.snapshot_id;

REVOKE ALL ON ALL TABLES IN SCHEMA epav_migration FROM PUBLIC;
