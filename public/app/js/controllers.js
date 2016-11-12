'use strict';

angular.module('xenon.controllers', []).
	controller('LoginCtrl', function($scope, $rootScope)
	{
		$rootScope.isLoginPage        = true;
		$rootScope.isLightLoginPage   = false;
		$rootScope.isLockscreenPage   = false;
		$rootScope.isMainPage         = false;
	}).
	controller('LoginLightCtrl', function($scope, $rootScope)
	{
		$rootScope.isLoginPage        = true;
		$rootScope.isLightLoginPage   = true;
		$rootScope.isLockscreenPage   = false;
		$rootScope.isMainPage         = false;
	}).
	controller('LockscreenCtrl', function($scope, $rootScope)
	{
		$rootScope.isLoginPage        = false;
		$rootScope.isLightLoginPage   = false;
		$rootScope.isLockscreenPage   = true;
		$rootScope.isMainPage         = false;
	}).
	controller('MainCtrl', function($scope, $rootScope, $location, $layout, $layoutToggles, $pageLoadingBar, Fullscreen)
	{
		$rootScope.isLoginPage        = false;
		$rootScope.isLightLoginPage   = false;
		$rootScope.isLockscreenPage   = false;
		$rootScope.isMainPage         = true;

		$rootScope.layoutOptions = {
			horizontalMenu: {
				isVisible		: true,
				isFixed			: true,
				minimal			: false,
				clickToExpand	: false,

				isMenuOpenMobile: false
			},
			sidebar: {
				isVisible		: false,
				isCollapsed		: true,
				toggleOthers	: true,
				isFixed			: true,

				isMenuOpenMobile: false,

				// Added in v1.3
				userProfile		: true
			},
			chat: {
				isOpen			: false,
			},
			settingsPane: {
				isOpen			: false,
				useAnimation	: true
			},
			container: {
				isBoxed			: false
			},
			skins: {
				sidebarMenu		: '',
				horizontalMenu	: '',
				userInfoNavbar	: ''
			},
			pageTitles: true,
			userInfoNavVisible	: false
		};

		$layout.loadOptionsFromCookies(); // remove this line if you don't want to support cookies that remember layout changes


		$scope.updatePsScrollbars = function()
		{
			var $scrollbars = jQuery(".ps-scrollbar:visible");

			$scrollbars.each(function(i, el)
			{
				if(typeof jQuery(el).data('perfectScrollbar') == 'undefined')
				{
					jQuery(el).perfectScrollbar();
				}
				else
				{
					jQuery(el).perfectScrollbar('update');
				}
			})
		};


		// Define Public Vars
		public_vars.$body = jQuery("body");


		// Init Layout Toggles
		$layoutToggles.initToggles();


		// Other methods
		$scope.setFocusOnSearchField = function()
		{
			public_vars.$body.find('.search-form input[name="s"]').focus();

			setTimeout(function(){ public_vars.$body.find('.search-form input[name="s"]').focus() }, 100 );
		};


		// Watch changes to replace checkboxes
		$scope.$watch(function()
		{
			cbr_replace();
		});

		// Watch sidebar status to remove the psScrollbar
		$rootScope.$watch('layoutOptions.sidebar.isCollapsed', function(newValue, oldValue)
		{
			if(newValue != oldValue)
			{
				if(newValue == true)
				{
					public_vars.$sidebarMenu.find('.sidebar-menu-inner').perfectScrollbar('destroy')
				}
				else
				{
					public_vars.$sidebarMenu.find('.sidebar-menu-inner').perfectScrollbar({wheelPropagation: public_vars.wheelPropagation});
				}
			}
		});


		// Page Loading Progress (remove/comment this line to disable it)
		$pageLoadingBar.init();

		$scope.showLoadingBar = showLoadingBar;
		$scope.hideLoadingBar = hideLoadingBar;


		// Set Scroll to 0 When page is changed
		$rootScope.$on('$stateChangeStart', function()
		{
			var obj = {pos: jQuery(window).scrollTop()};

			TweenLite.to(obj, .25, {pos: 0, ease:Power4.easeOut, onUpdate: function()
			{
				$(window).scrollTop(obj.pos);
			}});
		});


		// Full screen feature added in v1.3
		$scope.isFullscreenSupported = Fullscreen.isSupported();
		$scope.isFullscreen = Fullscreen.isEnabled() ? true : false;

		$scope.goFullscreen = function()
		{
			if (Fullscreen.isEnabled())
				Fullscreen.cancel();
			else
				Fullscreen.all();

			$scope.isFullscreen = Fullscreen.isEnabled() ? true : false;
		}

	}).
	controller('SidebarMenuCtrl', function($scope, $rootScope, $menuItems, $timeout, $location, $state, $layout)
	{

		// Menu Items
		var $sidebarMenuItems = $menuItems.instantiate();

		$scope.menuItems = $sidebarMenuItems.prepareSidebarMenu().getAll();

		// Set Active Menu Item
		$sidebarMenuItems.setActive( $location.path() );

		$rootScope.$on('$stateChangeSuccess', function()
		{
			$sidebarMenuItems.setActive($state.current.name);
		});

		// Trigger menu setup
		public_vars.$sidebarMenu = public_vars.$body.find('.sidebar-menu');
		$timeout(setup_sidebar_menu, 1);

		ps_init(); // perfect scrollbar for sidebar
	}).
	controller('HorizontalMenuCtrl', function($scope, $rootScope, $menuItems, $timeout, $location, $state)
	{
		var $horizontalMenuItems = $menuItems.instantiate();

		$scope.menuItems = $horizontalMenuItems.prepareHorizontalMenu().getAll();

		// Set Active Menu Item
		$horizontalMenuItems.setActive( $location.path() );

		$rootScope.$on('$stateChangeSuccess', function()
		{
			$horizontalMenuItems.setActive($state.current.name);

			$(".navbar.horizontal-menu .navbar-nav .hover").removeClass('hover'); // Close Submenus when item is selected
		});

		// Trigger menu setup
		$timeout(setup_horizontal_menu, 1);
	}).
	controller('SettingsPaneCtrl', function($rootScope)
	{
		// Define Settings Pane Public Variable
		public_vars.$settingsPane = public_vars.$body.find('.settings-pane');
		public_vars.$settingsPaneIn = public_vars.$settingsPane.find('.settings-pane-inner');
	}).
	controller('ChatCtrl', function($scope, $element)
	{
		var $chat = jQuery($element),
			$chat_conv = $chat.find('.chat-conversation');

		$chat.find('.chat-inner').perfectScrollbar(); // perfect scrollbar for chat container


		// Chat Conversation Window (sample)
		$chat.on('click', '.chat-group a', function(ev)
		{
			ev.preventDefault();

			$chat_conv.toggleClass('is-open');

			if($chat_conv.is(':visible'))
			{
				$chat.find('.chat-inner').perfectScrollbar('update');
				$chat_conv.find('textarea').autosize();
			}
		});

		$chat_conv.on('click', '.conversation-close', function(ev)
		{
			ev.preventDefault();

			$chat_conv.removeClass('is-open');
		});
	}).
	controller('UIModalsCtrl', function($scope, $rootScope, $modal, $sce)
	{
		// Open Simple Modal
		$scope.openModal = function(modal_id, modal_size, modal_backdrop)
		{
			$rootScope.currentModal = $modal.open({
				templateUrl: modal_id,
				size: modal_size,
				backdrop: typeof modal_backdrop == 'undefined' ? true : modal_backdrop
			});
		};

		// Loading AJAX Content
		$scope.openAjaxModal = function(modal_id, url_location)
		{
			$rootScope.currentModal = $modal.open({
				templateUrl: modal_id,
				resolve: {
					ajaxContent: function($http)
					{
						return $http.get(url_location).then(function(response){
							$rootScope.modalContent = $sce.trustAsHtml(response.data);
						}, function(response){
							$rootScope.modalContent = $sce.trustAsHtml('<div class="label label-danger">Cannot load ajax content! Please check the given url.</div>');
						});
					}
				}
			});

			$rootScope.modalContent = $sce.trustAsHtml('Modal content is loading...');
		}
	}).
	controller('PaginationDemoCtrl', function($scope)
	{
		$scope.totalItems = 64;
		$scope.currentPage = 4;

		$scope.setPage = function (pageNo)
		{
			$scope.currentPage = pageNo;
		};

		$scope.pageChanged = function()
		{
			console.log('Page changed to: ' + $scope.currentPage);
		};

		$scope.maxSize = 5;
		$scope.bigTotalItems = 175;
		$scope.bigCurrentPage = 1;
	}).
	controller('LayoutVariantsCtrl', function($scope, $layout, $cookies)
	{
		$scope.opts = {
			sidebarType: null,
			fixedSidebar: null,
			sidebarToggleOthers: null,
			sidebarVisible: null,
			sidebarPosition: null,

			horizontalVisible: null,
			fixedHorizontalMenu: null,
			horizontalOpenOnClick: null,
			minimalHorizontalMenu: null,

			sidebarProfile: null
		};

		$scope.sidebarTypes = [
			{value: ['sidebar.isCollapsed', false], text: 'Expanded', selected: $layout.is('sidebar.isCollapsed', false)},
			{value: ['sidebar.isCollapsed', true], text: 'Collapsed', selected: $layout.is('sidebar.isCollapsed', true)},
		];

		$scope.fixedSidebar = [
			{value: ['sidebar.isFixed', true], text: 'Fixed', selected: $layout.is('sidebar.isFixed', true)},
			{value: ['sidebar.isFixed', false], text: 'Static', selected: $layout.is('sidebar.isFixed', false)},
		];

		$scope.sidebarToggleOthers = [
			{value: ['sidebar.toggleOthers', true], text: 'Yes', selected: $layout.is('sidebar.toggleOthers', true)},
			{value: ['sidebar.toggleOthers', false], text: 'No', selected: $layout.is('sidebar.toggleOthers', false)},
		];

		$scope.sidebarVisible = [
			{value: ['sidebar.isVisible', true], text: 'Visible', selected: $layout.is('sidebar.isVisible', true)},
			{value: ['sidebar.isVisible', false], text: 'Hidden', selected: $layout.is('sidebar.isVisible', false)},
		];

		$scope.sidebarPosition = [
			{value: ['sidebar.isRight', false], text: 'Left', selected: $layout.is('sidebar.isRight', false)},
			{value: ['sidebar.isRight', true], text: 'Right', selected: $layout.is('sidebar.isRight', true)},
		];

		$scope.horizontalVisible = [
			{value: ['horizontalMenu.isVisible', true], text: 'Visible', selected: $layout.is('horizontalMenu.isVisible', true)},
			{value: ['horizontalMenu.isVisible', false], text: 'Hidden', selected: $layout.is('horizontalMenu.isVisible', false)},
		];

		$scope.fixedHorizontalMenu = [
			{value: ['horizontalMenu.isFixed', true], text: 'Fixed', selected: $layout.is('horizontalMenu.isFixed', true)},
			{value: ['horizontalMenu.isFixed', false], text: 'Static', selected: $layout.is('horizontalMenu.isFixed', false)},
		];

		$scope.horizontalOpenOnClick = [
			{value: ['horizontalMenu.clickToExpand', false], text: 'No', selected: $layout.is('horizontalMenu.clickToExpand', false)},
			{value: ['horizontalMenu.clickToExpand', true], text: 'Yes', selected: $layout.is('horizontalMenu.clickToExpand', true)},
		];

		$scope.minimalHorizontalMenu = [
			{value: ['horizontalMenu.minimal', false], text: 'No', selected: $layout.is('horizontalMenu.minimal', false)},
			{value: ['horizontalMenu.minimal', true], text: 'Yes', selected: $layout.is('horizontalMenu.minimal', true)},
		];

		$scope.chatVisibility = [
			{value: ['chat.isOpen', false], text: 'No', selected: $layout.is('chat.isOpen', false)},
			{value: ['chat.isOpen', true], text: 'Yes', selected: $layout.is('chat.isOpen', true)},
		];

		$scope.boxedContainer = [
			{value: ['container.isBoxed', false], text: 'No', selected: $layout.is('container.isBoxed', false)},
			{value: ['container.isBoxed', true], text: 'Yes', selected: $layout.is('container.isBoxed', true)},
		];

		$scope.sidebarProfile = [
			{value: ['sidebar.userProfile', false], text: 'No', selected: $layout.is('sidebar.userProfile', false)},
			{value: ['sidebar.userProfile', true], text: 'Yes', selected: $layout.is('sidebar.userProfile', true)},
		];

		$scope.resetOptions = function()
		{
			$layout.resetCookies();
			window.location.reload();
		};

		var setValue = function(val)
		{
			if(val != null)
			{
				val = eval(val);
				$layout.setOptions(val[0], val[1]);
			}
		};

		$scope.$watch('opts.sidebarType', setValue);
		$scope.$watch('opts.fixedSidebar', setValue);
		$scope.$watch('opts.sidebarToggleOthers', setValue);
		$scope.$watch('opts.sidebarVisible', setValue);
		$scope.$watch('opts.sidebarPosition', setValue);

		$scope.$watch('opts.horizontalVisible', setValue);
		$scope.$watch('opts.fixedHorizontalMenu', setValue);
		$scope.$watch('opts.horizontalOpenOnClick', setValue);
		$scope.$watch('opts.minimalHorizontalMenu', setValue);

		$scope.$watch('opts.chatVisibility', setValue);

		$scope.$watch('opts.boxedContainer', setValue);

		$scope.$watch('opts.sidebarProfile', setValue);
	}).
	controller('ThemeSkinsCtrl', function($scope, $layout)
	{
		var $body = jQuery("body");

		$scope.opts = {
			sidebarSkin: $layout.get('skins.sidebarMenu'),
			horizontalMenuSkin: $layout.get('skins.horizontalMenu'),
			userInfoNavbarSkin: $layout.get('skins.userInfoNavbar')
		};

		$scope.skins = [
			{value: '', 			name: 'Default'			,	palette: ['#2c2e2f','#EEEEEE','#FFFFFF','#68b828','#27292a','#323435']},
			{value: 'aero', 		name: 'Aero'			,	palette: ['#558C89','#ECECEA','#FFFFFF','#5F9A97','#558C89','#255E5b']},
			{value: 'navy', 		name: 'Navy'			,	palette: ['#2c3e50','#a7bfd6','#FFFFFF','#34495e','#2c3e50','#ff4e50']},
			{value: 'facebook', 	name: 'Facebook'		,	palette: ['#3b5998','#8b9dc3','#FFFFFF','#4160a0','#3b5998','#8b9dc3']},
			{value: 'turquoise', 	name: 'Truquoise'		,	palette: ['#16a085','#96ead9','#FFFFFF','#1daf92','#16a085','#0f7e68']},
			{value: 'lime', 		name: 'Lime'			,	palette: ['#8cc657','#ffffff','#FFFFFF','#95cd62','#8cc657','#70a93c']},
			{value: 'green', 		name: 'Green'			,	palette: ['#27ae60','#a2f9c7','#FFFFFF','#2fbd6b','#27ae60','#1c954f']},
			{value: 'purple', 		name: 'Purple'			,	palette: ['#795b95','#c2afd4','#FFFFFF','#795b95','#27ae60','#5f3d7e']},
			{value: 'white', 		name: 'White'			,	palette: ['#FFFFFF','#666666','#95cd62','#EEEEEE','#95cd62','#555555']},
			{value: 'concrete', 	name: 'Concrete'		,	palette: ['#a8aba2','#666666','#a40f37','#b8bbb3','#a40f37','#323232']},
			{value: 'watermelon', 	name: 'Watermelon'		,	palette: ['#b63131','#f7b2b2','#FFFFFF','#c03737','#b63131','#32932e']},
			{value: 'lemonade', 	name: 'Lemonade'		,	palette: ['#f5c150','#ffeec9','#FFFFFF','#ffcf67','#f5c150','#d9a940']},
		];

		$scope.$watch('opts.sidebarSkin', function(val)
		{
			if(val != null)
			{
				$layout.setOptions('skins.sidebarMenu', val);

				$body.attr('class', $body.attr('class').replace(/\sskin-[a-z]+/)).addClass('skin-' + val);
			}
		});

		$scope.$watch('opts.horizontalMenuSkin', function(val)
		{
			if(val != null)
			{
				$layout.setOptions('skins.horizontalMenu', val);

				$body.attr('class', $body.attr('class').replace(/\shorizontal-menu-skin-[a-z]+/)).addClass('horizontal-menu-skin-' + val);
			}
		});

		$scope.$watch('opts.userInfoNavbarSkin', function(val)
		{
			if(val != null)
			{
				$layout.setOptions('skins.userInfoNavbar', val);

				$body.attr('class', $body.attr('class').replace(/\suser-info-navbar-skin-[a-z]+/)).addClass('user-info-navbar-skin-' + val);
			}
		});
	}).
	controller('HomeCtrl', function($scope, $rootScope, $element, $state, $http)
	{
		clearInterval($rootScope.timer);
		$scope.submit = function(){
			//console.log($scope.domainURL);
			$rootScope.domainURL = $scope.domainURL;

			$http.post('/get_image_by_domain', 
				{domainURL: $scope.domainURL}				
			).success(function(data) {
			 	//console.log(data);
			 	$rootScope.imageArray = data;
			 	$state.go('app.image-list');
			});		   	
		}
	}).
	controller('ImageListCtrl', function($scope, $rootScope, $element, $modal, $state, $http)
	{
		clearInterval($rootScope.timer);
		$scope.imageArray = $rootScope.imageArray;
		$scope.imageData = [];
		console.log("image list :", $scope.imageArray);

		$('#back-image').click(function(e) {
		    var offset = $(this).offset();
		    $rootScope.x_pos = (e.pageX - offset.left).toFixed(1);
		    $rootScope.y_pos = (e.pageY - offset.top).toFixed(1);
		});

		$scope.openModal = function(modal_id, modal_size, modal_backdrop)
		{
			$rootScope.currentModal = $modal.open({
				templateUrl: modal_id,
      			controller: 'ModalInstanceCtrl',
				size: modal_size,
				resolve: {
			        items: function () {
			          //return '123';
			        }
			      },
				backdrop: typeof modal_backdrop == 'undefined' ? true : modal_backdrop
			});

			$rootScope.currentModal.result.then(function (item_data) {
		      //console.log(item_data);
		      if(item_data)
		      {
		      	//console.log($scope.imageData._id);
		      	//console.log(item_data._id);
		      	console.log($rootScope.format);
		      	$http.post('/tag_item_to_image', 
					{
						imageID: $scope.imageData._id,
						itemID: item_data._id,
						x_pos: $rootScope.x_pos,
						y_pos: $rootScope.y_pos,
						format: $rootScope.format
					}				
				).success(function(data) {
				 	alert(data);

				});	
		      }

		    }, function () {
		      
		    });
		};

		$scope.image_clicked = function(id) {
			//console.log("item clicked" + id);
			$scope.imageData = $scope.imageArray[id];
			$scope.imageIndex = id;
			$scope.itemDataArray = [];
			$scope.imageData.item_data.forEach(function(item) {
				var item_info = [];
				console.log(item.itemID);
				item_info['x'] = item.x_pos;
				item_info['y'] = item.y_pos;				
				$.ajax({
					type: 'POST',
					url: '/fetch_item',
					data: {id: item.itemID},
					success: function(itemData) {
						console.log(itemData);								

						if(itemData.thumbnail.indexOf('http://')==-1)
							itemData.thumbnail = 'http://'+itemData.thumbnail;

						item_info['image_url'] = itemData.thumbnail;
						item_info['title'] = itemData.name; 
						item_info['price'] = itemData.price; 
						item_info['cart_url'] = itemData.link; 

						$scope.itemDataArray.push(item_info);
					},
					async:false
				});
			});
			//console.log($scope.imageData);
			var e = document.getElementById("imgEdit");
	       	if(e.style.display == 'block')
	          	e.style.display = 'none';
	       	else
	          	e.style.display = 'block';
		};

		$scope.openEditModal = function(item_id, modal_id, modal_size, modal_backdrop)
		{			
			$rootScope.editModal = $modal.open({
				templateUrl: modal_id,
      			controller: 'EditModalInstanceCtrl',
				size: modal_size,
				resolve: {
			        items: function () {
			          return $scope.itemDataArray[item_id];
			        }
			      },
				backdrop: typeof modal_backdrop == 'undefined' ? true : modal_backdrop
			});

			$rootScope.editModal.result.then(function (action) {	
				if(action==1)
				{
					$http.post('/update_item_on_image', 
					{
						imageID: $scope.imageData._id,
						itemIndex: item_id,
						new_x: $rootScope.new_x,
						new_y: $rootScope.new_y
					}				
					).success(function(res) {
					 	alert(res);
					});
				}	
				else
				{
					$http.post('/remove_item_from_image', 
					{
						imageID: $scope.imageData._id,
						itemIndex: item_id					
					}				
					).success(function(res) {
					 	alert(res);
					 	$scope.itemDataArray.splice(item_id, 1);
					});
				}					
				
		    }, function () {
		    	
		    });
		};
		

		$scope.Remove = function() {
			$http.post('/remove_image', 
					{
						id: $scope.imageData._id.toString()						
					}				
				).success(function(data) {
				 	alert(data);
				 	$rootScope.imageArray.splice($scope.imageIndex, 1);
				 	//$scope.imageArray.splice($scope.imageIndex, 1);
				 	/*location.reload(); 
				 	$http.post('/get_image_by_domain', 
						{domainURL: $rootScope.domainURL}				
					).success(function(data) {
					 	console.log(data);
					 	$rootScope.imageArray = data;					 	
					 	$state.go('app.image-list');
					});	*/
				});	
		};

		$scope.dragOptions = {
	        start: function(e, item) {
	          console.log("STARTING", item);

	        },
	        drag: function(e, item) {
	          console.log("DRAGGING");

	        },
	        stop: function(e, item) {
	          console.log("STOPPING");
	          var offset = $('#back-image').offset();
	          $rootScope.new_x = (e.pageX - offset.left).toFixed(1);
	          $rootScope.new_y = (e.pageY - offset.top).toFixed(1);
	        },
	        container: 'back-image'
	    }
	}).
	controller('ModalInstanceCtrl', function ($scope, $rootScope, $modalInstance, items, $http) 
	{
		//console.log(items);
	  	//$scope.items = items;

		$scope.ok = function () {
			var e = document.getElementById("format_select");
			$rootScope.format = e.options[e.selectedIndex].value;
			$modalInstance.close($scope.item_data);			
		};

		$scope.cancel = function () {
		    $modalInstance.dismiss();
		};

		$scope.SearchItem = function() {
			$http.post('/search_item', 
				{
					keyword: $scope.itemID
				}
			).success(function(res) {
				if(res.length==0)
				{
					alert("No search result!");
					var e = document.getElementById("item_data");
			       	if(e.style.display == 'block')
			          	e.style.display = 'none';
			    }
				else {
					var result = res[0];
					//console.log(result);
					$scope.item_data = result;
					var e = document.getElementById("item_data");
			       	if(e.style.display == 'none')
			          	e.style.display = 'block';

					$scope.thumbnail = result.thumbnail;
					if($scope.thumbnail.indexOf('http://')==-1)
						$scope.thumbnail = 'http://'+result.thumbnail;	
					//$('#thumbnail').attr('src', 'http://'+result.thumbnail);
					$scope.name = result.name;
					$scope.refID = result.refID;
					$scope.description = result.description;
					$scope.price = result.price;
					$scope.link = result.link;
					$scope.store_name = result.store_name;
					$scope.brand = result.brand;
					$scope.hashtags = result.hashtags;
				}
			});
		};
	}).
	controller('EditModalInstanceCtrl', function ($scope, $rootScope, $modalInstance, items, $http) 
	{
		//console.log(items);
	  	$scope.itemInfo = items;
	  	$scope.new_x_pos = $rootScope.new_x;
	  	$scope.new_y_pos = $rootScope.new_y;
		$scope.update = function () {

			$modalInstance.close(1);			
		};

		$scope.remove = function () {
			$modalInstance.close(0);
		    //$modalInstance.dismiss();
		};		
	}).
	controller('Home2Ctrl', function($scope, $rootScope, $element, $state)
	{
		clearInterval($rootScope.timer);
		$scope.submit = function() {
			//console.log($scope.search_by_id);
			
		    $state.go('app.image-list');
		}
	}).
	controller('Home3Ctrl', function($scope, $rootScope, $element, $state, $http)
	{
		clearInterval($rootScope.timer);
		function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                
                reader.onload = function (e) {
                	//document.getElementById('thumbnail_img').style.display = 'block';
                    //$('#thumbnail_img').attr('src', e.target.result);
                    //console.log(e.target.result);
                    $scope.thumbnail = e.target.result;
                }
                
                reader.readAsDataURL(input.files[0]);
            }
        }

		$('#thumbnail').on('change', function () {
			readURL(this);		        
		});

		$scope.addItem = function() {
			$http.post('/add_item', 
				{
					name: $scope.name,
					refID: $scope.refID,
					description: $scope.description,
					price: $scope.price,
					link: $scope.link,
					thumbnail: $scope.thumbnail,
					store_name: $scope.store,
					brand: $scope.brand,
					hashtags: $scope.hashtags
				}				
			).success(function(res) {
			 	//console.log(res);
			 	alert(res);
			});	
		}
	}).
	controller('Home4Ctrl', function($scope, $rootScope, $element, $state, $http)
	{
		clearInterval($rootScope.timer);
		function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                
                reader.onload = function (e) {
                	//document.getElementById('thumbnail_img').style.display = 'block';
                    //$('#thumbnail_img').attr('src', e.target.result);
                    //console.log(e.target.result);
                    $scope.thumbnail = e.target.result;
                }
                
                reader.readAsDataURL(input.files[0]);
            }
        }

		$('#thumbnail').on('change', function () {
			readURL(this);		        
		});

		$scope.SearchItem = function() {
			$http.post('/search_item', 
				{
					keyword: $scope.itemID
				}
			).success(function(res) {
				if(res.length==0)
				{
					alert("No search result!");
					var e = document.getElementById("item_data");
			       	if(e.style.display == 'block')
			          	e.style.display = 'none';
			    }
				else {
					var result = res[0];
					//console.log(result);
					$scope.item_data = result;
					var e = document.getElementById("item_data");
			       	if(e.style.display == 'none')
			          	e.style.display = 'block';

					//$scope.thumbnail = result.thumbnail;
					//if($scope.thumbnail.indexOf('http://')==-1)
					//	$scope.thumbnail = 'http://'+result.thumbnail;	
					//$('#thumbnail').attr('src', 'http://'+result.thumbnail);
					$scope.name = result.name;
					$scope.refID = result.refID;
					$scope.description = result.description;
					$scope.price = result.price;
					$scope.link = result.link;
					$scope.store_name = result.store_name;
					$scope.brand = result.brand;
					//e = document.getElementById("tagsinput-1");
					$('#tagsinput-1').attr('value', result.hashtags);
					//$scope.hashtags = result.hashtags;
				}
			});
		};

		$scope.updateItem = function() {
			$http.post('/update_item', 
				{
					id:   $scope.item_data._id.toString(),
					name: $scope.name,
					refID: $scope.refID,
					description: $scope.description,
					price: $scope.price,
					link: $scope.link,
					thumbnail: $scope.thumbnail,
					store_name: $scope.store_name,
					brand: $scope.brand,
					hashtags: $scope.hashtags
				}				
			).success(function(res) {
			 	//console.log(data);
			 	alert(res);
			});	
		};

		$scope.removeItem = function() {
			$http.post('/remove_item', 
				{
					id:   $scope.item_data._id.toString()					
				}				
			).success(function(res) {
			 	//console.log(data);
			 	alert(res);
			});	
		}
	}).
	controller('Home5Ctrl', function($scope, $rootScope, $element, $state, $http)
	{
		$http.post('/get_domains', {}				
		).success(function(res) {
		 	//console.log(data);
		 	//alert(res);
		 	$scope.domains = res;
		});	

		var dF = Date.parse($scope.dateFrom);
		var dT = Date.parse($scope.dateTo);

		if(!dF)
			$scope.dateFrom = '12/12/2012';
		if(!dT)
		{
			var currentTime = new Date();
			var month = currentTime.getMonth() + 1;
			var day = currentTime.getDate();
			var year = currentTime.getFullYear();
			if(day<10)
				day = '0' + day;
			if(month<10)
				month = '0' + month;

			$scope.dateTo = day + '/' + month + '/' + year;
		}

		$rootScope.timer = setInterval(function(){
			$scope.jsCalls = 0;
	 		$scope.nullReturn = 0;
	 		$scope.trueReturn = 0;
	 		$scope.returnItems = 0;

			//var dF = Date.parse($scope.dateFrom);
			//var dT = Date.parse($scope.dateTo);
			var temp = $scope.dateFrom;
			if(temp)
				temp = temp.substring(6) + '-' + temp.substring(3,5) + '-' + temp.substring(0,2);
			//console.log(temp);
			var dF = Date.parse(temp);
			//console.log(dF);
			temp = $scope.dateTo;
			if(temp)
				temp = temp.substring(6) + '-' + temp.substring(3,5) + '-' + temp.substring(0,2);
			//console.log(temp);
			var dT = Date.parse(temp);
			console.log(dF+"~"+dT);
			if(!dF || !dT)
				alert("Please input date range for searching Stats info");
			else {
				//console.log(dF+"~"+dT);

				var temp = $scope.dateFrom;
				if(temp)
					temp = temp.substring(6) + '-' + temp.substring(3,5) + '-' + temp.substring(0,2);
				//console.log(temp);
				dF = Date.parse(temp);
				//console.log(dF);
				temp = $scope.dateTo;
				if(temp)
					temp = temp.substring(6) + '-' + temp.substring(3,5) + '-' + temp.substring(0,2);
				//console.log(temp);
				dT = Date.parse(temp);
				//console.log(dT);

				var e = document.getElementById("domain_select");
				var domain_alias = "all";
				if(e.options[e.selectedIndex].value!=0)
					domain_alias = $scope.domains[e.options[e.selectedIndex].value-1];

				$http.post('/get_jsInfo', 
				{
					dateFrom: dF,
					dateTo:   dT,
					domainAlias: domain_alias
				}				
				).success(function(res) {
					res.forEach(function(info) {
						$scope.jsCalls += info.JsCall;
				 		$scope.nullReturn += info.NullReturn;
				 		$scope.trueReturn += info.TrueReturn;
				 		$scope.returnItems += info.ReturnItems;
					});			 	
				});	

				$http.post('/get_statsInfo', 
				{
					dateFrom: dF,
					dateTo:   dT,
					domainAlias: domain_alias
				}				
				).success(function(res) {
					console.log(res);
					$scope.imgStatsArray = [];
					if(res.length!=0) {
						res.forEach(function(info) {
							if(info.StatsInfo.length!=0) {
								//$scope.imgStatsArray = info;
								info.StatsInfo.forEach(function(statsData) {
									if($scope.imgStatsArray.length==0)
									{
										var new_stats = {};
										new_stats['ImageID'] = statsData.ImageID;
										new_stats['HoverImage'] = statsData.HoverImage;
										new_stats['HoverItem'] = statsData.HoverItem;
										new_stats['AddToCart'] = statsData.AddToCart;
										$scope.imgStatsArray.push(new_stats);
									}
									else
									{
										var same_image_found = false;
										var counter = 0;
										$scope.imgStatsArray.forEach(function(imgStatsItem){
											if(!same_image_found && imgStatsItem.ImageID == statsData.ImageID)
											{
												same_image_found = true;
												imgStatsItem.HoverImage += statsData.HoverImage;
												imgStatsItem.HoverItem += statsData.HoverItem;
												imgStatsItem.AddToCart += statsData.AddToCart;
											}
										});
										if(!same_image_found)
										{
											var new_stats = {};
											new_stats['ImageID'] = statsData.ImageID;
											new_stats['HoverImage'] = statsData.HoverImage;
											new_stats['HoverItem'] = statsData.HoverItem;
											new_stats['AddToCart'] = statsData.AddToCart;
											$scope.imgStatsArray.push(new_stats);
										}
									}
								});
							}
						});		
					}	 	
				});	
			}
		}, 10000);

	});