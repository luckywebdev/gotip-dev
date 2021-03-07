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
    case 'noticeCreate' :
        const result = await noticeCreate(req.body)
        .then(rest => {
            if(rest.result){
                res.send({
                    result: rest.result
                });
            }
            else{
                res.send({
                    result: false,
                    error: rest.error
                });
            }
        })
        .catch((err) => {
            res.send({
                result: err.result,
                errorMessage: err.error
            });
        })
        break;
    case 'noticeUpdate' :
        const rst = await noticeUpdate(req.body)
        .then(rest => {
            if(rest.result){
                res.send({
                    result: rest.result
                });
            }
            else{
                res.send({
                    result: false,
                    error: rest.error
                });
            }
        })
        .catch((err) => {
            res.send({
                result: err.result,
                error: err.error
            });
        })
        break;
    case 'getNotice' :
        const userList = await getNotice()
        .then((rest) => {
            if(rest.result){
                res.send({
                    result: rest.result,
                    noticeData: rest.noticeData
                });
            }
            else{
                res.send({
                    result: false,
                    noticeData: [],
                    error: rest.error
                });
            }
        })
        .catch(err => {
            res.send({
                noticeData: [],
                result: err.result,
                error: err.error
            });
        })
        break;
    case 'userSearch' :
        const rest = await userSearch(req.body)
        .then((rest) => {
            if(rest.result){
                res.send({
                    result: rest.result,
                    userList: rest.userList
                });
            }
            else{
                res.send({
                    result: false,
                    userList: [],
                    error: rest.error
                });
            }
        })
        .catch(err => {
            res.send({
                userList: [],
                result: err.result,
                error: err.error
            });
        })
        break;
    case 'deleteUser' :
        const del = await deleteUser(req.body)
        .then((rest) => {
            if(rest.result){
                res.send({
                    result: rest.result,
                });
            }
            else{
                res.send({
                    result: false,
                    error: rest.error
                });
            }
        })
        .catch(err => {
            res.send({
                result: err.result,
                error: err.error
            });
        })
        break;
    case 'creatorSearch' :
        await creatorSearch(req.body)
        .then((rest) => {
            console.log("creatorSearchResult===>", rest);
            if(rest.result){
                res.send({
                    result: rest.result,
                    creatorList: rest.creatorList
                });
            }
            else{
                res.send({
                    result: false,
                    creatorList: [],
                    error: rest.error
                });
            }
        })
        .catch(err => {
            res.send({
                creatorList: [],
                result: err.result,
                error: err.error
            });
        })
        break;
    case 'upload' : 
        const imageUrl = await uploadImage(req.body)
        res.send({
            result: imageUrl ? true : false,
            uploadedUrl: imageUrl
        })
        break;
    case 'updateUser':
        console.log("updateUSEr===", req.body);
        await admin.auth().verifyIdToken(req.body.idToken)
        .then(async (decoded) => {
            await updateUser(req.body)
            .then((rst) => {
                res.send(rst);
            })
            .catch(err => {
                res.send({
                    result: false,
                    error: err
                })
            })
        })
        .catch(err => {
            res.send({
                result: false,
                error: err
            })
        })
    default:
        res.end()
  }
}

function noticeCreate(body){
    return new Promise (async (resolve, reject) => {
        const currentTime = new Date().getTime();
        let newData = {};
        const noticeRef = db.collection('info').doc('mdkNotice')
        db.runTransaction(async (t) => {
            const noticeDoc = await t.get(noticeRef);
            if(noticeDoc.exists){
                let noticeData = noticeDoc.data().list;
                newData.content = body.content;
                const id = ulid();
                newData.id = id;
                newData.created_at = currentTime;
                noticeData.push(newData);
                t.update(noticeRef, {list: noticeData});
            }
        })
        .then(() => {
            resolve({
                result: true
            })
        })
        .catch(err => {
            reject({
                result: false,
                error: err
            })
        })
    })
}

