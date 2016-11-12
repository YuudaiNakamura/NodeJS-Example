var Mixpanel = require('mixpanel');

var mixpanel = Mixpanel.init('63c11c3f319e4af6f9a16bc726009479');


var mongoose = require('mongoose');
var express = require('express');
var request = require('request');
var fs = require('fs');
var crypto = require('crypto');
var moment = require('moment');

var ImageDataModel = require('./models/ImageData');
var ItemDataModel = require('./models/ItemData');
var StatsDataModel = require('./models/StatsData');
var DomainModel = require('./models/Domains');
var UsingJsDataModel = require('./models/UsingJsData');



var DOWNLOAD_DIR_PATH = "public/assets/download/";
var ITEM_THUMBNAIL_PATH = DOWNLOAD_DIR_PATH + "ItemThumbnails/";


var download = function(uri, filename, callback){
	
	request.head(uri, function(err, res, body){
		console.log('content-type:', res.headers['content-type']);
		console.log('content-length:', res.headers['content-length']);
		
		var type = res.headers['content-type'];
		type = type.substring(type.lastIndexOf('/')+1);
		var file_size = res.headers['content-length'];

		request(uri).pipe(fs.createWriteStream(DOWNLOAD_DIR_PATH + filename)).on('close', function(res) {
			callback(file_size, type);
		});		
	});
};

var checksum = function(str, algorithm, encoding) {
    var result =  crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex');
    //console.log(result);
    return result;
};

var im = require('imagemagick'); //should run "brew install imagemagick" before using this package

if (!fs.existsSync(DOWNLOAD_DIR_PATH))
{
	fs.mkdirSync(DOWNLOAD_DIR_PATH);
}

if (!fs.existsSync(ITEM_THUMBNAIL_PATH))
{
	fs.mkdirSync(ITEM_THUMBNAIL_PATH);
}

