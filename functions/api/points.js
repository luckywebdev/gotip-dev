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
    case 'sendChip':
      await sendChip(req.body)
      .then((rst) => {
        console.log("result_api", rst)
        res.send(rst);
      })
      .catch(err => {
        console.log("result_api", err)
        res.send(err)
      })
    case 'convertPoints':
      await convertPoints(req.body)
      .then((rst) => {
        res.send(rst);
      })
      .catch(err => {
        console.log("result_api", err)
        res.send(err)
      })
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

function sendChip (chipDatas) {
  return new Promise (async (resolve, reject) => {
    const currentTime = new Date().getTime();
    let chipData = chipDatas;
    chipData.timestamp = currentTime;
    chipData.year = new Date().getFullYear();
    chipData.month = new Date().getMonth() + 1;
    chipData.date = new Date().getDate();
    const sendPointRef = db.collection('points').doc(chipData.sendID);
    const recPointRef = db.collection('points').doc(chipData.recID);
    console.log("chipData===>", chipData);
    db.runTransaction(async (t) => {
      const sendDoc = await t.get(sendPointRef);
      if(sendDoc.exists){
        let sendPointData = sendDoc.data();
        let recPointData = {data: {normal: {value: 0}, subscription: {value: 0}}, saleData: {normal: {value: 0}, subscription: {value: 0}}, log: []};
        const recDoc = await t.get(recPointRef);
        if(recDoc.exists){
          recPointData = recDoc.data();
        }
        chipData.direction = 0;
        sendPointData.log.push(chipData);
        chipData.direction = 1;
        recPointData.log.push(chipData);
        sendPointData.data[chipData.chipType].value -= chipData.chipAmount;
        console.log("sendPoint1====>", sendPointData.data[chipData.chipType]);
        if(typeof recPointData.saleData[chipData.chipType].value !== 'undefined'){
          recPointData.saleData[chipData.chipType].value += chipData.chipAmount;
          console.log("sendPoint2====>", recPointData.saleData[chipData.chipType].value);
        }
        else{
          recPointData.saleData[chipData.chipType].value = chipData.chipAmount;
          console.log("sendPoint3====>", recPointData.saleData[chipData.chipType].value);
        }
        console.log("sendPoint4====>", sendPointData);
        t.update(sendPointRef, sendPointData);
        t.update(recPointRef, recPointData);
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
        err
      });
    })
  })

}

function convertPoints(body) {
  return new Promise (async (resolve, reject) => {
    const pointRef = db.collection('points').doc(body.uid);
    console.log("pointConvertData", body);
    db.runTransaction(async (t) => {
      const pointData = await t.get(pointRef);
      if(pointData.exists){
        let normalPoint = pointData.data();
        if(normalPoint.data.normal.value)
          normalPoint.data.normal.value += body.points;
        else
          normalPoint.data.normal.value = body.points;
        normalPoint.saleData.normal.value = 0;
        normalPoint.saleData.subscription.value = 0;
        t.update(pointRef, normalPoint);
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
        err
      });
    })
  })
}
