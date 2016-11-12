


<!-- start Mixpanel -->

/*<script type="text/javascript">*/

(function(e,b){if(!b.__SV){var a,f,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===e.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f)}})(document,window.mixpanel||[]);
mixpanel.init("63c11c3f319e4af6f9a16bc726009479");


/*</script>*/


<!-- end Mixpanel -->


mixpanel.track("js_call");





/*! tinycarousel - v2.1.8 - 2015-02-22
 * https://baijs.com/tinycarousel
 *
 * Copyright (c) 2015 Maarten Baijs <wieringen@gmail.com>;
 * Licensed under the MIT license */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){function b(b,e){function f(){return i.update(),i.move(i.slideCurrent),g(),i}function g(){i.options.buttons&&(n.click(function(){return i.move(--t),!1}),m.click(function(){return i.move(++t),!1})),a(window).resize(i.update),i.options.bullets&&b.on("click",".bullet",function(){return i.move(t=+a(this).attr("data-slide")),!1})}function h(){i.options.buttons&&!i.options.infinite&&(n.toggleClass("disable",i.slideCurrent<=0),m.toggleClass("disable",i.slideCurrent>=i.slidesTotal-r)),i.options.bullets&&(o.removeClass("active"),a(o[i.slideCurrent]).addClass("active"))}this.options=a.extend({},d,e),this._defaults=d,this._name=c;var i=this,j=b.find(".viewport:first"),k=b.find(".overview:first"),l=null,m=b.find(".next:first"),n=b.find(".prev:first"),o=b.find(".bullet"),p=0,q={},r=0,s=0,t=0,u="x"===this.options.axis,v=u?"Width":"Height",w=u?"left":"top",x=null;return this.slideCurrent=0,this.slidesTotal=0,this.intervalActive=!1,this.update=function(){return k.find(".mirrored").remove(),l=k.children(),p=j[0]["offset"+v],s=l.first()["outer"+v](!0),i.slidesTotal=l.length,i.slideCurrent=i.options.start||0,r=Math.ceil(p/s),k.append(l.slice(0,r).clone().addClass("mirrored")),k.css(v.toLowerCase(),s*(i.slidesTotal+r)),h(),i},this.start=function(){return i.options.interval&&(clearTimeout(x),i.intervalActive=!0,x=setTimeout(function(){i.move(++t)},i.options.intervalTime)),i},this.stop=function(){return clearTimeout(x),i.intervalActive=!1,i},this.move=function(a){return t=isNaN(a)?i.slideCurrent:a,i.slideCurrent=t%i.slidesTotal,0>t&&(i.slideCurrent=t=i.slidesTotal-1,k.css(w,-i.slidesTotal*s)),t>i.slidesTotal&&(i.slideCurrent=t=1,k.css(w,0)),q[w]=-t*s,k.animate(q,{queue:!1,duration:i.options.animation?i.options.animationTime:0,always:function(){b.trigger("move",[l[i.slideCurrent],i.slideCurrent])}}),h(),i.start(),i},f()}var c="tinycarousel",d={start:0,axis:"x",buttons:!0,bullets:!1,interval:!1,intervalTime:3e3,animation:!0,animationTime:1e3,infinite:!0};a.fn[c]=function(d){return this.each(function(){a.data(this,"plugin_"+c)||a.data(this,"plugin_"+c,new b(a(this),d))})}});

// Include Stylesheet
$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'http://54.191.85.147:8080/inc/hook/producttaggingtool.css') );



