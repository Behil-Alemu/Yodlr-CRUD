var express = require('express');
var router = express.Router();
var _ = require('lodash');
var logger = require('../lib/logger');
var log = logger();

var users = require('../init_data.json').data;
var curId = _.size(users);

/* GET users listing. */
router.get('/', function(req, res) {
	try {
		res.json(_.toArray(users));
	} catch (err) {
		return next(err);
	}
});

/* Create a new user */
router.post('/', function(req, res) {
	var user = req.body;
	user.id = curId++;
	if (!user.state) {
		user.state = 'pending';
	}
	users[user.id] = user;
	log.info('Created user', user);
	const updatedData = JSON.stringify({ data: users }, null, 2);
	fs.writeFileSync('init_data.json', updatedData);
	res.json(user);
});

/* Get a specific user by id */
router.get('/:id', function(req, res, next) {
	var user = users[req.params.id];
	if (!user) {
		return next();
	}
	res.json(users[req.params.id]);
});

/* Delete a user by id */
router.delete('/:id', function(req, res) {
	var user = users[req.params.id];
	delete users[req.params.id];
	res.status(204);
	log.info('Deleted user', user);
	res.json(user);
});

/* Update a user by id */
router.put('/:id', function(req, res, next) {
	try {
    
		var user = req.body;
		if (user.id != req.params.id) {
			return next(new Error('ID paramter does not match body'));
		}

		users[user.id] = user;
		log.info('Updating user', user);
		const updatedData = JSON.stringify({ data: user }, null, 2);
    
		fs.writeFileSync('init_data.json', updatedData);
		res.json(user);
	} catch (err) {
		log.error(err);
		next(err);
	}
});

module.exports = router;
