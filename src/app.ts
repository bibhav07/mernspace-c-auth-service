import express from "express";

const app = express();


app.get('/', (req, res) => {
    res.send('welcome to auth service....')
})

export default app;