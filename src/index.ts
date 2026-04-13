import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const hostname: string = process.env.HOST ?? '0.0.0.0';
const port: number = 3000;

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(dirname, '..', 'views'));
app.use(express.static(path.join(dirname, '..', 'public')));
app.use(express.urlencoded({ extended: true }));

// Import router after dotenv.config()
const router = await import('./routes.js');
app.use(router.default);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
