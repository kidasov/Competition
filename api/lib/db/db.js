'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Session = exports.User = exports.Event = exports.sequelize = undefined;

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _event = require('./models/event');

var _event2 = _interopRequireDefault(_event);

var _user = require('./models/user');

var _user2 = _interopRequireDefault(_user);

var _session = require('./models/session');

var _session2 = _interopRequireDefault(_session);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const sequelize = exports.sequelize = new _sequelize2.default('competition', 'postgres', 'example', {
  host: 'localhost',
  dialect: 'postgres'
});

const Event = exports.Event = (0, _event2.default)(sequelize, _sequelize.DataTypes);
const User = exports.User = (0, _user2.default)(sequelize, _sequelize.DataTypes);
const Session = exports.Session = (0, _session2.default)(sequelize, _sequelize.DataTypes);

sequelize.sync();