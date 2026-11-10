const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite'); // SQLite integrado en Node.js 22+ (sin instalar nada)
const { archivoBD } = require('../config/config');

const db = new DatabaseSync(archivoBD);
db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

module.exports = db;
