// Database models
import mysql from 'mysql2/promise';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

const pool = mysql.createPool({
  socketPath: '/tmp/mysql.sock',
  user: 'root',
  password: '',
  database: 'recipe_site',
});

interface Recipe extends RowDataPacket {
  id: number;
  name: string;
  protein: string;
  instructions: string;
}

interface Ingredient extends RowDataPacket {
  id: number;
  name: string;
  info: string;
  amount: string;
}

export async function getAllRecipes() {
  const [rows] = await pool.query<Recipe[]>(
    'SELECT id, name, protein FROM recipes ORDER BY protein, name'
  );
  return rows;
}

export async function getAllRecipesByProtein() {
  const rows = await getAllRecipes();
  const beef = rows.filter(r => r.protein === 'beef');
  const chicken = rows.filter(r => r.protein === 'chicken');
  return { beef, chicken };
}

export async function getRecipeById(id: string) {
  const [rows] = await pool.query<Recipe[]>(
    'SELECT id, name, protein, instructions FROM recipes WHERE id = ?',
    [id]
  );
  return rows[0];
}

export async function getIngredientsByRecipeId(id: string) {
  const [rows] = await pool.query<Ingredient[]>(
    `SELECT i.name, i.info, ri.amount
     FROM recipe_ingredients ri
     JOIN ingredients i ON ri.ingredient_id = i.id
     WHERE ri.recipe_id = ?`,
    [id]
  );
  return rows;
}

export async function getAllIngredients() {
  const [rows] = await pool.query<Ingredient[]>(
    'SELECT id, name FROM ingredients ORDER BY name'
  );
  return rows;
}

export async function insertRecipe(
  name: string,
  protein: string,
  instructions: string,
  ids: string[],
  amts: string[],
) {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO recipes (name, protein, instructions) VALUES (?, ?, ?)',
    [name, protein, instructions]
  );
  const recipeId = result.insertId;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const amt = amts[i] ?? '';
    if (id !== undefined) {
      await insertRecipeIngredient(recipeId, id, amt);
    }
  }
}

export async function insertRecipeIngredient(recipeId: number, ingredientId: string, amount: string) {
  await pool.query(
    'INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount) VALUES (?, ?, ?)',
    [recipeId, ingredientId, amount]
  );
}
