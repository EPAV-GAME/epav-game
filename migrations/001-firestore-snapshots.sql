CREATE SCHEMA IF NOT EXISTS epav_migration;
REVOKE ALL ON SCHEMA epav_migration FROM PUBLIC;

CREATE TABLE IF NOT EXISTS epav_migration.snapshots (
    id uuid PRIMARY KEY,
    source_database varchar(512) NOT NULL,
    source_read_time timestamptz NOT NULL,
    imported_at timestamptz NOT NULL DEFAULT now(),
    document_count bigint NOT NULL CHECK (document_count >= 0),
    UNIQUE (source_database, source_read_time)
);

CREATE TABLE IF NOT EXISTS epav_migration.documents (
    snapshot_id uuid NOT NULL REFERENCES epav_migration.snapshots(id) ON DELETE CASCADE,
    path varchar(6144) NOT NULL,
    collection_path varchar(6144) NOT NULL,
    document_id varchar(1500) NOT NULL,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL,
    CHECK (path = collection_path || '/' || document_id),
    PRIMARY KEY (snapshot_id, path)
);

CREATE INDEX IF NOT EXISTS epav_migration_documents_collection_idx
    ON epav_migration.documents (snapshot_id, collection_path, document_id);

REVOKE ALL ON ALL TABLES IN SCHEMA epav_migration FROM PUBLIC;
