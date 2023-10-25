<?php 

require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'utils' . DIRECTORY_SEPARATOR . 'HeaderUtils.php';
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

        if (!empty($_POST['id'])) {
            $musician->id = $_POST['id'];

            $result = $musician->deleteMusician();

            if ($result) {
                http_response_code(200);
                echo json_encode($result);
            }
        }
        
    }  else {
        http_response_code(400);
        echo json_encode(new Exception('Token invalid veullez vous reconnecter'));
    }
} else {
    http_response_code(400);
    echo json_encode(new Exception('Incorrect request'));
}
