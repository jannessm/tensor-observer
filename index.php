<?php

include_once './php/scalar_handler.php';
include_once './php/exception_handler.php';
include_once './php/frontend.php';
include_once './php/error_response.php';

$DATA_PATH = './data/';

$input = file_get_contents('php://input');

if ($input !== '') {
########## POST Handling ############
# if post call save data
# data needed:
# * type
# * scalar
# * run
# * tag
# * step
# * wall_time

    $data = json_decode($input);

    # check if every parameter exists
    if ($data->type === null) {
        respond_error(400, "Type is missing.");

    # handle types
    } elseif ($data->type === 'scalar') {
        scalar_handler($data, $DATA_PATH);
    } elseif ($data->type === 'exception') {
        exception_handler($data, $DATA_PATH);
    }

} else {
########## GET Handling ###########

# remove unused runs on gui trigger from file
    if ($_GET['delete']) {
        try {
            remove_run($DATA_PATH . 'scalars.csv', $_GET['delete']);
            remove_run($DATA_PATH . 'exceptions.csv', $_GET['delete']);
        } catch (Exception $e) {
            repond_error(500, "something went wrong");
        }
    } else {
# if get show plot and last activity for run
        $html = file_get_contents('./assets/index.html');

        $html = str_replace('{{ scalars }}', get_scalar_data($DATA_PATH), $html);
        $html = str_replace('{{ exceptions }}', get_exception_data($DATA_PATH), $html);

        echo $html;
    }
}
?>