module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes

	// frontend routes =========================================================
	// route to handle all angular requests
	
	/*app.get('/imagecurling/:uri', function(req, res) {
		request({uri: req.params.uri}, function(err, response, body) {
			var self = this;
			self.items = new Array();

			if(err && response.statusCode != 200)
				console.log('Request error.');

			//console.log(body);
			res.send(body);
		});
	});*/

	app.post('/add_item', function(req, res) {
		//console.log(JSON.stringify(req.body));
	
		var new_item_data = {};
		new_item_data['name'] = req.body.name;
		new_item_data['refID'] = req.body.refID;
		new_item_data['description'] = req.body.description;
		new_item_data['price'] = req.body.price;
		new_item_data['link'] = req.body.link;
		new_item_data['store_name'] = req.body.store_name;
		new_item_data['brand'] = req.body.brand;
		new_item_data['hashtags'] = req.body.hashtags;

		var temp = req.body.thumbnail;
		if(temp.indexOf('image/jpeg')>-1)
			var base64Data = req.body.thumbnail.replace(/^data:image\/jpeg;base64,/, "");
		else if(temp.indexOf('image/png')>-1)
			var base64Data = req.body.thumbnail.replace(/^data:image\/png;base64,/, "");

		fs.writeFile(DOWNLOAD_DIR_PATH+"original.png", base64Data, 'base64', function(err) {
			if(!err) {
			  im.convert([DOWNLOAD_DIR_PATH+"original.png", '-resize', '150x120', ITEM_THUMBNAIL_PATH+"thumbnail.png"], 
				function(err, stdout){
					if (fs.existsSync(DOWNLOAD_DIR_PATH+"original.png"))
						fs.unlink(DOWNLOAD_DIR_PATH+"original.png");

					fs.readFile(ITEM_THUMBNAIL_PATH + "thumbnail.png", function(err, data) {
						if(!err) {
							var check_sum = checksum(data);
							//console.log(check_sum);

							
							var storeURL = ITEM_THUMBNAIL_PATH + check_sum.substring(0, 1);
							if (!fs.existsSync(storeURL)){
							    fs.mkdirSync(storeURL);
							}
							storeURL = storeURL + '/' + check_sum.substring(1, 2);
							if (!fs.existsSync(storeURL)){
							    fs.mkdirSync(storeURL);
							}					
							storeURL = storeURL + '/' + check_sum.substring(2, 3);
							if (!fs.existsSync(storeURL)){
							    fs.mkdirSync(storeURL);
							}
							storeURL = storeURL + '/' + check_sum.substring(3, 4);
							if (!fs.existsSync(storeURL)){
							    fs.mkdirSync(storeURL);
							}
							storeURL = storeURL + '/' + check_sum.substring(4, 5);
							if (!fs.existsSync(storeURL)){
							    fs.mkdirSync(storeURL);
							}
							storeURL = storeURL + '/' + check_sum.substring(5, 6);
							if (!fs.existsSync(storeURL)){
							    fs.mkdirSync(storeURL);
							}
							storeURL = storeURL + '/' + check_sum.substring(6);
							if (!fs.existsSync(storeURL)){
							    fs.mkdirSync(storeURL);
							}

							fs.rename(ITEM_THUMBNAIL_PATH+"thumbnail.png", storeURL+'/'+"thumbnail.png", function(err) {
								new_item_data['store_path'] = storeURL+'/'+"thumbnail.png";
								storeURL = storeURL.replace('public', '');
								new_item_data['thumbnail'] = req.headers.host + storeURL+'/'+"thumbnail.png";

								ItemDataModel.create(new_item_data, function(err) {
											if(!err)
												res.send("Item created!")
											else
												console.log(err);
										});
							});			
						}			
					});
				});
			}
		});			
	});

	app.post('/search_item', function(req, res) {
		//console.log(req.body.keyword);

		var result=[];
		ItemDataModel.find({},function(err, dataArray) {
			//console.log(dataArray);
			dataArray.forEach(function(data) {
				if(data.refID.indexOf(req.body.keyword) > -1)
					result.push(data);				
			});
			res.send(result);
		});
	});

	app.post('/fetch_item', function(req, res) {
		//console.log(req.body.keyword);
		ItemDataModel.findOne({_id: req.body.id},function(err, data) {
			//console.log(data);			
			res.send(data);
		});
	});

	app.post('/update_item', function(req, res) {
		//console.log(JSON.stringify(req.body));
	
		ItemDataModel.findOne({_id: req.body.id}, function(err, item) 
		{
			if(!err) 
			{
				item['name'] = req.body.name;
				item['refID'] = req.body.refID;
				item['description'] = req.body.description;
				item['price'] = req.body.price;
				item['link'] = req.body.link;
				item['store_name'] = req.body.store_name;
				item['brand'] = req.body.brand;
				item['hashtags'] = req.body.hashtags;

				if (fs.existsSync(item['store_path'])) {
				    fs.unlink(item['store_path']);
				}				

				var temp = req.body.thumbnail;
				if(temp.indexOf('image/jpeg')>-1)
					var base64Data = req.body.thumbnail.replace(/^data:image\/jpeg;base64,/, "");
				else if(temp.indexOf('image/png')>-1)
					var base64Data = req.body.thumbnail.replace(/^data:image\/png;base64,/, "");

				fs.writeFile(DOWNLOAD_DIR_PATH+"original.png", base64Data, 'base64', function(err) {
					if(!err) {
					  im.convert([DOWNLOAD_DIR_PATH+"original.png", '-resize', '150x120', ITEM_THUMBNAIL_PATH+"thumbnail.png"], 
						function(err, stdout){
							if (fs.existsSync(DOWNLOAD_DIR_PATH+"original.png")) {
								fs.unlink(DOWNLOAD_DIR_PATH+"original.png");
							}

							fs.readFile(ITEM_THUMBNAIL_PATH + "thumbnail.png", function(err, data) {
								if(!err) {
									var check_sum = checksum(data);
									//console.log(check_sum);

									
									var storeURL = ITEM_THUMBNAIL_PATH + check_sum.substring(0, 1);
									if (!fs.existsSync(storeURL)){
									    fs.mkdirSync(storeURL);
									}
									storeURL = storeURL + '/' + check_sum.substring(1, 2);
									if (!fs.existsSync(storeURL)){
									    fs.mkdirSync(storeURL);
									}					
									storeURL = storeURL + '/' + check_sum.substring(2, 3);
									if (!fs.existsSync(storeURL)){
									    fs.mkdirSync(storeURL);
									}
									storeURL = storeURL + '/' + check_sum.substring(3, 4);
									if (!fs.existsSync(storeURL)){
									    fs.mkdirSync(storeURL);
									}
									storeURL = storeURL + '/' + check_sum.substring(4, 5);
									if (!fs.existsSync(storeURL)){
									    fs.mkdirSync(storeURL);
									}
									storeURL = storeURL + '/' + check_sum.substring(5, 6);
									if (!fs.existsSync(storeURL)){
									    fs.mkdirSync(storeURL);
									}
									storeURL = storeURL + '/' + check_sum.substring(6);
									if (!fs.existsSync(storeURL)){
									    fs.mkdirSync(storeURL);
									}

									fs.rename(ITEM_THUMBNAIL_PATH+"thumbnail.png", storeURL+'/'+"thumbnail.png", function(err) {
										item['store_path'] = storeURL+'/'+"thumbnail.png";
										storeURL = storeURL.replace('public', '');
										item['thumbnail'] = req.headers.host + storeURL+'/'+"thumbnail.png";

										item.save(function(err) {
											if(!err)
												res.send("Item updated!")
											else
												res.send("Update failed!")
										});
									});			
								}			
							});
						});
					}
				});			
			}
			else
				res.send("Item not found!");
		});
	});

	app.post('/remove_item', function(req, res) {
		//console.log(JSON.stringify(req.body));
	
		ItemDataModel.findOne({_id: req.body.id}, function(err, item) 
		{
			if(!err) 
			{
				if(item)
				{
					if (fs.existsSync(item['store_path'])) {
					    fs.unlink(item['store_path']);
					}

					item.remove(function(err) {
						if(!err)
							res.send("Removed item");
						else
							res.send("Remove failed!");
					});
				}
				else
					res.send("Item not found!")
			}
			else
				res.send("Internal Server Error!");
		});
	});

	app.post('/get_image_by_domain', function(req, res) {
		//console.log(req.body.domainURL);
		var domain = req.body.domainURL.toLowerCase();
		var result=[];
		var found = false;
		ImageDataModel.find({},function(err, dataArray) {
			console.log(dataArray);
			dataArray.forEach(function(data) {
				found = false;
				console.log(data);
				data.page_urls.forEach(function(url) {
					if(!found && url.indexOf(domain) > -1)
					{
						found = true;
						result.push(data);
					}
				});				
			});
			res.send(result);
		});
	});

	//Process image from url
	app.post('/image_by_url', function(req, resdata) {
		//console.log(req.headers.host);
		//download image file
		var result = [];
		var pageURL = req.body.page;
		pageURL = pageURL.toLowerCase();

		var currentTime = new Date();
		var month = currentTime.getMonth() + 1;
		var day = currentTime.getDate();
		var year = currentTime.getFullYear();

		if(day<10)
			day = '0' + day;
		if(month<10)
			month = '0' + month;
		var dateString = year + '-' + month + '-' + day;
		//console.log(dateString);


		var domainString = pageURL.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];

		var URL = req.body.data;
		//req.body.data.forEach( function (URL) {
		URL = URL.substring(34);
			var pathname = URL.substring(0, URL.lastIndexOf('/')+1);
			var filename = URL.substring(URL.lastIndexOf('/')+1);

			console.log(pathname);
			console.log(URL);
			console.log(pageURL);
			console.log(URL.substring(34));
			console.log('je suis la');
			console.log(filename);

			download(pathname+filename, filename, function(file_size, type) {
				fs.readFile(DOWNLOAD_DIR_PATH + filename, 'base64', function(err, data) {
					//console.log(data);
					var img_width = 0, img_height = 0, create_date = '';

					im.identify(['-format', '%w', DOWNLOAD_DIR_PATH+filename], function(err, width){
					    console.log('width: '+width);
					    img_width = width;

					    im.identify(['-format', '%h', DOWNLOAD_DIR_PATH+filename], function(err, height){
							console.log('height: '+height);
							img_height = height;

							var check_sum = checksum(data);
							console.log('checksum: ' +check_sum);

							ImageDataModel.find({checksum: check_sum}, function(err, reses) 
							{
								if(!err) 
								{									
									if(reses.length==0)
									{
										//console.log("not found");

										var storeURL = DOWNLOAD_DIR_PATH + check_sum.substring(0, 1);
										if (!fs.existsSync(storeURL)){
										    fs.mkdirSync(storeURL);
										}
										storeURL = storeURL + '/' + check_sum.substring(1, 2);
										if (!fs.existsSync(storeURL)){
										    fs.mkdirSync(storeURL);
										}					
										storeURL = storeURL + '/' + check_sum.substring(2, 3);
										if (!fs.existsSync(storeURL)){
										    fs.mkdirSync(storeURL);
										}
										storeURL = storeURL + '/' + check_sum.substring(3, 4);
										if (!fs.existsSync(storeURL)){
										    fs.mkdirSync(storeURL);
										}
										storeURL = storeURL + '/' + check_sum.substring(4, 5);
										if (!fs.existsSync(storeURL)){
										    fs.mkdirSync(storeURL);
										}
										storeURL = storeURL + '/' + check_sum.substring(5, 6);
										if (!fs.existsSync(storeURL)){
										    fs.mkdirSync(storeURL);
										}
										storeURL = storeURL + '/' + check_sum.substring(6);
										if (!fs.existsSync(storeURL)){
										    fs.mkdirSync(storeURL);
										}
										
										var new_image_data = {};
										new_image_data['stateProcessed'] = false;
										new_image_data['page_urls'] = [];
										new_image_data['page_urls'].push(pageURL);
										new_image_data['image_urls'] = [];
										new_image_data['image_urls'].push(URL);
										new_image_data['image_width'] = img_width;
										new_image_data['image_height'] = img_height;
										new_image_data['image_size'] = file_size;
										new_image_data['image_created_date'] = create_date;
										new_image_data['checksum'] = check_sum;

										fs.rename(DOWNLOAD_DIR_PATH+filename, storeURL+'/'+filename, function(err) {
										    // handle the error
										    if(!err)
										    	new_image_data['store_url'] = storeURL+'/'+filename;
										   	else
										   		new_image_data['store_url'] = DOWNLOAD_DIR_PATH+filename;

										   	ImageDataModel.create(new_image_data, function(err) {
												if(!err)
												{
													console.log("created");
													resdata.send([{"success" : "registered"}]);

													UsingJsDataModel.count(function(err, count) {
														if(count==0){
															var new_jsdata = {};
															new_jsdata['date'] = dateString;
															new_jsdata['domain'] = domainString;
															/*new_jsdata['JsCall'] = 1;*/
															new_jsdata['NullReturn'] = 1;
															/*mixpanel.track("null_return1");*/
															new_jsdata['TrueReturn'] = 0;
															new_jsdata['ReturnItems'] = 0;
															UsingJsDataModel.create(new_jsdata);
														}
														else {
															UsingJsDataModel.findOne({date: dateString, domain: domainString}, function(err, jsData) {
																if(!err)
																{
																	if(jsData)
																	{
																		/*jsData.JsCall++;*/
																		jsData.NullReturn++;
																		jsData.save();
																		return;
																	}
																	else{
																		var new_jsdata = {};
																		new_jsdata['date'] = dateString;
																		new_jsdata['domain'] = domainString;
																		/*new_jsdata['JsCall'] = 1;*/
																		new_jsdata['NullReturn'] = 1;
																		/*mixpanel.track("null_return2");*/
																		new_jsdata['TrueReturn'] = 0;
																		new_jsdata['ReturnItems'] = 0;
																		UsingJsDataModel.create(new_jsdata);
																	}
																}
															});															
														}		
													});														
												}
											});
										});
									}
									else
									{
										var res = reses[0];
										//console.log(JSON.stringify(res));
										if (fs.existsSync(DOWNLOAD_DIR_PATH+filename))
											fs.unlink(DOWNLOAD_DIR_PATH+filename);
										if(!res.stateProcessed)
										{
											var pageURL_compare = false;
											res['page_urls'].forEach( function(url) {
												if(url==pageURL)
													pageURL_compare = true;
											});
											if(!pageURL_compare)
											{
												console.log("other pageURL");
												res['page_urls'].push(pageURL);
											}

											var imageURL_compare = false;
											res['image_urls'].forEach( function(url) {
												if(url==URL)
													imageURL_compare = true;
											});
											if(!imageURL_compare)
											{
												//console.log("other imageURL");
												res['image_urls'].push(URL);
											}	

											res.save(function(err) {
												if(!err)
												{													
													console.log("unprocessed");
													resdata.send([{"success" : "unprocessed"}]);

													UsingJsDataModel.count(function(err, count) {
														if(count==0){
															var new_jsdata = {};
															new_jsdata['date'] = dateString;
															new_jsdata['domain'] = domainString;
															/*new_jsdata['JsCall'] = 1;*/
															new_jsdata['NullReturn'] = 1;
															/*mixpanel.track("null_return3");*/
															new_jsdata['TrueReturn'] = 0;
															new_jsdata['ReturnItems'] = 0;
															UsingJsDataModel.create(new_jsdata);
														}
														else {
															UsingJsDataModel.findOne({date: dateString, domain: domainString}, function(err, jsData) {
																if(!err)
																{
																	if(jsData)
																	{
																		/*jsData.JsCall++;*/
																		jsData.NullReturn++;
																		/*mixpanel.track("null_return4");*/
																		console.log(jsData);
																		console.log("RE");
																		console.log("lalala");
																		console.log(jsData);
																		console.log("lalala");
																		console.log("RE");
																		jsData.save();
																		return;
																	}
																	else{
																		var new_jsdata = {};
																		new_jsdata['date'] = dateString;
																		new_jsdata['domain'] = domainString;
																		/*new_jsdata['JsCall'] = 1;*/
																		new_jsdata['NullReturn'] = 1;
																		mixpanel.track("null_return5");
																		new_jsdata['TrueReturn'] = 0;
																		new_jsdata['ReturnItems'] = 0;
																		UsingJsDataModel.create(new_jsdata);
																	}
																}
															});
														}	
													});												
												}
											});
										}
										else
										{
											var response = [];
											console.log("processed");
											response.push({"success" : "processed"});
											response.push(res.format);
											response.push(res.item_data);
											resdata.send(response);

											UsingJsDataModel.count(function(err, count) {
												if(count==0)
												{
													var new_jsdata = {};
													new_jsdata['date'] = dateString;
													new_jsdata['domain'] = domainString;
													/*new_jsdata['JsCall'] = 1;*/
													new_jsdata['NullReturn'] = 0;
													new_jsdata['TrueReturn'] = 1;
													new_jsdata['ReturnItems'] = 1;
													UsingJsDataModel.create(new_jsdata);
												}
												else {
													UsingJsDataModel.findOne({date: dateString, domain: domainString}, function(err, jsData) {
														if(!err)
														{
															if(jsData)
															{
																/*jsData.JsCall++;*/
																jsData.TrueReturn++;
																jsData.ReturnItems++;
																jsData.save();
																return;
															}
															else {
																var new_jsdata = {};
																new_jsdata['date'] = dateString;
																new_jsdata['domain'] = domainString;
																/*new_jsdata['JsCall'] = 1;*/
																new_jsdata['NullReturn'] = 0;
																new_jsdata['TrueReturn'] = 1;
																new_jsdata['ReturnItems'] = 1;
																UsingJsDataModel.create(new_jsdata);
															}
														}
													});
													
												}		
											});											
											
													
											//resdata.send({"success": "processed"});
											
											/*var response = [];
											var item_count = res.item_data.length;
											console.log(item_count);
											var itemdata = res.item_data[0];
											var image_item_data = mongoose.model('ImageItemData');

											//res.item_data.forEach(function(itemdata) {
												var item_array = [];
												item_array['x'] = itemdata.x_pos;
												item_array['y'] = itemdata.y_pos;
												item_array['format'] = itemdata.format;

												console.log(itemdata.itemID);	
												
												ItemDataModel.findOne({_id: itemdata.itemID}, function(err, item) {

													console.log("callback");
													item_count=item_count-1;
													if(!err) {
														console.log("item found");
														item_array['name'] = item.name;
														item_array['price'] = item.price;
														item_array['link'] = item.link;
														item_array['thumbnail'] = item.thumbnail;
														item_array['store_name'] = item.store_name;
														item_array['brand'] = item.brand;

														response.push(item_array);														
													}
													else
														console.log("item not found");
												});										
											//});
											//while(item_count>0){
											//	;
											//}
											resdata.send(response);
											//resdata.send(response);
											*/
										}
									}	
								}
								else
									resdata.send({"error" : "Server Error"});								
							});
					    });
					});					
				});
			});
		//});	
	});

	//Remove Image
	app.post('/remove_image', function(req, res) {
		//console.log(JSON.stringify(req.body));
	
		ImageDataModel.findOne({_id: req.body.id}, function(err, imageItem) 
		{
			if(!err) 
			{
				if (fs.existsSync(imageItem['store_url'])) {
				    fs.unlink(imageItem['store_url']);
				}

				imageItem.remove(function(err) {
					if(!err)
						res.send("Removed image");
					else
						res.send("Remove failed!");
				});
			}
			else
				res.send("Image not found!");
		});
	});

	app.post('/tag_item_to_image', function(req, res) {
		console.log(req.body);

		ImageDataModel.findOne({_id: req.body.imageID}, function(err, imageData) {
			if(!err) {
				var image_item_data = mongoose.model('ImageItemData');
				imageData.item_data.push({
					x_pos: req.body.x_pos,
					y_pos: req.body.y_pos,
					itemID: req.body.itemID.toString()
				});

				if(!imageData.stateProcessed)
					imageData.stateProcessed = true;
				imageData.format = req.body.format;
				imageData.save(function(err) {
					if(!err)
					{
						console.log("added tag data");
						res.send("Added item to image");
					}
					else
						res.send(err);
				});
			}
			else
				res.send(err);
		});

	});

	app.post('/update_item_on_image', function(req, res) {
		//console.log(req.body);

		ImageDataModel.findOne({_id: req.body.imageID}, function(err, imageData) {
			if(!err) {
				var image_item_data = mongoose.model('ImageItemData');
				imageData.item_data[req.body.itemIndex].x_pos = req.body.new_x;
				imageData.item_data[req.body.itemIndex].y_pos = req.body.new_y;
				
				imageData.save(function(err) {
					if(!err)
					{
						console.log("Updated item data on image");
						res.send("Updated item position on image");
					}
					else
						res.send(err);
				});
			}
			else
				res.send(err);
		});

	});

	app.post('/remove_item_from_image', function(req, res) {
		//console.log(req.body);

		ImageDataModel.findOne({_id: req.body.imageID}, function(err, imageData) {
			if(!err) {
				var image_item_data = mongoose.model('ImageItemData');
				imageData.item_data.splice(req.body.itemIndex, 1);
				if(imageData.item_data.length==0)
					imageData.stateProcessed = false;
				
				imageData.save(function(err) {
					if(!err)
					{
						console.log("removed item data from image");
						res.send("Removed item from image");
					}
					else
						res.send(err);
				});
			}
			else
				res.send(err);
		});

	});

	app.post('/get_domains', function(req, res) {
		var domain_names = [];
		ImageDataModel.find({}, function(err, images) {
			if(!err)
			{
				images.forEach(function(data) {
					var include = false;
					data.page_urls.forEach(function(url) {
						var domain = url.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];
						domain_names.forEach(function(domainname){
							if(domainname.indexOf(domain)>-1)
								include = true;
						});
						if(!include)
							domain_names.push(domain);
					});
				});
				res.send(domain_names);
				DomainModel.count(function(err, count) {
					if(!err)
					{
						//console.log(count);
						if(count==0)
						{
							var new_domain = {};
							new_domain['domain_name'] = domain_names;
							DomainModel.create(new_domain, function(err, newmodel) {
								if(!err)
								{
									console.log("created domain data model");
									console.log(newmodel);
								}
							});
						}
						else
							DomainModel.find(function(err, domain_data){
								domain_data[0].domain_name = domain_names;
								domain_data[0].save(function(err){
									if(!err)
										console.log("updated domain data");
								});
							});
					}
				});				
			}
		});
		
	});

	app.post('/get_jsInfo', function(req, res) {
		console.log(req.body);

		var result = [];

		if(req.body.domainAlias=='all')
		{
			UsingJsDataModel.find({}, function(err, jsInfoData) {
				jsInfoData.forEach(function(info){					

					var info_date = Date.parse(info.date);										
					//console.log(info_date);
					if(info_date>=req.body.dateFrom && info_date<=req.body.dateTo)
						result.push(info);
				});
				res.send(result);
			});			
		}
		else
		{
			UsingJsDataModel.find({domain: req.body.domainAlias}, function(err, jsInfoData) {
				jsInfoData.forEach(function(info){
					var info_date = new Date(info.date);
					//console.log(info_date);
					if(info_date>=req.body.dateFrom && info_date<=req.body.dateTo)
						result.push(info);
				});
				res.send(result);
			});
		}
	});

	app.post('/get_statsInfo', function(req, res) {
		var result = [];
		if(req.body.domainAlias=='all')
		{
			StatsDataModel.find({}, function(err, statsInfoData) {
				if(!err && statsInfoData.length!=0)
				{
					statsInfoData.forEach(function(statsInfo) {
						var info_date = Date.parse(statsInfo.date);
						if(info_date>=req.body.dateFrom && info_date<=req.body.dateTo)
							result.push(statsInfo);
					});
					//console.log(result);
					res.send(result);
				}
			});
		}
		else
		{
			StatsDataModel.find({}, function(err, statsInfoData) {
				if(!err && statsInfoData.length!=0)
				{
					statsInfoData.forEach(function(statsInfo) {
						var info_date = Date.parse(statsInfo.date);
						if(info_date>=req.body.dateFrom && info_date<=req.body.dateTo && statsInfo.PageURL.indexOf(req.body.domainAlias)>-1)
							result.push(statsInfo);
					});
					res.send(result);
				}
			});
		}
	});

	app.post('/send_stats_info', function(req, res) {
		//console.log(req.body.data);

		var data = req.body.data;
		//data.forEach(function(imageStatsData) {
			StatsDataModel.findOne({PageURL: data[0].page, date: data[1].date}, function(err, statsData) {
				if(!err)
				{
					if(statsData)
					{
						var counter = 0;
						statsData.StatsInfo = [];
						//console.log("found stats info");
						data.forEach(function(statsInfo) {	
							//console.log(statsInfo.imageURL);
							if(statsInfo.imageURL) 
							{
								var imgStats = {};
								var URL = statsInfo.imageURL;
							
								var pathname = URL.substring(0, URL.lastIndexOf('/')+1);
								var filename = URL.substring(URL.lastIndexOf('/')+1);

								download(pathname+filename, filename, function(file_size, type) {
									fs.readFile(DOWNLOAD_DIR_PATH + filename, 'base64', function(err1, imgdata) {
										var check_sum = checksum(imgdata);
										//console.log('checksum: ' +check_sum);

										if (fs.existsSync(DOWNLOAD_DIR_PATH+filename))
											fs.unlink(DOWNLOAD_DIR_PATH+filename);

										ImageDataModel.findOne({checksum: check_sum}, function(err2, reses) 
										{
											if(!err) 
											{									
												if(reses)
												{
													var image_stats_data = mongoose.model('ImageStatsData');
													//console.log('imageID: '+reses._id);
													imgStats['ImageID'] = reses._id.toString();
													imgStats['HoverImage'] = parseInt(statsInfo.HoverImage);
													imgStats['HoverItem'] = parseInt(statsInfo.HoverItem);
													imgStats['AddToCart'] = parseInt(statsInfo.AddToCart);
													statsData.StatsInfo.push(imgStats);

													counter++;
													if(counter==data.length-2)
													{
														statsData.save(function(err) {
															if(!err)
																console.log("updated statsData");
														});
													}
												}
											}
										});
									});
								});
							};
						});						
					}
					else
					{
						//console.log("not found stats info");
						//console.log(data);
						var new_statsData = {};
						new_statsData['PageURL'] = data[0].page;
						new_statsData['date'] = data[1].date;
						new_statsData['StatsInfo'] = [];

						var counter = 0;
						data.forEach(function(statsInfo) {	
							//console.log(statsInfo.imageURL);
							if(statsInfo.imageURL) 
							{							
								var URL = statsInfo.imageURL;
							
								var pathname = URL.substring(0, URL.lastIndexOf('/')+1);
								var filename = URL.substring(URL.lastIndexOf('/')+1);

								download(pathname+filename, filename, function(file_size, type) {
									fs.readFile(DOWNLOAD_DIR_PATH + filename, 'base64', function(err1, imgdata) {
										var check_sum = checksum(imgdata);
										console.log('checksum: ' +check_sum);

										if (fs.existsSync(DOWNLOAD_DIR_PATH+filename))
											fs.unlink(DOWNLOAD_DIR_PATH+filename);

										ImageDataModel.findOne({checksum: check_sum}, function(err2, reses) 
										{
											if(!err) 
											{									
												if(reses)
												{
													var image_stats_data = mongoose.model('ImageStatsData');
													console.log('imageID: '+reses._id);
													var imgStats = {
														ImageID: reses._id.toString(),
														HoverImage: parseInt(statsInfo.HoverImage),
														HoverItem: parseInt(statsInfo.HoverItem),
														AddToCart: parseInt(statsInfo.AddToCart)
													};
													//imgStats['ImageID'] = reses._id.toString();
													//imgStats['HoverImage'] = parseInt(statsInfo.HoverImage);
													//imgStats['HoverItem'] = parseInt(statsInfo.HoverItem);
													//imgStats['AddToCart'] = parseInt(statsInfo.AddToCart);
													new_statsData.StatsInfo.push(imgStats);

													counter++;
													if(counter==data.length-2)
													{
														console.log(new_statsData);
														StatsDataModel.create(new_statsData, function(err){
															if(!err)
																console.log("created new statsData");
														});
													}
												}
											}
										});
									});
								});
							};
						});

						//console.log(new_statsData);
												
					}
				}
				else
					res.send("Internal Server Error!");
			});
		//});
	});

};
