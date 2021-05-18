const express = require('express');
const connectDB = require('./config/db');
const app = express();

//connecting to db
connectDB();

//init middleware (for body parser in users.js)
app.use(express.json(({ extended: false })));

app.get('/',function(req, res){
    res.send('API Running');
})

// Define users
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});