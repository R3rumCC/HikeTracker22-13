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
module.exports = router