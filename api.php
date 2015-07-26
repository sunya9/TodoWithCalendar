<?php

require_once('db.php');
require_once('get.php');
require_once('post.php');
require_once('delete.php');

date_default_timezone_set('Asia/Tokyo');
 
switch($_SERVER['REQUEST_METHOD']){
    case 'GET': // get list
        $res = get($pdo);
        break;
    case 'POST': // save todo
        $res = post($pdo);
        break;
    case 'PATCH': //update todo
        $res = post($pdo);
        break;
    case 'DELETE': // delete todo
        $res = delete($pdo);
        break;
}

header('Content-type: application/json');
echo json_encode($res);