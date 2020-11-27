<?php
include_once './php/error_response.php';

function append_line_to_file($path, $array) {
    $file = fopen($path, 'a');
    fwrite($file, join(';', $array) . "\n");
    fclose();
}

function remove_run($path, $run) {
    $reading = fopen($path, 'r');
    $writing = fopen($path . '.tmp', 'w');

    if (!$reading || !$writing) {
        fclose($reading);
        fclose($writing);
        throw new Exception("could not open files to alter data!");
    }

    $altered_file = FALSE;

    while (!feof($reading)) {
        $line = fgets($reading);
        
        if (!strpos($line, $run)) {
            fwrite($writing, $line);
        } else {
            $altered_file = TRUE;
        }
    }
    
    fclose($reading);
    fclose($writing);
    
    // might as well not overwrite the file if we didn't replace anything
    if ($altered_file)
    {
        rename($path . '.tmp', $path);
    } else {
        unlink($path . '.tmp');
    }
}