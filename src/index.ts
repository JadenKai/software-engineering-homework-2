import express, { type Request, type Response } from 'express';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import path from 'path';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const hostname: string = '127.0.0.1';
const port: number = 3000;

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(dirname, '..', 'views'));
app.use(express.static(path.join(dirname, '..', 'public')));
app.use(express.urlencoded({ extended: true }));

const pool = mysql.createPool({
  socketPath: '/tmp/mysql.sock',
  user: 'root',
  password: '',
  database: 'recipe_site',
});

app.get('/', (_req: Request, res: Response) => {
  res.redirect('/home');
});

app.get('/home', (_req: Request, res: Response) => {
  res.render('home');
});

app.get('/recipes', async (_req: Request, res: Response) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id, name, protein FROM recipes ORDER BY protein, name'
  );
  const beef = rows.filter(r => r['protein'] === 'beef');
  const chicken = rows.filter(r => r['protein'] === 'chicken');
  res.render('recipes', { beef, chicken });
});

app.get('/recipe/:id', async (req: Request, res: Response) => {
  const id = req.params['id'] as string;
  const [recipeRows] = await pool.query<RowDataPacket[]>(
    'SELECT id, name, protein, instructions FROM recipes WHERE id = ?',
    [id]
  );
  const recipe = recipeRows[0];
  if (!recipe) {
    res.status(404).send('Recipe not found');
    return;
  }
  const [ingRows] = await pool.query<RowDataPacket[]>(
    `SELECT i.name, i.info, ri.amount
     FROM recipe_ingredients ri
     JOIN ingredients i ON ri.ingredient_id = i.id
     WHERE ri.recipe_id = ?`,
    [id]
  );
  res.render('recipe', { recipe, ingredients: ingRows });
});

app.get('/add-recipe', async (_req: Request, res: Response) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id, name FROM ingredients ORDER BY name'
  );
  res.render('add-recipe', { ingredients: rows });
});

app.post('/add-recipe', async (req: Request, res: Response) => {
  const body = req.body as Record<string, string | string[]>;
  const name = body['name'] as string;
  const protein = body['protein'] as string;
  const instructions = body['instructions'] as string;
  const rawIds = body['ingredient_ids'];
  const rawAmts = body['amounts'];

  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO recipes (name, protein, instructions) VALUES (?, ?, ?)',
    [name, protein, instructions]
  );
  const recipeId = result.insertId;

  if (rawIds) {
    const ids = Array.isArray(rawIds) ? rawIds : [rawIds];
    const amts = rawAmts ? (Array.isArray(rawAmts) ? rawAmts : [rawAmts]) : [];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const amt = amts[i] ?? '';
      if (id !== undefined) {
        await pool.query(
          'INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount) VALUES (?, ?, ?)',
          [recipeId, id, amt]
        );
      }
    }
  }

  res.redirect('/recipes');
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
