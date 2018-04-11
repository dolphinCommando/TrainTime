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
  //console.log(JSON.stringify(snap.val()));
  $('#trains').empty();
  snap.child('trains').forEach(function(childSnap) {
	  //console.log(childSnap.val());
	  var timeLeft= getMinutesTilTrain(childSnap.val().start, childSnap.val().frequency);
	  var nextTime = moment().add(timeLeft, "minutes").format('hh:mm A');
	  $('#trains').append(`
	  <tr>
	    <td>${childSnap.val().name}</td>
		<td>${childSnap.val().destination}</td>
		<td>${childSnap.val().frequency}</td>
		<td>${nextTime}</td>
		<td>${timeLeft}</td>  
	  </tr>
	  `);  
  });
});

function getMinutesTilTrain(firstTime, tFrequency) {
	var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % tFrequency;
   
    return (tFrequency - tRemainder);

}



