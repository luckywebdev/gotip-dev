const { v1 } = require('uuid')
const dateformat = require('date-format')

let admin
let db
module.exports = async function (adminRef, dbRef, req, res) {
  admin = adminRef
  db = dbRef

  console.log(req.query, req.params, req.path, req.body)
  switch (req.params.action) {
    case 'getinfo':
      admin.auth().verifyIdToken(req.query.idToken)
      .then(async (decoded) => {
        var uid = decoded.uid
        var result = false
        if (uid) result = await getPointsInfo(uid)
        console.log(result)
        res.send(result)
      })
      .catch((err) => {
        console.error(err)
        res.send(false)
      })
      break
    case 'purchase':
      admin.auth().verifyIdToken(req.body.idToken)
      .then(async (decoded) => {
        var uid = decoded.uid
        var result = false
        if (uid) result = await procPurchasePoint(uid, req.params, req.body)
        console.log(result)
        res.send(result)
      })
      .catch((err) => {
        console.error(err)
        res.send(false)
      })
      break
    default:
      res.end()
  }
}


function getPointsInfo (uid) {
  return new Promise(async (resolve, reject) => {
    const result = {}
    const pointsRef = db.collection('points').doc(uid)
    pointsRef.get()
    .then((doc) => {
      const data = doc.exists ? doc.data() : {}
      resolve(data)
    })
    .catch((err) => {
      reject(err)
    })
  })
}


function procPurchasePoint (uid, { type }, { value }) {
  return new Promise(async (resolve, reject) => {
    const [currentDate, expireDate, displayExpireDate, timestamp] = createRegDate()
    const pointsRef = db.collection('points').doc(uid)
    const [currentData, currentLog] = await pointsRef.get()
    .then(doc => {
      const data = doc.exists ? doc.data() : {}
      return [
        data.data && Array.isArray(data.data) ? data.data : [],
        data.log && Array.isArray(data.log) ? data.log : []
      ]
    })
    
    const regData = {
      id: v1(),
      registerDate: currentDate,
      expireDate: expireDate,
      displayExpireDate,
      timestamp
    }
    switch (type) {
      case 'add':
        regData.value = !isNaN(value) ? Number(value) : 0
        break
      default:
        console.error('No purchase type found.')
    }
    const regLog = Object.assign({ type }, regData)
    regData.current = regData.value

    currentData.push(regData)
    currentLog.push(regLog)

    db.runTransaction(async (t) => {
      t.set(pointsRef, { data: currentData, log: currentLog }, { merge: true })
    })
    .then(() => {
      resolve(true)
    }).catch((err) => {
      reject(err)
    })
  })
}


function createRegDate () {
  const dateTime = new Date()
  const currentDate = dateformat('yyyy-MM-dd hh:mm:ss', dateTime)
  const timestamp = dateTime.getTime()
  dateTime.setMonth(dateTime.getMonth() + 3)
  const displayExpireDate = dateformat('yyyy-MM-dd', dateTime)
  dateTime.setDate(dateTime.getDate() + 1)
  dateTime.setHours(0)
  dateTime.setMinutes(0)
  dateTime.setSeconds(0)
  const expireDate = dateformat('yyyy-MM-dd hh:mm:ss', dateTime)
  return [currentDate, expireDate, displayExpireDate, timestamp]
}


// function createRegData (body) {
//   const regData = {
//     sex: body.sex || null,
//     email: body.email || null,
//     tel: body.tel || null
//   }
//   if (body.name && body.ruby) regData.name = {
//     value: body.name || null,
//     ruby: body.ruby || null,
//     nickname: body.nickname || null
//   }
//   if (body.birthyear && body.birthmonth && body.birthday) regData.birthdate = {
//     year: body.birthyear,
//     month: body.birthmonth,
//     day: body.birthday
//   }
//   return regData
// }
// function updateAccountInfo (body, uid) {
//   return new Promise(async (resolve, reject) => {
//     const authInfo = {}
//     if (body.password && body.password.length > 0) authInfo.password = body.password
//     if (body.email && body.email.length > 0) authInfo.email = body.email
//     const userRecord = await admin.auth().updateUser(uid, authInfo)
//       .catch(error => {
//         console.error(error)
//         reject(error)
//       })
    
//     const regData = createRegData(body)
//     // regData.premium = false
//     // regData.auth_level = 1
//     const userRef = db.collection('users').doc(uid)
//     db.runTransaction(async (t) => {
//       await t.get(userRef)
//       t.set(userRef, regData, { merge: true })
//     })
//     .then(() => {
//       resolve(true)
//     }).catch((err) => {
//       reject(err)
//     })
//   })
// }


// async function updateConfig (body, uid) {
//   const configRef = db.collection('config').doc(uid)
//   let result
//   if (configRef && typeof body.data === 'object') result = await configRef.set(body.data, { merge: true })
//   return result
// }

// async function getUserProfile (uid) {
//   const userRef = db.collection('users').doc(uid)
//   const configRef = db.collection('config').doc(uid)
//   let result = { uid }
//   await configRef.get()
//     .then((doc) => {
//       if (doc.exists) {
//         const data = doc.data()
//         result.isPublished = data.profile_published ? true : false
//       } else {
//         result.isPublished = null
//       }
//     })
  
//   await userRef.get()
//     .then((doc) => {
//       if (doc.exists) {
//         const data = doc.data()
//         console.log('Required Profile Data.', data)
        
//         result.authLevel = data.authLevel ? data.authLevel : 1
//         if (result.isPublished) {
//           result.profile = data.profile ? data.profile : ''
//           result.profileImgUrl = data.profileImgUrl ? data.profileImgUrl : ''
//           result.nickname = data.name && data.name.nickname ? data.name.nickname : ''
//           result.bleDescription = data.bleDescription ? data.bleDescription : ''
//         }
//       }
//       result.isExists = doc.exists
//     })
  
//   return result
// }

// function setUserProfile (userData, uid) {
//   const userRef = db.collection('users').doc(uid)
//   let result = {}

//   return new Promise(async resolve => {
//     await userRef.get()
//       .then(async (doc) => {
//         if (doc.exists) {
//           const data = doc.data()
//           if (userData.profile) data.profile = userData.profile
//           if (userData.profileImgUrl) data.profileImgUrl = userData.profileImgUrl
//           if (userData.nickname) data.nickname = userData.nickname
//           if (userData.bleDescription) data.bleDescription = userData.bleDescription
          
//           result.result = await userRef.set(data, { merge: true })
//           .then(() => {
//             return true
//           })
//           .catch(err => {
//             console.error('Error at update profile data.', err)
//             return false
//           })
//         }
//         result.isExists = doc.exists
//         resolve(result)
//       })
//   })
// }