/* Producttagging Plugin */
;(function(factory) {
    if(typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    }
    else if(typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    }
    else {
        factory(jQuery);
    }
}
(function($) {
    var pluginName = "producttagging"
    ,   defaults   =
        {
        	tags: [],
            type: 1
        }
    ;

    function Plugin($container, options) {
        /**
         * The options of the carousel extend with the defaults.
         *
         * @property options
         * @type Object
         * @default defaults
         */
    	this.options = $.extend({}, defaults, options);

        /**
         * @property _defaults
         * @type Object
         * @private
         * @default defaults
         */
        this._defaults = defaults;

        /**
         * @property _name
         * @type String
         * @private
         * @final
         * @default 'producttagging'
         */
        this._name = pluginName;

        var self = this;

        /**
         * @method _initialize
         * @private
         */
        function _initialize() {
            _attach();
            return self;
        }

        /**
         * @method _attach
         * @private
         */
        function _attach() {

			// Product Template
			var product_template = $("<div class='tt-product-wrapper'>" +
				"<div class='tt-product-image'></div>" +
				"<div class='tt-product-content'>" +
				"<h1 class='tt-product-title'></h1>" +
				"<span class='tt-product-name'></span>" +
				"<div class='tt-product-price-container'><h2 class='tt-product-price'></h2>" +
				"<a class='tt-product-link'></a></div>" +
				"<div class='tt-product-btn-container'><a class='tt-product-btn' target='_blank'></a></div>");

			var image_url = $container.attr("src");
			$container.addClass("image");
			// Add special classname to image block
			$container.wrap( "<div class='image-tag-container'></div>" );
			$container = $container.parent();

			
			var statsObject = {imageURL:rootPath+image_url, HoverImage:0, HoverItem:0, AddToCart:0};
			imageStatsInfo.push(statsObject);
			// Add tags to image
			switch(self.options.type) {
				case "1":
					$container.addClass("image-tag-first");

					var tag_add_to_cart_button_click_count = 0;
					var tag_see_detail_click_count = 0;
					var image_hover_count = 0;
					var tag_pointer_hover_count = 0;

					self.options.tags.map(function(tag) {
						var $tag_div = $("<div class='image-tag'></div>");
						$tag_div.append(product_template.clone());
						$tag_div.find(".tt-product-image").css("background-image", "url("+tag.image_url+")");
						$tag_div.find(".tt-product-title").html("Buy it!");
						$tag_div.find(".tt-product-name").html(tag.title);
						$tag_div.find(".tt-product-price").html(tag.price);
						$tag_div.find(".tt-product-link").html(">> See details");
						$tag_div.find(".tt-product-btn-container .tt-product-btn").html("Add to cart").attr('href',tag.cart_url);
						$tag_div.css('left', tag.x);
						$tag_div.css('top', tag.y);



						var $tag_pointer = $("<div class='tt-pointer'></div>");
						$tag_div.append($tag_pointer);

						$container.append($tag_div);
						
						$tag_pointer.hover(function(){
							tag_pointer_hover_count ++;
							mixpanel.track("tag_pointer_hover_count1");


							console.log(tag);
							console.log("FAFAFAFA");


							statsObject.HoverItem = tag_pointer_hover_count;
							console.log("tag_pointer_hover_count: " + tag_pointer_hover_count.toString());
						}, function(){});
					});


					//track
					$container.hover(function(){
						image_hover_count ++;
						mixpanel.track("image_hover_count1");
						statsObject.HoverImage = image_hover_count;
						console.log(image_url + " ||| " + image_hover_count.toString());
					}, function(){});

					$container.find(".tt-product-btn").on("click",function(){
						tag_add_to_cart_button_click_count ++;
						mixpanel.track("tag_add_to_cart_button_click_count1");
						statsObject.AddToCart = tag_add_to_cart_button_click_count;
						console.log("tag_add_to_cart_button_click_count:" + tag_add_to_cart_button_click_count.toString());
					});

					$container.find(".tt-product-link").on("click",function(){
						tag_see_detail_click_count ++;
						mixpanel.track("tag_see_detail_click_count1");
						console.log("tag_see_detail_click_count:" + tag_see_detail_click_count.toString());
					});
					break;
				case "2":

					$container.addClass("image-tag-second");
					$container.append('<div class="link-area"><div class="demo-icon"></div><span class="link-area-text">FIND SIMILAR LOOK</span><span class="up-down-icon"></span></div>');
					var $sliderContainer = $("<div class='tags-slider-container'><a class='buttons tt-buttons prev'>prev</a><div class='viewport'><ul class='overview'></ul></div><a class='buttons tt-buttons next'>next</a></div>"),
						$slidelist = $sliderContainer.find("ul");

					$container.append($sliderContainer);

					// track variable definition
					var tag_add_to_cart_button_click_count = 0;
					var tag_see_detail_click_count = 0;
					var image_hover_count = 0;
					var grey_bar_click_count = 0;
					var prev_click_count = 0;
					var next_click_count = 0;

					self.options.tags.map(function(tag) {
						var $tag_div = $("<li class='image-tag' style='width:242.5px;'></li>");
						$tag_div.append(product_template.clone());
						$tag_div.find(".tt-product-image").css("background-image", "url("+tag.image_url+")");
						$tag_div.find(".tt-product-title").html("Buy it!");
						$tag_div.find(".tt-product-name").html(tag.title);
						$tag_div.find(".tt-product-price").html(tag.price);
						$tag_div.find(".tt-product-link").html(">> See details");
						$tag_div.find(".tt-product-btn-container .tt-product-btn").html("Add to cart").attr('href',tag.cart_url);
						$slidelist.append($tag_div);

					});

					var slider = $sliderContainer.tinycarousel().data("plugin_tinycarousel");	
					$container.find(".link-area").click(function(){
						$container.toggleClass("tags-slider-open");
						if($container.hasClass("tags-slider-open")){
							if($sliderContainer.offset().top+$sliderContainer.height()>$(window).scrollTop()+$(window).height()) {
								$('html,body').animate({
							        scrollTop: $sliderContainer.offset().top+$sliderContainer.height()-$(window).height()},
							        400);
							}
						}
					})

				    $container.mouseleave(function(){
						$container.removeClass("tags-slider-open");
				    });

				    //track
					$container.hover(function(){
						image_hover_count ++;
						mixpanel.track("image_hover_count2");
/*						console.log(self);*/
						statsObject.HoverImage = image_hover_count;
						console.log(image_url + " ||| " + image_hover_count.toString());
					}, function(){});



					$container.find(".link-area").on('click',function(){
						grey_bar_click_count ++;
						mixpanel.track("grey_bar_click_count");
						statsObject.HoverItem = grey_bar_click_count;
						console.log("grey_bar_click_count:" + grey_bar_click_count.toString());
					});

					$sliderContainer.find(".prev").on('click',function(){
						prev_click_count ++;
						mixpanel.track("prev_click_count");
						console.log("prev_click_count:" + prev_click_count.toString());
					});

					$sliderContainer.find(".next").on('click',function(){
						next_click_count ++;
						mixpanel.track("next_click_count");
						console.log("next_click_count:" + next_click_count.toString());
					});

					$sliderContainer.find(".tt-product-btn").on('click',function(){
						tag_add_to_cart_button_click_count ++;
						mixpanel.track("tag_add_to_cart_button_click_count2");
						statsObject.AddToCart = tag_add_to_cart_button_click_count;
						console.log("tag_add_to_cart_button_click_count:" + tag_add_to_cart_button_click_count.toString());
					});

					$sliderContainer.find(".tt-product-link").on('click',function(){
						tag_see_detail_click_count ++;
						mixpanel.track("tag_see_detail_click_count2");
						console.log("tag_see_detail_click_count:" + tag_see_detail_click_count.toString());
					});
					break;
				case "3":
					$container.addClass("image-tag-third");
					var $sliderContainer = $("<div class='tags-slider-container'><a class='buttons tt-buttons prev'>prev</a><div class='viewport'><ul class='overview'></ul></div><a class='buttons tt-buttons next'>next</a></div>"),
						$slidelist = $sliderContainer.find("ul"),
						$pointersContainer = $("<div class='tags-pointer-container'></div>");

					$container.append($sliderContainer);
					$container.append($pointersContainer);


					// track variable definition
					var image_hover_count = 0,
						prev_click_count = 0,
						next_click_count = 0,
						tag_pointer_hover_count = 0,
						tag_add_to_cart_button_click_count = 0,
						tag_see_detail_click_count = 0;

					self.options.tags.map(function(tag, index) {
						var $tag_div = $("<li class='image-tag'></li>");
						$tag_div.append(product_template.clone());
						$tag_div.find(".tt-product-image").css("background-image", "url("+tag.image_url+")");
						$tag_div.find(".tt-product-name").html(tag.title);
						$tag_div.find(".tt-product-price").html(tag.price);
						$tag_div.find(".tt-product-link").html(">> See details");
						$tag_div.find(".tt-product-btn-container .tt-product-btn").html("Shop").attr('href',tag.cart_url);
						$slidelist.append($tag_div);

						var $tag_pointer = $("<div class='tt-pointer' data-id='"+index+"'></div>");
						$tag_pointer.css('left', tag.x);
						$tag_pointer.css('top', tag.y);
						$pointersContainer.append($tag_pointer);
					});
					$sliderContainer.find("li").css('width', $container.find(".image").width());

					var slider = $sliderContainer.tinycarousel().data("plugin_tinycarousel");

					$pointersContainer.find(".tt-pointer").hover(function(){
						slider.move($(this).data('id'));
						$pointersContainer.find(".tt-pointer").removeClass('active');
						$(this).addClass('active');
						$container.addClass('tags-slider-open');

						if($sliderContainer.offset().top+$sliderContainer.height()>$(window).scrollTop()+$(window).height()) {
							$('html,body').animate({
						        scrollTop: $sliderContainer.offset().top+$sliderContainer.height()-$(window).height()},
						        400);
						}
					}, function(){
					});

					$sliderContainer.bind("move", function()
				    {
						$pointersContainer.find(".tt-pointer").removeClass('active');
						$pointersContainer.find(".tt-pointer:nth-child("+(slider.slideCurrent+1)+")").addClass('active');
				    });

				    $container.mouseleave(function(){
						$(this).removeClass('tags-slider-open');
						$pointersContainer.find(".tt-pointer").removeClass('active');
				    });


				    // track
				    $container.hover(function(){
						image_hover_count ++;
						mixpanel.track("image_hover_count3");
						statsObject.HoverImage = image_hover_count;
						console.log(image_url + " ||| " + image_hover_count.toString());
					}, function(){});


					$sliderContainer.find(".prev").on('click',function(){
						prev_click_count ++;
						mixpanel.track("prev_click_count");
						console.log("prev_click_count:" + prev_click_count.toString());
					});

					$sliderContainer.find(".next").on('click',function(){
						next_click_count ++;
						mixpanel.track("next_click_count");
						console.log("next_click_count:" + next_click_count.toString());
					});

					$pointersContainer.find(".tt-pointer").hover(function(){
						tag_pointer_hover_count ++;
						mixpanel.track("tag_pointer_hover_count3");
						statsObject.HoverItem = tag_pointer_hover_count;
						console.log("tag_pointer_hover_count:" + tag_pointer_hover_count.toString());
					}, function(){});

					$sliderContainer.find(".tt-product-btn").on('click',function(){
						tag_add_to_cart_button_click_count ++;
						mixpanel.track("tag_add_to_cart_button_click_count3");
						statsObject.AddToCart = tag_add_to_cart_button_click_count;
						console.log("tag_add_to_cart_button_click_count:" + tag_add_to_cart_button_click_count.toString());
					});

					$sliderContainer.find(".tt-product-link").on('click',function(){
						tag_see_detail_click_count ++;
						mixpanel.track("tag_see_detail_click_count3");
						console.log("tag_see_detail_click_count:" + tag_see_detail_click_count.toString());
					});
					break;
			}
        }

        return _initialize();
    }


    /**
    * @class producttagging
    * @constructor
    * @param {Object} options
        @param {Number}  [options.type=1] Type of tagging.
        @param {Array}   [options.tags=[]] Array of tag data.
    */
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if(!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin($(this), options));
            }
        });
    };
}));

