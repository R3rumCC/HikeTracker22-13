var express = require('express');
var router = express.Router();
const { validationResult,body,param } = require('express-validator');
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

router.post('/User',[
body('user.email').notEmpty().withMessage('Email cannot be empty!')
                        .isEmail().withMessage('Incorrect email format!') ,
body('user.name').notEmpty().withMessage('Name cannot be empty!'),
body('user.lastname').notEmpty().withMessage('Lastname cannot be empty!'),
body('user.password').notEmpty().withMessage('Password cannot be empty!'),
body('user.phoneNumber').notEmpty().withMessage('PhoneNumber cannot be empty!')
                        .isNumeric().withMessage('PhoneNumber must be numeric!'),
body('user.role').notEmpty().withMessage('Role cannot be empty!')
                        .isIn(["Hiker","LocalGuide","HutWorker"]).withMessage('Incorrect format of role!'),
                    ],(req, res, next) => {   
                            const errors = validationResult(req)
                        
                            if(!errors.isEmpty()){
                                return res.status(400).json({
                                    errors: errors.array()
                                })
                            }
                            next()},
c.addUser);

router.post('/User', async (req, res) => {
    try{
        await c.addUser(req,res);
        res.status(200).json();
    } catch (error) {
        console.log("erroreeeeee")
        res.status(500).json(error).end();
    }
});

// router.post('/User', [
//     check('name').isLength({ min: 1 }),
//     check('lastname').isLength({ min: 1 }),
//     check('role').isIn(["Hiker","LocalGuide","HutWorker"]),
//     check('password').isLength({ min: 1 }),
//     check('email').isEmail(),
//     check('phoneNumber').isNumeric()
//   ], (req, res) => {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//       return res.status(422).json({ errors: errors.array() })
//     }
//     const lastname  = req.body.user.lastname
//     const name  = req.body.user.name
//     const email = req.body.user.email
//     const phoneNumber   = req.body.user.phoneNumber
//     const password   = req.body.user.password
//     const role   = req.body.user.role
//   })

router.get('/User/:email',[
param('email').notEmpty().withMessage('Email cannot be empty!')
.isEmail().withMessage('Incorrect email format!') ,
                        ],(req, res, next) => {   
                                const errors = validationResult(req)
                            
                                if(!errors.isEmpty()){
                                    return res.status(400).json({
                                        errors: errors.array()
                                    })
                                }
                                next()},
       c.getUser);
router.get('/Code/:email',[
    param('email').notEmpty().withMessage('Email cannot be empty!')
    .isEmail().withMessage('Incorrect email format!') ,
                            ],(req, res, next) => {   
                                    const errors = validationResult(req)
                                
                                    if(!errors.isEmpty()){
                                        return res.status(400).json({
                                            errors: errors.array()
                                        })
                                    }
                                    next()},

       c.checkCode);
router.post('/Point',c.addPoint);

router.get('/getHuts', async (req, res) => {
    try{
        const huts = await c.getHuts();
        console.log(huts);
        res.status(200).json(huts).end();
    } catch (e){
        res.status(500).json(e).end();
    }
});

module.exports = router