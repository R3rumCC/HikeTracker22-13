var express = require('express');
var router = express.Router();
const { validationResult, body, param } = require('express-validator');
var c = require('./hikeController');

router.get('/getHikes', async (req, res) => {
	try {
		const hikes = await c.getHikes();
		//console.log(hikes)
		res.status(200).json(hikes).end();
	} catch (error) {
		// console.log(error);
		res.status(500).json(error).end();
	}
});

router.post('/User', [
	body('user.email').notEmpty().withMessage('Email cannot be empty!')
		.isEmail().withMessage('Incorrect email format!'),
	body('user.name').notEmpty().withMessage('Name cannot be empty!'),
	body('user.lastname').notEmpty().withMessage('Lastname cannot be empty!'),
	body('user.password').notEmpty().withMessage('Password cannot be empty!'),
	body('user.phoneNumber').notEmpty().withMessage('PhoneNumber cannot be empty!'),
	//.isNumeric().withMessage('PhoneNumber must be numeric!'),											//on db the phone numbers are in this format: +39 1234567890
	body('user.role').notEmpty().withMessage('Role cannot be empty!')
		.isIn(["Hiker", "LocalGuide", "HutWorker"]).withMessage('Incorrect format of role!'),
], (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array()
		})
	}
	c.addUser(req, res)
		.then((req, res) => {
			if (req.error)
				res.status(422).json(error).end();
			else
				res.status(200).json()
		});
}
);

/*router.post('/User', async (req, res) => {
	try {
		await c.addUser(req, res);
		res.status(200).json();
	} catch (error) {
		console.log("erroreeeeee")
		res.status(500).json(error).end();
	}
});*/

router.get('/User/:email', [
	param('email').notEmpty().withMessage('Email cannot be empty!')
		.isEmail().withMessage('Incorrect email format!'),
], (req, res, next) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array()
		})
	}
	next()
},
	c.getUser);
router.get('/Code/:email', [
	param('email').notEmpty().withMessage('Email cannot be empty!')
		.isEmail().withMessage('Incorrect email format!'),
], (req, res, next) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		return res.status(400).json({
			errors: errors.array()
		})
	}
	next()
},

	c.checkCode);

	

router.post('/Hike', c.addHike);

router.post('/Point', c.addPoint);


router.get('/getHuts', async (req, res) => {
	try {
		const huts = await c.getHuts();
		console.log(huts);
		res.status(200).json(huts).end();
	} catch (e) {
		res.status(500).json(e).end();
	}
});

module.exports = router