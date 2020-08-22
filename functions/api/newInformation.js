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
    case 'get_posted':
      console.log("req", req.body);
      const newInformation = await getPostedInformation(req.body)
      res.send({ infos: newInformation })
      break
    case 'post':
      var { checkResult, uid } = await checkAuthLevel(req.query.idToken, 1)
      if (checkResult) {
        const postResult = await postNewInformation(req.body, uid)
        res.send({ result: postResult })
      } else {
        res.send({ errMessage: 'AuthLevel rejected.' })
      }
      break
    case 'update':
      var { checkResult, uid } = await checkAuthLevel(req.query.idToken, 1)
      if (checkResult) {
        const postResult = await updateNewInformation(req.body, uid)
        res.send({ result: postResult })
      } else {
        res.send({ errMessage: 'AuthLevel rejected.' })
      }
      break;
    case 'delete':
      var { checkResult, uid } = await checkAuthLevel(req.query.idToken, 1)
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
    db.collection('info').doc('newInformation').get()
    .then((snapShot) => {
      resolve(snapShot.exists ? snapShot.data() : {})
    }).catch((err) => {
      reject(err)
    })
  })
}

function getPostedInformation (body) {
  return new Promise(async (resolve, reject) => {
    db.collection('info').doc('newInformation').get()
    .then((snapShot) => {
      return snapShot.exists ?  snapShot.data() : {}
    }).then(data => {
      console.log("postedTime", body);
      if (data && data[body.key]) 
        resolve(data[body.key])
    })
    .catch((err) => {
      reject(err)
    })
  })
}

function postNewInformation ({ title, message, imageUrl, notify, activeDate }, uid) {
  return new Promise(async (resolve, reject) => {
    const currentTime = new Date().getTime()
    console.info('New information(create) posted by :', uid)
    db.collection('info').doc('newInformation').set({
      [currentTime]: {
        postedTime: currentTime,
        title,
        message,
        imageUrl,
        notify: notify,
        activeDate: activeDate,
        uid: uid
      }
    }, { merge: true })
    .then(() => {
      resolve(true)
    }).catch((err) => {
      reject(err)
    })
  })
}

function updateNewInformation ({ title, message, imageUrl, notify, activeDate, postedTime }, uid) {
  return new Promise(async (resolve, reject) => {
    const currentTime = new Date().getTime()
    console.info('New information(update) posted by :', uid)
    let updateData = {
      title,
      message,
      notify,
      activeDate,
      uid: uid
    }
    if(imageUrl !== "")
      updateData.imageUrl = imageUrl;
    db.collection('info').doc('newInformation').update({
      [postedTime]: updateData
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
    db.collection('info').doc('newInformation').get()
    .then(snapShot => {
      return snapShot.exists ? snapShot.data() : {}
    })
    .then(data => {
      if (data && data[key]) delete data[key]
      db.collection('info').doc('newInformation').set(data)
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
        console.log("checkAuth", levelRequired + "&&&" + typeof data.auth_level);
        if (typeof data.auth_level === 'number' && levelRequired <= data.auth_level) result = true
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