function noticeUpdate(body){
    return new Promise (async (resolve, reject) => {
        const currentTime = new Date().getTime();
        const noticeRef = db.collection('info').doc('mdkNotice')
        db.runTransaction(async (t) => {
            const noticeDoc = await t.get(noticeRef);
            if(noticeDoc.exists){
                let noticeData = noticeDoc.data().list;
                const updateIndex = noticeData.findIndex(item => item.id === body.id);
                noticeData[updateIndex].content = body.content;
                noticeData[updateIndex].updated_at = currentTime;
                t.update(noticeRef, {list: noticeData});
            }
        })
        .then(() => {
            resolve({
                result: true
            })
        })
        .catch(err => {
            reject({
                err
            })
        })
    })
}

function getNotice() {
    return new Promise (async (resolve, reject) => {
        const currentTime = new Date().getTime();
        const noticeRef = db.collection('info').doc('mdkNotice');
        await noticeRef.get()
        .then((doc) => {
            if(doc.exists){
                const noticeData = doc.data().list;
                resolve({
                    result: true,
                    noticeData: noticeData
                })
            }
            else{
                resolve({
                    result: true,
                    noticeData: []
                })
            }
        })
        .catch(err => {
            reject({
                result: false,
                noticeData: [],
                error: err
            })
        })
    })
}

function userSearch(body) {
    return new Promise (async (resolve, reject) => {
        console.log("userList=====----1===>", body);
        var userRef = db.collection('users');
        if(body.startDate !== "" && body.endDate === ""){
           userRef = userRef.where('created_at', '>=', new Date(body.startDate).getTime().toString()).where('created_at', '<=', new Date().getTime().toString());
        }
        if(body.startDate === "" && body.endDate !== ""){
            userRef = userRef.where('created_at', '>=', new Date("2020-01-01").getTime().toString()).where('created_at', '<=', new Date(body.endDate).getTime().toString());
        }
        if(body.startDate !== "" && body.endDate !== ""){
            userRef = userRef.where('created_at', '>=', new Date(body.startDate).getTime().toString()).where('created_at', '<=', new Date(body.endDate).getTime().toString());
        }
        if(body.nickname !== ""){
            userRef = userRef.where('name.nickname', '==', body.nickname);
        }
        if(body.name !== ""){
            userRef = userRef.where('name.value', '==', body.name);
        }
        if(body.agentID !== ""){
            userRef = userRef.where('agent_id', '==', body.agentID);
        }
        if(body.agentName !== ""){
            userRef = userRef.where('agent_name', '==', body.agentName);
        }
        if(body.userID !== "") {
            userRef = userRef.where('uid', '==', body.uid);
        }
        if(body.creatorChk === true){
            userRef = userRef.where('auth_level', '==', 2);
        }
        if(body.fanChk === true){
            userRef = userRef.where('auth_level', '==', 1);
        }
        if(body.deletedChk === true){
            userRef = userRef.where('auth_level', '==', 0);
        }
        const snapshot = await userRef.get();
        if(snapshot.empty){
            console.log("userList=====0===>", snapshot);
            resolve({
                result: true,
                userList: []
            })
        }
        else{
            const userList = [];
            snapshot.forEach(item => {
                var userRst = item.data();
                userRst.userID = item.id;
                if(userRst.auth_level !== 4 && userRst.auth_level !== 3){
                    if(body.userID !== ""){
                        if(body.userID === item.id){
                            console.log("userListID--", item.id)
                            userList.push(userRst);
                        }
                    }
                    else{
                        userList.push(userRst);
                    }
                }
            })
            console.log("userList=====1===>", userList);
            resolve({
                result: true,
                userList: userList
            })
        }
    })
}

function deleteUser (body) {
    return new Promise(async (resolve, reject) => {
        const idArr = body.uidArray;
        console.log("id", idArr);
        const idArrLen = idArr.length;
        idArr.forEach((item, index) => {
            const userRef = db.collection('users').doc(item);
            db.runTransaction(async (t) => {
                const userDoc = await t.get(userRef)
                if(userDoc.exists){
                    let userData = userDoc.data();
                    userData.auth_level = 0;
                    t.set(userRef, userData, { merge: true })
                }
            })
            .then(async () => {
                const userAccount = await admin.auth().getUser(item)
                .then(async (result) => {
                    const deleteAccount = await admin.auth().deleteUser(item)
                    .then(() => {
                        if(index === idArrLen - 1){
                            resolve({
                                result: true
                            })
                        }
                    })
                    .catch((err) => {
                        console.log("delete_error", err);
                        if(index === idArrLen - 1){
                            reject({
                                result: false,
                                error: "auth"
                            })
                        }
                    })
                })
                .catch(err => {
                    if(index === idArrLen - 1){
                        resolve({
                            result: true
                        })
                    }
                })
            })
        })
    })
}

