<?php

require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'config.php';

class Message
{
    private $table = "message";
    private $connection = null;

    public $id;
    public $userId;
    public $targetId;
    public $stickerId;

    public function __construct($connection)
    {
        if ($this->connection == null) {
            $this->connection = $connection;
        }
    }

    public function postMessage()
    {
        if (!empty($this->userId) && !empty($this->targetId) && !empty($this->stickerId)) {

            $reqStr = "INSERT INTO {$this->table}(userId, targetId, stickerId) VALUES(:userId, :targetId, :stickerId)";
            $req = $this->connection->prepare($reqStr);
            $req->execute(array(
                'userId' => $this->userId,
                'targetId' => $this->targetId,
                'stickerId' => $this->stickerId
            ));

            $res = $req->fetch(PDO::FETCH_ASSOC);
            return $res;
        }
    }

    public function getMyMessage()
    {
        if (!empty($this->userId)) {

            $reqStr = "SELECT message.id as id, userId, stickerId, user.name, user.password, user.carbonEmission, user.generatedPower, user.chargingTime, user.distanceTraveled, user.speed FROM {$this->table} LEFT JOIN user ON userId = user.id WHERE targetId = :userId";
            $req = $this->connection->prepare($reqStr);
            $req->execute(array(
                'userId' => $this->userId
            ));

            $res = $req->fetchAll(PDO::FETCH_ASSOC);
            return $res;
        }
    }
}