var SERVER_ADDRESS = "http://54.218.15.89:8080"; //http://54.191.85.147:8080/image_by_url
/*
var data = [
	[
		{
			x: 240,
			y: 145.5,
			image_url: 'http://whitehouse.prod51.fr/op/img/article_first_tag1.jpg',
			title: 'Warehouse Pea Coat',
			price: '132.35 €',
			cart_url: 'http://www.asos.com/Warehouse/Warehouse-Pea-Coat/Prod/pgeproduct.aspx?iid=5974436&amp;cid=2641&amp;Rf989=4894&amp;sh=0&amp;pge=0&amp;pgesize=36&amp;sort=-1&amp;clr=Navy&amp;totalstyles=20&amp;gridsize=3'
		},
		{
			x: 120,
			y: 300,
			image_url: 'http://whitehouse.prod51.fr/op/img/article_first_tag2.jpg',
			title: 'Black Pliage Tote Bag',
			price: '140.16 €',
			cart_url: 'http://shop.nordstrom.com/s/longchamp-large-le-pliage-tote/3241956?origin=category-personalizedsort&amp;contextualcategoryid=0&amp;fashionColor=Black&amp;resultback=1569'
		},
		{
			x: 205,
			y: 450.5,
			image_url: 'http://whitehouse.prod51.fr/op/img/article_first_tag3.jpg',
			title: 'Black Skinny Jeans',
			price: '38.00 €',
			cart_url: 'http://www.topshop.com/webapp/wcs/stores/servlet/ProductDisplay?catalogId=33057&amp;storeId=12556&amp;productId=17457667&amp;langId=-1'
		}
	],
	[
		{
			image_url: 'http://whitehouse.prod51.fr/op/img/article_second_tag1.jpg',
			title: 'Camel Derbies',
			price: '44.50 €',
			cart_url: 'http://www.brandalley.fr/fiche-Produit/Rayon-1394751'
		},
		{
			image_url: 'http://whitehouse.prod51.fr/op/img/article_second_tag2.jpg',
			title: 'Navy Blazer In Jersey',
			price: '66.18 €',
			cart_url: 'http://www.asos.com/ASOS/ASOS-Skinny-Blazer-In-Jersey/Prod/pgeproduct.aspx?iid=5289343&cid=5678&Rf-200=33&sh=0&pge=0&pgesize=36&sort=-1&clr=Navy&totalstyles=171&gridsize=3'
		},
		{
			image_url: 'http://whitehouse.prod51.fr/op/img/article_second_tag3.jpg',
			title: 'Straight Chinos',
			price: '29.80 €',
			cart_url: 'http://www.asos.com/asos/asos-straight-chinos/prod/pgeproduct.aspx?iid=4685063&clr=Navy&SearchQuery=chino&pgesize=36&pge=0&totalstyles=40&gridsize=3&gridrow=6&gridcolumn=3'
		},
		{
			image_url: 'http://whitehouse.prod51.fr/op/img/article_second_tag4.jpg',
			title: 'White Crew Neck Shirt',
			price: '22.00 €',
			cart_url: 'www.topman.com/en/tmuk/product/clothing-140502/mens-t-shirts-vests-2925317/plain-t-shirts-140654/premium-white-crew-neck-t-shirt-5018047?bi=40&ps=20'
		}
	],
	[
		{
			x: 510,
			y: 90,
			image_url: 'http://whitehouse.prod51.fr/op/img/article_third_product1.jpg',
			title: 'White Wooden Cabinet',
			price: '319.99 €',
			cart_url: 'http://www.home24.fr/jack-alice/vitrine-chateau-blanc-imitation-chene-de-san-remo'
		},
		{
			x: 412,
			y: 452,
			image_url: 'http://whitehouse.prod51.fr/op/img/article_third_product2.jpg',
			title: 'White Design Chair',
			price: '329.00 €',
			cart_url: 'http://www.home24.fr/m-rteens/chaise-capitonnee-troenoe-lot-de-4-matiere-synthetique-imitation-cuir-blanc'
		},
		{
			x: 230,
			y: 377,
			image_url: 'http://whitehouse.prod51.fr/op/img/article_third_product3.jpg',
			title: 'Pine Table',
			price: '359.00 €',
			cart_url: 'http://www.ikea.com/fr/fr/catalog/products/60152340/'
		}
	]
];
*/

