const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public')); // For CSS & JS files

let todolist = [
    { text: "Learn Jenkins", completed: false },
    { text: "Practice EJS", completed: false }
];

app.get('/', (req, res) => {
    res.render('index', { todolist });
});

app.post('/todo/add', (req, res) => {
    todolist.push({ text: req.body.newtodo, completed: false });
    res.redirect('/');
});

app.post('/todo/delete/:id', (req, res) => {
    todolist.splice(req.params.id, 1);
    res.redirect('/');
});

app.get('/todo/edit/:id', (req, res) => {
    res.render('edit', { todo: todolist[req.params.id], todoIdx: req.params.id });
});

app.post('/todo/edit/:id', (req, res) => {
    todolist[req.params.id].text = req.body.editTodo;
    res.redirect('/');
});

app.post('/todo/complete/:id', (req, res) => {
    todolist[req.params.id].completed = !todolist[req.params.id].completed;
    res.redirect('/');
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
