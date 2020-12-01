<?php

include_once './php/file_writer.php';

function scalar_data_is_complete($data) {
    if (!isset($data->scalar)) {
        respond_error(400, "Scalar is missing.");
        return FALSE;

    } elseif (!isset($data->run) || $data->run === '') {
        respond_error(400, "Run is missing.");
        return FALSE;

    } elseif (!isset($data->tag)) {
        respond_error(400, "Tag is missing.");
        return FALSE;

    } elseif (!isset($data->step)) {
        respond_error(400, "Step is missing.");
        return FALSE;

    } elseif (!isset($data->wall_time)) {
        respond_error(400, "Wall time is missing.");
        return FALSE;

    }

    return TRUE;
}

function scalar_handler($data, $path) {
    if (scalar_data_is_complete($data)) {
        $line = array(
            $data->wall_time,
            $data->run,
            $data->tag,
            $data->step,
            $data->scalar
        );
        append_line_to_file($path . 'scalars.csv', $line);
    }
}

function get_scalar_data($path, $from) {
    $data = file($path . 'scalars.csv');

    if (!$data) {
        $data = array();
    }

    $resp = array();

    foreach ($data as $line) {
        $values = explode(';', $line);
        
        if ($from < $values[0]) {
            array_push($resp, array(
                "wall_time" => (float) $values[0],
                "run" => trim($values[1]),
                "tag" => trim($values[2]),
                "step" => (int) $values[3],
                "scalar" => (float) $values[4]
            ));
        }
    }

    return json_encode($resp);
}
?>