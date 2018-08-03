const mongoose = require("mongoose");

const Dishes = require("./models/dishes");


const url = "mongodb://localhost:27017/conFusion";
const connect = mongoose.connect(url);

connect.then((db) => {
	//const db=client.db("conFusion");
	console.log("Connected to database");

	return Dishes.create({
		name: "abc5",
		description: "def"
	})
.then((dish)=>{
		console.log(dish);
		
		return Dishes.findByIdAndUpdate(dish._id,{$set: {description: 'abc'}},
				{ 
					new: true
				}
		).exec();	
		
		})
	.then((dish)=>{
		console.log(dish);
		dish.comments.push({
			rating: 5,
			comment: "Good",
			author: "me"
		});
		return dish.save();
	}).then((dish)=> {
		console.log(dish);
		return mongoose.connection.db.dropCollection('dishes');
	
	}).then(()=>{
		return mongoose.connection.close();
	}).catch((err)=>{
		console.log(err);
	});
});



