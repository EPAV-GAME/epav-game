-- Apply after the direct relational API (data version 3) is serving requests.
-- Old document storage and migration-only routines are removed with RESTRICT.
DROP TRIGGER business_record_sync ON epav_internal.records;
DROP FUNCTION epav_data.refresh_business_trigger();
DROP FUNCTION epav_data.refresh_business_record(bigint);
DROP FUNCTION epav_data.refresh_product_version(bigint,varchar);
DROP FUNCTION epav_data.refresh_product_children(bigint,varchar[],varchar,bigint);
DROP FUNCTION epav_data.field_strings(bigint,varchar[]);
DROP FUNCTION epav_data.field_number(bigint,varchar[]);
DROP FUNCTION epav_data.field_string(bigint,varchar[]);
DROP FUNCTION epav_data.field_value(bigint,varchar[]);
DROP FUNCTION epav_data.field_node(bigint,varchar[]);
DROP FUNCTION epav_data.put_record(varchar,varchar,varchar,jsonb);
DROP FUNCTION epav_data.delete_record(varchar,varchar,varchar);
DROP FUNCTION epav_data.check_revision(varchar,varchar,varchar);

ALTER TABLE epav_data.produtos_swift DROP COLUMN registro_id;
ALTER TABLE epav_data.produtos_swift_versoes DROP COLUMN registro_id;
ALTER TABLE epav_data.arquivo_produtos_swift DROP COLUMN registro_id;
ALTER TABLE epav_data.auditoria_catalogo DROP COLUMN registro_id;
ALTER TABLE epav_data.importacoes_catalogo DROP COLUMN registro_id;
ALTER TABLE epav_data.sincronizacao_imagens_swift DROP COLUMN registro_id;

DROP TABLE epav_internal.record_fields;
DROP TABLE epav_internal.records;
DROP TYPE epav_internal.firestore_kind;
DROP SCHEMA epav_internal;
