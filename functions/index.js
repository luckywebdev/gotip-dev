const functions = require('firebase-functions');
functions.logger.log("example", {a:1, b:2, c:"33", d:{e:4}});

const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

const serviceAccount = require("./gotip-dev-firebase-adminsdk.json");
const profiles = functions.config()
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    apiKey: profiles.dev.apikey,
    authDomain: profiles.dev.domain,
    projectId: profiles.dev.project_id,
    databaseURL: profiles.database_url,
    storageBucket: "gotip-dev.appspot.com"
})

const db = admin.firestore()


const app = express()
app.use((req, res, next) => {
  console.log(`Function started on request URL:${ req.path }`)
  next()
});
app.use(cors({ origin: '*' }));

const router = express.Router()
router.post(
  '/user/:action',
  require('./api/user').bind(null, admin, db)
)
router.get(
  '/user/:action/:userId',
  require('./api/user').bind(null, admin, db)
)
router.get(
  '/user/:action',
  require('./api/user').bind(null, admin, db)
)
router.post(
  '/agent/:action',
  require('./api/agent').bind(null, admin, db)
)
router.get(
  '/agent/:action/:agentId',
  require('./api/agent').bind(null, admin, db)
)
router.post(
  '/admin/:action',
  require('./api/admin').bind(null, admin, db)
)
router.get(
  '/admin/:action/:userId',
  require('./api/admin').bind(null, admin, db)
)
router.get(
  '/points/:action',
  require('./api/points').bind(null, admin, db)
)
router.post(
  '/points/:action/:type',
  require('./api/points').bind(null, admin, db)
)
router.post(
  '/points/:action',
  require('./api/points').bind(null, admin, db)
)
router.post(
  '/upload/:type',
  require('./api/upload').bind(null, admin, db)
)
router.get(
  '/download/:type/:id',
  require('./api/download').bind(null, admin, db)
)
router.all(
  '/info/:action',
  require('./api/newInformation').bind(null, admin, db)
)
router.all(
  '/channel/:action',
  require('./api/channel').bind(null, admin, db)
)
router.post(
  '/mail/:action',
  require('./api/mail').bind(null, admin, db)
)
app.use('/api', router)

module.exports.api = functions.https.onRequest(app)