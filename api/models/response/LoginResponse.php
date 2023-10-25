<?php 

class LoginResponse {
    public $token;
    public $id;
    public $username;

    function __construct($token, $id, $username) {
        $this->token = $token;
        $this->id = $id;
        $this->username = $username;
    }
}