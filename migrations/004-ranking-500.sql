-- Preserve the existing 500-point scale of the no-AI edition.
ALTER TABLE epav_data.ranking DROP CONSTRAINT IF EXISTS ranking_pontos_check;
ALTER TABLE epav_data.ranking ADD CONSTRAINT ranking_pontos_check CHECK(pontos BETWEEN 0 AND 500);
