'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.User = exports.Event = exports.sequelize = undefined;

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _event = require('./models/event');

var _event2 = _interopRequireDefault(_event);

var _user = require('./models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const sequelize = exports.sequelize = new _sequelize2.default('competition', 'postgres', 'example', {
  host: 'localhost',
  dialect: 'postgres'
});

const Event = exports.Event = (0, _event2.default)(sequelize, _sequelize.DataTypes);
const User = exports.User = (0, _user2.default)(sequelize, _sequelize.DataTypes);

sequelize.sync();