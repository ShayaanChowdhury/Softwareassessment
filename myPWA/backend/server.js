const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

const path = require('path');
const dbPath = path.join(__dirname, 'database', 'cricket_stat.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

app.get('/api/batting-stats', (req, res) => {
    db.all('SELECT * FROM batting_stats', [], (err, rows) => {
        if (err) {
            res.status(500).send('Error retrieving batting data');
        } else {
            res.status(200).json(rows);
        }
    });
});

app.get('/api/bowling-stats', (req, res) => {
    db.all('SELECT * FROM bowling_stats', [], (err, rows) => {
        if (err) {
            res.status(500).send('Error retrieving bowling data');
        } else {
            res.status(200).json(rows);
        }
    });
});

app.post('/api/stats', (req, res) => {
    const {
        runs, balls, notOut, fours, sixes, catches,
        wickets, runsGiven, overs
    } = req.body;

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        db.run(
            'INSERT INTO batting_stats (runs, balls, notOut, fours, sixes, catches) VALUES (?, ?, ?, ?, ?, ?)',
            [runs, balls, notOut ? 1 : 0, fours, sixes, catches],
            function(err) {
                if (err) {
                    db.run('ROLLBACK');
                    return res.status(500).send('Error saving batting stats');
                }
            }
        );

        db.run(
            'INSERT INTO bowling_stats (wickets, runsGiven, overs) VALUES (?, ?, ?)',
            [wickets, runsGiven, overs],
            function(err) {
                if (err) {
                    db.run('ROLLBACK');
                    return res.status(500).send('Error saving bowling stats');
                }
            }
        );

        db.run('COMMIT', (err) => {
            if (err) {
                db.run('ROLLBACK');
                return res.status(500).send('Error committing transaction');
            }
            res.status(201).json({ message: 'Stats saved successfully' });
        });
    });
});

app.delete('/api/stats', (req, res) => {
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        
        db.run('DELETE FROM batting_stats', (err) => {
            if (err) {
                db.run('ROLLBACK');
                return res.status(500).send('Error deleting batting stats');
            }
        });

        db.run('DELETE FROM bowling_stats', (err) => {
            if (err) {
                db.run('ROLLBACK');
                return res.status(500).send('Error deleting bowling stats');
            }
        });

        db.run('COMMIT', (err) => {
            if (err) {
                db.run('ROLLBACK');
                return res.status(500).send('Error committing transaction');
            }
            res.status(200).json({ message: 'All stats deleted successfully' });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});