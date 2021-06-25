const express = require('express');
const mongoose = require('mongoose');

const app = express();

// DB Config
const db = require('./config/db');

// Connect to MongoDB
db()

//INIT Middleware
app.use(express.json( {extended : false } ) )



app.get('/', (req, res) => res.send('Hello World'));

// Use Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'))

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
