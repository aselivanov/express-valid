const low = require('lowdb');
const Memory = require('lowdb/adapters/Memory');

const db = low(new Memory());

db.defaults({ profiles: [] });

module.exports = db;