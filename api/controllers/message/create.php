<?php

require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'utils' . DIRECTORY_SEPARATOR . 'HeaderUtils.php';

HeaderUtils::handleOptionsRequest();
HeaderUtils::addRequestHeader("POST");

require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'config.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'Message.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'User.php';

if ($_SERVER['REQUEST_METHOD'] === "POST") {

    $db = new Database();
    $message = new Message($db->connection);

    if (!empty($_POST['userId']) && !empty($_POST['targetId']) && !empty($_POST['stickerId'])) {

        $message->userId = $_POST['userId'];
        $message->targetId = $_POST['targetId'];
        $message->stickerId = $_POST['stickerId'];

        $result = $message->postMessage();

        if ($result) {
            http_response_code(200);
            echo json_encode($result);
        }
    }
} else {
    http_response_code(400);
    echo json_encode(new Exception('Incorrect request'));
}
