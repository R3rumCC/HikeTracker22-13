var express = require('express');
var router = express.Router();
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
router.post('/User',c.addUser);
router.get('/User/:email',c.getUser);
router.get('/Code/:email',c.checkCode);
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