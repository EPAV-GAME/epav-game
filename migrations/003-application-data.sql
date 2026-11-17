-- Operational data is independent of the immutable import snapshots.
-- JSON is used only for parameter transport; no column stores JSON or TEXT.
CREATE SCHEMA IF NOT EXISTS epav_data;
CREATE TABLE epav_data.records (
  row_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  collection_path varchar(6144) NOT NULL,
  document_id varchar(1500) NOT NULL,
  revision uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  UNIQUE(collection_path,document_id)
);
CREATE INDEX records_recent ON epav_data.records(collection_path,created_at DESC,document_id DESC);
CREATE TABLE epav_data.record_fields (LIKE epav_migration.document_fields INCLUDING ALL);
ALTER TABLE epav_data.record_fields ADD FOREIGN KEY(document_row_id)
  REFERENCES epav_data.records(row_id) ON DELETE CASCADE;
ALTER TABLE epav_data.record_fields ADD FOREIGN KEY(document_row_id,parent_no)
  REFERENCES epav_data.record_fields(document_row_id,node_no);
CREATE INDEX record_fields_lookup ON epav_data.record_fields(document_row_id,field_name,parent_no);

CREATE TABLE epav_data.ranking (
  uid varchar(128) PRIMARY KEY,
  nome varchar(20) NOT NULL CHECK(length(nome) BETWEEN 2 AND 20),
  pontos integer NOT NULL CHECK(pontos BETWEEN 0 AND 400),
  qualidade_quartos integer NOT NULL CHECK(qualidade_quartos BETWEEN 0 AND 160),
  satisfacao integer NOT NULL CHECK(satisfacao BETWEEN 0 AND 100),
  classificacao varchar(40) NOT NULL,
  tempo_jogado_ms bigint NOT NULL CHECK(tempo_jogado_ms BETWEEN 0 AND 604800000),
  publicado_em timestamptz NOT NULL DEFAULT clock_timestamp(),
  versao integer NOT NULL DEFAULT 2 CHECK(versao=2)
);
CREATE INDEX ranking_score ON epav_data.ranking(pontos DESC,tempo_jogado_ms,uid);

CREATE FUNCTION epav_data.put_record(c varchar,i varchar,expected varchar,nodes jsonb)
RETURNS uuid LANGUAGE plpgsql SET search_path=pg_catalog,epav_data AS $$
DECLARE r epav_data.records; v uuid;
BEGIN
  -- Serialize creates as well as updates; no read-modify-write race on absent rows.
  PERFORM pg_advisory_xact_lock(hashtextextended(c||'/'||i,17112026));
  SELECT * INTO r FROM epav_data.records WHERE collection_path=c AND document_id=i FOR UPDATE;
  IF expected='' AND r.row_id IS NOT NULL THEN RAISE EXCEPTION 'CONFLICT' USING ERRCODE='40001'; END IF;
  IF expected IS NOT NULL AND expected<>'' AND (r.row_id IS NULL OR r.revision::varchar<>expected)
    THEN RAISE EXCEPTION 'CONFLICT' USING ERRCODE='40001'; END IF;
  INSERT INTO epav_data.records(collection_path,document_id) VALUES(c,i)
    ON CONFLICT(collection_path,document_id) DO UPDATE SET revision=gen_random_uuid(),updated_at=clock_timestamp()
    RETURNING * INTO r;
  DELETE FROM epav_data.record_fields WHERE document_row_id=r.row_id;
  INSERT INTO epav_data.record_fields(document_row_id,node_no,parent_no,field_name,array_index,kind,
    string_value,integer_value,double_value,boolean_value,timestamp_value,bytes_value,
    reference_value,latitude,longitude,members_present)
  SELECT r.row_id,node_no,parent_no,field_name,array_index,kind,string_value,integer_value,double_value,
    boolean_value,timestamp_value,decode(bytes_value,'base64'),reference_value,latitude,longitude,members_present
  FROM jsonb_to_recordset(nodes) AS f(node_no integer,parent_no integer,field_name varchar,array_index integer,
    kind epav_migration.firestore_kind,string_value varchar,integer_value bigint,double_value double precision,
    boolean_value boolean,timestamp_value timestamptz,bytes_value varchar,reference_value varchar,
    latitude double precision,longitude double precision,members_present boolean) ORDER BY node_no;
  RETURN r.revision;
