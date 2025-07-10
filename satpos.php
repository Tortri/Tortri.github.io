<?php
$satelliteId = isset($_GET['satelliteId']) ? $_GET['satelliteId'] : 53951; // Replace with your default satellite ID or get from request
$apiKey = 'PYU7EM-HLHYTV-639VND-54O1'; // Replace with your N2YO API key

$url = "https://api.n2yo.com/rest/v1/satellite/positions/" . $satelliteId . "/0/0/0/1/?apiKey=" . $apiKey;

$curlHandle = curl_init($url);
curl_setopt($curlHandle, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($curlHandle);
curl_close($curlHandle);

header('Content-Type: application/json');
echo $response;
?>
