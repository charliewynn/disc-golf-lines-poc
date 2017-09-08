<?php
require("sqllogin.php");

mysql_connect($host,$username,$password);
@mysql_select_db($db_name) or die( "Unable to select database");
 
$level = $_POST[level];
$x = $_POST[x];
$y = $_POST[y];
$dist = $_POST[dist];
$score = $_POST[score];
  
$query = "SELECT * FROM `gravity` WHERE `level` = $level";
extract(query($query, "select"));

if($count == 0)//no score for that level
{
	$sql = 'INSERT INTO `cwynnlogin2`.`gravity` (`level`, `time`, `x`, `y`, `dist`, `score`) VALUES ('.$level.', CURRENT_TIMESTAMP, '.$x.', '.$y.', '.$dist.', '.$score.');';
	if (!mysql_query($sql)){ die('Error%%%: ' . mysql_error()); }
	echo 'New Record';
}
elseif($count == 1)//score already there
{
	$oldBestScore=mysql_result($result,0,"score");
	if($oldBestScore < $score)
	{
		$query = 'UPDATE `cwynnlogin2`.`gravity` SET `x` = '.$x.', `y` = '.$y.', `dist` = '.$dist.', `score` = '.$score.' WHERE `gravity`.`level` = '.$level.' LIMIT 1;';
    query($query, "update");
		echo 'New Record';
	}
}
else//shouldn't happen
{
	die('Error 0001: Multiple Level Entries');
}

?>