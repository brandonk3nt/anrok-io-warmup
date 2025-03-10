// 1. 'httpGet' is provided for you.
// 2. You have to implement 'httpGetParallel' and 'httpGetSerial'
//    using 'httpGet'. See signatures below.
// 3. 'testAsync' will try running your 'httpGetParallel' and
//    'httpGetSerial' with some test URLs. The expected output
//    is shown at the very bottom of this file.
//
// You can run this on your computer with Node.js or use an online JavaScript
// environment that allows HTTP requests, e.g. https://runjs.co/

// A non-blocking, callback-style function to make an HTTP GET request.
// When the request is complete, 'callback' will be called with
// the response body text. For simplicity, we're ignoring errors.
//
// Example usage:
//     httpGet('https://example.org/', r => {
//         console.log(`Got first page: ${JSON.stringify(r)}`);
//
//         const targetUrl = extractFirstLink(r);
//         if (targetUrl !== null) {
//             httpGet(targetUrl, r => {
//                 console.log(`Got second page: ${JSON.stringify(r)}`);
//             });
//         }
//     });
function httpGet(url, callback) {
    log(`HTTP start ${JSON.stringify(url)}`);
    // The 'fetch' API uses promises, but that's just an internal implementation detail of
    // 'httpGet'. In this exercise, you should do everything with callbacks, not promises.
    // The point of the exercise is to use callbacks everywhere else.
    fetch(url)
        .then(res => {
            res.text().then(r => {
                const truncated = r.substring(0, 20);
                log(`HTTP finish ${JSON.stringify(url)} -> ${JSON.stringify(truncated)}`);
                callback(truncated)
            });
        })
        .catch(err => { throw err; });
}

// This function should initiate parallel HTTP GET requests for all URLs in
// the 'urls' array. After all requests are complete, call 'callback' with
// an array of response bodies, matching the order of the `urls` array.
function httpGetParallel(urls, callback) {
    // You have to write this code.
    // You can use 'httpGet', but don't use promises.
    throw new Error('todo');
}

// This function should make HTTP GET requests for the URLs in the 'urls'
// array one at a time. After the last request is complete, call 'callback'
// with an array of response bodies, matching the order of the `urls` array.
function httpGetSerial(urls, callback) {
    // You have to write this code.
    // You can use 'httpGet', but don't use promises.
    throw new Error('todo');
}

function log(message) {
    const now = new Date();
    const dateTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString();
    const time = dateTime.substring(11, 21); // Just the time, with 1/10th of a second precision
    console.log(`[${time}] ${message}`);
}

async function testAsync() {
    // httpbin.org provides several convenient test endpoints. We're using
    // httpbin.org/delay/N, which just waits N seconds before responding.
    const urls = [
        'https://httpbin.org/delay/1',
        'https://httpbin.org/delay/2',
        'https://httpbin.org/delay/1',
    ];

    log('Testing httpGetParallel...');
    await new Promise(resolve => {
        httpGetParallel(urls, responses => {
            log(`Got responses: ${JSON.stringify(responses, null, 4)}`);
            resolve();
        });
    });

    log('Testing httpGetSerial...');
    await new Promise(resolve => {
        httpGetSerial(urls, responses => {
            log(`Got responses: ${JSON.stringify(responses, null, 4)}`);
            resolve();
        });
    });
}

testAsync().catch(console.error);

/*
Expected output:

    [23:32:16.5] Testing httpGetParallel...
    [23:32:16.5] HTTP start "https://httpbin.org/delay/1"
    [23:32:16.5] HTTP start "https://httpbin.org/delay/2"
    [23:32:16.5] HTTP start "https://httpbin.org/delay/1"
    [23:32:17.9] HTTP finish "https://httpbin.org/delay/1" -> "{\n  \"args\": {}, \n  \""
    [23:32:18.2] HTTP finish "https://httpbin.org/delay/1" -> "{\n  \"args\": {}, \n  \""
    [23:32:19.5] HTTP finish "https://httpbin.org/delay/2" -> "{\n  \"args\": {}, \n  \""
    [23:32:19.5] Got responses: [
        "{\n  \"args\": {}, \n  \"",
        "{\n  \"args\": {}, \n  \"",
        "{\n  \"args\": {}, \n  \""
    ]
    [23:32:19.5] Testing httpGetSerial...
    [23:32:19.5] HTTP start "https://httpbin.org/delay/1"
    [23:32:20.6] HTTP finish "https://httpbin.org/delay/1" -> "{\n  \"args\": {}, \n  \""
    [23:32:20.6] HTTP start "https://httpbin.org/delay/2"
    [23:32:22.7] HTTP finish "https://httpbin.org/delay/2" -> "{\n  \"args\": {}, \n  \""
    [23:32:22.7] HTTP start "https://httpbin.org/delay/1"
    [23:32:23.8] HTTP finish "https://httpbin.org/delay/1" -> "{\n  \"args\": {}, \n  \""
    [23:32:23.8] Got responses: [
        "{\n  \"args\": {}, \n  \"",
        "{\n  \"args\": {}, \n  \"",
        "{\n  \"args\": {}, \n  \""
    ]

(Your timestamps might be different.)
*/
