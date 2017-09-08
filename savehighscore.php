<?php
require("sqllogin.php");

mysql_connect($host,$username,$password);
@mysql_select_db($db_name) or die( "Unable to select database");
 
$name = $_POST[name];
$score = $_POST[score];
  
$sql = "INSERT INTO `gravityhighscores` (`name`, `score`) VALUES ('$name', $score);";
query($sql, "insert");

$sql = "SELECT count(*) AS num FROM `gravityhighscores` WHERE score >= $score;";
extract(query($sql, "select"));

echo mysql_result($result,0,"num");

?>