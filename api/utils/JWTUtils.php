<?php 

require_once realpath(__DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . "vendor/autoload.php");
require_once __DIR__ . DIRECTORY_SEPARATOR . 'HeaderUtils.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JWTUtils {
    public static function loadToken($user) {
        $issuedAt   = new DateTimeImmutable();
        $expire     = $issuedAt->modify('+1 day')->getTimestamp();
        $serverName = 'localhost';
        $username   = $user->username;

        $data = [
            'iat'  => $issuedAt->getTimestamp(),
            'iss'  => $serverName,
            'nbf'  => $issuedAt->getTimestamp(),
            'exp'  => $expire,
            'userName' => $username,
        ];

        $user->token = JWT::encode(
            $data,
            $_ENV['API_KEY'],
            'HS512'
        );
    }

    public static function getBearerToken() {
        $headers = HeaderUtils::getAuthorizationHeader();
        // HEADER: Get the access token from the header
        if (!empty($headers)) {
            if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
                return $matches[1];
            }
        }
        return null;
    }

    public static function authorizeToken($user, $token = null) {
        $userToken = $user->getToken();

        if($token != null && $userToken['token'] == $token) {
            $decoded = (array) JWT::decode($token, new Key($_ENV['API_KEY'], 'HS512'));
            $date = new DateTimeImmutable();
            if($date->getTimestamp() < $decoded['exp']) {
                return true;
            }
            return false;
        }
        return false;
    }
}