const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');

// express app
const app = express();

//connect to mongodb
const dbURI = 'mongodb+srv://logan:test1234@cluster0.5zi0j.mongodb.net/database?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware and static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

//mongoose and mondo sandbox routes
app.get('/add-blog', (req, res) => {
    const blog = new Blog({
        title: 'new blog',
        snippet: 'about my new blog',
        body: 'more about my new blog'
    });

    blog.save()
    .then((result) => {
        res.send(result)
    })
    .catch((err) => {
        console.log(err);
    });
});

app.get('/all-blogs', (req, res) => {
    Blog.find()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/single-blog', (req, res) =>{
    Blog.findById()
        .then((result) => {
            res.send(result); 
        })
        .catch((err) => {
            console.log(err);
        });
});

// routes
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About'});
});

// blog routes
app.use('/blogs', blogRoutes);

//404
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});