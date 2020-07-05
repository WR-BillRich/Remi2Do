const express       = require('express');
const {Client}      = require('pg');
const bodyParser    = require('body-parser');
const cors          = require('cors')
require('dotenv').config();

const client = new Client({
    connectionString: process.env.CONSTRING
});


const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
  }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

client.connect();

// app.get('/', async (req, res) => {
//     const result = await client.query('SELECT * FROM MSUser');
//     console.log(result);
//     res.send(result.rows);
// });

app.get('/api/v1/insert_user', async (req, res) => {
    try{
        const query = {
            text: "INSERT INTO MSUser (username, password, full_name, user_type_id, isactive) VALUES ($1, $2, $3, $4, $5)",
            values: ['APPTECH_WilliamRich', '12345', 'WilliamRich', 1, 1]
        }
        const result = await client.query(query);
        res.send(result);
    }catch(err){
        console.log(err);
        throw err;
    }
});

app.get('/api/v1/pic', async (req, res) => {
    try{
        const query = {
            text: "SELECT USER_ID, USERNAME, FULL_NAME FROM MSUser WHERE USER_TYPE_ID = 2",
        }
        const result = await client.query(query);
        console.log(result.rows);
        res.json(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500);
        throw err;
    }
});

app.post('/api/v1/task', async (req, res) => {
    try{
        const queryText =   "INSERT INTO TRTask (TASK_ID, TASK_TITLE, TASK_DESC, ISACTIVE, CREATED_DATE, CREATED_BY, ASSIGNED_TO, OVERDUE_DATE, COMPLETED_DATE, COMPLETED_BY)" +
                            "VALUES (default, $1, $2, 1, now(), $3, $4, $5, null, null)";
        const query = {
            text: queryText,
            values : [
                req.body.title,
                req.body.desc,
                "ADMIN",
                req.body.assignTo,
                req.body.overdueDate
            ]
        };
        const result = await client.query(query);
        console.log('task insert: ', req.body);
        res.status(201);
        res.send({"message":"Task Added"});
    }catch (err) {
        console.log(err);
        res.status(500);
        res.send(
            {
                "message": "Task Add Fail",
                "error": err
            });
        throw err;
    }
});

app.listen(PORT, () => {
    console.log(`Listening at PORT: ${PORT}`);
});