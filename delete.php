<?php

function delete($pdo){
    $id = $_GET['id'];
    $res = false;
    if($id > 0){
        $stmt = $pdo->prepare('delete from todos where id = :id');
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $res = $stmt->execute();
    }
    $pdo = null;

    return $res;
}