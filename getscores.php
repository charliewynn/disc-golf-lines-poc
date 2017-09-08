<?php
require("sqllogin.php");

mysql_connect($host,$username,$password);
@mysql_select_db($db_name) or die( "Unable to select database");

$query="SELECT * FROM `gravity` ORDER BY `level`";

extract(query($query, "select"));

echo "<table border=\"1\">";
echo "<tr><td>level</td><td>time</td><td>x</td><td>y</td><td>dist</td><td>score</td></tr>";
for($i = 0; $i < $count; ++$i)
{
	$level=mysql_result($result,$i,"Level");
	$time=mysql_result($result,$i,"time");
	$x=mysql_result($result,$i,"x");
	$y=mysql_result($result,$i,"y");
	$dist=mysql_result($result,$i,"dist");
	$score=mysql_result($result,$i,"score");
  echo "<tr>
          <td>$level</td>
          <td>$time</td>
          <td>$x</td>
          <td>$y</td>
          <td>$dist</td>
          <td>$score</td>
        </tr>";
}
echo "</table>";
mysql_close();
?>
