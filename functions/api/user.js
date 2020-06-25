let admin
let db
module.exports = async function (adminRef, dbRef, req, res) {
  admin = adminRef
  db = dbRef

  console.log(req.query, req.params, req.path, req.body)
  switch (req.params.action) {
    case 'create' :
      createAccount(req.body)
      .then(insertAccountInfo.bind(null, req.body))
      .then(() => {
        res.send({
          result: true
        })
      })
      .catch((err) => {
        console.error(err)
        var errMessage = ''
        if (typeof err === 'object') switch (err.code) {
          case 'auth/email-already-exists':
            errMessage = 'ご入力いただいたメールアドレスは既に登録されています。'
            break
          case 'auth/invalid-email':
            errMessage = 'ご入力いただいたメールアドレスはお使いいただけません。'
            break
          default:
            errMessage = err.code
        }
        res.send({
          result: false,
          message: `アカウントを作成できませんでした。エラー：${ errMessage }`,
          errorCode: err.code
        })
      })
      break
    case 'modify':
      admin.auth().verifyIdToken(req.body.idToken)
      .then(async (decoded) => {
        var uid = decoded.uid
        if (uid) updateAccountInfo(req.body, uid)
        .then(result => {
          if (result) {
            res.send({ result: true })
          } else {
            res.send({
              result: false,
              message: `アカウントを編集できませんでした。`,
              errorCode: ''
            })
          }
        })
      })
      break
    case 'get':
      admin.auth().verifyIdToken(req.body.idToken)
      .then(async (decoded) => {
        var uid = decoded.uid
        var result = false
        if (uid) result = await getAccountInfo(uid)
        console.log(result)
        res.send(result)
      })
      .catch((err) => {
        console.error(err)
        res.send(false)
      })
      break
    case 'setconfig':
      admin.auth().verifyIdToken(req.body.idToken)
      .then(async (decoded) => {
        var uid = decoded.uid
        var result
        if (uid) result = await updateConfig(req.body, uid)
        res.send(result)
      })
      .catch((err) => {
        console.error(err)
        res.send(false)
      })
      break
    case 'profile':
      var userId = req.params.userId
      var result
      if (userId) result = await getUserProfile(userId)
      res.send(result)
      break
    case 'setprofile':
      admin.auth().verifyIdToken(req.body.idToken)
      .then(async (decoded) => {
        var uid = decoded.uid
        var result
        if (uid) result = await setUserProfile(req.body, uid)
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

function createAccount (body) {
  return new Promise(async (resolve, reject) => {
    const { email, password, tel, name, userId } = body
    if (email && password) {
      const userInformation = {
        email: email,
        emailVerified: false,
        password: password,
        displayName: name,
        disabled: false
      }
      if (userId) userInformation.uid = userId
      if (tel) userInformation.phoneNumber = `+81${ String(tel).replace(/^0./, '') }`
      admin.auth().createUser(userInformation)
      .then((userRecord) =>{
        console.log(userRecord)
        resolve({
          result: true,
          uid: userRecord.uid
        })
      }).catch((err) => {
        reject(err)
      })
    }
  })
}

function insertAccountInfo (body, { uid }) {
  return new Promise(async (resolve, reject) => {
    const regData = createRegData(body)
    regData.premium = false
    regData.auth_level = 1

    const userRef = db.collection('users').doc(uid)
    const pointRef = db.collection('points').doc(uid)
    db.runTransaction(async (t) => {
      await t.get(userRef)
      t.set(userRef, regData, { merge: true })
      t.set(pointRef, { data: [], log: [] }, { merge: true })
    })
    .then(() => {
      resolve(true)
    }).catch((err) => {
      reject(err)
    })
  })
}
function createRegData (body) {
  const regData = {
    sex: body.sex || null,
    email: body.email || null,
    theme_color: body.themeColor || null,
    profile: body.profile || "",
    tel: body.tel || null
  }
  if (body.name && body.ruby) regData.name = {
    value: body.name || null,
    ruby: body.ruby || null,
    nickname: body.nickname || null
  }
  if (body.birthyear && body.birthmonth && body.birthday) regData.birthdate = {
    year: body.birthyear,
    month: body.birthmonth,
    day: body.birthday
  }
  return regData
}
function updateAccountInfo (body, uid) {
  return new Promise(async (resolve, reject) => {
    const authInfo = {}
    if (body.password && body.password.length > 0) authInfo.password = body.password
    if (body.email && body.email.length > 0) authInfo.email = body.email
    const userRecord = await admin.auth().updateUser(uid, authInfo)
      .catch(error => {
        console.error(error)
        reject(error)
      })
    
    const regData = createRegData(body)
    // regData.premium = false
    // regData.auth_level = 1
    const userRef = db.collection('users').doc(uid)
    db.runTransaction(async (t) => {
      await t.get(userRef)
      t.set(userRef, regData, { merge: true })
    })
    .then(() => {
      resolve(true)
    }).catch((err) => {
      reject(err)
    })
  })
}

function getAccountInfo (uid) {
  return new Promise(async (resolve, reject) => {
    const result = {}
    const userRef = db.collection('users').doc(uid)
    const configRef = db.collection('config').doc(uid)
    userRef.get()
    .then((doc) => {
      console.log(doc.data())
      if (doc.exists) {
          result.account = doc.data()
          userRef.set({ lastLogin: new Date().getTime() }, { merge: true })
      }
    })
    .then(() => {
      configRef.get()
      .then((doc) => {
        console.log(doc.data())
        result.config = doc.exists ? doc.data() : {}
        resolve(result)
      })
      .catch((err) => {
        return err
      })
    })
    .catch((err) => {
      reject(err)
    })
    
  })
}

async function updateConfig (body, uid) {
  const configRef = db.collection('config').doc(uid)
  let result
  if (configRef && typeof body.data === 'object') result = await configRef.set(body.data, { merge: true })
  return result
}

async function getUserProfile (uid) {
  const userRef = db.collection('users').doc(uid)
  const configRef = db.collection('config').doc(uid)
  let result = { uid }
  await configRef.get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data()
        result.isPublished = data.profile_published ? true : false
      } else {
        result.isPublished = null
      }
    })
  
  await userRef.get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data()
        console.log('Required Profile Data.', data)
        
        result.authLevel = data.authLevel ? data.authLevel : 1
        if (result.isPublished) {
          result.profile = data.profile ? data.profile : ''
          result.profileImgUrl = data.profileImgUrl ? data.profileImgUrl : ''
          result.nickname = data.name && data.name.nickname ? data.name.nickname : ''
          result.bleDescription = data.bleDescription ? data.bleDescription : ''
        }
      }
      result.isExists = doc.exists
    })
  
  return result
}

function setUserProfile (userData, uid) {
  const userRef = db.collection('users').doc(uid)
  let result = {}
  let currentDate = new Date();
  return new Promise(async resolve => {
    await userRef.get()
      .then(async (doc) => {
        if (doc.exists) {
          const data = doc.data()
          if (userData.userName) data.name.value = userData.userName
          if (userData.userAge) data.birthdate.year = currentDate.getFullYear() - userData.userAge
          if (userData.userRuby) data.name.ruby = userData.userRuby
          if (userData.themeColor) data.theme_color = userData.themeColor
          if (userData.userState) data.userState = userData.userState
          if (userData.profile) data.profile = userData.profile
          if (userData.profileImgUrl) data.profileImgUrl = userData.profileImgUrl
          if (userData.nickname) data.name.nickname = userData.nickname
          if (userData.bleDescription) data.ble_devices = userData.bleDescription
          
          result.result = await userRef.set(data, { merge: true })
          .then(() => {
            return true
          })
          .catch(err => {
            console.error('Error at update profile data.', err)
            return false
          })
        }
        result.isExists = doc.exists
        resolve(result)
      })
  })
}