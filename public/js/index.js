// initialize masonry with jquery
// $(function() {
// 	$('.grid').masonry();

// 	var overlay = false;
// 	$('#overlay').hide();

// 	$(document).ajaxStart(function() {
// 		overlay = true;
// 		setTimeout(function(){
// 			if(overlay) {
// 				$('#overlay').show()
// 			}
// 		},1000)
// 	});

// 	$(document).ajaxStop(function() {
// 		overlay = false;
// 		$('#overlay').hide();
// 	});
// });

$(function() {
	$('.grid').masonry();

	var overlay = false;
	$('#overlay').hide();
	var requests = 0;
	$(document).ajaxStart(function() {
		requests++;
		if(requests > 0) {
			$('#overlay').show()
		}
	});

	$(document).ajaxStop(function() {
		requests--;
		if (requests < 0) {
			$('#overlay').hide();			
		}
	});
});

sessionStorage.auth = false;

