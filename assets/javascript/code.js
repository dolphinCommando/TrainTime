database = firebase.database();

setInterval(function() {
	var currentTime = moment(moment()).format('hh:mm');
	database.ref().update({
		'currently': currentTime
	});
}, 1*1000);

$('#submit').click(function(event) {
    event.preventDefault();
    database.ref().child('trains').push({'name': $('#name').val(), 'destination': $('#destination').val(), 'start':  $('#start').val(), 'frequency': $('#frequency').val()});
	$('.add').val('');
});

database.ref().on('value', function(snap) {
  console.log(JSON.stringify(snap.val()));
});

