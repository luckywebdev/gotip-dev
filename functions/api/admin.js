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
        const rest = await getNotice()
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
    case 'upload' : 
        const imageUrl = await uploadImage(req.body)
        res.send({
            result: imageUrl ? true : false,
            uploadedUrl: imageUrl
        })
        break;
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
                console.log("newData====>", body.content);

                newData.content = body.content;
                const id = ulid();
                newData.id = id;
                newData.created_at = currentTime;
                console.log("newData=====1====>", newData);
                noticeData.push(newData);
                t.update(noticeRef, {list: noticeData});
            }
        })
        .then(() => {
            console.log("newData=====2====>");
            resolve({
                result: true
            })
        })
        .catch(err => {
            console.log("newData=====3====>", err);

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
                console.log("noticeData====1=====>", noticeData);
                resolve({
                    result: true,
                    noticeData: noticeData
                })
            }
            else{
                console.log("noticeData====2=====>");
                resolve({
                    result: true,
                    noticeData: []
                })
            }
        })
        .catch(err => {
            console.log("noticeData====3=====>", err);

            reject({
                result: false,
                noticeData: [],
                error: err
            })
        })
    })
}