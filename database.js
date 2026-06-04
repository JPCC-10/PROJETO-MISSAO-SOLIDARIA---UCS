const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./estoque.db');

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS estoque(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT UNIQUE,
            quantidade INTEGER
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS historico(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            datahora TEXT,
            tipo TEXT,
            nome TEXT,
            quantidade INTEGER
        )
    `);

});

module.exports = db;