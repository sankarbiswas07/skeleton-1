# Scaffold DB
Basically it's an migration file, where basic role and 1st admin user will be inserted alone with the database and it's primary collection to give your DB a head start without bothering that you have to make one admin user, give permission to DB and it's DB auth users.


# mongo shell

> mongo "mongodb://root:admin@localhost:27017/starter_project?authSource=admin"
> load("mongo-init.js")
> load("./db_scaffold/mongo-init.js")

# delete existing user from mongo shell, issue commands one by one

> use starter_project-test
> db.dropUser("starter_project-test-user", {w: "majority", wtimeout: 5000})

> use starter_project
> db.dropUser("starter_project-user", {w: "majority", wtimeout: 5000})