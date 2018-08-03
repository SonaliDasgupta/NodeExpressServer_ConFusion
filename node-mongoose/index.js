const mongoose = require("mongoose");

const Dishes = require("./models/dishes");

const url = "mongodb://localhost:27017/conFusion";
const connect = mongoose.connect(url, {
	useMongoClient: true
});

connect.then((db) => {
	//const db=client.db("conFusion");
	console.log("Connected to database");

	var newDish = Dishes({
		name: "abc5",
		description: "def"
	});

	newDish.save().then((dish)=>{
		console.log(dish);
		return Dishes.find({}).exec();
	}).then((dishes)=>{
		console.log(dishes);

		return mongoose.connection.db.dropCollection('dishes');
	}).then(()=>{
		return mongoose.connection.close();
	}).catch((err)=>{
		console.log(err);
	});

});
