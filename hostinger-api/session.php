<?php
require __DIR__ . '/config.php';
send_cors_headers();
start_session_safe();

json_response(['authenticated' => !empty($_SESSION['admin'])]);
