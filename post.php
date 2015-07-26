<?php

function post($pdo){
    $request_body = file_get_contents('php://input');
    $post = json_decode($request_body, true);
    $id = $post['id'];
    $title = $post['title'];
    $due_date = date('Y-m-d H:i:s', ($post['due_date'] / 1000));
    $create_date = date('Y-m-d H:i:s', ($post['create_date'] / 1000));
    $complete = $post['complete'];
    $res = null;
    if($id == 0){ // new
        try{
            $stmt = $pdo->prepare('insert into todos (title, create_date) values (:title, :create_date)');
            $stmt->bindParam(':title', $title, PDO::PARAM_STR);
            $stmt->bindValue(':create_date', $create_date, PDO::PARAM_STR);
            $r = $stmt->execute();
        }catch (PDOException $e) {
        }
        $id = $pdo->lastInsertId();
        $post['id'] = intval($id);
        $res = $post;
    }else if($id > 0){ // update
        $stmt = $pdo->prepare('update todos set title = :title, due_date = :due_date, create_date = :create_date, complete = :complete where id = :id');
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':title', $title, PDO::PARAM_STR);
        $stmt->bindValue(':due_date', $due_date, PDO::PARAM_STR);
        $stmt->bindValue(':create_date', $create_date, PDO::PARAM_STR);
        $stmt->bindValue(':complete', $complete, PDO::PARAM_BOOL);
        $res = $stmt->execute();
    }

    $pdo = null;
    return $res;
}
