<?php

include_once './php/file_writer.php';

function end_data_is_complete($data) {
    if ($data->run === null) {
        respond_error(400, "Run is missing.");
        return FALSE;

    } elseif ($data->wall_time === null) {
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

    foreach ($data as $i => $line) {
        $values = explode(';', $line);

        if ($from < $values[0]) {
            $data[$i] = array(
                "wall_time" => (float) $values[0],
                "run" => trim($values[1])
            );
        }
    }

    return json_encode($data);
}
?>