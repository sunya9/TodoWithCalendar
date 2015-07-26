<?php

try{
    $pdo = new PDO('mysql:host=localhost;dbname=DB_NAME;charset=utf8', 'username', 'password');
} catch (PDOException $e) {
    exit('error:'.$e->getMessage());
}