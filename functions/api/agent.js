const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport');
const profiles = require('firebase-functions').config()
const { ulid } = require('ulid')


let admin
let db
module.exports = async function (adminRef, dbRef, req, res) {
  admin = adminRef
  db = dbRef

  console.log(req.query, req.params, req.path, req.body)
  switch (req.params.action) {
    case 'check' :
      const chks = await checkAgent()
      .then((result) => {
        console.log("checkagent", result);
        if(result.result){
          res.send({ result: true })
        }
      })
      .catch((err) => {
        res.send(err);
      })
      break;
    case 'register' :
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
    case 'updateStatus' :
      updateStatus(req.body.uid, req.body.agentID, req.body.currentStatus, req.body.statusCode)
      .then((result) => {
        console.log("approve_status", result);
        if(result){
          res.send({ result: true })
        }
      })
      .catch((err) => {
        res.send(err);
      })
      break;
    case 'getChild':
      const types = req.body.type;
      let childs = {};
      for(var k in types){
        await getChildAgent(req.body.uid, types[k])
        .then((result) => {
          if(result.err === null){
            childs[types[k]] = result
          }
        })
        .catch((err) => {
          res.send(err);
        })
      }
      console.log("getChild", childs)

      res.send({
        childs,
        err: null,
        result: true
      })
      break
    case 'upload' : 
      const imageUrl = await uploadImage(req.body)
      res.send({
        result: imageUrl ? true : false,
        uploadedUrl: imageUrl
      })
      break;
    case 'sendMessage' : 
      var results = await postInviteMail(req.body);
      if(results){
        res.send({
          result: true,
        })
      }
      else{
        res.send({
          result: results,
        })
      }
      break;
    case 'holdMessage' : 
      var results = await postHoldMail(req.body);
      if(results){
        res.send({
          result: true,
        })
      }
      else{
        res.send({
          result: results,
        })
      }
      break;
    default:
      res.end()
  }
}

