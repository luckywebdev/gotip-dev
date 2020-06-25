let admin
let db
module.exports = async function (adminRef, dbRef, req, res) {
  admin = adminRef
  db = dbRef

  switch (req.params.type) {
    case 'image' :
      const imageData = req.params.id ? await selectImage(req.params.id) : ''
      res.writeHead(imageData ? 200 : 400, { 'Content-Type': 'image/png' })
      res.end(imageData)
      break
    default:
      res.end()
  }
}

function selectImage (id) {
  return new Promise(async (resolve, reject) => {
    let imageData = ''
    await db.collection('uploads').doc(id).get()
    .then(doc => {
      if (doc.exists) {
        const data = doc.data()
        if (data.type === 'image' && data.data) imageData = data.data
      }
    })
    resolve(imageData)
  })
}
