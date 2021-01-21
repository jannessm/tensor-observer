<?php

$DELETE_PWD = md5(md5('CHANGE-ME'));

include_once './php/scalar_handler.php';
include_once './php/exception_handler.php';
include_once './php/end_handler.php';
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
    if (!isset($data->type)) {
        respond_error(400, "Type is missing.");

    # handle types
    } elseif ($data->type === 'scalar') {
        scalar_handler($data, $DATA_PATH);
    } elseif ($data->type === 'exception') {
        exception_handler($data, $DATA_PATH);
    } elseif ($data->type === 'end_signal') {
        end_handler($data, $DATA_PATH);
    }

} else {
########## GET Handling ###########

# remove unused runs on gui trigger from file
    $from = -1;
    if (isset($_GET['from'])) {
        $from = $_GET['from'];
    }
    if (isset($_GET['delete'])) {
        if (!isset($_GET['pwd']) || $_GET['pwd'] !== $DELETE_PWD) {
            respond_error(401, "Wrong pwd.");
            return;
        }
        
        try {
            remove_run($DATA_PATH . 'scalars.csv', $_GET['delete']);
            remove_run($DATA_PATH . 'exceptions.csv', $_GET['delete']);
            remove_run($DATA_PATH . 'end_signals.csv', $_GET['delete']);
        } catch (Exception $e) {
            repond_error(500, "something went wrong");
        }
    
    } elseif (isset($_GET['scalars'])) {
        echo get_scalar_data($DATA_PATH, $from);
    
    } elseif (isset($_GET['exceptions'])) {
        echo get_exception_data($DATA_PATH, $from);
    
    } elseif (isset($_GET['end_signals'])) {
        echo get_end_data($DATA_PATH, $from);
    
    } else {
    # if get show plot and last activity for run
        $html = file_get_contents('./assets/index.html');
        echo $html;
    }
}
?>