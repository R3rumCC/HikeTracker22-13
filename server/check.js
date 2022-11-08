//structure left for references

const dao = require('./dao');

exports.checkTipologia = (tipologia) => {
  if (tipologia === 'part-time' || tipologia === 'full-time')
    return true;
  else
    return false;
}

exports.checkExistingStudyPlane = async (studentId) => {
  try {
    if (await dao.existingStudyPlane(studentId)) {
      return true;
    }
    else
      return false;
  }
  catch {
    return false;
  }
}

