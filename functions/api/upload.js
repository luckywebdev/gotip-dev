const { ulid } = require('ulid')

let admin
let db
module.exports = async function (adminRef, dbRef, req, res) {
  admin = adminRef
  db = dbRef

  switch (req.params.type) {
    case 'image' :
      const imageUrl = await uploadImage(req.body);
      res.send({
        result: imageUrl ? true : false,
        uploadedUrl: imageUrl
      });
      break;
    default:
      res.end()
  }
}

function uploadImage (body) {
  const image = body
  const fileType = body.fileType === "png" ? body.fileType : 'jpeg';
  const uid = body.uid;
  const imgType = body.imgType;
  const buffer = Buffer.from(image.dataURL.replace('data:image/' + fileType + ';base64,', ''), 'base64');
  console.log("buffer", buffer);
  return new Promise(async (resolve, reject) => {
    let imageUrl = null;
    if (image && buffer.byteLength < 10000000) { //10000000
      const bucket = admin.storage().bucket();
      const id = ulid();
      const file = bucket.file(`image/${ id }.${ fileType }`);
      const fileExisting = await file.exists();
      console.log("existing", fileExisting);
      if(fileExisting[0]){
        await file.delete().then(res => {
          console.log("delete", res);
        });
      }
      await file.save(buffer);
      await file.setMetadata({ contentType: 'image/*', cacheControl: 'public, max-age=31536000', firebaseStorageDownloadTokens: id });
      await file.getSignedUrl({
        action: 'read',
        expires: '12-31-2491'
      })
      .then(signedUrls => {
        imageUrl = signedUrls;
        admin.auth().verifyIdToken(body.idToken)
        .then(async (decoded) => {
          var uid = decoded.uid
          if (uid) {
            const userRef = db.collection('users').doc(uid);
            await userRef.get()
            .then(async (doc) => {
              if (doc.exists) {
                const data = doc.data();
                if(imgType === "cover"){
                  data.coverImgUrl = imageUrl[0];
                }
                else{
                  data.profileImgUrl = imageUrl[0];
                }
                return await userRef.set(data, { merge: true })
                .then((res) => {
                  return res;
                })
                .catch(err => {
                  console.error('Error at update profile image data.', err)
                  return false
                })
              }
              result.isExists = doc.exists
            })
          }
        })
      })
    }
    resolve(imageUrl);
  })
}