function createAccount (body) {
  return new Promise(async (resolve, reject) => {
    const { email, password, phoneNumber, agentName, uid } = body
    if (email && password) {
      const userInformation = {
        uid: uid,
        email: email,
        emailVerified: false,
        password: password,
        displayName: agentName,
        disabled: true
      }
      const userData = await admin.auth().getUser(uid)
      .then((userRecord) => {
        resolve({
          result: true,
          uid: userRecord.uid,
          createTime: userRecord.metadata.creationTime,
          lastSignInTime: userRecord.metadata.lastSignInTime
        })
      })
      .catch(err => {
        if(err.code === 'auth/user-not-found'){
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
  })
}

function updateStatus (uid, agentID, currentStatus, statusCode) {
  return new Promise(async (resolve, reject) => {
    const types = ["applications", "approved", "holds", "refused"];
    const userRef = db.collection('users').doc(agentID);
    const oldRef = db.collection('master').doc(types[currentStatus]);
    const newRef = db.collection('master').doc(types[statusCode]);
    if(uid.length > 6 || uid === "100000"){
      db.runTransaction(async (t) => {
        await t.get(userRef)
        const oldMaster = await t.get(oldRef);

        if(oldMaster.exists){
          if(currentStatus !== statusCode){
            let oldData = oldMaster.data().list;
            let oldDataIndex = oldData.findIndex(item => item.agentID === agentID);
            let oldItem = oldData[oldDataIndex];
            oldItem.approval_status = statusCode;
            const newMaster = await t.get(newRef);
            if(newMaster.exists){
              let newData = newMaster.data().list;
              newData = [...newData, oldItem];
              t.update(newRef, {list: newData})
            }
    
            oldData.splice(oldDataIndex, 1);
            t.update(oldRef, {list: oldData})
            t.update(userRef, {approval_status: statusCode, approval_status_p: 1, updated_at: new Date().getTime()})
  
          }
        }
      })
      .then(() => {
        if(statusCode === 1){
          admin.auth().updateUser(agentID, {
            disabled: false
          })
          .then((userRecord) =>{
            resolve({
              result: true,
              uid: userRecord.uid,
              createTime: userRecord.metadata.creationTime,
              lastSignInTime: userRecord.metadata.lastSignInTime
            })
          })
        }
        else{
          resolve({
            result: true,
            uid: uid,
          })
        }
    
      }).catch((err) => {
        reject(err)
      })
    }
    else{
      db.runTransaction(async (t) => {
        const oldMaster = await t.get(oldRef);
        if(oldMaster.exists){
          if(currentStatus !== statusCode){
            let oldData = oldMaster.data().list;
            let oldDataIndex = oldData.findIndex(item => item.agentID === agentID);
            if(statusCode !== 1){
              let oldItem = oldData[oldDataIndex];
              oldItem.approval_status = statusCode;
              const newMaster = await t.get(newRef);
              if(newMaster.exists){
                let newData = newMaster.data().list;
                newData = [...newData, oldItem];
                t.update(newRef, {list: newData})
              }      
              oldData.splice(oldDataIndex, 1);
              t.update(oldRef, {list: oldData})
              t.update(userRef, {approval_status: statusCode, approval_status_p: 0, updated_at: new Date().getTime()})
            }
            else{
              oldData[oldDataIndex].approval_status = statusCode;
              t.update(oldRef, {list: oldData})
            }
          }
        }
      })
      .then(() => {
        resolve({
          result: true,
          uid: uid,
        })
      }).catch((err) => {
        reject(err)
      })
    }

  })
}

function checkAgent() {
  return new Promise(async(resolve, reject) => {
    try{
      const userDB = await db.collection('master').doc("applications").get()
      .then(async (doc) => {
        if(doc.exists){
          const userData = doc.data().list;
          userData.forEach(async (item) => {
            const currentTime = new Date().getTime();
            const twoDayTime = 60 * 60 * 48 * 1000;
            const agentRef = await db.collection('users').doc(item.agentID).get();
            const agentData = agentRef.data();

            if((item.parentAgentID === "100000" && item.approval_status === 0) || (item.parentAgentID !== "100000" && item.approval_status === 1) || (item.parentAgentID !== "100000" && agentData.approval_status_p === 1)){
              if(currentTime - item.created_at > twoDayTime){
                updateStatus("100000", item.agentID, 0, 1);
              }
            }
          })
        }
        resolve({
          result: true
        })
      })
    }
    catch(err){
      console.log("checkAgent_Err", err);
      reject({
        result: false,
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
    regData.premium = false;
    regData.created_at = new Date().getTime();
    regData.approval_status_p = body.approvalStatusP;
    const bankData = {
      bank_code: body.bankCode || null,
      branch_code: body.branchCode || null,
      account_number: body.bankAccountNumber || null,
      account_holder: body.bankAccountName || null,
      account_type: body.bankAccountType || null
    }
    const agentData = [{
        agentID: body.uid,
        parentAgentID: body.parentAgentID,
        agentName: body.agentName,
        approval_status: 0,
        agentLevel: body.agentLevel,
        created_at: new Date().getTime()
    }]
    const masterRef = db.collection('master').doc('applications')
    const holdsRef = db.collection('master').doc('holds')
    const userRef = db.collection('users').doc(uid)
    const pointRef = db.collection('points').doc(uid)
    const bankRef = db.collection('banks').doc(uid)
    db.runTransaction(async (t) => {
      await t.get(userRef)
      const masterDoc = await t.get(masterRef)
      const holdMaster = await t.get(holdsRef);
      if(masterDoc.exists){
          let masterData = masterDoc.data().list;
          masterData = [...masterData, ...agentData];
          let holdData = holdMaster.data().list;
          let holdDataIndex = holdData.findIndex(item => item.agentID === body.uid);

          holdData.splice(holdDataIndex, 1);
          t.update(holdsRef, {list: holdData})
          t.update(masterRef, {list: masterData})
      }
      else{
          t.set(masterRef, {list: agentData}, {mere:true})
      }
      t.set(userRef, regData, { merge: true })
      t.set(pointRef, { data: [], log: [] }, { merge: true })
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
    tel: `+81${ body.phoneNumber }` || null,
    // tel: `+81${ String(body.tel).replace(/^0/, '') }` || null,
    agent_id: body.agentID || null,
    userState: body.userState || 0,
    auth_level: body.auth_level || 3,
    approval_status: body.approvalStatus || 0,
    agentLevel: body.agentLevel || 1,
    allIDs: body.allIDs || "",
    parentAgentID: body.parentAgentID || ""
  }
  if (body.agentName) regData.name = {
    value: body.accountName || null,
    ruby: body.corporateName || null,
    nickname: body.agentName || null,
    agentNameKana: body.agentNameKana || null
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
  if(body.chargePersonName) regData.delegate = {
    name: body.chargePersonName || null,
    nameKana: body.chargePersonNameKana || null,
    tel: body.chargePersonTel || null
  }
  if(body.address && body.postalCode) regData.address = {
    value: body.address || null,
    postal_code: body.postalCode || null,
  }
  console.log("regData====>", regData);
  return regData
}

function getChildAgent (uid, type) {
  return new Promise(async (resolve, reject) => {
    const result = [];
    uid = uid.toString();
    console.log("type====>", type);
    if(uid.length > 6)
      uid = "100000";
    // const userRef = db.collection('users').doc(uid)
    let masterRef = db.collection('master').doc(type)
    masterRef.get()
    .then((doc) => {
      if(doc.exists) {
        const tempList = doc.data().list;
        const tempListLength = tempList.length - 1;
        let k = 0;
        if(tempListLength >= 0){
          const agentList = tempList.map(async (item) => {
            const temp = await db.collection('users').doc(item.agentID).get()
            .then(async (agentDoc) => {
              const agentData = agentDoc.data();
              agentData.preApprovalStatus = item.approval_status;
              const bankData = await db.collection('banks').doc(item.agentID).get();
              if(item.parentAgentID === "100000"){
                agentData.parentAgentName = "MDK";
              }
              else{
                const pAgentDoc = await db.collection('users').doc(item.parentAgentID).get()
                const pAgentData = pAgentDoc.data();
                agentData.parentAgentName = pAgentData.name.nickname;
              }
              // const resultElm = {...item, agentData}
              if(uid === '100000'){
                if(item.parentAgentID === '100000'){
                  result.push({...agentData, ...bankData.data()});
                }
                else{
                  if(type !== 'holds' || item.approval_status_p !== 0){
                    result.push({...agentData, ...bankData.data()});
                  }
                }
              }
              else{
                if(item.parentAgentID === uid){
                    result.push({...agentData, ...bankData.data()});
                  if(type === 'approved'){
                    const approvedData = tempList.filter(elem => elem.parentAgentID === item.agentID);
                    approvedData.map(async (elems) => {
                      await db.collection('users').doc(elems.agentID).get()
                      .then(async (agentDoc_1) => {
                        const agentData_1 = agentDoc_1.data();
                        agentData_1.preApprovalStatus = elems.approval_status;
                        const bankData_1 = await db.collection('banks').doc(elems.agentID).get();
                        result.push({...agentData_1, ...bankData_1.data()});
                      })
                    })
                    console.log("approvedData", approvedData);
                  }
                }
              }
              if(tempListLength === k){
                resolve({
                  result: result,
                  type,
                  err: null
                });
              }
            })
            k++;
          })
        }
        else{
          resolve({
            result: result,
            type,
            err: null
          });
        }
      }
    })
    .catch((err) => {
      reject({
        err: err
      }) 
    })
  })
}


function getCountChildAgent (uid) {
  return new Promise(async (resolve, reject) => {
    const result = [];
    uid = uid.toString();
    let approvedCount = 0;
    let applicationsCount = 0;
    let holdsCount = 0;
    let refusedCount = 0;
    let allApprovedCount = 0;
    let allApplicationsCount = 0;
    let allHoldsCount = 0;
    let allRefusedCount = 0;
   // const userRef = db.collection('users').doc(uid)
    let masterRef1 = db.collection('master').doc('applications')
    masterRef1.get()
    .then((doc) => {
      if(doc.exists) {
        const tempList = doc.data().list;
        allApplicationsCount = tempList.length;
        const agentList = tempList.map(async (item) => {
          if(item.parentAgentID === uid){
            applicationsCount++
          }
        })
      }
    })
    let masterRef2 = db.collection('master').doc('approved')
    masterRef2.get()
    .then((doc) => {
      if(doc.exists) {
        const tempList = doc.data().list;
        allApprovedCount = tempList.length;
        const agentList = tempList.map(async (item) => {
          if(item.parentAgentID === uid){
            approvedCount++
          }
        })
      }
    })
    let masterRef3 = db.collection('master').doc('holds')
    masterRef3.get()
    .then((doc) => {
      if(doc.exists) {
        const tempList = doc.data().list;
        allHoldsCount = tempList.length;
        const agentList = tempList.map(async (item) => {
          if(item.parentAgentID === uid){
            holdsCount++
          }
        })
      }
    })
    let masterRef4 = db.collection('master').doc('refused')
    masterRef4.get()
    .then((doc) => {
      if(doc.exists) {
        const tempList = doc.data().list;
        allRefusedCount = tempList.length;
        const agentList = tempList.map(async (item) => {
          if(item.parentAgentID === uid){
            refusedCount++
          }
        })
      }
    })
    resolve({
      approvedCount,
      applicationsCount,
      holdsCount,
      refusedCount,
      allApprovedCount: allApprovedCount,
      allApplicationsCount: allApplicationsCount,
      allHoldsCount: allHoldsCount,
      allRefusedCount: allRefusedCount,
    })
  })
}

function uploadImage(body) {
  const image = body.imgUrl;
  const id = body.agentID;
  console.log(image, id);
  const buffer = Buffer.from(image.replace('data:image/png;base64,', ''), 'base64')
  return new Promise(async (resolve, reject) => {
    let imageUrl = null
    if (image && buffer.byteLength < 10000000) { //10000000
      const bucket = admin.storage().bucket()
      // const id = ulid()
      
      const file = bucket.file(`image/qr_${ id }.png`)
      await file.save(buffer)
      await file.setMetadata({ contentType: 'image/png', cacheControl: 'public, max-age=31536000' })
      await file.getSignedUrl({
        action: 'read',
        expires: '12-31-2491'
      }).then(signedUrls => {
        imageUrl = signedUrls
        const qrRef = db.collection('images').doc("QRcode");
        db.runTransaction(async (t) => {
          await t.get(qrRef);
          t.set(qrRef, {[id]: imageUrl}, {merge: true});
        })
      })
    }
    resolve(imageUrl)
  })

}

async function postInviteMail (body) {
  // return new Promise(async (resolve, reject) => {
    const mailBody = body.content;
    const mailConfig = {
      from: 'noreply@gotip-dev.firebaseapp.com',
      to: body.receive,
      subject: `${body.title}`,
      text: mailBody,
      attachments: [{'filename': 'QRcode.png', 'path': body.imgUrl}]
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

async function postHoldMail (body) {
  // return new Promise(async (resolve, reject) => {
    let chargeName = "";
    let email = "";
    let parentAgentID = "100000";
    let agentLevel = 1;
    let imgUrl = "";
    const userRef = await db.collection('users').doc(body.agentID).get()
    .then((res) => {
      const userData = res.data();
      chargeName = userData.delegate.name;
      email = userData.email;
      parentAgentID = userData.parentAgentID;
      agentLevel = userData.agentLevel;
    })
    const qrRef = await db.collection('images').doc("QRcode").get()
    .then((res) => {
      const imgData = res.data();
      imgUrl = imgData[body.agentID][0];
    })
  
    const mailBody = `【Gotipから代理店申請についてお知らせです】

                      ${chargeName} 様の代理店登録ありがとうございます。
                      審査の結果 不備があるため 再度修正をして 以下のURLをクリックして修正をして再申請を
                      お願いいたします。

                      不備内容：
                      ${body.content}

                      https://gotip-dev.web.app/admin/agent/registration/${parentAgentID}${body.agentID}${agentLevel}`
    
    const mailConfig = {
      from: 'noreply@gotip-dev.firebaseapp.com',
      to: email,
      subject: `【Gotipから代理店申請についてお知らせです】`,
      text: mailBody,
      attachments: [{'filename': 'QRcode.png', 'path': imgUrl}]
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
