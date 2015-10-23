//Created by Ole Halvor Dahl
console.log('Loading script');
var tid          = 0;              //The main time variable - conatins total milliseconds played
var start        = false;        //Contains whether the clock is running or not
var startTid     = new Date();//The time when you last started the clock  
var stopTid      = new Date(); //the time when you last stopped the clock
var upTid        = 0;
var diffTid      = 0;          //the difference in time between each time the clock function is run - each time this is added to "tid"
var dispTid      = 0;          //the time that will be shown
var tidS;
var nyStreng;
var tidSlen;
var myVar;
var remaining    = 0;
var tempBlindTid = 0;
var currLev      = 0;        //current level
var levCheck     = 0;  
var sound        = false;      //stores if you have clicked to enable sound checkbox
var pause        = false;      //stores if you have clicked to enable pause checkbox
var minutesPlayed;      //if you input a "minutes played" in config - it is stored here

// -------  Configuration Variables (not in use (only for defining names now))------ //
var blinds       = [1,1,1,1,1,1,1,1, 1, 1, 1, 1,1,1];   //What you put here is irrelevant, but it must be the same size as blindsLengde[]
var blindsLengde = [45,45,60,60,60,60,60,60,60,60, 60, 60, 60, 60]; //Hvo many minutes each level is
var ante         = [0,0,2,5,10,10,25,25, 50, 50, 100, 100, 200, 300];
var comment      = ["","","","Remove white","","","Remove red","", "", "", "Remove blue", "", "", ""];
var blindVerdi   = ["2-4","5-10","10-20","25-50","40-80","50-100","75-150","100-200", "150-300", "200-400", "300-600", "400-800", "500-1000", "750-1500"];
var chipvalue    = [2,5,25,100,500];
var chipcolor    = ["white","blue","red","green","black"];
var chipamount   = [10,11,9,7,0];
// -------  Configuration Variables (not in use)------ //



// -------  Getting and parsing Variables from url ------ //
var varArr= [1,1];
var mottat=get_query(); //getting variables
var c =0;
for (m in mottat){
  varArr[c] = mottat[m];
  c++;
}
for (a in varArr){  //Replace URL symbols '%2C' and '%22' with a comma or a ' " '
  varArr[a] = varArr[a].replace(/%2C/g, ",");
varArr[a] = varArr[a].replace(/%22/g, '"');
}
//console.log(varArr);
//Splitting the array on the commas and storing them in individual variables
blindsLengde = varArr[0].split(',');
blinds       = varArr[0].split(',');  // "blinds" ends up storing the milliseconds since start at each level change.
ante         = varArr[1].split(',');
comment      = varArr[3].split(',');
blindVerdi   = varArr[2].split(',');
chipvalue    = varArr[4].split(',');

minutesPlayed = varArr[5];
//console.log("minutes played: "+minutesPlayed);
//console.log("Chip values: "+chipvalue);




// -------  Getting and parsing Variables from url ------ //


//This loops generates the total time until each level and saves it in blinds[]
for (var i=0; i<blinds.length; i++){  
	blinds[i] = (blindsLengde[i]*60000) + tempBlindTid; //multiplied by 60000, minutes to milliseconds
	tempBlindTid += (blindsLengde[i]*60000);
  //if each level is 60 minutes, blinds[0] = 0, blinds[1] = 60*60000, blinds[2] = blinds [1] + 60*60000 etc.
}

function removeAllCurrent(){  //this removes the colored cell from the table - used at level change
  for (var i = 0; i<blindsLengde.length; i++){
    // document.getElementById("c"+(i+1)).innerHTML =" ";
  }
}


function setCurrent(current){  
  try{
    removeAllCurrent();
    // document.getElementById(current).innerHTML ="_"; 
    // document.getElementById(current).style.background="#111111";  //This makes the "current"-cell in the current row black.
  }catch(err){console.log(err.message);}
}

