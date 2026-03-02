import { Router, type Request, type Response } from 'express';
import {
  getRecipeById,
  getIngredientsByRecipeId,
  getAllIngredients,
  insertRecipe,
  getAllRecipesByProtein,
} from './database.js';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.redirect('/home');
});

router.get('/home', (_req: Request, res: Response) => {
  res.render('home');
});

router.get('/recipes', async (_req: Request, res: Response) => {
  const { beef, chicken } = await getAllRecipesByProtein();
  res.render('recipes', { beef, chicken });
});

router.get('/recipe/:id', async (req: Request, res: Response) => {
  const id = req.params['id'] as string;
  const recipe = await getRecipeById(id);
  if (!recipe) {
    res.status(404).send('Recipe not found');
    return;
  }
  const ingredients = await getIngredientsByRecipeId(id);
  res.render('recipe', { recipe, ingredients });
});

router.get('/add-recipe', async (_req: Request, res: Response) => {
  const ingredients = await getAllIngredients();
  res.render('add-recipe', { ingredients });
});

router.post('/add-recipe', async (req: Request, res: Response) => {
  const body = req.body as Record<string, string | string[]>;
  const name = body['name'] as string;
  const protein = body['protein'] as string;
  const instructions = body['instructions'] as string;
  const rawIds = body['ingredient_ids'];
  const rawAmts = body['amounts'];

  const ids = rawIds ? (Array.isArray(rawIds) ? rawIds : [rawIds]) : [];
  const amts = rawAmts ? (Array.isArray(rawAmts) ? rawAmts : [rawAmts]) : [];

  await insertRecipe(name, protein, instructions, ids, amts);
  res.redirect('/recipes');
});

export default router;
