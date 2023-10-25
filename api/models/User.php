<?php

declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'config.php';
require_once __DIR__ . DIRECTORY_SEPARATOR . 'response' . DIRECTORY_SEPARATOR . 'LoginResponse.php';

class User
{
    private $table = "user";
    private $connection = null;

    public $id;
    public $name;
    public $password;
    public $carbonEmission;
    public $generatedPower;
    public $chargingTime;
    public $distanceTraveled;
    public $speed;

    public function __construct($connection)
    {
        if ($this->connection == null) {
            $this->connection = $connection;
        }
    }

    public function login()
    {
        $reqStr = "SELECT * FROM {$this->table} WHERE name = :name AND password = :password LIMIT 1";
        $req = $this->connection->prepare($reqStr);
        $req->execute(array(
            'name' => $this->name,
            'password' => $this->password
        ));

        $res = $req->fetch(PDO::FETCH_ASSOC);
        return $res;
    }
}
