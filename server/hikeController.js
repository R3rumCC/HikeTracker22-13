const dao = require('./DAO');
var crypto = require('crypto');

exports.getHikes = async function () {
	try {
		let fullHikes = []
		let hikes = await dao.readHikes();
		for (let hike of hikes) {
			//hike['reference_points'] = await dao.readReferencePoints(hike.title);
			hike['reference_points'] = await dao.readListOfReferencePoints(hike.title);
			let refer_points = [];
			for (const rp of hike['reference_points'].reference_points.split("-")) {
				const idPoint = parseInt(rp);
				const refPoint = await dao.readPointById(idPoint);
				refer_points.push(refPoint);
			}
			hike['reference_points'] = refer_points;
			fullHikes.push(hike)
		}
		return fullHikes;
	} catch (error) {
		console.log(error)
		throw error;
	}
}

exports.addHike = async function (req, res) {
	dao.addHike(req.body.newHike).then(
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
					console.log(error)
					return res.status(500).send(error);
				}
			)/*.catch((error) => {
				console.log(error)
				reject (error);
			});*/
		}
	});
}

/*exports.addUser = function (req, res) {
	const _charStr = 'abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789';
	let min = 0, max = _charStr.length - 1, salt = '';
	let len = 32;
	for (var i = 0, index; i < len; i++) {
		index = RandomIndex(min, max, i, _charStr);
		salt += _charStr[index];
	}

	// var hash = crypto.createHmac('sha512', salt); 
	// var hash = crypto.createHash('sha512', salt); //use sha512 
	crypto.scrypt(req.body.user.password, salt, 32, async function (err, value) {
		if (err)
			reject(err);
		else {
			try {
				await dao.addUser(req.body.user.email, value, req.body.user.role, req.body.user.name, req.body.user.lastname, req.body.user.phoneNumber, salt);
				try {
					await dao.deleteCode(req.body.user.email)
					return res.status(200).json();
				}catch (error) {
						return res.status(500).send(error);
					}
				} catch (error) {
					console.log(error)
					return await res.status(500).send(error);
				}
			}
	});
}*/

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
	//   console.log(req.body.point);
	dao.getUserByEmail(req.params.email).then(
		result => {
			return res.status(200).json(result);
		},
		error => {
			return res.status(500).send(error);
		}
	)
}



exports.addPoint = async function (req, res) {
	//   console.log(req.body.point);
	dao.addPoint(req.body.point).then(
		result => {
			return res.status(200).json();
		},
		error => {
			return res.status(500).send(error);
		}
	)
}