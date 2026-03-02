CREATE DATABASE IF NOT EXISTS recipe_site;
USE recipe_site;

CREATE TABLE ingredients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  info TEXT NOT NULL
);

CREATE TABLE recipes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  protein VARCHAR(50) NOT NULL,
  instructions TEXT NOT NULL
);

CREATE TABLE recipe_ingredients (
  recipe_id INT NOT NULL,
  ingredient_id INT NOT NULL,
  amount VARCHAR(50) NOT NULL,
  PRIMARY KEY (recipe_id, ingredient_id),
  FOREIGN KEY (recipe_id) REFERENCES recipes(id),
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
);

INSERT INTO ingredients (name, info) VALUES
  ('Ground Beef', 'Rich in protein and iron, important for muscle building and energy production.'),
  ('Taco Seasoning', 'A Tex-Mex spice blend of cumin, chili powder, and garlic, originating in the American Southwest.'),
  ('Tortillas', 'A staple of Mexican cuisine made from corn or wheat flour, dating back thousands of years.'),
  ('Cheddar Cheese', 'An aged dairy product from Somerset, England; excellent source of calcium and protein.'),
  ('Salsa', 'Fresh tomato-based condiment rich in lycopene, a powerful antioxidant.'),
  ('Chicken Breast', 'A lean white meat protein, low in fat and high in B vitamins and niacin.'),
  ('Cooked Rice', 'A staple grain for over half the world\'s population; white rice provides quick energy.'),
  ('Soy Sauce', 'Originated in China over 2,500 years ago; fermented sauce rich in umami flavor.'),
  ('Eggs', 'One of nature\'s most complete foods, containing all essential amino acids.'),
  ('Green Onions', 'Also called scallions; mild allium with origins in Central Asia, often used as garnish.');

INSERT INTO recipes (name, protein, instructions) VALUES
  ('Beef Tacos', 'beef', 'Brown ground beef in a skillet over medium-high heat. Drain excess fat. Add taco seasoning and 1/4 cup water, simmer 3 minutes. Warm tortillas. Fill each tortilla with seasoned beef, then top with shredded cheddar cheese and salsa.'),
  ('Chicken Fried Rice', 'chicken', 'Dice chicken breast and cook in a hot oiled pan until golden. Push to the side and scramble the eggs in the same pan. Add cooked rice, soy sauce, and stir everything together over high heat for 3-4 minutes. Top with sliced green onions and serve.');

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount) VALUES
  (1, 1, '1 lb'),
  (1, 2, '2 tbsp'),
  (1, 3, '8 small'),
  (1, 4, '1 cup shredded'),
  (1, 5, '1/2 cup'),
  (2, 6, '1 lb'),
  (2, 7, '3 cups'),
  (2, 8, '3 tbsp'),
  (2, 9, '2'),
  (2, 10, '2 stalks');
