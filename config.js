console.log("script loaded");
var rounds, defLength
var fibNumbers = "0.1,0.1,0.2,0.3,0.5,0.8,1.3,2.1,3.4,5.5,6.0,6.0,60,60";
var lengths, antes, blinds, comments, minutes;
var dlengths, dantes, dblinds, dcomments, dminutes;
var fibTest = false;
var removed = false;


function initialSetUp(){ //gets stuff from the html
	rounds = $("#rounds").val();
	defLength = $("#standardLength").val();
	antes= $("#antes").val();
	dantes = antes;
	blinds = $("#blinds").val();
	dblinds=blinds
	comments = $("#comments").val();
	dcomments = comments;
	generateLengths();
	dlengths = lengths;
	refreshGui();
}

function setRounds(){
	rounds = $("#rounds").val();
	generateLengths();
	refreshGui();
}

function setDefLen () {
	defLength = $("#standardLength").val();
	generateLengths();
	refreshGui();
}

function setLengths(){
	lengths = $('#lengths').val();
	refreshGui();
}

function setAnte(){
	antes = $('#antes').val();
	refreshGui();
}

function setBlinds(){
	blinds = $('#blinds').val();
	refreshGui();
}

function setComments(){
	comments = $('#comments').val();
	refreshGui();
}

function setMinutes(){
	minutes = $('#minutes').val();
	if ($('#minutes').val()>0){
		createCookie("tid","",-1);
		console.log("Cookie deleted");
	}
	refreshGui();
}

function reset(){
	console.log("reset!");
	$('#lengths').val(dlengths);
	$('#antes').val(dantes);
	$('#blinds').val(dblinds);
	$('#comments').val(dcomments);
	$('#rounds').val("14");
	$('#standardLength').val("45");
	if (fibTest) {
		toggleFibTest();
		$('#fibTest').prop('checked',false);
	}
}

function refreshGui(){
	$("#rounds").val(rounds);
	$("#standardLength").val(defLength);
	$("#lengths").val(lengths);
	$("#antes").val(antes);
	$("#blinds").val(blinds);
	$("#comments").val(comments);
	console.log("Gui Refreshed");
}

function addListeners(){
	$('#rounds').change(setRounds);
	$('#standardLength').change(setDefLen);
	$('#fibTest').click(toggleFibTest);
	$('#minutes').change(setMinutes);
	$('#lengths').change(setLengths);
	$('#antes').change(setAnte);
	$('#blinds').change(setBlinds);
	$('#comments').change(setComments);
	$('#reset').click(reset);
}

function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

function toggleFibTest(){
	if(fibTest){
		fibTest=false;
		$("#standardLength").prop('disabled', false);
		$("#rounds").prop('disabled', false);
		generateLengths();
	}else{
		lengths = fibNumbers;
		fibTest=true;
		$("#rounds").prop('disabled', true);
		$("#standardLength").prop('disabled', true);
	}
	refreshGui();
}

function generateLengths(){
	var genLengths = [];
	for (i=0; i<rounds; i++){
		genLengths[i]=defLength;
	}
	lengths = genLengths;
}

$(document).ready(function(){ //wait until the html is loaded before starting script
	initialSetUp();
	addListeners();
	console.log("Script done");
});
