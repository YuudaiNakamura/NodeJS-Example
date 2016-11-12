// grab the mongoose module
var mongoose = require('mongoose');

var item_data_schema = mongoose.Schema({
	x_pos:  Number,
	y_pos:  Number,
	itemID: String
});

module.exports = mongoose.model('ImageItemData', item_data_schema);

var imagedataSchema = mongoose.Schema({
	stateProcessed:     {type: Boolean, default: false},
	image_urls:         [],
	page_urls:          [],
	store_url:          String,
	checksum:           String,
	image_width:        Number,
	image_height:       Number,
	image_size:         Number,
	image_created_date: Date,
	item_data: 			[item_data_schema],
	format:             String
});
// define our ImageData model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('ImageData', imagedataSchema);
