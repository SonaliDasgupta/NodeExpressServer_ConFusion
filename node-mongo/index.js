const MongoClient = require('mongodb').MongoClient;
const assert = require("assert");
const dbOp= require('./operations');

const url= "mongodb://localhost:27017/conFusion";
const dbName="conFusion";


MongoClient.connect(url).then((client)=>{

	
	console.log("Connected correctly to server");
	const db=client.db(dbName);
	return dbOp.insertDocument(db, {name: "Vadonut", description: "test"}, "dishes").then((result)=> {
		console.log("Inserted Document: \n", result.ops);

		return dbOp.findDocuments(db, "dishes")
	})
		.then((docs)=>{
			console.log("Found documents:\n ", docs);

			return dbOp.updateDocument(db, {name: "Vadonut"}, {"description": "Updated test"}, "dishes");
		})
		.then((res)=>{

			return dbOp.findDocuments(db, "dishes");
		})
		.then((docs)=>{
			console.log("Found documents:\n ", docs);

			return db.dropCollection("dishes");}).then((result)=>{
				console.log("Dropped collection: ",result);
				return client.close();
			})
			.catch((err)=> console.log(err));
		
		})

			.catch((err)=> console.log(err)); 