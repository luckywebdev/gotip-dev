let admin
let db
module.exports = async function (adminRef, dbRef, req, res) {
  admin = adminRef
  db = dbRef

  console.log(req.query, req.params, req.path, req.body)
  switch (req.params.action) {
    case 'online':
      const onlineChannels = await getOnlineChannels()
      res.send({ onlines: onlineChannels })
      break
    case 'info':
      const channelInfo = await getChannelInfo(req.query)
      res.send({
        result: channelInfo ? true : false,
        info: channelInfo
      })
      break
    case 'actions':
      const channelActions = await getChannelActions(req.query)
      res.send({ actions: channelActions })
      break
    case 'comment':
      var uid = await decodeUserToken(req.query.idToken)
      var result = await postComment(uid, req.body)
      res.send({ result })
      break
    case 'initChannel':
      var { checkResult, uid } = await checkAuthLevel(req.query.idToken, 2)
      var result = checkResult ? await initChannel(uid) : false
      res.send(result)
      break
    case 'editChannel':
      var { checkResult, uid } = await checkAuthLevel(req.query.idToken, 2)
      var result = checkResult ? await editChannel(uid, req.body) : false
      res.send({ result })
      break

    default:
      res.end()
  }
}


function getOnlineChannels () {
  return new Promise(async (resolve, reject) => {
    db.collection('channels').where('isOnline', '==', true).get()
    .then((snapShots) => {
      const result = []
      snapShots.forEach(doc => {
        if (doc.exists) result.push(doc.data())
      })
      resolve(result)
    }).catch((err) => {
      reject(err)
    })
  })
}

function getChannelInfo ({ channelId }) {
  return new Promise(async (resolve, reject) => {
    db.collection('channels').where('id', '==', channelId ? channelId : 'null').get()
    .then((snapShots) => {
      let result = {}
      if (snapShots) snapShots.forEach(doc => {
        if (doc.exists) result = doc.data()
      })
      resolve(result)
    }).catch((err) => {
      reject(err)
    })
  })
}

function getChannelActions ({ channelId, timeFrom = 0 }) {
  return new Promise(async (resolve, reject) => {
    db.collection('channels').doc(channelId).get()
    .then((snapShot) => {
      let result = []
      if (snapShot.exists) {
        const actions = snapShot.data().actions
        if (actions) result = actions.filter(action => action.timestamp > timeFrom)
      }
      resolve(result)
    }).catch((err) => {
      reject(err)
    })
  })
}

function postComment (uid, { channelId, name, message }) {
  return new Promise(async (resolve, reject) => {
    const currentTime = new Date().getTime()
    const channelRef = db.collection('channels').doc(channelId)
    db.runTransaction(async (t) => {
      const actions = await t.get(channelRef)
      .then(doc => {
        const actions = doc.exists ? doc.data().actions : []
        actions.push({
          actionType: 'comment',
          senderId: uid,
          name,
          message,
          timestamp: currentTime
        })
        return actions
      })
      t.set(channelRef, {
        actions,
        lastUpdatedTime: currentTime
      }, { merge: true })
    })
    .then(() => {
      resolve(true)
    }).catch((err) => {
      reject(err)
    })
  })
}


function initChannel (uid) {
  return new Promise(async (resolve, reject) => {
    const currentTime = new Date().getTime()
    const channelId = uid
    console.info(`Channel initialized by ${ uid }.`)
    const performerInfo = await db.collection('users').doc(uid).get()
    .then(doc => {
      const data = doc.exists ? doc.data() : {}
      return {
        nickname: data.name && data.name.nickname ? data.name.nickname : '',
        profile: data.profile ? data.profile : '',
        imageUrl: data.profileImgUrl ? data.profileImgUrl : ''
      }
    })
    db.collection('channels').doc(channelId).set({
      id: channelId,
      userId: uid,
      createdTime: currentTime,
      isOnline: false,
      actions: [],
      users: [],
      performerInfo
    }, { merge: true })
    .then(() => {
      resolve({ result: true, channelId })
    }).catch((err) => {
      reject(err)
    })
  })
}

function editChannel (uid, { channelId }) {
  return new Promise(async (resolve, reject) => {
    const currentTime = new Date().getTime()
    const channelRef = db.collection('channels').doc(channelId)
    db.runTransaction(async (t) => {
      const actions = await t.get(channelRef)
      .then(doc => {
        const actions = doc.exists ? doc.data().actions : []
        actions.push({
          senderId: uid,
          name,
          message,
          timestamp: currentTime
        })
        return actions
      })
      t.set(channelRef, {
        actions,
        lastUpdatedTime: currentTime
      }, { merge: true })
    })
    .then(() => {
      resolve(true)
    }).catch((err) => {
      reject(err)
    })
  })
}




async function decodeUserToken (token) {
  const decoded = await admin.auth().verifyIdToken(token)
  return decoded && decoded.uid ? decoded.uid : null
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