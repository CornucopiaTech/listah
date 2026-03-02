-- Get tags and count of items for each tag
SELECT atag, COUNT(*) AS row_count
FROM (
  SELECT DISTINCT id, jsonb_array_elements_text(tag::JSONB) AS atag
  FROM apps.items
  WHERE tag::VARCHAR != 'null'
) AS expanded
GROUP BY 1
ORDER BY 1
;


--  Get all items that have all of the tags specifed tag
SELECT * FROM apps.items
WHERE tag::JSONB @> '["farmer","bracelet"]'::jsonb;


--  Get all items that have any of the tags specific tag
SELECT * FROM apps.items
WHERE tag::JSONB ?| array['grandson','granny','farmer'];


-- Read items including information for saved filters
SELECT sf."name" filter_name, sf.id filter_id, it.*
FROM apps.items it
	FULL OUTER JOIN apps.saved_filters sf
		ON sf.user_id = it.user_id
		AND it.tag::JSONB @> sf.tags::jsonb
;



-- Read items that  have all of the tags in the saved filters
SELECT sf."name", it.*
FROM apps.items it
	INNER JOIN apps.saved_filters sf
		ON sf.user_id = it.user_id
		AND it.tag::JSONB @> sf.tags::jsonb
WHERE user_id::VARCHAR = '%v' AND sf.id IN ('%v')
;


-- Read row count for the category group that  have all of the tags in the saved filters
SELECT category, COUNT(*) row_count
FROM (
  SELECT sf."name" category, it.*
  FROM apps.items it
    INNER JOIN apps.saved_filters sf
      ON sf.user_id = it.user_id
      AND it.tag::JSONB @> sf.tags::jsonb
  WHERE user_id::VARCHAR = '%v' AND sf.id IN ('%v')
)
GROUP BY 1
;
