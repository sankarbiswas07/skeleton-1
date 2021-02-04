// import
const express = require("express")
const { RoleCode } = require("../../../../lib/helper/declaration")
const { checkInRoles } = require("../../../../lib/helper/role")
const { rightCreate, list, update } = require("./role")
//----------------------------------------------------
//  A U T H E N T I C A T E D    M I D D L E W A R E
//----------------------------------------------------
const authenticated = require("../../../../lib/auth/authentication")

//----------------------------------------------------
//  A U T H O R I Z A T I O N    M I D D L E W A R E
//----------------------------------------------------
const { hasRights } = require("../../../../lib/auth/authorization")

//----------------------------------------------------
//               S C H E M A     M I D D L E W A R E
//----------------------------------------------------


//----------------------------------------------------
//                                      R O U T E S
//----------------------------------------------------
const router = express.Router()

// Test Route is reachable or not
router.get("/", (req, res) => res.status(200).json({ error: false, message: "Unauthorized ROLE API(s) are accessible : x-api-key accepted" }))

/*-------------------------------------------------------------------------*/
// Authenticated + authorization routes - All Role routes
router.use(authenticated, checkInRoles([RoleCode.ADMIN, RoleCode.SUPER]), hasRights("role"))
/*-------------------------------------------------------------------------*/

router.post("/right", rightCreate) // right add
router.get("/list", list) // role list
router.patch("/right", update) // role list

// const auth = router
module.exports = router
