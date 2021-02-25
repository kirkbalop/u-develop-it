const express = require('express');
const inputCheck = require('./utils/inputCheck');
const db = require('./db/database');
const apiRoutes = require('./routes/apiRoutes');

const PORT = process.env.PORT || 3001;
const app = express();
app.use('/api', apiRoutes);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});

app.get('/api/parties', (req, res) => {
    const sql = `SELECT * FROM parties`;
    const params = [];
    db.all(sql, params, (err, row) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }

        res.json({
            message: 'success',
            data: rows
        });
    });
});

app.get ('/api/party/:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({error: err.message});
            return;
        }

        res.json({
            message: 'success',
            data: row
        });
    });
});

app.delete('/api/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function(err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        res.json({ message: 'successfully deleted', changes: this.changes});
    });
});

// catch all for any other requests
app.use((req,res) => {
    res.status(404).end();
});

// start server after db connection
db.on('open', () => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}.`);
    });
});