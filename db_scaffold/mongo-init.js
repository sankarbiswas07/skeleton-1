/* eslint-disable no-undef */
function seed(dbName, user, password) {
  db = db.getSiblingDB(dbName)
  // create user for a db
  //   db.createUser({
  //     user,
  //     pwd: password,
  //     roles: [{ role: "readWrite", db: dbName }]
  //   })

  db.createCollection("api_keys")
  db.createCollection("roles")

  db.api_keys.insert({
    metadata: "To be used by the xyz vendor",
    key: "GCMUDiuY5a7WvyUNt9n3QztToSHzK7Uj",
    version: 1,
    status: true,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  db.roles.insertMany([
    {
      code: "USER", status: true, createdAt: new Date(), updatedAt: new Date()
    },
    {
      code: "ADMIN", status: true, createdAt: new Date(), updatedAt: new Date()
    }
  ])
}

const dbName = "starter_project" // Same as .env

seed(`${dbName}`, `${dbName}-user`, `${dbName}-pass`)
// seed(`${dbName}-test`, `${dbName}-test-user`, `${dbName}-test-pass`)
