<?php

include_once './php/file_writer.php';

function exception_data_is_complete($data) {
    if (!isset($data->exception)) {
        respond_error(400, "Exception is missing.");
        return FALSE;

    } elseif (!isset($data->run)) {
        respond_error(400, "Run is missing.");
        return FALSE;

    } elseif (!isset($data->wall_time)) {
        respond_error(400, "Wall time is missing.");
        return FALSE;

    }

    return TRUE;
}

function exception_handler($data, $path) {
    if (exception_data_is_complete($data)) {
        $file = fopen($path . 'exceptions.csv', 'a');

        $line = array(
            $data->wall_time,
            $data->run,
            $data->exception
        );
        append_line_to_file($path . 'exceptions.csv', $line);
    }
}

function get_exception_data($path, $from) {
    $data = file($path . 'exceptions.csv');

    if (!$data) {
        $data = array();
    }

    $resp = array();

    foreach ($data as $line) {
        $values = explode(';', $line);

        if ($from < $values[0]) {
            array_push($resp, [array(
                "wall_time" => (float) $values[0],
                "run" => trim($values[1]),
                "exception" => trim($values[2])
            )]);
        }
    }

    return json_encode($resp);
}
?>