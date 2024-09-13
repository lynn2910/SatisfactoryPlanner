DROP TABLE IF EXISTS buildings_allowed_recipes;
DROP TABLE IF EXISTS buildings;
DROP TABLE IF EXISTS buildings_type;
DROP TABLE IF EXISTS conveyors;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS recipes_flux;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS resource_type;

CREATE TABLE resource_type
(
    type_id INTEGER     NOT NULL PRIMARY KEY AUTOINCREMENT,
    name    VARCHAR(64) NOT NULL
);

CREATE TABLE items
(
    item_id VARCHAR(128) NOT NULL PRIMARY KEY,
    name    VARCHAR(128) NOT NULL,
    type    INTEGER      NOT NULL,

    FOREIGN KEY (type) REFERENCES resource_type (type_id)
);

-- A flux of resources, such as for example 'coal' and 'iron' for steel
CREATE TABLE recipes_flux
(
    flux_id INT           NOT NULL,
    item    VARCHAR(128)  NOT NULL,
    rate    DECIMAL(4, 2) NOT NULL,

    FOREIGN KEY (item) REFERENCES items (item_id)
);

CREATE TABLE recipes
(
    recipe_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    input_id  INT     NOT NULL,
    output_id INT     NOT NULL,

    FOREIGN KEY (input_id) REFERENCES recipes_flux (flux_id),
    FOREIGN KEY (output_id) REFERENCES recipes_flux (flux_id)
);

CREATE TABLE buildings_type
(
    type_id INTEGER     NOT NULL PRIMARY KEY AUTOINCREMENT,
    name    VARCHAR(32) NOT NULL
);

CREATE TABLE buildings
(
    building_id VARCHAR(128)  NOT NULL PRIMARY KEY,
    name        VARCHAR(256)  NOT NULL,
    type        INT           NOT NULL,

    width       DECIMAL(4, 2) NOT NULL,
    length      DECIMAL(4, 2) NOT NULL,
    height      DECIMAL(4, 2) NOT NULL,

    FOREIGN KEY (type) REFERENCES buildings_type (type_id)
);

CREATE TABLE buildings_allowed_recipes
(
    building  VARCHAR(128) NOT NULL PRIMARY KEY,
    recipe_id INTEGER,

    FOREIGN KEY (recipe_id) REFERENCES recipes (recipe_id),
    FOREIGN KEY (building) REFERENCES buildings (building_id)
);

CREATE TABLE conveyors
(
    conveyor_id VARCHAR(32) NOT NULL PRIMARY KEY,
    name        VARCHAR(64) NOT NULL,

    speed       INT
);

INSERT INTO resource_type (type_id, name)
VALUES (0, 'solid'),
       (1, 'liquid');

INSERT INTO items (item_id, name, type)
VALUES ('iron', 'Iron', 0),
       ('coal', 'Coal', 0),
       ('iron_ingot', 'Iron ingot', 0),
       ('steel_ingot', 'Steel ingot', 0);

INSERT INTO recipes_flux (flux_id, item, rate)
VALUES (0, 'iron', 30),
       (1, 'iron_ingot', 30);

INSERT INTO recipes (recipe_id, input_id, output_id)
VALUES (0, 0, 1);

INSERT INTO buildings_type (type_id, name)
VALUES (0, 'create_factory'),
       (1, 'storage');

INSERT INTO buildings (building_id, name, type, width, length, height)
VALUES ('constructor_mk1', 'Constructor', 0, 1.0, 1.1, 0.9),
       ('container_simple', 'Container', 1, 1.0, 2.0, 1.0);

INSERT INTO conveyors (conveyor_id, name, speed)
VALUES ('conveyor_mk1', 'Conveyor MK1', 60),
       ('conveyor_mk2', 'Conveyor MK2', 120);