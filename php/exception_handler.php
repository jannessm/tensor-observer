<?php

include_once './php/file_writer.php';

function exception_data_is_complete($data) {
    if ($data->exception === null) {
        respond_error(400, "Exception is missing.");
        return FALSE;

    } elseif ($data->run === null) {
        respond_error(400, "Run is missing.");
        return FALSE;

    } elseif ($data->wall_time === null) {
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

function get_exception_data($path) {
    $data = file($path . 'exceptions.csv');

    foreach ($data as $i => $line) {
        $values = explode(';', $line);

        $data[$i] = array(
            "wall_time" => (float) $values[0],
            "run" => $values[1],
            "exception" => $values[2]
        );
    }

    return json_encode($data);
}
?>