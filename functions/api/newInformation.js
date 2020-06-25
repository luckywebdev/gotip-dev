let admin
let db
module.exports = async function (adminRef, dbRef, req, res) {
  admin = adminRef
  db = dbRef

  console.log(req.query, req.params, req.path, req.body)
  switch (req.params.action) {
    case 'get':
      const newInformations = await getNewInformation()
      res.send({ infos: newInformations })
      break
    case 'post':
      var { checkResult, uid } = await checkAuthLevel(req.query.idToken, 4)
      if (checkResult) {
        const postResult = await postNewInformation(req.body, uid)
        res.send({ result: postResult })
      } else {
        res.send({ errMessage: 'AuthLevel rejected.' })
      }
      break
    case 'delete':
      var { checkResult, uid } = await checkAuthLevel(req.query.idToken, 4)
      if (checkResult) {
        const deleteResult = await deleteNewInformation(req.body, uid)
        res.send({ result: deleteResult })
      } else {
        res.send({ errMessage: 'AuthLevel rejected.' })
      }
      break
    default:
      res.end()
  }
}


function getNewInformation () {
  return new Promise(async (resolve, reject) => {
    db.collection('info').doc('newInfomation').get()
    .then((snapShot) => {
      resolve(snapShot.exists ? snapShot.data() : {})
    }).catch((err) => {
      reject(err)
    })
  })
}

function postNewInformation ({ title, message, imageUrl }, uid) {
  return new Promise(async (resolve, reject) => {
    const currentTime = new Date().getTime()
    console.info('New information posted by :', uid)
    db.collection('info').doc('newInfomation').set({
      [currentTime]: {
        postedTime: currentTime,
        title,
        message,
        imageUrl
      }
    }, { merge: true })
    .then(() => {
      resolve(true)
    }).catch((err) => {
      reject(err)
    })
  })
}

function deleteNewInformation ({ key }, uid) {
  return new Promise(async (resolve, reject) => {
    console.info(`New information ${ key } deleted by ${ uid }.`)
    db.collection('info').doc('newInfomation').get()
    .then(snapShot => {
      return snapShot.exists ? snapShot.data() : {}
    })
    .then(data => {
      if (data && data[key]) delete data[key]
      db.collection('info').doc('newInfomation').set(data)
      .then(() => {
        resolve(true)
      })
    })
    .catch((err) => {
      reject(err)
    })
  })
}



async function checkAuthLevel (token, levelRequired) {
  return await admin.auth().verifyIdToken(token)
  .then(async (decoded) => {
    const result = await db.collection('users').doc(decoded.uid).get()
    .then(snapShot => {
      let result = false
      if (snapShot.exists) {
        const data = snapShot.data()
        if (typeof data.authLevel === 'number' && levelRequired <= data.authLevel) result = true
      }
      return result
    })
    .catch(err => {
      console.error(err)
      return null
    })
    console.info('Auth level checked.', { checkResult: result, uid: decoded.uid })
    return { checkResult: result, uid: decoded.uid }
  })
}