const nodemailer = require('nodemailer')
const profiles = require('firebase-functions').config()


let admin
let db
module.exports = async function (adminRef, dbRef, req, res) {
  admin = adminRef
  db = dbRef

  console.log(req.query, req.params, req.path, req.body)
  switch (req.params.action) {
    case 'postContactMail':
      var result = await postContactMail(req.body)
      res.send({ result })
      break
    default:
      res.end()
  }
}


async function postContactMail ({ message, title, senderName, senderAddress }) {
  const mailBody =
`【Go-Tip.comお問い合わせフォーム】
${ senderName }様よりお問い合わせが届いております。

お名前： ${ senderName }

メールアドレス： ${ senderAddress }

お問い合わせ項目： ${ title }

お問い合わせ内容：
${ message }
`
  const mailConfig = {
    from: senderAddress,
    to: profiles.contact.address,
    subject: `【Go-Tip.comお問い合わせ】${ title }｟${ senderName }様より｠`,
    text: mailBody
  }
  const mailTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: profiles.contact.address,
      pass: profiles.contact.password
    }
  })

  console.info(`Received message : ${ mailBody }`)
  const result = await mailTransport.sendMail(mailConfig)
  .then(sendResult => {
    console.log(sendResult)
    return true
  })
  .catch(err => {
    console.error(err)
    return false
  })

  return result
}