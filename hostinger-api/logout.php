<?php
require __DIR__ . '/config.php';
send_cors_headers();
start_session_safe();

$_SESSION = [];
session_destroy();

json_response(['success' => true]);
