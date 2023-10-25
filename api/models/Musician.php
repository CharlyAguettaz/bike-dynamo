<?php 

require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'config.php';

class Musician {
    private $table = "musician";
    private $connection = null;

    public $id;
    public $first_name;
    public $last_name;
    public $concert_date;
    public $concert_place;
    public $concert_description;
    public $is_show;
    public $image_path;
    public $gender;

    public function __construct($connection) {
        if ($this->connection == null) {
            $this->connection = $connection;
        } 
    }

    public function getMusician() {
        $reqStr = "SELECT * FROM {$this->table}";
        $req = $this->connection->prepare($reqStr);
        $req->execute();
        return $req->fetchAll(PDO::FETCH_ASSOC);
    }

    public function postMusician() {
        if (!empty($this->first_name) && !empty($this->last_name) && !empty($this->concert_date) && !empty($this->concert_place) && !empty($this->concert_description) && !empty($this->image_path) && !empty($this->gender)) {

            $reqStr = "INSERT INTO {$this->table}(first_name, last_name, concert_date, concert_place, concert_description, image_path, gender) VALUES(:first_name, :last_name, :concert_date, :concert_place, :concert_description, :image_path, :gender)";
            $req = $this->connection->prepare($reqStr);
            $req->execute(array(
                'first_name' => $this->first_name,
                'last_name' => $this->last_name,
                'concert_date' => $this->concert_date,
                'concert_place' => $this->concert_place,
                'concert_description' => $this->concert_description,
                'image_path' => $this->image_path,
                'gender' => $this->gender
            ));

            var_dump($req);


            $res = $req->fetch(PDO::FETCH_ASSOC);
            return $res;
        }
    }

    public function updateMusician() {
        if (!empty($this->id) && !empty($this->first_name) && !empty($this->last_name) && !empty($this->concert_date) && !empty($this->concert_place) && !empty($this->concert_description) && !empty($this->image_path) && !empty($this->gender)) {
            $reqStr = "UPDATE {$this->table} SET first_name = :first_name, last_name = :last_name, concert_date = :concert_date, concert_place = :concert_place, concert_description = :concert_description, image_path = :image_path, gender = :gender
            WHERE id = :id";
            $req = $this->connection->prepare($reqStr);
            $res = $req->execute(array(
                'id' => $this->id,
                'first_name' => $this->first_name,
                'last_name' => $this->last_name,
                'concert_date' => $this->concert_date,
                'concert_place' => $this->concert_place,
                'concert_description' => $this->concert_description,
                'image_path' => $this->image_path,
                'gender' => $this->gender
            ));
            return $res;
        }
    }

    public function deleteMusician() {
        if (!empty($this->id)) {
            $reqStr = "DELETE FROM {$this->table} WHERE id = :id";
            $req = $this->connection->prepare($reqStr);
            $res = $req->execute(array(
                'id' => $this->id
            ));
            return $res;
        }
    }
}