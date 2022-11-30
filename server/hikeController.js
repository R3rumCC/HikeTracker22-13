const dao = require('./DAO');
var crypto = require('crypto');
const { start } = require('repl');

exports.getHikes = async function () {
  try {
    let fullHikes = []
    let hikes = await dao.readHikes();
    for (let hike of hikes) {
      //hike['reference_points'] = await dao.readReferencePoints(hike.title);
      hike['reference_points'] = await dao.readListOfReferencePoints(hike.title);
      if (hike['reference_points']) {
        let refer_points = [];
        for (const rp of hike['reference_points'].reference_points.split("-")) {
          const idPoint = parseInt(rp);
          const refPoint = await dao.readPointById(idPoint);
          refer_points.push(refPoint);
        }
        hike['reference_points'] = refer_points;
      }
      else {
        hike['reference_points'] = [];
      }
      fullHikes.push(hike)
    }
    return fullHikes;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

exports.addHike = async function (req, res) {

  //better rename these two fields in start_point_address and end_point_address because they are address, not idPoint
  const startId = await dao.checkPresenceByAddress(req.body.newHike.start_point)
  const endId = await dao.checkPresenceByAddress(req.body.newHike.end_point)
  //console.log(startId.idPoint, endId.idPoint)

  let hike = {
    title: req.body.newHike.title, length: req.body.newHike.length, expected_time: req.body.newHike.expected_time,
    ascent: req.body.newHike.ascent, difficulty: req.body.newHike.difficulty, start_point: startId.idPoint, end_point: endId.idPoint,
    reference_points: req.body.newHike.reference_points, description: req.body.newHike.description, gpx_track: req.body.newHike.gpx_track
  }
  //console.log('before db call: ')
  //console.log(hike)

  dao.addHike(hike).then(
    result => {
      return res.status(200).json();
    },
    error => {
      return res.status(500).send(error);
    }
  )
}

exports.getHuts = async function () {
  try {
    const huts = await dao.readHuts();
    return huts;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

function RandomIndex(min, max, i, _charStr) {

  let index = Math.floor(Math.random() * (max - min + 1) + min),
    numStart = _charStr.length - 10;
  if (i == 0 && index >= numStart) {
    index = RandomIndex(min, max, i, _charStr);
  }
  return index;
}


exports.addUser = async function (req, res) {
  const u = await dao.getUserByEmail(req.body.user.email);
  // console.log(u);
  if (!u.error) { res.status(422).send("This email has been registered.").end(); }
  else {
    const _charStr = 'abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789';
    let min = 0, max = _charStr.length - 1, salt = '';
    let len = 32;
    for (var i = 0, index; i < len; i++) {
      index = RandomIndex(min, max, i, _charStr);
      salt += _charStr[index];
    }

    // var hash = crypto.createHmac('sha512', salt); 
    // var hash = crypto.createHash('sha512', salt); //use sha512 
    crypto.scrypt(req.body.user.password, salt, 32, function (err, value) {
      if (err) reject(err);
      else {
        dao.addUser(req.body.user.email, value, req.body.user.role, req.body.user.name, req.body.user.lastname, req.body.user.phoneNumber, salt).then(
          result => {
            dao.deleteCode(req.body.user.email).then(
              result => {
                return res.status(200).json();
              },
              error => {
                return res.status(500).send(error);
              }
            );
          },
          error => {
            return res.status(500).send(error);
          }
        )
      }
    });
  }
}

exports.checkCode = async function (req, res) {
  //   console.log(req.body.point);
  dao.getCode(req.params.email).then(
    result => {
      return res.status(200).json(result);
    },
    error => {
      return res.status(500).send(error);
    }
  )
}


exports.getUser = async function (req, res) {
  dao.getUserByEmail(req.params.email).then(
    result => {
      return res.status(200).json(result);
    },
    error => {
      return res.status(500).send(error);
    }
  )
}


//It checks for the presence of the point in the db, then:
//-if not present, it is added;
//-if present, a positive feedback is sent anyway       //Why a positive feedback? Return code to be changed, 200 would indicate that the addPoint succeeds while here it rightly fails because you already have a point with that address
exports.addPoint = async function (req, res) {

  try {
    const id = await dao.checkPresenceByAddress(req.body.point.address)
    if (id !== null) {
      return res.status(200).json(id);      
    } else {
      dao.addPoint(req.body.point).then(
        result => {
          return res.status(200).json(result);
        },
        error => {
          return res.status(500).send(error);
        }
      )
    }

  } catch (e) {
    console.log(e);
    throw e;
  }
}
