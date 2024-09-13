-- Get all resources for input of building
SELECT r.recipe_id, rfi.*
FROM recipes r
         JOIN recipes_flux rfi ON rfi.flux_id = r.input_id
WHERE r.recipe_id = 0;


SELECT *
FROM recipes r
         JOIN recipes_flux rf ON rf.flux_id = r.output_id
WHERE rf.item = 'iron_ingot';