CREATE TABLE batting_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    runs INTEGER,
    balls INTEGER,
    notOut BOOLEAN,
    fours INTEGER,
    sixes INTEGER,
    catches INTEGER
);

CREATE TABLE bowling_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    wickets INTEGER,
    runsGiven INTEGER,
    overs REAL
);
