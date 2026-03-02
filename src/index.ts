import express, { type Request, type Response } from 'express';
import path from 'path';

const hostname: string = '127.0.0.1';
const port: number = 3000;

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(express.static('.'));

app.get('/', (req: Request, res: Response) => {
  res.redirect('/home.html');
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
