-- Get tags and count of items for each tag
SELECT
    atag,
    COUNT(*) AS row_count
FROM (
    SELECT DISTINCT id, jsonb_array_elements_text(tag::JSONB) AS atag
    FROM apps.items
    WHERE tag::VARCHAR != 'null'
) AS expanded
GROUP BY atag
ORDER BY row_count DESC, atag;


--  Get all items that have all of the tags specifed tag
SELECT * FROM apps.items
WHERE tag::JSONB @> '["farmer","bracelet"]'::jsonb;


--  Get all items that have any of the tags specific tag
SELECT * FROM apps.items
WHERE tag::JSONB ?| array['grandson','granny','farmer'];
