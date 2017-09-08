<?php
$host="cwynnlogin2.db.2873762.hostedresource.com"; // Host name 
$username="cwynnlogin2"; // Mysql username 
$password="L20Inches"; // Mysql password 
$db_name="cwynnlogin2"; // Database name

function query($sql, $type)
{
	$type = strtolower($type);
	if($type == "select")
	{
		$result=mysql_query($sql);
		if (!$result) {
			die("ERROR: Query is: $sql<br />Error is: ".mysql_error());
		}
		$count = mysql_num_rows($result);
		return compact('result', 'count');
	}
	else
	{	
		if (!mysql_query($sql)){ die("ERROR: Query is: $sql<br />Error is: ".mysql_error()); }
	}
}
?>