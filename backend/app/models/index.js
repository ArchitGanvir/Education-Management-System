const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.courses = require('./courses.model');
db.subs = require('./subs.model');
db.lects = require('./lects.model');

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;