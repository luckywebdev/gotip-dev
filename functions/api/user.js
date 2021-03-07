const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport');
const profiles = require('firebase-functions').config()


let admin
let db
module.exports = async function (adminRef, dbRef, req, res) {
  admin = adminRef
  db = dbRef

  console.log(req.query, req.params, req.path, req.body)
  switch (req.params.action) {
    case 'create' :
      createAccount(req.body)
      .then(async (result) => {
        var postRst = null;
        if(typeof req.body.agent_id !== 'undefined' && req.body.agent_id !== null){
          await insertAccountInfo(req.body, {uid: result.uid})
          .then(async (res) => {
            console.log("create_result", result);
            postRst = await postContactMail(req.body, result);
          })
        }
        else{
          console.log("create_result", result);
          postRst = await postContactMail(req.body, result);
        }
        if(postRst){
          res.send({
            result: true
          })
        }
        else{
          res.send({
            result: postRst
          })
        }
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
    case 'check' :
      await checkAccount(req.body)
      .then(result => {
        console.log("results===>", result);
        if(result.state){
          admin.auth().createCustomToken(req.body.uid)
          .then((customToken) => {
            res.send({
              result: true,
              action: result.action,
              customToken: customToken,
              email: result.email,
              auth_level: result.auth_level,
              agent_id: result.agent_id
            })  
          })
        }
        else{
          if(result.errMessage === "timeout") {
            admin.auth().deleteUser(req.body.uid)
            .then(() => {
              res.send({
                result: false,
                action: result.action,
                message: 'timeout',
                email: result.email
              })
            })
          }
          else{
            res.send({
              result: false,
              action: result.action,
              message: result.errMessage,
              email: result.email
            })
          }
        }
      })
      .catch(err => {
        console.error(err);
        res.send({
          result: false,
          action: "land",
          message: '',
          errorCode: err,
          email: ''
        })
      })
      break;
    case 'register' :
      insertAccountInfo(req.body, {uid: req.body.uid})
      .then(() => {
        updateAccountInfo(req.body, req.body.uid)
        .then(() => {
          console.log("reg_1====>")
          res.send({
            result: true
          })
        })
        .catch((err) => {
          console.log("reg_2====>", err)
          res.send({
            result: false,
            message: `アカウントを作成できませんでした。エラー：${ err }`,
          })  
        })
      })
      .catch((err) => {
        console.log("reg_3====>", err)
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
    case 'createbysocial':
      const createTime = new Date();
      if(typeof req.body.agent_id !== 'undefined' && req.body.agent_id !== null){
        await insertAccountInfo(req.body, {uid: req.body.uid})
        .then(async (res) => {
          await postContactMail({email: req.body.email, agent_id: req.body.agent_id}, {uid: req.body.uid, createTime: createTime})
          .then((results) => {
            if(results){
              res.send({
                result: true
              })
            }
            else{
              res.send({
                result: results
              })
            }
          })
          .catch(err => {
            res.send({
              result: err
            })
          })
        })
      }
      else{
        postContactMail({email: req.body.email, agent_id: null}, {uid: req.body.uid, createTime: createTime})
        .then((results) => {
          if(results){
            res.send({
              result: true
            })
          }
          else{
            res.send({
              result: results
            })
          }
        })
        .catch(err => {
          res.send({
            result: err
          })
        })
      }
      break;
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
      console.log("req_params", req.params);
      var userId = req.params.userId
      var result
      if (userId) result = await getUserProfile(userId)
      console.log("profile_result", result);
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
    case 'getCreator':
      await getCreatorList()
      .then(rst => {
        res.send({
          creatorList: rst.creatorList,
          result: true
        })
      })
      .catch((err) => {
        res.send({
          result: false,
          creatorList: [],
          error: err
        })
      })
      break;
    case 'delete':
      deleteAccount(req.params.userId)
      .then((result) => {
        console.log(result)
        res.send(result)
      })
      .catch((err) => {
        console.error(err)
        res.send(false)
      })
      break
    case 'logout': 
      await logOut(req.body)
      .then(() => {
        res.send({
          result: true
        })
      })
      .catch(err => {
        res.send({
          result:false,
          error: err
        })
      })
    default:
      res.end()
  }
}

function createAccount (body) {
  return new Promise(async (resolve, reject) => {
    const { email, password } = body
    if (email && password) {
      const userInformation = {
        email: email,
        emailVerified: false,
        password: password,
        disabled: false
      }
      admin.auth().createUser(userInformation)
      .then((userRecord) =>{
        resolve({
          result: true,
          uid: userRecord.uid,
          createTime: userRecord.metadata.creationTime,
          lastSignInTime: userRecord.metadata.lastSignInTime
        })
      }).catch((err) => {
        reject(err)
      })
    }
  })
}

function checkAccount(body) {
  return new Promise(async(resolve, reject) => {
    try{
      const userDB = await db.collection('users').doc(body.uid).get()
      .then(async (doc) => {
        if(doc.exists){
          const account = doc.data();
          if(typeof account.name !== 'undefined' && account.name.nickname !== ''){
            db.collection('users').doc(body.uid).update({loggedin: true}, {merge: true});
            resolve({
              state: true,
              action: "login",
              email: doc.email,
              auth_level: account.auth_level
            })
          }
          else{
            resolve({
              state: true,
              action: "register",
              email: account.email,
              auth_level: account.auth_level,
              agent_id: account.agent_id
            })
          }
        }
        else{
          const userData = await admin.auth().getUser(body.uid);
          const d = new Date(userData.metadata.creationTime);
          const createTimeStamp = d.getTime() / 1000;
          const currentTime = new Date().getTime() / 1000;
          const oneDayTime = 60 * 60 * 24;
  
          if((currentTime - createTimeStamp) <= oneDayTime){
            resolve({
              state: true,
              action: "register",
              email: userData.email,
            })
          }
          else{
            resolve({
              state: false,
              action: "land",
              errMessage: "timeout"
            })
          }
        }
      })
    }
    catch(err){
      reject({
        state: false,
        action: "land",
        errMessage: err
      })
    }
  })
}

function insertAccountInfo (body, { uid }) {
  return new Promise(async (resolve, reject) => {
    const regData = createRegData(body)
    const userData = await admin.auth().getUser(uid);
    regData.email = userData.email;
    regData.fid = uid;
    regData.uid = uid;
    regData.premium = false;
    const currentTime = new Date();
    regData.created_at = new Date().getTime();
    const dayStamp = 60 * 60 * 24 * 1000;
    const bankData = {
      bank_code: body.bank_code || null,
      branch_code: body.branch_code || null,
      account_type: body.account_type || null,
      account_number: body.account_number || null,
      account_holder: body.account_holder || null
    }
    const pointData = {
      data: {
        normal: {
          value: 1000,
          expire_date: currentTime.setDate(currentTime.getDate() + 1)
        },
        subscription: {
          value: 2000,
          expire_date: currentTime.setMonth(currentTime.getMonth() + 1)
        }
      },
      saleData: {
        normal: {
          value: 0,
        },
        subscription: {
          value: 0,
        }
      },
      log: []      
    }
    const userRef = db.collection('users').doc(uid)
    const pointRef = db.collection('points').doc(uid)
    const bankRef = db.collection('banks').doc(uid)
    db.runTransaction(async (t) => {
      await t.get(userRef)
      t.set(userRef, regData, { merge: true })
      t.set(pointRef, pointData, { merge: true })
      t.set(bankRef, bankData, {merge: true})
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
    theme_color: body.themeColor || "rgba(48, 170, 137, 1)",
    profile: body.profile || "",
    tel: `+81${ body.tel }` || null,
    // tel: `+81${ String(body.tel).replace(/^0/, '') }` || null,
    agent_id: body.agent_id || null,
    userState: body.userState || 0,
    auth_level: body.auth_level || 1
  }
  if (body.nickname) regData.name = {
    value: body.name || null,
    ruby: body.ruby || null,
    nickname: body.nickname || null
  }
  if (typeof body.birthdate !== 'undefined' && body.birthdate.year && body.birthdate.month && body.birthdate.day) regData.birthdate = {
    year: body.birthdate.year,
    month: body.birthdate.month,
    day: body.birthdate.day
  }
  else{
    regData.birthdate = {
      year: "",
      month: "",
      day: ""
    };
  }
  if(body.delegate) regData.delegate = {
    name: body.delegate.name || null,
    ID_photo: body.delegate.ID_photo || null
  }
  if(body.prefecture && body.post_code) regData.address = {
    value: body.prefecture || null,
    postal_code: body.post_code || null,
    county: body.county || null,
    town: body.town || null,
    fandi: body.fandi || null,
    building_room: body.building_room || null
  }
  return regData
}

function updateAccountInfo (body, fid) {
  return new Promise(async (resolve, reject) => {
    const authInfo = {}
    if (body.email && body.email.length > 0) authInfo.email = body.email;
    if (body.nickname && body.nickname.length > 0) authInfo.displayName = body.nickname;
    const userRecord = await admin.auth().updateUser(fid, authInfo)
      .catch(error => {
        console.error(error)
        reject(error)
      })
    
    const regData = createRegData(body)
    regData.updated_at = new Date().getTime();
    const userData = await admin.auth().getUser(fid);
    regData.email = userData.email;
    regData.premium = false
    const userRef = db.collection('users').doc(fid)
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
        reject(err)
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

function getUserProfile (uid) {
  return new Promise(async (resolve, reject) => {
    const result = {}
    var fid = uid;
    const userRefs = db.collection('users').where('uid', '==', uid);
    const userDatas = await userRefs.get();
    if(!userDatas.empty){
      console.log("userDatas", userDatas);
      var k = 0;
      userDatas.forEach(async (item) => {
        userData = item.data();
        fid = userData.fid;
        console.log("fid", fid, k, userDatas._size);
        result.account = userData;
        result.isExists = item.exists;
        const configRef = db.collection('config').doc(fid)
        const pointRef = db.collection('points').doc(fid)
        const bankRef = db.collection('banks').doc(fid)
        await configRef.get()
          .then((doc) => {
            if (doc.exists) {
              const data = doc.data()
              result.config = data;
            } else {
              result.config = {}
            }
          })
          .catch(err => {
            result.error = err;
          })
        await pointRef.get()
          .then((doc) => {
            if (doc.exists) {
              const data = doc.data()
              result.pointdata = data
            } else {
              result.pointdata = {}
            }
        })
        .catch(err => {
          result.error = err;
        })
      
        
        await bankRef.get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data()
            result.bank = data
          }
          result.isExists = doc.exists
        })
        .catch(err => {
          result.error = err;
        })
        if(k === userDatas._size - 1){
          console.log("fid", fid, k, result);
  
          resolve(result);
        }
        k++;
      })
    }
    else{
      resolve(result);
    }
  })
 
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
          if (userData.sns_info) data.sns_info = JSON.parse(JSON.stringify(userData.sns_info))
          
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

function getCreatorList() {
  return new Promise(async (resolve, reject) => {
    var creatorList = [];
    var userRef = db.collection('users');
    userRef = userRef.where('auth_level', '==', 2);
    const snapshot = await userRef.get();
    console.log("creatorsnapshot", snapshot)
    const snapshotSize = snapshot._size;
    if(snapshot.empty){
      resolve({
        creatorList: [],
        result: true
      })
    }
    else{
      var k = 0;
      snapshot.forEach((item) => {
        var creatorData = item.data();
        creatorData.userID = item.id;
        creatorList.push(creatorData);
        if(k === snapshotSize - 1){
          resolve({
            creatorList: creatorList,
            result: true
          })
        }
        k++;
      })
    }
  })
}

async function postContactMail ({ email, agent_id }, {uid, createTime}) {
  // return new Promise(async (resolve, reject) => {
    const d = new Date(createTime);
    const createTimeStamp = d.getTime() / 1000;
    let url = '';
    if(typeof agent_id !== 'undefined' && agent_id !== null){
      url = `https://gotip-dev.firebaseapp.com/registration?code=${uid}&agent=${agent_id}`;
    }
    else{
      url = `https://gotip-dev.firebaseapp.com/registration?code=${uid}&time=${createTimeStamp}`;
    }
    const mailBody =
      `【GoTip 会員登録にお申し込みいただき、誠にありがとうございます。】
        下記ページより本登録のお手続きをお願いいたします。
    
        本登録が完了いたしましたら、ご登録メールアドレス宛に本登録完了のお知らせをメールにてお送りいたします。
    
        ■会員登録
        24時間以内に以下URLより登録を完了させてください。
        ※24時間を過ぎた場合には無効になり、ますのでご注意ください。
        その場合はお手数ですがご登録を最初からやり直して頂きますようお願い致します。
        ${url}
    
        お問い合わせ
    
    
        ※このメールは、送信専用メールアドレスから配信されています。ご返信いただいてもお答えできませんので、ご了承ください。
        ※このメールに心当たりがない方、またはご不明な点がある方はGOTIP問い合わせ窓口にお問い合わせください。
        ※個人情報の取扱いについては個人情報保護方針をご覧下さい。
      `
    const mailConfig = {
      from: 'noreply@gotip-dev.firebaseapp.com',
      to: email,
      subject: `【GoTip 会員登録にお申し込みいただき、誠にありがとうございます。】`,
      text: mailBody
    }
    const mailTransport = nodemailer.createTransport({
      service: "gmail",
      secure: false,
      port: 25,
      auth: {
        user: 'chloe.jong827@gmail.com',
        pass: 'xqdmaangadbhfkce' //'chloejong922'
      }, tls: {
        rejectUnauthorized: false
      }
    })
  
    const result = await mailTransport.sendMail(mailConfig)
    .then(sendResult => {
      console.log(sendResult)
      return true
    })
    .catch(err => {
      console.error(err)
      return false
    })
    return result;
  // })
}


function deleteAccount (uid) {
  return new Promise(async (resolve, reject) => {
    const result = {}
    const userRef = db.collection('users').doc(uid).delete();
    const bankRef = db.collection('banks').doc(uid).delete();
    const pointRef = db.collection('points').doc(uid).delete();
    if(userRef && bankRef && pointRef){
      const deleteAccount = await admin.auth().deleteUser(uid)
      .then(() => {
        resolve({
          result: true
        })
      })
      .catch((err) => {
        reject({
          result: false,
          error: "auth"
        })
      })
    }
    else{
      reject({
        result: false,
        error: "db"
      })
    }    
  })
}

function logOut(body){
  return new Promise (async (resolve, reject) => {
    await db.collection('users').doc(body.uid).get()
    .then(async (doc) => {
      if(doc.exists){
        console.log("loggedin===", body.uid);
        await db.collection('users').doc(body.uid).update({loggedin: false}, {merge: true})
        .then(() => {
          resolve({
            result: true
          })
        })
        .catch((err) => {
          resolve({
            result: false,
            error: err
          })
        })
      }
      else{
        reject({
          result: false,
          error: 'there is no doc'
        })
      }
    })
  })
}