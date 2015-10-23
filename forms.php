<!DOCTYPE html>
<!-- Created by Ole Halvor Dahl -->
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="dcterms.created" content="lør, 25 okt 2014 07:26:20 GMT">
  <link rel="stylesheet" href="../mainpage/style.css"></link>
  <title>PokerGenerator</title>
</head>
<body>
 <div class="wrapper">
  <?php
    $handle = fopen("../txt/menu.txt", "r");
    if ($handle) {
      while (($line = fgets($handle)) !== false) {
        echo $line;
      }
    } else {
      // error opening the file.
    } 
    fclose($handle);
  ?>
  <header><h1> PokerTableConfig 0.2 </h1></header><hr>
  <div id="midt3">
    <ol>
      <li>Each box represents a column in the generated table. </li>
      <li>Each value must be seperated with commas ","</li>
      <li>You should have the same amount of values in every box</li>
      <li>Avoid whitespaces between values</li>
    </ol>
    <table>
      <tr>
        <td>Number of rounds</td><td><input id="rounds" size="5" name="rounds" type="number" value="14" ></input></td>
      </tr>
      <tr>
        <td>Standard round length</td><td><input id="standardLength" size="5" type="number" value="45" ></input>
      </td>
    </tr>
    <tr><td><label class="label">Fibonacci debug lengths</label></td><td><input id="fibTest" type="checkbox"></input></td></tr>
  </table>
  <table>
    <form method="get" action="pokertable.html"> 
      <tr><td><label> Round length in minutes </label> </td><td><input type="text" required="true" placeholder="RoundLength" size="120" name="lengths" id="lengths" value="1,1,2,3,5,8,13,21,34,55,60,60,60,60"></input></td></tr>
      <tr><td><label> Antes</label></td><td><input type="text" placeholder="Antes" size="120" name="antes" id="antes" value="0,0,2,5,10,10,25,25,50,50,100,100,200,300"></input> </td></tr>
      <tr><td><label> Blinds</label></td><td><input type="text" placeholder="Blinds" size="120" name="blinds" id="blinds" value='2-4,5-10,10-20,25-50,40-80,50-100,75-150,100-200,150-300,200-400,300-600,400-800,500-1000,750-1500'></input> </td></tr>
      <tr><td><label> Comments</label></td><td><input type="text" placeholder="Comments" size="120" name="comments" id="comments" value=',,,Remove_white,,,Remove_red,,,,Remove_blue,,,'></input> </td></tr>
      <tr><td><label> Chip value</label></td><td><input type="text" placeholder="Chip value" size="120" name="value" id="value" value="2,5,25,100,500" /> </td></tr>
      <tr><td><label> Minutes played:</td><td><input type="number" id="minutes" name="minutes" value="0" style="width:35px"></input></td></tr>
      <tr><td><input type="submit" value="Create Poker Table"></input> </td></tr>
    </table>
  </form>
  <input type="submit" value="reset!" id="reset" />
</div>
</div>
<div class="push"></div>
<div class="footer">
  <?php
  $handle = fopen("../txt/footer.txt", "r");
  if ($handle) {
    while (($line = fgets($handle)) !== false) {
      echo $line;
    }
  } else {
    // error opening the file.
  } 
  fclose($handle);
  ?>
</div>
<script src="jquery-1.11.2.min.js"></script>
<script src="forms.js"></script>
</body>
</html>