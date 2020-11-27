<?php

include_once './php/file_writer.php';

function scalar_data_is_complete($data) {
    if ($data->scalar === null) {
        respond_error(400, "Scalar is missing.");
        return FALSE;

    } elseif ($data->run === null) {
        respond_error(400, "Run is missing.");
        return FALSE;

    } elseif ($data->tag === null) {
        respond_error(400, "Tag is missing.");
        return FALSE;

    } elseif ($data->step === null) {
        respond_error(400, "Step is missing.");
        return FALSE;

    } elseif ($data->wall_time === null) {
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

function get_scalar_data($path) {
    $data = file($path . 'scalars.csv');

    foreach ($data as $i => $line) {
        $values = explode(';', $line);

        $data[$i] = array(
            "wall_time" => (float) $values[0],
            "run" => $values[1],
            "tag" => $values[2],
            "step" => (int) $values[3],
            "scalar" => (float) $values[4]
        );
    }

    return json_encode($data);
}
?>