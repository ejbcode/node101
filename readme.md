# Node with express

## Installation

- Install Node
- Create a project with `npm init`
- Install express with `npm i express`
- Install nodemon like a dev dependencies tool.
  `npm i nodemon -D`

## Let's build a basic a web server:

Create a _index.js_ in the root of the folder.

```js
const http = require("http");

const app = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello World");
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
```

Now we can open the web server in a browser by visiting the address [localhost:3001](http://localhost:3001/)

The request is responded to with the status code 200, with the Content-Type header set to **text/plain**.

## WebServer with a json file.

- Create a todos.json file and import it into the index

```js
const http = require("http");
const todos = require("./todos.json");

const app = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(JSON.stringify(todos));
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
```

Now the web server will return a raw data in the JSON format to the frontend. The application/json value in the Content-Type header informs the receiver that the data is in the JSON format. The todos array gets transformed into JSON with the JSON.stringify(todos) method.

## Express

A easy way to implementing our server code is using express. Express provide a better abstraction for general use cases we usually require to build a backend server. `npm i express`

```JS
const http = require("http");const express = require('express')
const app = express()
const todos = require('./todos.json')

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/todos', (request, response) => {
  response.json(todos)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

now we have two routes,

- /
- /api/todos

The first one defines an event handler, that is used to handle HTTP GET requests made to the app. The event handler function accepts two parameters. The first request parameter contains all of the information of the HTTP request, and the second response parameter is used to define how the request is responded to.

The second route defines an event handler, that handles HTTP GET requests. The request is responded to with the json method of the response object. Calling the method will send the notes array that was passed to it as a JSON formatted string. Express automatically sets the Content-Type header with the appropriate value of application/json.

## Rest

HTTP defines a set of request methods to indicate the desired action to be performed for a given resource. Although they can also be nouns, these request methods are sometimes referred to as HTTP verbs.

### GET

The GET method requests a representation of the specified resource. Requests using GET should only retrieve data.

### HEAD

The HEAD method asks for a response identical to that of a GET request, but without the response body.

### POST

The POST method is used to submit an entity to the specified resource, often causing a change in state or side effects on the server.

### PUT

The PUT method replaces all current representations of the target resource with the request payload.

### DELETE

The DELETE method deletes the specified resource.

### PATCH

The PATCH method is used to apply partial modifications to a resource.

The URL for the entire collection of all note resources is www.example.com/api/.

We can execute different operations on resources. The operation to be executed is defined by the HTTP verb:

| Verb   | URL      | functionality                                                    |
| ------ | -------- | ---------------------------------------------------------------- |
| GET    | todos/10 | fetches a single resource                                        |
| GET    | todos    | fetches all resources in the collection                          |
| POST   | todos    | creates a new resource based on the request data                 |
| DELETE | todos/10 | removes the identified resource                                  |
| PUT    | todos/10 | replaces the entire identified resource with the request data    |
| PATCH  | todos/10 | replaces a part of the identified resource with the request data |

_index.js_

```JS
const express = require('express');

const app = express();
let todos = require('./todos.json');

app.use(express.json());

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

```

## Middleware

Middleware are functions that have access to the request object (req), the response object (res), and the next function in the application’s request-response cycle. The next function is a function in the Express router which, when invoked, executes the middleware succeeding the current middleware.

Middleware functions can perform the following tasks:

- Execute any code.
- Make changes to the request and the response objects.
- End the request-response cycle.
- Call the next middleware in the stack.

To load the middleware function, call app.use(), specifying the middleware function. For example, the following code loads the isLogin middleware function before the route to the root path (/).

```JS
const express = require('express')
const app = express()

const isLogin = (req, res, next) => {
  console.log('the user is is Login');
  next();
};

app.use(isLogin)

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000)

```

Also the middleware can be imported from other module like this

_login.js_

```JS
const isLogin = (req, res, next) => {
  console.log('the user is is Login');
  next();
};

module.exports = isLogin;
```

_index.js_

```JS
const login = require('./login.js')

app.use(login)
```

## CORS

Cross-Origin Resource Sharing (CORS) is a protocol that enables scripts running on a browser client to interact with resources from a different origin.

Install cors with the command `npm i cors`

take the middleware to use and allow for requests from all origins:

```JS
const cors = require('cors')

app.use(cors())
```