var checksum = function(str, algorithm, encoding) {
    var result =  crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex');
    //console.log(result);
    return result;
};

var data = [];
var imageStatsInfo = [{page: window.location.href.toLowerCase()}];
var rootPath = window.location.protocol + "//" + window.location.host + "/";
console.log("OQOQOQ");
console.log(window.location.hostname);
console.log(window.location.pathname);
console.log(rootPath);
if (window.location.hostname == "54.191.85.147")
{
console.log("ROROROR");
    var path = window.location.pathname;
    if (path.indexOf("/") == 0)
    {
        path = path.substring(1);
    }
    path = path.split("/", 1);
    if (path != "")
    {
        rootPath = rootPath + path + "/";
    }
}

$(document).ready(function(){
	/*
	// Demo - Style1
	$("#image1").producttagging({type: 1, tags: data[0]});
	// Demo - Style2
	$("#image2").producttagging({type: 2, tags: data[1]});
	// Demo - Style3
	$("#image3").producttagging({type: 3, tags: data[2]});
	*/


	var dateInfo = {date: ""};
	imageStatsInfo.push(dateInfo);
	

	/* setInterval(function()
		{
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
			dateInfo.date = dateString;

			console.log(imageStatsInfo);
			$.post(SERVER_ADDRESS + '/send_stats_info', {data: imageStatsInfo}, function(res) {
			 	console.log(JSON.stringify(res));
			});			
	}, 50000000000); */

	var imageArray = [];
	$("img").each(function(){
		var t = this;
		var img_path = $(this).attr('src');
		
    
		imageArray.push(rootPath+img_path);
	});

		
	$.ajax({
		type: 'POST',
		url: SERVER_ADDRESS + '/image_by_url',
		data: {data: imageArray, page:window.location.href},
		success: function(res) 
		{
			console.log(res);
		 	if(res.length!=0) {
			 	if(res[0].success == "processed")
			 	{
			 		var imageData = [];
			 		res[2].forEach(function(item) {		 			
			 			//console.log(item);

						var item_info = [];
						item_info['x'] = item.x_pos;
						item_info['y'] = item.y_pos;
			 			if(item.itemID)
						{
							//console.log(item.itemID);
							$.ajax({
							  type: 'POST',
							  url: SERVER_ADDRESS + '/fetch_item',
							  data: {id: item.itemID},
							  success: function(itemData) {
							  	//console.log(itemData);								

								if(itemData.thumbnail.indexOf('http://')==-1)
									itemData.thumbnail = 'http://'+itemData.thumbnail;

								item_info['image_url'] = itemData.thumbnail;
								item_info['title'] = itemData.name; 
								item_info['price'] = itemData.price; 
								item_info['cart_url'] = itemData.link; 

								imageData.push(item_info);
								//console.log(imageData);
							  },
							  async:false
							});
							/*
							$.post(SERVER_ADDRESS + '/fetch_item', {id: item.itemID}, function(itemData) {
								console.log(itemData);
								count--;
								item_info['image_url'] = itemData.thumbnail;
								item_info['title'] = itemData.name; 
								item_info['price'] = itemData.price; 
								item_info['cart_url'] = itemData.link; 

								imageData.push(item_info);
								//console.log(imageData);
							});*/
						}
			 		});			 		
			 		//console.log(imageData);
			 		data.push(imageData);
			 		$(t).producttagging({type: res[1], tags: imageData});
			 	}
			 }
		},
		async:true
	});		

	console.log(data);

	//$("#image1").producttagging({type: 1, tags: data[0]});
	//$.post('http://localhost:8080/image_by_url', {data: imageArray, page:window.location.href}, function(res) {
	// 	console.log(JSON.stringify(res));
	//});
	
});
