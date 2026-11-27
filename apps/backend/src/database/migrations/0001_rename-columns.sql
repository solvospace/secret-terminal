
DO $$
DECLARE
    item RECORD;
BEGIN
    FOR item IN
        SELECT *
        FROM (VALUES
            ('auth', 'users', 'verificationCode', 'verification_code'),
            ('auth', 'refresh_tokens', 'userId', 'user_id'),
            ('auth', 'reset_codes', 'userId', 'user_id'),
            ('watchlist', 'watchlists', 'userId', 'user_id'),
            ('watchlist', 'watchlist_coins', 'coinId', 'coin_id'),
            ('watchlist', 'watchlist_coins', 'imageUrl', 'image_url'),
            ('watchlist', 'watchlist_coins', 'watchlistId', 'watchlist_id')
        ) AS changes(schema_name, table_name, old_column, new_column)
    LOOP
        IF EXISTS (
            SELECT 1
            FROM information_schema.columns AS columns
            WHERE columns.table_schema = item.schema_name
              AND columns.table_name = item.table_name
              AND columns.column_name = item.old_column
        ) THEN
            EXECUTE format(
                'ALTER TABLE %I.%I RENAME COLUMN %I TO %I',
                item.schema_name,
                item.table_name,
                item.old_column,
                item.new_column
            );
        END IF;
    END LOOP;
END $$;
