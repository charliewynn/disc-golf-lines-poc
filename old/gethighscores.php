<?php
require("sqllogin.php");

mysql_connect($host,$username,$password);
@mysql_select_db($db_name) or die( "Unable to select database");

$query="SELECT * FROM `gravityhighscores` ORDER BY `score` DESC";

extract(query($query, "select"));

echo "<table border=\"1\">";
echo "<tr><td>#</td><td>Name</td><td>Time</td><td>score</td></tr>";
for($i = 0; $i < $count; ++$i)
{
	$name=mysql_result($result,$i,"name");
	$time=mysql_result($result,$i,"time");
	$score=mysql_result($result,$i,"score");
  echo "<tr>
          <td>".($i+1)."</td>
          <td>$name</td>
          <td>$time</td>
          <td>$score</td>
        </tr>";
}
echo "</table>";
mysql_close();
?>
