const express = require("express")
// eslint-disable-next-line import/no-named-default
const auth = require("./access")
const invitation = require("./invitation")
const role = require("./role")

const apiKey = require("../../../lib/auth/apiKey")
const bearer = require("../../../lib/auth/bearer")

const router = express.Router()

router.get("/", (req, res) => res.status(200).json({ error: false, message: "Skeleton-I : Tell me what you need" }))

/*-------------------------------------------------------------------------*/
// Below all APIs are public APIs protected by api-key
router.use("/", apiKey)
router.use("/", bearer)
/*-------------------------------------------------------------------------*/

router.use("/auth", auth)
router.use("/invitation", invitation) // All invitation related route (without acceptance route)
router.use("/role", role) // All invitation related route (without acceptance route)


module.exports = router
