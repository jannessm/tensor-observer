<?php

function respond_error($code, $errormsg) {
    http_response_code($code);
    header('Content-Type: application/json');
    
    $data = array(
        "code" => $code,
        "type" => "error",
        "message" => $errormsg
    );
    
    echo json_encode($data);
}