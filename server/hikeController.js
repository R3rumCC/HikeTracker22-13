const dao = require('./DAO');
const crypto = require('crypto');
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

  console.log('addHike server');
  //better rename these two fields in start_point_address and end_point_address because they are address, not idPoint
  const startId = await dao.checkPresenceByAddress(req.body.newHike.start_point)
  const endId = await dao.checkPresenceByAddress(req.body.newHike.end_point)

  if (startId == null || endId == null) {
    return res.status(400)
  }
  //console.log(startId.idPoint, endId.idPoint)

  let hike = {
    title: req.body.newHike.title, length: req.body.newHike.length, expected_time: req.body.newHike.expected_time,
    ascent: req.body.newHike.ascent, difficulty: req.body.newHike.difficulty, start_point: startId.idPoint, end_point: endId.idPoint,
    reference_points: req.body.newHike.reference_points, description: req.body.newHike.description, gpx_track: req.body.newHike.gpx_track,
    hike_condition: req.body.newHike.hike_condition, local_guide: req.body.newHike.local_guide
  }

  dao.addHike(hike).then(
    result => {
      return res.status(200).json();
    },
    error => {
      return res.status(500).send(error);
    }
  )
}

exports.updateHike = async function (req, res) {

  const oldHike = await dao.getHikeByTitle(req.body.oldHikeTitle);

  const updateHike = {
    title: req.body.hike.title, length: req.body.hike.length, expected_time: req.body.hike.expected_time,
    ascent: req.body.hike.ascent, difficulty: req.body.hike.difficulty, start_point: oldHike.start_point, end_point: oldHike.end_point,
    reference_points: req.body.hike.reference_points, description: req.body.hike.description, gpx_track: oldHike.gpx_track,
    hike_condition: req.body.hike.hike_condition, hike_condition_description: req.body.hike.hike_condition_description, local_guide: oldHike.local_guide
  }

  dao.updateHike(req.body.oldHikeTitle ,updateHike).then(
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
    for (let i = 0, index; i < len; i++) {
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

exports.getPoints = async function () {
  try {
    const points = await dao.readPoints();
    return points;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

//It checks for the presence of the point in the db, then:
//-if not present, it is added;
//-if present, a positive feedback is sent anyway   
exports.addPoint = async function (req, res) {
  try {
    const id = await dao.checkPresenceByCoordinates(req.body.point.gps_coordinates)
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

//It checks for the presence of the point in the db, then:
//-if not present, it is added;
//-if present, a positive feedback is sent anyway   
exports.addHut = async function (req, res) {

  //console.log("Inside addHut server side")
  // console.log(req.body.hut)
  try {
    const id = await dao.checkPresenceByCoordinates(req.body.hut.address)
    if (id !== null) {
      return res.status(200).json(id);
    }

    const res1 = dao.addHut(req.body.hut).then(
      result => {

        dao.addPoint(req.body.hut).then(
          result => {
            return res.status(200).json(result);
          },
          error => {
            return res.status(500).send(error);
          }
        )
      },
      error => {
        return res.status(500).send(error);
      }

    )

  } catch (e) {
    console.log(e);
    throw e;
  }
}

/*************HikerHike API************/

exports.startHike = async function (req, res) {
  dao.startHike(req.body.hiker_email, req.body.hike_title, req.body.start_time).then(
    result => {
      return res.status(200).json();
    },
    error => {
      return res.status(500).send(error);
    }
  )
}

exports.updateEndTime = async function (req, res) {
  dao.updateHikeEndTime(req.body.hiker_email, req.body.hike_title, req.body.start_time, req.body.end_time).then(
    result => {
      return res.status(200).json();
    },
    error => {
      return res.status(500).send(error);
    }
  )
}

exports.getFinishedHikes = async function () {
  try {
    const hikes = await dao.getFinishedHikes();
    return hikes;
  } catch (error) {
    throw error;
  }
}

exports.getDistinctFinishedHikes = async function () {
  try {
    const hikes = await dao.getDistinctFinishedHikes();
    return hikes;
  } catch (error) {
    throw error;
  }
}

exports.getFinishedHikesByHiker = async function (req) {
  try {
    const hikes = await dao.getDistinctFinishedHikes(req.params.hiker_email);
    return hikes;
  } catch (error) {
    throw error;
  }
}