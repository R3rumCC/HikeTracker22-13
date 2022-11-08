const dao = require('./DAO');

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
