const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// routes
const userRoutes = require("./api/routes/users");
const loginRoutes = require("./api/routes/login");
const registerRoutes = require("./api/routes/register");
const proposalRoutes = require("./api/routes/proposals");
const evaluationRoutes = require("./api/routes/evaluations");
const inviteRoutes = require('./api/routes/invite');
const emailRoutes = require('./api/routes/email');
const scholarshipRoutes = require('./api/routes/scholarships');

app.use(cors());

mongoose.connect(process.env.MONGODB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
// app.use('/uploads', express.static('uploads'));
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token'
    );
    if (req.method == 'OPTIONS'){
        res.header(
            'Access-Control-Allow-Methods', 
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({});
    }
    next();
});

// handle requests
app.use('/users', userRoutes);
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/proposals', proposalRoutes);
app.use('/evaluations', evaluationRoutes);
app.use('/invite', inviteRoutes);
app.use('/email', emailRoutes);
app.use('/scholarships', scholarshipRoutes);

app.use((req, res, next) => {
    const error = new Error('Route not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;