<?php 

require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'utils' . DIRECTORY_SEPARATOR . 'HeaderUtils.php';
HeaderUtils::addRequestHeader("POST");

require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'config.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'User.php';

if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $db = new Database();

    $user = new User($db->connection);
    $user->id = $_POST['id'];    

    $result = $user->logout();

    if ($result) {
        http_response_code(200);
        echo json_encode($result);
    }
}