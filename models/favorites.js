const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('./users');
require('./dishes');





const favoriteSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'

	},

	dishes: [{type: mongoose.Schema.Types.ObjectId,
		ref: 'Dish'}]
});



var Favorites= mongoose.model("Favorites", favoriteSchema);
module.exports= Favorites;