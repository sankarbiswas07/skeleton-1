/* eslint-disable no-undef */
function seed(dbName, user, password) {
  db = db.getSiblingDB(dbName)
  //-----------------------------------------------------------
  //                                      Create user for a db
  //-----------------------------------------------------------

  //   db.createUser({
  //     user,
  //     pwd: password,
  //     roles: [{ role: "readWrite", db: dbName }]
  //   })

  //-----------------------------------------------------------
  //                                    C L I E N T   K E Y S
  //-----------------------------------------------------------
  db.createCollection("api_keys")
  db.api_keys.insert({
    metadata: "To be used by the xyz vendor",
    key: "GCMUDiuY5a7WvyUNt9n3QztToSHzK7Uj",
    redirectUri: "https://www.google.com?q=sankar prasad biswas",
    version: 1,
    status: true,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  //-----------------------------------------------------------
  //                                       B A S E   R O L E S
  //-----------------------------------------------------------
  db.createCollection("roles")
  db.roles.insertMany([
    {
      code: "USER",
      isActive: true,
      rights: {
        POST: { role: false, invitation: false },
        PUT: { role: false, invitation: false },
        PATCH: { role: false, invitation: false },
        DELETE: { role: false, invitation: false },
        GET: { role: false, invitation: false },
      },

      createdBy: null,
      updatedBy: null,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      code: "ADMIN",
      isActive: true,
      rights: {
        POST: { role: true, invitation: true },
        PUT: { role: true, invitation: true },
        PATCH: { role: true, invitation: true },
        DELETE: { role: true, invitation: true },
        GET: { role: true, invitation: true },
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      code: "SUPER",
      isActive: true,
      rights: {
        POST: { role: true, invitation: true },
        PUT: { role: true, invitation: true },
        PATCH: { role: true, invitation: true },
        DELETE: { role: true, invitation: true },
        GET: { role: true, invitation: true },
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])

  const superRole = db.roles.findOne({ code: "SUPER" }, { _id: 1 })

  //-----------------------------------------------------------
  //                                    S U P E R    U S E R
  //-----------------------------------------------------------
  // Super user setup
  db.createCollection("users")
  db.users.insert({
    name: {
      first: "sankar",
      last: "prasad biswas"
    },
    email: "sankarbiswas07@gmail.com",
    phone: { countryCode: "91", number: "8961766682" },
    roles: [superRole._id],

    // nopass
    password: "$2b$10$/BsJ0dGT76NwZqRCEkSeTug02Joh65f9DK5gDTqyOijEqm1qqdBOa",
    isActive: true,

    createdAt: new Date(),
    updatedAt: new Date(),
  })

  const superUser = db.users.findOne({ roles: superRole._id }, { _id: 1 })
  // updated roles - createdBy, updatedBy & updatedAt
  db.roles.updateMany({}, { $set: { createdBy: superUser._id, updatedBy: superUser._id, updatedAt: new Date() } })
  db.users.updateMany({}, { $set: { createdBy: superUser._id, updatedBy: superUser._id, updatedAt: new Date() } })
}

const dbName = "starter_project" // Same as .env

seed(`${dbName}`, `${dbName}-user`, `${dbName}-pass`)
// seed(`${dbName}-test`, `${dbName}-test-user`, `${dbName}-test-pass`)
