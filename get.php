<?php

function get($pdo){
    $stmt = $pdo->prepare('select * from todos');
    $stmt->execute();
    $res = [];
    while($row = $stmt -> fetch(PDO::FETCH_ASSOC)) {
        $res[] = [
            'id' => intval($row['id']),
            'title' => $row["title"],
            'create_date' => $row['create_date'],
            'due_date' => $row['due_date'],
            'complete' => intval($row['complete']) > 0
        ];
    }

    $pdo = null;
    return $res;
}