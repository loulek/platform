// var socket = io().connect();

// socket.on('connect', function(data) {
//   console.log('on connect -> connected');
//   console.log(data);
// });

// initialize masonry with jquery
$(function() {
	$('.grid').masonry();

	var overlay = false;
	$('#overlay').hide();

	$(document).ajaxStart(function() {
		overlay = true;
		setTimeout(function(){
			if(overlay) {
				$('#overlay').show()
			}
		},1000)
	});

	$(document).ajaxStop(function() {
		overlay = false;
		$('#overlay').hide();
	});
});

sessionStorage.auth = false;

