<?php 

require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'utils' . DIRECTORY_SEPARATOR . 'HeaderUtils.php';

HeaderUtils::handleOptionsRequest();
HeaderUtils::addRequestHeader("POST");

require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'config.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'Musician.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'User.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'utils' . DIRECTORY_SEPARATOR . 'JWTUtils.php';


$token = JWTUtils::getBearerToken();

if ($_SERVER['REQUEST_METHOD'] === "POST") {
        $db = new Database();        
        $user = new User($db->connection);
        $user->id = $_POST['user_id'];
       
    if ($token != null && JWTUtils::authorizeToken($user, $token)) {

        $musician = new Musician($db->connection);


        if (!empty($_POST['last_name']) && !empty($_POST['first_name']) && !empty($_POST['concert_date']) && !empty($_POST['concert_place']) && !empty($_POST['concert_description']) && !empty($_POST['gender']) && !empty($_POST['image_path'])) {

            $musician->last_name = $_POST['last_name'];
            $musician->first_name = $_POST['first_name'];
            $musician->concert_date = $_POST['concert_date'];
            $musician->concert_place = $_POST['concert_place'];
            $musician->concert_description = $_POST['concert_description'];
            $musician->gender = $_POST['gender'];
            $musician->image_path = $_POST['image_path'];

            $result = $musician->postMusician();

            if ($result) {
                http_response_code(200);
                echo json_encode($result);
            }
        }      
    } else {
        http_response_code(400);
        echo json_encode(new Exception('Token invalid veullez vous reconnecter'));
    }
} else {
    http_response_code(400);
    echo json_encode(new Exception('Incorrect request'));
}


