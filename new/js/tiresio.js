function init_pagination() {
	$('.selectors').on('click', function() {
		$('.selectors').each(function() {
			$(this).removeClass('active');
		});
		$(this).addClass('active');
	});

	var pagination_index = 1;
	function check_prev_next(pagination_index) {
		if (pagination_index !== 1 && pagination_index !== 5) {
			$('.prev-pagination').removeClass('disabled');
			$('.next-pagination').removeClass('disabled');
		}
		if (pagination_index === 1) {
			$('.prev-pagination').addClass('disabled');
		}
		if (pagination_index === 5) {
			$('.next-pagination').addClass('disabled');
		}
	}
	check_prev_next(pagination_index);
	$('.prev-pagination').on('click', function() {
		if (pagination_index !== 1) {
			var current = $('.pagination .active');
			current.prev().addClass('active');
			current.removeClass('active');
			pagination_index--;
		}
		check_prev_next(pagination_index);
	});
	$('.next-pagination').on('click', function() {
		if (pagination_index !== 5) {
			var current = $('.pagination .active');
			current.next().addClass('active');
			current.removeClass('active');
			pagination_index++;
		}
		check_prev_next(pagination_index);
	});
}

function get_view(id) {
	if (id == 'publishers') {
		$('#main').load('views/publishers.html', function() {
			var demo_content = '<tr><td class="domain-name"><a class="domain-href" href="#">histoiredeuxsoeurs.com</a></td><td class="pages-process">5</td><td class="img-process">18</td><td class="visitors">30 000</td><td class="flag-tab"><span class="glyphicon glyphicon-flag"></span></td></tr>';

			var demo_tmp = '';
			for (var index = 10; index > 0; index--) {
				demo_tmp += demo_content;
			}
			$('#publishers-tbody').html(demo_tmp);
			$('.domain-href').on('click', function() {
				get_view('profile');
			});
			init_pagination();
		});
	}
	if (id == 'images') {
		$('#main').load('views/images.html', function() {

		});
	}
	if (id == 'profile') {
		$('#main').load('views/profile.html', function() {
			var demo_content = '<tr><td class="profile-page-title">virée shopping</td><td class="profile-img">9</td><td class="to-process">3</td><td class="profile-views">5 200</td><td class="profile-url"><a href="#"><span class="glyphicon glyphicon-open"></span></a></td></tr>';

			var demo_tmp = '';
			for (var index = 10; index > 0; index--) {
				demo_tmp += demo_content;
			}
			$('#profile-tbody').html(demo_tmp);
			$('#back-publishers').on('click', function() {
				get_view('publishers');
			});
			$('.profile-page-title').on('click', function() {
				get_view('articles');
			});
			init_pagination();
		});
	}
	if (id == 'articles') {
		$('#main').load('views/articles.html', function() {
			var demo_content = '<tr><td class="article-img"><img src="img/instagram.jpg" class="img-rounded"/></td><td class="article-link"><a href="#">img/histoiredeuxsoeurs/...</a><br/><p>Page/Images_URL(s) <span tabindex="0" role="button" data-trigger="focus" data-toggle="popover" class="badge popovers">42</span></p></td><td class="article-status"><fieldset disabled><input type="checkbox" checked> Processed</fieldset></td><td class="article-active"><input type="checkbox" name="on-off" checked></td></tr>';

			var demo_tmp = '';
			for (var index = 3; index > 0; index--) {
				demo_tmp += demo_content;
			}
			$('#article-tbody').html(demo_tmp);
			$("[name='on-off']").bootstrapSwitch();
			$('#back-publishers').on('click', function() {
				get_view('publishers');
			});
			$('#page-url').on('click', function() {
				get_view('profile');
			});
			$("[data-toggle=popover]").popover({
					title: 'Images URL(s)',
					html: true,
					content: '<ul class="list-urls"><li><a href="#">pageurl.com</a></li><li><a href="#">pageurl.com</a></li><li><a href="#">pageurl.com</a></li><li><a href="#">pageurl.com</a></li><li><a href="#">pageurl.com</a></li><li><a href="#">pageurl.com</a></li><li><a href="#">pageurl.com</a></li></ul>'
				});
			$('.article-img img').on('click', function() {
				get_view('vignettes');
			});
			init_pagination();
		});
	}
	if (id == 'vignettes') {
		$('#main').load('views/vignettes.html', function() {
			$('.btn-add').hide();
			$('#back-publishers').on('click', function() {
				get_view('publishers');
			});
			$('#page-url').on('click', function() {
				get_view('profile');
			});
			$('#page-article').on('click', function() {
				get_view('articles');
			});
			$("[name='on-off']").bootstrapSwitch();
			$('.thumbnail').on({
				mouseover: function() {
					$(this).children('.btn-add').show();
				},
				mouseout: function() {
					$(this).children('.btn-add').hide();
				}
			});
			$('.img-copy').on('click', function() {
				$('.mod-vignette').load('views/mod/vignette.html', function() {
					$('#modal-vign').modal('show');
				})
			});
			init_pagination();
		});
	}
}

function get_nav() {
	$('nav').load('views/nav.html', function() {
		$('#publishers-nav').on('click', function() {
			$(this).addClass('active');
			$('#images-nav').removeClass('active');
			get_view('publishers');
		});
		$('#images-nav').on('click', function() {
			$(this).addClass('active');
			$('#publishers-nav').removeClass('active');
			get_view('images');
		});
	});
}

$(document).ready(function() {
	get_nav();
	get_view('publishers');
});
