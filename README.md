# Recipe Site

A multi-page recipe web application built with Express.js, EJS, MySQL, and TypeScript.

## Setup

### 1. Install dependencies

```
npm install
```

### 2. Set up the database

Run the schema script against your MySQL instance:

```
mysql -u root --socket=/tmp/mysql.sock < schema.sql
```

If the database already exists from a previous run, drop it first:

```
mysql -u root --socket=/tmp/mysql.sock -e "DROP DATABASE IF EXISTS recipe_site;" && mysql -u root --socket=/tmp/mysql.sock < schema.sql
```

### 3. Start the server

```
npm start
```

Visit [http://127.0.0.1:3000](http://127.0.0.1:3000).

## Pages

| URL | Description |
|-----|-------------|
| `/home` | Home page with cooking experience |
| `/recipes` | Recipe listing categorized by protein (beef, chicken) |
| `/recipe/:id` | Individual recipe — hover over ingredients for info |
| `/add-recipe` | Form to add a new recipe using existing ingredients |
