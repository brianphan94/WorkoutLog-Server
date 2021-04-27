require('dotenv').config()
const Express = require('express');
const database = require('./db');
const userController = require('./controllers/userController');
const logController = require('./controllers/logController');
const validate = require('./middleware/validateSession');


const app = Express();

app.use(require('./middleware/headers'));
app.use(Express.json());

app.use(validate)
app.use('/user', userController);
app.use('/', logController);

database.sync();

app.listen(process.env.PORT, () => console.log(`[${process.env.PORT}]: port is listening`));