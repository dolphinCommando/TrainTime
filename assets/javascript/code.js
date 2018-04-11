database = firebase.database();

setInterval(function() {
	var currentTime = moment(moment()).format('hh:mm');
	database.ref().update({
		'currently': currentTime
	});
}, 1*1000);

$('#submit').click(function(event) {
	var regex = new RegExp('^[0-1][0-9]:[0-5][0-9]$|^[2][0-3]:[0-5][0-9]$');
	//console.log($('#start').val().match(regex));
	var fieldsFilled = true;
	var inputs = document.getElementsByClassName('add');
	for (var i = 0; i < inputs.length; i++) {
		if(!(inputs[i].validity.valid)) {
			inputs[i].setAttribute('class', 'form-control add is-invalid');
			fieldsFilled = false;
		}
	}
    event.preventDefault();
	if (Number.parseInt($('#frequency').val(), 10) === NaN || Number.parseInt($('#frequency').val(), 10) < 1) {	
		$('#frequency').val('Enter an integer greater than or equal to 1');	
	}
	else if ($('#start').val().match(regex) === null) {
		$('#start').val('Enter a time between 00:00 and 23:59');
	}
	else if (fieldsFilled) {
    	database.ref().child('trains').push({'name': $('#name').val(), 'destination': $('#destination').val(), 'start': $('#start').val(), 'frequency': $('#frequency').val()});
		$('.add').val('');
		$('.add').attr('class', 'form-control add');
    }
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



