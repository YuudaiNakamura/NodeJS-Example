// grab the mongoose module
var mongoose = require('mongoose');

var usingJSSchema = mongoose.Schema({
	domain:         String,
	date:           String,
	JsCall:         Number,
	NullReturn:     Number,
	TrueReturn:     Number,
	ReturnItems:    Number
});
// define our ItemData model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('UsingJsData', usingJSSchema);
