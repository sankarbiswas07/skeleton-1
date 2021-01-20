// import config
const { mongoCred } = require("../config.js")

// pull all database initiative functions
const { mongo } = require("./mongoose")


// Trigger and initiate the databases
mongo(mongoCred)
