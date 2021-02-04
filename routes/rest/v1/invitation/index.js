// import
const express = require("express")
const schema = require("./schema")
const { RoleCode } = require("../../../../lib/helper/declaration")
const { validator, ValidationSource } = require("../../../../lib/helper/validation")
const { checkInRoles } = require("../../../../lib/helper/role")
const { signupInvitationAcceptance } = require("./accept")

const { signup } = require("./send")
const { list } = require("./invitation")
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
const hasSignUpInvitationSchema = validator(schema.signupInvitation)
const hasSignUpAcceptanceSchema = validator(schema.acceptInvitation)

//----------------------------------------------------
//                                      R O U T E S
//----------------------------------------------------
const router = express.Router()

// Test Route is reachable or not
router.get("/", (req, res) => res.status(200).json({ error: false, message: "Unauthorized Invitation API(s) are accessible : x-api-key accepted" }))

/*-------------------------------------------------------------------------*/
// Unauthenticated Routes - Acceptance Route
/*-------------------------------------------------------------------------*/

router.post("/acceptSignup", hasSignUpAcceptanceSchema, signupInvitationAcceptance)

/*-------------------------------------------------------------------------*/
// Authenticated routes - All type of Invitation
router.use(authenticated)
/*-------------------------------------------------------------------------*/

router.post("/signup", hasSignUpInvitationSchema, checkInRoles([RoleCode.ADMIN, RoleCode.SUPER]), hasRights("invitation"), signup) // Signup invitation
router.get("/list", checkInRoles([RoleCode.ADMIN, RoleCode.SUPER]), hasRights("invitation"), list) // Invitation list

// const auth = router
module.exports = router
