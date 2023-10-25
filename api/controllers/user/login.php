<?php 

require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'utils' . DIRECTORY_SEPARATOR . 'HeaderUtils.php';
HeaderUtils::addRequestHeader("POST");

require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'config.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'User.php';

if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $db = new Database();

    $user = new User($db->connection);

    if(!empty($_POST['username']) && !empty($_POST['password'])) {

        $user->username = $_POST['username'];
        $user->password = $_POST['password'];
        

        $result = $user->login();

        if (!empty($result->token)) {
            http_response_code(200); 
            echo json_encode($result);
        } else {
            http_response_code(200); 
            echo json_encode($result);
        }
    }
}


