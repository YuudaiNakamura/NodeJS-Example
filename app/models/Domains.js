// grab the mongoose module
var mongoose = require('mongoose');

var domainsSchema = mongoose.Schema({
	domain_name:         [String]
});
// define our ItemData model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Domains', domainsSchema);
