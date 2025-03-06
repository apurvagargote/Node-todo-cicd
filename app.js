const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const sanitizer = require('sanitizer');

const app = express();
const port = 8000;

// Middleware Setup
app.use(bodyParser.urlencoded({ extended: false }));

// Enable PUT & DELETE method override via `_method`
app.use(methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Store Todo Items
let todolist = [];

/* ✅ Display To-Do List */
app.get('/todo', (req, res) => {
    res.render('todo.ejs', { todolist });
});

/* ✅ Add a New Task */
app.post('/todo/add/', (req, res) => {
    let newTodo = sanitizer.escape(req.body.newtodo);
    if (newTodo.trim() !== '') {
        todolist.push({ text: newTodo, completed: false });
    }
    res.redirect('/todo');
});

/* ✅ Delete a Task */
app.post('/todo/delete/:id', (req, res) => {
    let id = req.params.id;
    if (todolist[id]) {
        todolist.splice(id, 1);
    }
    res.redirect('/todo');
});

/* ✅ Get a Single Task for Editing */
app.get('/todo/:id', (req, res) => {
    let todoIdx = req.params.id;
    let todo = todolist[todoIdx];

    if (todo) {
        res.render('edititem.ejs', { todoIdx, todo });
    } else {
        res.redirect('/todo');
    }
});

/* ✅ Edit a Task */
app.post('/todo/edit/:id', (req, res) => {
    let todoIdx = req.params.id;
    let editTodo = sanitizer.escape(req.body.editTodo);

    if (editTodo.trim() !== '' && todolist[todoIdx]) {
        todolist[todoIdx].text = editTodo;
    }
    res.redirect('/todo');
});

/* ✅ Toggle Task Completion */
app.post('/todo/complete/:id', (req, res) => {
    let id = req.params.id;
    if (todolist[id]) {
        todolist[id].completed = !todolist[id].completed;
    }
    res.redirect('/todo');
});

/* 🔄 Redirect Unknown Routes to /todo */
app.use((req, res) => {
    res.redirect('/todo');
});

/* ✅ Start Server */
app.listen(port, () => {
    console.log(`🚀 Todolist running on http://0.0.0.0:${port}`);
});

// Export app
module.exports = app;