function creatorSearch(body) {
    return new Promise (async (resolve, reject) => {
        const creatorList = [];
        let agentName = "MDK";
        if(Number(body.agentID) !== 100000){
            var agentRef = await db.collection('users').doc(body.agentID).get();
            if(agentRef.exists){
                const agentData = agentRef.data();
                agentName = agentData.name.nickname;
            }
        }
        var userRef_0 = db.collection('users');
        userRef_0 = userRef_0.where('agent_id', '==', body.agentID.toString());
        userRef_0 = userRef_0.where('auth_level', '==', 2);
        const snapshot_0 = await userRef_0.get();
        if(!snapshot_0.empty){
            snapshot_0.forEach((item) => {
                var creatorRst_0 = item.data();
                creatorRst_0.userID = item.id;
                creatorRst_0.agentName = agentName;
                creatorList.push(creatorRst_0);
            })
        }
    
        await getChildAgent(body.agentID, 'approved')
        .then(async (res) => {
            const agentAcount = res.result.length;
            let k = 0;
            if(agentAcount > 0){
                res.result.forEach(async (elem) => {
                    var userRef = db.collection('users');
                    userRef = userRef.where('agent_id', '==', elem.agent_id);
                    userRef = userRef.where('auth_level', '==', 2);
                    const snapshot = await userRef.get();
                    let i = 0;
                    const snapshotSize = snapshot._size;
                    if(!snapshot.empty){
                        console.log('size::', snapshot._size);
                        snapshot.forEach((item) => {
                            var creatorRst = item.data();
                            creatorRst.userID = item.id;
                            creatorRst.agentName = elem.name.nickname;
                            creatorList.push(creatorRst);
                            if(k === agentAcount - 1 && i === snapshotSize - 1){
                                resolve({
                                    result: true,
                                    creatorList
                                });
                            }
                            i++;
                        })
                    }
                    else{
                        if(k === agentAcount - 1){
                            resolve({
                                result: true,
                                creatorList
                            });
                        }
                    }
                    k++;
                })
            }
            else{
                resolve({
                    result: true,
                    creatorList
                });
            }
        })
        .catch(err => {
            console.log("error_search", err);
            resolve({
                result: false,
                creatorList: [],
                error: err
            });
        })
    })
}

function getChildAgent (uid, type) {
    return new Promise(async (resolve, reject) => {
      const result = [];
      uid = uid.toString();
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

function updateUser (body) {
    return new Promise (async (resolve, reject) => {
        const regData = createRegData(body)
        regData.updated_at = new Date().getTime();
        const userData = await admin.auth().getUser(body.fid);
        regData.email = userData.email;
        regData.premium = false
        const bankData = {
            bank_code: body.bank_code || null,
            branch_code: body.branch_code || null,
            account_type: body.account_type || null,
            account_number: body.account_number || null,
            account_holder: body.account_holder || null
        }
        const userRef = db.collection('users').doc(body.fid);
        const bankRef = db.collection('banks').doc(body.fid);
        db.runTransaction(async (t) => {
            await t.get(userRef)
            await t.get(bankRef);
            t.update(userRef, regData)
            t.update(bankRef, bankData);
        })
        .then(() => {
            resolve({
                result: true
            })
        }).catch((err) => {
            reject(err)
        })
    })
}
  
function createRegData (body) {
    const regData = {
      sex: body.sex || null,
      uid: body.uid || null,
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
    if(body.address && body.address.prefecture) regData.address = {
      value: body.address.prefecture || null,
      postal_code: bod.addressy.post_code || null,
      county: body.address.county || null,
      town: body.address.town || null,
      fandi: body.address.fandi || null,
      building_room: body.address.building_room || null
    }
    return regData
  }
  
  