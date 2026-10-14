/**
 * COER UNIVERSITY, ROORKEE
 * Department of Computer Science & Engineering
 * Full Stack Web Development — Lab Sheet 5: Express.js (All-in-One File)
 */

const express = require('express');
const path = require('path');
require('dotenv').config(); // Part I: Load .env config

const app = express();

// ==========================================
// PART E & I: Body Parsing & Static Files Middleware
// ==========================================
// Enable JSON and URL-encoded form parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from a public folder if present
app.use(express.static(path.join(__dirname, 'public')));


// ==========================================
// PART D: Custom Global Middleware
// ==========================================
// Request Logger: logs method, URL, and timestamp
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Admin API Key validation middleware
const checkApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(403).json({ error: '403 Forbidden: Missing x-api-key header' });
  }
  next();
};

// Protect /admin routes
app.use('/admin', checkApiKey);


// ==========================================
// PART A: Basic Server Root Route
// ==========================================
app.get('/', (req, res) => {
  res.send('Express Lab Running');
});


// ==========================================
// PART B: Basic Routing
// ==========================================
// GET /about: returns personal name and roll number
app.get('/about', (req, res) => {
  res.json({
    name: 'Sharansh Prajapati',
    rollNumber: 'CU24250130'
  });
});

// GET /courses: returns 3 course names
app.get('/courses', (req, res) => {
  res.json(['Full Stack Web Development', 'Computer Networks', 'Cloud Computing']);
});

// POST /echo: returns back the same JSON payload sent
app.post('/echo', (req, res) => {
  res.json(req.body);
});


// ==========================================
// PART C: Route Parameters & Query Strings
// ==========================================
// GET /search?name=...&age=...
app.get('/search', (req, res) => {
  const { name, age } = req.query;
  res.json({ name, age });
});

// GET /products/:category/:id
app.get('/products/:category/:id', (req, res) => {
  const { category, id } = req.params;
  res.json({ category, id });
});


// ==========================================
// PART D: Protected Admin Route
// ==========================================
app.get('/admin/dashboard', (req, res) => {
  res.json({ message: 'Welcome to the protected admin dashboard!' });
});


// ==========================================
// PART E: JSON Registration & Form Submission
// ==========================================
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  res.status(201).json({
    message: `User ${name} registered successfully!`,
    email
  });
});

app.post('/contact', (req, res) => {
  console.log('Form submission received:', req.body);
  res.send('Thank you for contacting us! We have received your message.');
});


// ==========================================
// PART F, G & J: Routers (Students, Books, Members, Tasks CRUD)
// ==========================================

// --- Fake Auth Middleware for /api (Part J) ---
const fakeApiAuth = (req, res, next) => {
  // Simulating authentication check across /api endpoints
  next();
};
app.use('/api', fakeApiAuth);


// --- 1. Students Router (Part C & Part F) ---
const studentsRouter = express.Router();

studentsRouter.get('/:id', (req, res) => {
  res.json({ id: req.params.id, message: 'Student details' });
});

app.use('/api/students', studentsRouter);


// --- 2. Books Router (Part F & Part J: Full CRUD) ---
const booksRouter = express.Router();
let books = [
  { id: 1, title: 'Clean Code', author: 'Robert C. Martin' },
  { id: 2, title: 'JavaScript: The Good Parts', author: 'Douglas Crockford' }
];

booksRouter.get('/', (req, res) => {
  res.json(books);
});

booksRouter.get('/:id', (req, res, next) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) {
    const error = new Error('Book not found');
    error.statusCode = 404;
    return next(error);
  }
  res.json(book);
});

booksRouter.post('/', (req, res) => {
  const newBook = { id: Date.now(), ...req.body };
  books.push(newBook);
  res.status(201).json(newBook);
});

booksRouter.put('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === id);
  if (index === -1) {
    const error = new Error('Book not found');
    error.statusCode = 404;
    return next(error);
  }
  books[index] = { id, ...req.body };
  res.json(books[index]);
});

booksRouter.delete('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const exists = books.some(b => b.id === id);
  if (!exists) {
    const error = new Error('Book not found');
    error.statusCode = 404;
    return next(error);
  }
  books = books.filter(b => b.id !== id);
  res.json({ message: `Book ${id} deleted successfully` });
});

app.use('/api/books', booksRouter);


// --- 3. Members Router (Part J: Full CRUD) ---
const membersRouter = express.Router();
let members = [
  { id: 1, name: 'Sharansh Prajapati', membership: 'Premium' },
  { id: 2, name: 'Aarav Sharma', membership: 'Basic' }
];

membersRouter.get('/', (req, res) => res.json(members));

membersRouter.get('/:id', (req, res, next) => {
  const member = members.find(m => m.id === parseInt(req.params.id));
  if (!member) {
    const err = new Error('Member not found');
    err.statusCode = 404;
    return next(err);
  }
  res.json(member);
});

membersRouter.post('/', (req, res) => {
  const newMember = { id: Date.now(), ...req.body };
  members.push(newMember);
  res.status(201).json(newMember);
});

membersRouter.put('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const index = members.findIndex(m => m.id === id);
  if (index === -1) {
    const err = new Error('Member not found');
    err.statusCode = 404;
    return next(err);
  }
  members[index] = { id, ...req.body };
  res.json(members[index]);
});

membersRouter.delete('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  members = members.filter(m => m.id !== id);
  res.json({ message: `Member ${id} deleted` });
});

app.use('/api/members', membersRouter);


// --- 4. Custom Resource CRUD: Tasks (Part G & H) ---
let tasks = [
  { id: 1, title: 'Complete Express Lab Sheet', completed: false },
  { id: 2, title: 'Submit Assignment', completed: false }
];

// Read All
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Read One (calls next(err) if not found)
app.get('/api/tasks/:id', (req, res, next) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) {
    const err = new Error(`Task with id ${req.params.id} not found`);
    err.statusCode = 404;
    return next(err);
  }
  res.json(task);
});

// Create
app.post('/api/tasks', (req, res) => {
  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    title: req.body.title || 'Untitled Task',
    completed: req.body.completed || false
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update
app.put('/api/tasks/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    const err = new Error('Task not found for update');
    err.statusCode = 404;
    return next(err);
  }
  tasks[taskIndex] = { id, ...req.body };
  res.json(tasks[taskIndex]);
});

// Delete
app.delete('/api/tasks/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    const err = new Error('Task not found for deletion');
    err.statusCode = 404;
    return next(err);
  }
  tasks = tasks.filter(t => t.id !== id);
  res.json({ message: `Task ${id} deleted successfully` });
});


// ==========================================
// PART H: Error Handling
// ==========================================
// 404 Unmatched Route Handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Centralized Error Handling Middleware (4 parameters)
app.use((err, req, res, next) => {
  console.error('Centralized Error Caught:', err.message);
  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    status
  });
});


// ==========================================
// PART A & I: Server Initialization
// ==========================================
let PORT = process.env.PORT || 4000;

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Express Lab Server running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is currently in use. Retrying on port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(PORT);