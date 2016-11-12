// grab the mongoose module
var mongoose = require('mongoose');

var itemdataSchema = mongoose.Schema({
	name:           	String,
	refID:              String,
	description:        String,
	price: 				String, 
	link:               String,
	thumbnail:          String,
	store_name:         String,
	brand: 				String,
	hashtags:           String,
	store_path:         String 
});
// define our ItemData model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('ItemData', itemdataSchema);
