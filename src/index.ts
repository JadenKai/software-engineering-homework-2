import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import router from './routes.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const hostname: string = '127.0.0.1';
const port: number = 3000;

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(dirname, '..', 'views'));
app.use(express.static(path.join(dirname, '..', 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
