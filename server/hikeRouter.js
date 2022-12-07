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
});

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
}, c.getUser);

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
}, c.checkCode);


//router.post('/newHike', c.addHike);

router.post('/newHike', [
  body('newHike.title').notEmpty().withMessage('Title cannot be empty!'),
  body('newHike.length').notEmpty().withMessage('Length cannot be empty!')
    .isNumeric().withMessage('Length must be numeric!'),
  body('newHike.expected_time').notEmpty().withMessage('Expected time cannot be empty!')
    .isNumeric().withMessage('Expected time must be numeric!'),
  body('newHike.ascent').notEmpty().withMessage('Ascent cannot be empty!')
    .isNumeric().withMessage('Ascent must be numeric!'),
  body('newHike.difficulty').notEmpty().withMessage('Difficulty cannot be empty!')
    .isIn(["Tourist", "Hiker", "Professional hiker"]).withMessage('Incorrect format of diffiuclty!'),
  body('newHike.start_point').notEmpty().withMessage('Start point cannot be empty!')
    //.isNumeric().withMessage('Start point must be numeric!'),
  ,body('newHike.end_point').notEmpty().withMessage('End point cannot be empty!')
    //.isNumeric().withMessage('End point must be numeric!'),
  ,body('newHike.description').notEmpty().withMessage('Description cannot be empty!'),
  body('newHike.gpx_track').notEmpty().withMessage('Gpx track cannot be empty!'),
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }
  c.addHike(req, res)
});

//router.post('/Point', c.addPoint);

router.post('/Point', [
  body('point.address').notEmpty().withMessage('Address cannot be empty!'),
  body('point.gps_coordinates').notEmpty().withMessage('Gps coordinates cannot be empty!'),
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }
  c.addPoint(req, res)
});

router.get('/getHuts', async (req, res) => {
  try {
    const huts = await c.getHuts();
    console.log(huts);
    res.status(200).json(huts).end();
  } catch (e) {
    res.status(500).json(e).end();
  }
});

router.post('/Huts', [
  body('hut.address').notEmpty().withMessage('Address cannot be empty!'),
  body('hut.gps_coordinates').notEmpty().withMessage('Gps coordinates cannot be empty!'),
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }
  c.addHut(req, res)
});

module.exports = router