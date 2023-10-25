<?php

class HeaderUtils
{
    /** 
     * Get header Authorization
     * */
    public static function getAuthorizationHeader()
    {
        $headers = null;
        if (isset($_SERVER['Authorization'])) {
            $headers = trim($_SERVER["Authorization"]);
        } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
        } elseif (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
            if (isset($requestHeaders['Authorization'])) {
                $headers = trim($requestHeaders['Authorization']);
            }
        }
        return $headers;
    }

    public static function addRequestHeader($method)
    {
        header("Access-Control-Allow-Headers: content-type, authorization, accept");
        header("Access-Control-Allow-Origin: *");
        header("Content-type: application/json; charset= UTF-8");
        header("Access-Control-Allow-Methods: " . $method);
    }

    public static function handleOptionsRequest()
    {
        if ($_SERVER['REQUEST_METHOD'] === "OPTIONS") {
            header("Access-Control-Allow-Headers: content-type, authorization, accept");
            header("Access-Control-Allow-Origin: *");
            header("Content-type: application/json; charset= UTF-8");
            header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
            http_response_code(200);
            exit;
        }
    }
}
