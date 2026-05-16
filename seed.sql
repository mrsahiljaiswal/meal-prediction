INSERT INTO meals (
    meal_id,
    center_id,
    name,
    base_price,
    checkout_price,
    emailer_for_promotion,
    homepage_featured,
    image_url
)
VALUES
    (1885, 55, 'Vegetarian Thali', 152.29, 136.83, 0, 0, NULL),
    (1993, 55, 'Veggie Rice Bowl', 135.83, 136.83, 0, 0, NULL),
    (2539, 55, 'Paneer Curry Veg', 135.86, 134.86, 0, 0, NULL),
    (1248, 55, 'Mixed Vegetable Curry', 252.23, 251.23, 0, 0, NULL),
    (1778, 55, 'Mushroom Masala', 184.36, 183.36, 0, 0, NULL),
    (1062, 55, 'Spinach Dal Fry', 183.36, 182.36, 0, 0, NULL),
    (2707, 55, 'Paneer Tikka', 192.06, 190.12, 0, 0, NULL),
    (1207, 55, 'Chana Masala', 384.18, 325.92, 0, 1, NULL),
    (1230, 55, 'Kadai Vegetable', 390.00, 323.01, 0, 1, NULL),
    (2322, 55, 'Dal Makhani', 388.00, 322.07, 0, 1, NULL),
    (2290, 55, 'Jeera Rice', 310.43, 311.43, 0, 0, NULL),
    (1727, 55, 'Aloo Gobi', 446.23, 445.23, 0, 0, NULL),
    (1109, 55, 'Matar Paneer', 297.79, 264.84, 1, 0, NULL),
    (2640, 55, 'Veg Noodles', 281.33, 282.33, 0, 0, NULL),
    (2306, 55, 'Masala Dosa', 340.53, 243.50, 0, 0, NULL);

INSERT INTO ingredients (
    id,
    name,
    current_stock_quantity,
    unit
)
VALUES
    (1, 'Rice', 5000.0, 'GRAM'),
    (2, 'Paneer', 2500.0, 'GRAM'),
    (3, 'Tomato', 3000.0, 'GRAM'),
    (4, 'Spinach', 1800.0, 'GRAM'),
    (5, 'Spices', 1200.0, 'GRAM'),
    (6, 'Oil', 2500.0, 'ML'),
    (7, 'Potato', 2200.0, 'GRAM'),
    (8, 'Peas', 1600.0, 'GRAM'),
    (9, 'Lentils', 2000.0, 'GRAM'),
    (10, 'Yogurt', 1500.0, 'GRAM'),
    (11, 'Cucumber', 1000.0, 'GRAM'),
    (12, 'Carrot', 1400.0, 'GRAM'),
    (13, 'Onion', 2800.0, 'GRAM'),
    (14, 'Garlic', 300.0, 'GRAM'),
    (15, 'Ginger', 250.0, 'GRAM');

INSERT INTO meal_recipe (
    meal_id,
    ingredient_id,
    quantity_required,
    unit,
    wastage_percentage
)
VALUES
    (1, 1, 180.0, 'GRAM', 5.0),
    (1, 3, 90.0, 'GRAM', 3.0),
    (1, 7, 120.0, 'GRAM', 4.0),
    (1, 8, 80.0, 'GRAM', 3.0),
    (1, 5, 10.0, 'GRAM', 1.0),
    (1, 6, 20.0, 'ML', 2.0),
   (2, 1, 210.0, 'GRAM', 5.0),
    (2, 3, 70.0, 'GRAM', 2.0),
    (2, 8, 60.0, 'GRAM', 3.0),
    (2, 11, 50.0, 'GRAM', 1.0),
    (2, 6, 18.0, 'ML', 2.0),
    (3, 2, 200.0, 'GRAM', 5.0),
    (3, 3, 90.0, 'GRAM', 2.0),
    (3, 5, 12.0, 'GRAM', 1.0),
    (3, 13, 40.0, 'GRAM', 1.0),
    (3, 14, 20.0, 'GRAM', 1.0),
    (3, 6, 18.0, 'ML', 2.0),
    (4, 7, 150.0, 'GRAM', 4.0),
    (4, 12, 100.0, 'GRAM', 3.0),
    (4, 11, 60.0, 'GRAM', 2.0),
    (4, 13, 50.0, 'GRAM', 1.0),
    (4, 14, 15.0, 'GRAM', 1.0),
    (4, 6, 20.0, 'ML', 2.0),
    (5, 3, 70.0, 'GRAM', 2.0),
    (5, 5, 15.0, 'GRAM', 1.0),
    (5, 13, 40.0, 'GRAM', 1.0),
    (5, 14, 20.0, 'GRAM', 1.0),
    (5, 6, 18.0, 'ML', 2.0),
    (6, 4, 160.0, 'GRAM', 4.0),
    (6, 9, 100.0, 'GRAM', 3.0),
    (6, 13, 50.0, 'GRAM', 1.0),
    (6, 14, 10.0, 'GRAM', 1.0),
    (6, 6, 15.0, 'ML', 2.0),
    (7, 2, 220.0, 'GRAM', 5.0),
    (7, 10, 80.0, 'GRAM', 2.0),
    (7, 3, 50.0, 'GRAM', 1.0),
    (7, 5, 12.0, 'GRAM', 1.0),
    (7, 6, 15.0, 'ML', 2.0);

INSERT INTO meal_ingredient_mapping (
    meal_id,
    ingredient_id,
    quantity_required
)
VALUES
    (1, 1, 180.0),
    (1, 7, 120.0),
    (2, 1, 210.0),
    (2, 8, 60.0),
    (3, 2, 200.0),
    (4, 7, 150.0),
    (5, 3, 70.0),
    (6, 4, 160.0),
    (7, 2, 220.0);

INSERT INTO center_inventory (
    center_id,
    ingredient_id,
    current_stock_quantity
)
VALUES
    (55, 1, 5000.0),
    (55, 2, 2500.0),
    (55, 3, 3000.0),
    (55, 4, 1800.0),
    (55, 5, 1200.0),
    (55, 6, 2500.0),
    (55, 7, 2200.0),
    (55, 8, 1600.0),
    (55, 9, 2000.0),
    (55, 10, 1500.0),
    (55, 11, 1000.0),
    (55, 12, 1400.0),
    (55, 13, 2800.0),
    (55, 14, 300.0),
    (55, 15, 250.0);