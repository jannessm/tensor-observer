<?php

include_once './php/file_writer.php';

function end_data_is_complete($data) {
    if (!isset($data->run)) {
        respond_error(400, "Run is missing.");
        return FALSE;

    } elseif (!isset($data->wall_time)) {
        respond_error(400, "Wall time is missing.");
        return FALSE;

    }

    return TRUE;
}

function end_handler($data, $path) {
    if (end_data_is_complete($data)) {
        $line = array(
            $data->wall_time,
            $data->run
        );
        append_line_to_file($path . 'end_signals.csv', $line);
    }
}

function get_end_data($path, $from) {
    $data = file($path . 'end_signals.csv');

    if (!$data) {
        $data = [];
    }

    $resp = array();

    foreach ($data as $line) {
        $values = explode(';', $line);

        if ($from < $values[0]) {
            array_push($resp, array(
                "wall_time" => (float) $values[0],
                "run" => trim($values[1])
            ));
        }
    }

    return json_encode($resp);
}
?>