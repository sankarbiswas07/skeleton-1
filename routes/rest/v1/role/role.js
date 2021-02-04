const asyncHandler = require("../../../../lib/core/asyncHandler")
const RoleRepo = require("../../../../database/mongoose/repositories/RoleRepo")
const { SuccessResponse, SuccessMsgResponse } = require("../../../../lib/core/apiResponse")

//------------------------------------------------
//                                        PRIVATE
//------------------------------------------------
// Nothing


module.exports = {

  /**
       *
       * @api {post} /v1/role/right 1.0 Create new Right
       * @apiDescription creating a right's type(rightName) associated with API methods (POST,PATCH,PUT,GET.DELETE) for all role with default access value(defaultPermission)
       * @apiName createNewRight
       * @apiGroup Role-Right
       * @apiVersion  1.0.0
       * @apiPermission Authenticated
       * @apiPermission Admin
       *
       * @apiHeader {String} x-user-id  User ID.
       * @apiHeader {String} x-api-key  Vendor ID.
       * @apiHeader {String} Authorization  Bearer Access token.
       *
       * @apiParam  {String} rightName
       * @apiParam  {Boolean} [defaultPermission=false]
       *
       * @apiSuccess (200) {json} name description
       *
       * @apiParamExample  {json} Request-Example:
        {
          "rightName": "blog",
          "defaultPermission": false
        }
       *
       * @apiSuccessExample {json} Success-Response:
        {
            "statusCode": "10000",
            "message": "Right created for all role"
        }
       *
       *
       */
  rightCreate: asyncHandler(async (req, res) => {
    const { rightName, defaultPermission } = req.body
    await RoleRepo.createRightsForAllRole(rightName, defaultPermission)
    return SuccessMsgResponse(res, "Right created for all role")
  }),

  /**
       *
       * @api {get} /v1/role/list 2.0 Fetch Roles & Rights
       * @apiDescription Fetch all roles with rights, (intention to create a table with check boxes according to right names and it's value)
       * @apiName fetchRoleRights
       * @apiGroup Role-Right
       * @apiVersion  1.0.0
       * @apiPermission Authenticated
       * @apiPermission Admin
       *
       * @apiHeader {String} x-user-id  User ID.
       * @apiHeader {String} x-api-key  Vendor ID.
       * @apiHeader {String} Authorization  Bearer Access token.
       *
       * @apiParam  {String} rightName rightName which will be maintain n code middleware
       * @apiParam  {Boolean} [defaultPermission=false]
       *
       * @apiSuccess (200) {json} name description
       *
       * @apiParamExample  {json} Request-Example:
       * {}
       *
       * @apiSuccessExample {json} Success-Response:
    {
        "statusCode": "10000",
        "message": "Role list",
        "data": [
            {
                "_id": "5ec023317f06787780f9e52a",
                "code": "USER",
                "isActive": true,
                "rights": {
                    "POST": {
                        "role": false,
                        "own": true,
                        "any": false
                    },
                    "PATCH": {
                        "role": false,
                        "own": true,
                        "any": false
                    },
                    "DELETE": {
                        "role": true,
                        "own": true,
                        "any": false
                    },
                    "PUT": {
                        "role": true,
                        "demo": true,
                        "own": true,
                        "any": false
                    },
                    "GET": {
                        "role": true,
                        "own": true,
                        "any": false
                    }
                },
                "createdAt": "2020-05-16T17:30:25.104Z",
                "updatedAt": "2020-06-11T16:47:05.520Z"
            },
            {
                "_id": "5ec023317f06787780f9e52b",
                "code": "ADMIN",
                "isActive": true,
                "rights": {
                    "POST": {
                        "role": true,
                        "own": true,
                        "any": false
                    },
                    "PATCH": {
                        "role": true,
                        "own": true,
                        "any": false
                    },
                    "DELETE": {
                        "role": true,
                        "own": true,
                        "any": false
                    },
                    "PUT": {
                        "role": true,
                        "demo": true,
                        "own": true,
                        "any": false
                    },
                    "GET": {
                        "role": true,
                        "own": true,
                        "any": false
                    }
                },
                "createdAt": "2020-05-16T17:30:25.104Z",
                "updatedAt": "2020-06-11T16:40:37.606Z"
            }
        ]
    }
       *
       *
       */
  list: asyncHandler(async (req, res) => {
    const roles = await RoleRepo.findAllRoleRights()
    return SuccessResponse(res, "Role list", roles)
  }),

  /**
       *
       * @api {patch} /v1/role/right 3.0 Update a role's rights
       * @apiDescription Update a Role's right of a API method (from table - checkbox) - validation pending
       * @apiName patchRolesRights
       * @apiGroup Role-Right
       * @apiVersion  1.0.0
       * @apiPermission Authenticated
       * @apiPermission Admin
       *
       * @apiHeader {String} x-user-id  User ID.
       * @apiHeader {String} x-api-key  Vendor ID.
       * @apiHeader {String} Authorization  Bearer Access token.
       *
       * @apiParam  {String} code enum=["ADMIN", "USER", "SUPER"]
       * @apiParam  {String} method enum=["POST", "PUT", "PATCH", "DELETE", "GET"]
       * @apiParam  {String} rightName
       * @apiParam  {Boolean} status
       *
       * @apiSuccess (200) {json} name description
       *
       * @apiParamExample  {json} Request-Example:
        *{
            "code": "ADMIN",
            "method": "POST",
            "rightName": "invitation",
            "status": true
        }
       * @apiSuccessExample {json} Success-Response:
       {
        "statusCode": "10000",
        "message": "Role right updated",
        "data": {
            "_id": "5ec023317f06787780f9e52b",
            "code": "ADMIN",
            "isActive": true,
            "rights": {
                "POST": {
                    "role": true,
                    "own": true,
                    "any": false,
                    "invitation": true
                },
                "PATCH": {
                    "role": true,
                    "own": true,
                    "any": false,
                    "invitation": false
                },
                "DELETE": {
                    "role": true,
                    "own": true,
                    "any": false,
                    "invitation": false
                },
                "PUT": {
                    "role": true,
                    "demo": true,
                    "own": true,
                    "any": false,
                    "invitation": false
                },
                "GET": {
                    "role": true,
                    "own": true,
                    "any": false,
                    "invitation": true
                }
            },
            "createdAt": "2020-05-16T17:30:25.104Z",
            "updatedAt": "2020-06-11T19:14:24.790Z"
        }
    }
       *
       *
       */
  update: asyncHandler(async (req, res) => {
    const {
      code, method, rightName, status
    } = req.body
    await RoleRepo.updateOneRight(code, method, rightName, status)
    // fetch updated data
    const updatedData = await RoleRepo.findByCodeOnly(code)
    return SuccessResponse(res, "Role right updated", updatedData)
  })
}
