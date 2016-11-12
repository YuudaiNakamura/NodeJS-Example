// grab the mongoose module
var mongoose = require('mongoose');

var imagestatsSchema = mongoose.Schema({
	ImageID:        String,
	HoverImage:     Number,
	HoverItem:      Number,
	AddToCart:      Number 
});

module.exports = mongoose.model('ImageStatsData', imagestatsSchema);

var statsdataSchema = mongoose.Schema({
	PageURL:        String,
	date:           String,
	StatsInfo:      [imagestatsSchema] 
});
// define our StatsData model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('StatsData', statsdataSchema);
