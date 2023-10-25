<?php 

declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'config.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'utils' . DIRECTORY_SEPARATOR . 'JWTUtils.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'response' . DIRECTORY_SEPARATOR .'LoginResponse.php';

class User {
    private $table = "user";
    private $connection = null;

    public $id;
    public $username;
    public $password;
    public $token;

    public function __construct($connection) {
        if ($this->connection == null) {
            $this->connection = $connection;
        } 
    }

    public function login() {
        $reqStr = "SELECT id FROM {$this->table} WHERE username = :username AND password = :password LIMIT 1";
        $req = $this->connection->prepare($reqStr);
        $req->execute(array(
            'username' => $this->username,
            'password' => $this->password
        ));

        $res = $req->fetch(PDO::FETCH_ASSOC);


        if(!empty($res)) {
            $this->id = $res['id'];
            $tokenOK = $this->postToken();

            if ($tokenOK) {
                $response = new LoginResponse($this->token, $this->id, $this->username);
                return $response;
            } else {

            }

        } else {

        }
    }

    public function getToken() {
        $reqStr = "SELECT token FROM {$this->table} WHERE id = :id LIMIT 1";
        $req = $this->connection->prepare($reqStr);
        $req->execute(array(
            'id' => $this->id,
        ));

        return $req->fetch(PDO::FETCH_ASSOC);
    }

    public function postToken() {

        $jwtUtils = new JWTUtils();
        $jwtUtils->loadToken($this);

        if (!empty($this->token)) {
            $reqStr = "UPDATE {$this->table} SET token = :token WHERE id = :id LIMIT 1";
            $req = $this->connection->prepare($reqStr);
            $req->execute(array(
                'token' => $this->token,
                'id' => $this->id
            ));

            return $req->rowCount() > 0;
        }
    }

    public function logout() {
        $reqStr = "UPDATE  {$this->table} SET token = '' WHERE id = :id LIMIT 1";
        $req = $this->connection->prepare($reqStr);
        $req->execute(array(
            'id' => $this->id,
        ));

        $res = $req->fetch(PDO::FETCH_ASSOC);

        if($res) {
            return true;
        } else {
            return false;
        }
    }
}