//This adds a row to the table, "divnr" is an ID to manipulate the cell later, same with "row.id"
function addRow(content1,content2,content3,content4,content5,divnr){
 if (!document.getElementsByTagName) return;
   tabBody=document.getElementsByTagName("tbody").item(0);
   row=document.createElement("tr");
   row.id="r"+content1;
   cell1 = document.createElement("td");
   cell2 = document.createElement("td");
   cell3 = document.createElement("td");
   cell4 = document.createElement("td");
   cell5 = document.createElement("td");
   // cell6 = document.createElement("td");
   div = document.createElement("div");
   div.id = divnr;
   textnode1=document.createTextNode(content1);
   textnode2=document.createTextNode(content2);
   textnode3=document.createTextNode(content3);
   textnode4=document.createTextNode(content4);
   textnode5=document.createTextNode(content5);
   //textnode6=document.createTextNode(content6);
   cell1.appendChild(textnode1);
   cell2.appendChild(textnode2);
   cell3.appendChild(textnode3);
   cell4.appendChild(textnode4);
   cell5.appendChild(textnode5);
   //cell6.appendChild(textnode6);
   // cell6.appendChild(div);
   // div.appendChild(textnode6);
   row.appendChild(cell1);
   row.appendChild(cell2);
   row.appendChild(cell3);
   row.appendChild(cell4);
   row.appendChild(cell5);
   // row.appendChild(cell6);
   tabBody.appendChild(row);
 }

function pad(n){return n<10 ? '0'+n : n;}  //Makes 1 into 01.. used by the timer/clock

function nyVisTid(tid){   //converts from JS Date format(or milliseconds) to a more readeable one (HH:MM:SS)
	var d = new Date(tid);
	//console.log(tid);
	var text = pad(d.getUTCHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
  return text;
}

//Makes the current row bigger, and the rest smaller
function resizeTable(){ 
  var on = true;
  for (i=0; i<blindsLengde.length; i++){
    var rowId = "#r"+(i-1)+" td";
    if (i==currLev+2 ){
      $(rowId).css('padding', '8px');
      $(rowId).css('font-size', '24px'); 
    }
    else {
      $(rowId).css('padding', '4px');
      $(rowId).css('font-size', '14px'); 
    }
  }
}

var prevColor = $('#r1').css('background');
color = '#92FF5C';
$('#r1').css('background',color);

function update(){						        //this function is run over and over with x ms delay - This is the core of the clock. 
  diffTid = Date.now() - startTid;		//calculate how long the clock has been running since last start
  dispTid = diffTid +tid;             //calculate the stored time + the currently running time
  createCookie("tid",dispTid,2);      //creates a cookie, used in case the browser is closed while playing
  var tempLevel = 0;                  //this loop checks/counts what blind level we are on
  for (blind in blinds){
  	if (dispTid > blinds[blind]){
      
  		tempLevel++;
  	}
  }
  if (currLev < tempLevel){           //new level
    console.log("New level");
    $('#r')
    if(sound==true)play_single_sound();
    if(pause==true)main();            //if the "pause at new level" is toggeled, it simulates a click on the "start/pause" button
    console.log("row: #r"+(currLev+2));
    $('#r'+(currLev+1)).css('background',prevColor);
    prevColor = $('#r'+(currLev+2)).css('background');
    $('#r'+(currLev+2)).css('background',color);
  }
  currLev = tempLevel;
  resizeTable();
  document.getElementById('currentlevel').innerHTML = currLev+1; //prints the current level to the HTML page
  setCurrent("c"+(currLev+1));  //sets the colored cell in the right place in the table

  //next level in:
  remaining = blinds[currLev] - dispTid;
  document.getElementById('display-area').innerHTML = nyVisTid(remaining);
}



function main(){						//main() is called when Start/stop is pushed
  if (start == false){					// start == false indicates that the clock was not running
    $('#start').text('Pause');
    if (sound==true){
      var audio = new Audio('lyd.mp3');
      audio.play();
    }
    startTid = Date.now();
    myVar = setInterval(update,500);		//starts looping the update() function with a given delay in ms.
    start = true;						//the clock is running
    document.getElementById('info').innerHTML = "On";
  }
  else{	  								//Else contains the code that's executed when the clock is paused
    $('#start').text('Start');
    clearInterval(myVar);					//Stops the update() function
  start = false;
    tid = tid + diffTid;					//Adds the current time on the clock to the time variable
    document.getElementById('info').innerHTML = "Off";
  }
}

function reset(){	   //runs if the reset button is clicked
  if(confirm('Are you sure you want to reset?')){
    $('#r'+(currLev+1)).css('background',prevColor);
    console.log('#r'+(currLev+1));
    tid   = 0;
    clearInterval(myVar);
    start = false;
    createCookie("tid",0,2);
    eraseCookie("tid");
    console.log("cookies deleted");
    removeAllCurrent();
    document.getElementById('info').innerHTML = "Off";
    document.getElementById('display-area').innerHTML = "00:00:00";
    document.getElementById('currentlevel').innerHTML = "0";
    currLev = 0;
    resizeTable();
  }
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

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name,"",-1);
}

