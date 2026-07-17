<?php
/**
 * ИИ-чат для static-хостинга reg.ru (PHP).
 * Вызывается с того же домена: POST /api/chat.php
 * Ключ: config.local.php (не в git) или переменная окружения XAI_API_KEY.
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Preflight (на всякий случай)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Accept');
    http_response_code(204);
    exit;
}

function json_out(array $data, int $code = 200): void
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// ——— ключ xAI ———
$apiKey = getenv('XAI_API_KEY') ?: '';
$configLocal = __DIR__ . '/config.local.php';
if (is_file($configLocal)) {
    /** @var array{XAI_API_KEY?: string, XAI_MODEL?: string} $cfg */
    $cfg = include $configLocal;
    if (is_array($cfg)) {
        if (!empty($cfg['XAI_API_KEY'])) {
            $apiKey = (string) $cfg['XAI_API_KEY'];
        }
        $model = !empty($cfg['XAI_MODEL']) ? (string) $cfg['XAI_MODEL'] : 'grok-4.5';
    }
}
$apiKey = trim((string) $apiKey);
$model = $model ?? (getenv('XAI_MODEL') ?: 'grok-4.5');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    json_out([
        'ok' => true,
        'hasXaiKey' => $apiKey !== '',
        'engine' => 'php-reg.ru',
        'hint' => $apiKey !== ''
            ? 'Ключ XAI_API_KEY виден PHP на reg.ru'
            : 'Создайте public/api/config.local.php с XAI_API_KEY',
    ]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'method', 'reply' => 'Нужен POST'], 405);
}

if ($apiKey === '') {
    json_out([
        'error' => 'no_api_key',
        'reply' => "Ключ ИИ не настроен на сервере.\n\nНа reg.ru создайте файл /api/config.local.php:\n<?php\nreturn ['XAI_API_KEY' => 'xai-...'];\n\nИли напишите в Telegram @KorePartsBot.",
    ], 503);
}

$raw = file_get_contents('php://input') ?: '';
$body = json_decode($raw, true);
if (!is_array($body)) {
    json_out(['error' => 'bad_json', 'reply' => 'Некорректный JSON'], 400);
}

$messages = $body['messages'] ?? null;
if (!is_array($messages) || count($messages) === 0) {
    json_out(['error' => 'empty', 'reply' => 'Пустое сообщение'], 400);
}

$lastUser = '';
foreach (array_reverse($messages) as $m) {
    if (($m['role'] ?? '') === 'user' && !empty($m['content'])) {
        $lastUser = (string) $m['content'];
        break;
    }
}
if ($lastUser === '') {
    json_out(['error' => 'no_user', 'reply' => 'Нужен текст пользователя'], 400);
}

$system = <<<SYS
Ты — ИИ-помощник интернет-магазина KoreParts (запчасти Kia, Hyundai, Genesis, SsangYong).
Отвечай по-русски, кратко и по делу. Помогай с подбором деталей, OEM, категориями, доставкой.
Не выдумывай точные цены/наличие, если их нет — предложи заявку /request или Telegram @KorePartsBot.
VIN: /vin, каталог: /catalog. Тон: дружелюбный консультант.
SYS;

// Ограничим историю
$chat = [];
$chat[] = ['role' => 'system', 'content' => $system];
$slice = array_slice($messages, -12);
foreach ($slice as $m) {
    $role = $m['role'] ?? '';
    if ($role !== 'user' && $role !== 'assistant') {
        continue;
    }
    $content = mb_substr((string) ($m['content'] ?? ''), 0, 4000);
    if ($content === '') {
        continue;
    }
    $chat[] = ['role' => $role, 'content' => $content];
}

$payload = json_encode([
    'model' => $model,
    'messages' => $chat,
    'temperature' => 0.4,
    'max_tokens' => 800,
], JSON_UNESCAPED_UNICODE);

$ch = curl_init('https://api.x.ai/v1/chat/completions');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey,
    ],
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 60,
]);
$response = curl_exec($ch);
$errno = curl_errno($ch);
$http = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($errno || $response === false) {
    json_out([
        'error' => 'curl',
        'reply' => 'Не удалось связаться с xAI. Попробуйте позже или Telegram @KorePartsBot.',
    ], 502);
}

$data = json_decode($response, true);
if ($http < 200 || $http >= 300) {
    json_out([
        'error' => 'upstream',
        'reply' => 'Сейчас ИИ недоступен (xAI). Напишите в Telegram @KorePartsBot или оставьте заявку.',
    ], 502);
}

$reply = trim((string) ($data['choices'][0]['message']['content'] ?? ''));
if ($reply === '') {
    $reply = 'Не удалось получить ответ. Попробуйте ещё раз или напишите в Telegram @KorePartsBot.';
}

json_out(['reply' => $reply]);
