const dao = require('./DAO');
var crypto = require('crypto')

exports.getHikes = async function()  {
    try {
        let fullHikes = []
        let hikes = await dao.readHikes();
        for (let hike of hikes){
            hike['reference_points'] = await dao.readReferencePoints(hike.title);
            fullHikes.push(hike)
        }
        return fullHikes;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

function RandomIndex(min, max, i,_charStr){
    
    let index = Math.floor(Math.random()*(max-min+1)+min),
        numStart = _charStr.length - 10;
    if(i==0&&index>=numStart){
        index = RandomIndex(min, max, i,_charStr);
    }
    return index;
}

exports.addUser =async function(req,res)  {
    const  _charStr ='abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789';
    let min = 0, max = _charStr.length-1, salt = '';
    let len = 32;
    for(var i = 0, index; i < len; i++){
        index = RandomIndex(min, max, i,_charStr);
        salt += _charStr[index];
    }
    
    // var hash = crypto.createHmac('sha512', salt); 
    // var hash = crypto.createHash('sha512', salt); //use sha512 
    crypto.scrypt(req.body.user.password, salt, 32, function (err, value){
        if (err) reject(err);
        else{
    dao.addUser(req.body.user.name, req.body.user.lastname, req.body.user.email, value, salt, req.body.user.role, req.body.user.phoneNumber).then(
    result => {
        return res.status(200).json();                       
    },
    error => {
        return res.status(500).send(error);
    }
)
}});
}