function getLevel(){
  var tempLevel = 0;                //this loop checks/counts what blind level we are on
  for (blind in blinds){
    if (tid > blinds[blind]){
      tempLevel++;
    }
  }
  currLev = tempLevel;
  document.getElementById('currentlevel').innerHTML = currLev+1; //prints the current level to the HTML page
  setCurrent("c"+(currLev+1));
  return currLev;

}

function play_single_sound() {
  document.getElementById('audiotag1').play();
}

//gets the variables from the url
function get_query(){
    var url = location.href;
    var qs = url.substring(url.indexOf('?') + 1).split('&');
    for(var i = 0, result = {}; i < qs.length; i++){
    qs[i] = qs[i].split('=');
    result[qs[i][0]] = qs[i][1];
    }
    return result;

}

function setVariables(lengthG, antesG, blindsG, commentsG){
  blinds       = lengthG;
  blindsLengde = lengthG;
  ante         = antesG;
  comment      = commentsG;
  blindVerdi   = blindsG;
  console.log("lenght: "+lengthG +" Antes: " + antesG +" comments: "+commentsG+" blinds: "+blindsG);
}

function checkSound(){
  if (sound==true){
    sound=false;
  }else {sound=true;}
  console.log("Sound is now: "+sound);
}

function checkPause(){
  if (pause==true){
    pause=false;
  }else {pause=true;}
  console.log("Pause is now: "+pause);
}

function saveTab(){
  window.prompt("If you want to save this table: copy and save this address", location.href);
}


//The following lines binds the functions to the HTML buttons on pageload, and reads cookie or "minutesPlayed" if they exists
window.addEventListener('load',function(){
  // Set the correct values of chips in the HTML:
$('#chip1').text(chipvalue[0]);
$('#chip2').text(chipvalue[1]);
$('#chip3').text(chipvalue[2]);
$('#chip4').text(chipvalue[3]);
$('#chip5').text(chipvalue[4]);

  document.getElementById('display-area').innerHTML = nyVisTid(remaining);
  var ctid = parseInt(readCookie("tid"));
  if (ctid>0){
    console.log('milliseconds from cookie: ' + readCookie("tid"));
    tid = ctid;  
  }else ctid=0;
  
  //Since the coockie is deleted when you enter minutesPlayed in config -
  //This is only entered if you have not started playing
  if (minutesPlayed>0 && (ctid==0)){  

    tid = minutesPlayed * 60 * 1000;
    remaining = blinds[currLev] - tid;
    document.getElementById('display-area').innerHTML = nyVisTid(remaining);
  }
  //tid = 100000; //If you need to start at a specific time, this is the place. set tid = milliseconds since start ---------------------
  var count = 0;  
  //Generating the rows in the table
  for (blind in blindsLengde){
    addRow(count+1,blindVerdi[blind],ante[blind],blindsLengde[blind],comment[blind]," ", "c"+(count+1));
    count++;
  }
  if (ctid > 0){
    getLevel();
    remaining = blinds[currLev] - ctid;
    document.getElementById('display-area').innerHTML = nyVisTid(remaining);
  }
  document.getElementById('start').addEventListener('click',function(){
    main();
  });
  resizeTable();
});

window.addEventListener('load',function(){
  document.getElementById('reset').addEventListener('click',reset);
  document.getElementById('pausevalg').addEventListener('click',checkPause);
  document.getElementById('lydvalg').addEventListener('click',checkSound);
  document.getElementById('savebtn').addEventListener('click',saveTab);
});
console.log('script done!');
//Created by Ole Halvor Dahl