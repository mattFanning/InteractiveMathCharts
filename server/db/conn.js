const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
 
var _db;
const dbName = "interactive_math_charts"
 
module.exports = {
  connectToServer: async (callback) => {
    await client.connect();
    // Verify we got a good "db" object
    console.log("Connected successfully to server");
    _db = client.db(dbName);
    
    const collections = await _db.collections();
    const colNames = collections.map(function(c){return c.collectionName});
    console.log(`Collections: ${colNames}`);

    console.log("Successfully connected to MongoDB");
  },
 
  getDb: function () {
    return _db;
  },
};