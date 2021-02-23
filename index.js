const express = require('express');
const cors = require('cors');

const login = require('./loginMiddleware.js');

const app = express();
let todos = require('./todos.json');

app.use(express.json());

app.use(login);
app.use(cors());

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/todos', (request, response) => {
  response.json(todos);
});

app.get('/api/todos/:id', (request, response) => {
  const id = Number(request.params.id);
  const todo = todos.find((todoItem) => todoItem.id === id);
  if (todo) {
    response.json(todo);
  } else {
    response.status(404).json({ error: 'not found' });
  }
});

app.delete('/api/todos/:id', (request, response) => {
  const id = Number(request.params.id);
  todos = todos.filter((todo) => todo.id !== id);
  response.status(204).end();
});

app.post('/api/todos/', (request, response) => {
  const { title } = request.body;
  if (!title) {
    return response.status(400).json({
      error: 'content missing',
    });
  }

  const newTodo = {
    id: todos.length + 1,
    title,
    completed: false,
  };

  todos = [...todos, newTodo];
  return response.status(202).json(newTodo);
});

app.use((req, res) => {
  res.status(404).json({
    error: 'not found',
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