END $$;

CREATE FUNCTION epav_data.check_revision(c varchar,i varchar,expected varchar) RETURNS boolean
LANGUAGE plpgsql SET search_path=pg_catalog,epav_data AS $$
DECLARE v uuid;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended(c||'/'||i,17112026));
  SELECT revision INTO v FROM epav_data.records WHERE collection_path=c AND document_id=i FOR UPDATE;
  IF expected IS NULL OR v IS NULL OR v::varchar<>expected THEN RAISE EXCEPTION 'CONFLICT' USING ERRCODE='40001'; END IF;
  RETURN true;
END $$;
CREATE FUNCTION epav_data.delete_record(c varchar,i varchar,expected varchar) RETURNS boolean
LANGUAGE plpgsql SET search_path=pg_catalog,epav_data AS $$
BEGIN
  PERFORM epav_data.check_revision(c,i,expected);
  DELETE FROM epav_data.records WHERE collection_path=c AND document_id=i;
  RETURN true;
END $$;

CREATE VIEW epav_data.products AS
SELECT r.document_id AS id,
  (SELECT string_value FROM epav_data.record_fields WHERE document_row_id=r.row_id AND parent_no IS NULL AND field_name='nome') AS nome,
  (SELECT coalesce(string_value,integer_value::varchar) FROM epav_data.record_fields WHERE document_row_id=r.row_id AND parent_no IS NULL AND field_name='codigo') AS codigo,
  (SELECT boolean_value FROM epav_data.record_fields WHERE document_row_id=r.row_id AND parent_no IS NULL AND field_name='disponivelNoJogo') AS disponivel,
  ARRAY(SELECT f.string_value::varchar(240) FROM epav_data.record_fields p JOIN epav_data.record_fields f
    ON f.document_row_id=p.document_row_id AND f.parent_no=p.node_no
    WHERE p.document_row_id=r.row_id AND p.parent_no IS NULL AND p.field_name='tiposProduto' ORDER BY f.array_index) AS tipos,
  ARRAY(SELECT f.string_value::varchar(240) FROM epav_data.record_fields p JOIN epav_data.record_fields f
    ON f.document_row_id=p.document_row_id AND f.parent_no=p.node_no
    WHERE p.document_row_id=r.row_id AND p.parent_no IS NULL AND p.field_name='ocasioes' ORDER BY f.array_index) AS ocasioes,
  (SELECT f.string_value FROM epav_data.record_fields p JOIN epav_data.record_fields f
    ON f.document_row_id=p.document_row_id AND f.parent_no=p.node_no
    WHERE p.document_row_id=r.row_id AND p.parent_no IS NULL AND p.field_name='imagemSwift' AND f.field_name='url') AS imagem_url,
  (SELECT f.string_value FROM epav_data.record_fields p JOIN epav_data.record_fields f
    ON f.document_row_id=p.document_row_id AND f.parent_no=p.node_no
    WHERE p.document_row_id=r.row_id AND p.parent_no IS NULL AND p.field_name='dadosOriginais' AND f.field_name='Marca') AS marca,
  (SELECT f.string_value FROM epav_data.record_fields p JOIN epav_data.record_fields f
    ON f.document_row_id=p.document_row_id AND f.parent_no=p.node_no
    WHERE p.document_row_id=r.row_id AND p.parent_no IS NULL AND p.field_name='dadosOriginais' AND f.field_name='Formato') AS formato,
  (SELECT f.string_value FROM epav_data.record_fields p JOIN epav_data.record_fields f
    ON f.document_row_id=p.document_row_id AND f.parent_no=p.node_no
    WHERE p.document_row_id=r.row_id AND p.parent_no IS NULL AND p.field_name='dadosOriginais' AND f.field_name='Unidade Medida') AS unidade
FROM epav_data.records r WHERE r.collection_path='produtos_swift';

REVOKE ALL ON SCHEMA epav_data FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA epav_data FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA epav_data FROM PUBLIC;
