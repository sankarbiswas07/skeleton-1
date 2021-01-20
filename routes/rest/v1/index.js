const express = require("express")
// eslint-disable-next-line import/no-named-default
const auth = require("./access")

const apiKey = require("../../../lib/auth/apiKey")

const router = express.Router()

router.get("/", (req, res) => res.status(200).json({ error: false, message: "Skeleton-I : Tell me what you need" }))

/*-------------------------------------------------------------------------*/
// Below all APIs are public APIs protected by api-key
router.use("/", apiKey)
/*-------------------------------------------------------------------------*/

router.use("/auth", auth)

module.exports = router
