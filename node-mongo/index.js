const MongoClient = require('mongodb').MongoClient;
const assert = require("assert");
const dbOp= require('./operations');

const url= "mongodb://localhost:27017/conFusion";
const dbName="conFusion";


MongoClient.connect(url, (err, client)=>{

	assert.equal(err, null);
	console.log("Connected correctly to server");
	const db=client.db(dbName);
	dbOp.insertDocument(db, {name: "Vadonut", description: "test"}, "dishes", (result)=> {
		console.log("Inserted Document: \n", result.ops);

		dbOp.findDocuments(db, "dishes", (docs)=>{
			console.log("Found documents:\n ", docs);

			dbOp.updateDocument(db, {name: "Vadonut"}, {"description": "Updated test"}, "dishes", (result)=>{
				console.log("Updated Document \n ", result.result);

				dbOp.findDocuments(db, "dishes", (docs)=>{
			console.log("Found documents:\n ", docs);

			db.dropCollection("dishes",(result)=>{
				console.log("Dropped collection: ",result);
				client.close();
			});
		});


			});
		})
	});
});