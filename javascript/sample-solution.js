function httpGetParallel(urls, callback) {
    const responses = Array(urls.length); // Pre-size the response array.

    let numOutstanding = 0;
    for (const [i, url] of urls.entries()) {
        numOutstanding++;
        httpGet(url, r => {
            // As we get each response, save it in the appropriate array slot.
            responses[i] = r;
            numOutstanding--;
            // If this was the last outstanding request, we're done.
            if (numOutstanding === 0) {
                callback(responses);
            }
        });
    }
}

function httpGetSerial(urls, callback) {
    const responses = [];

    const startRequest = i => {
        if (i < urls.length) {
            httpGet(urls[i], r => {
                responses.push(r);
                startRequest(i + 1);
            });
        } else {
            callback(responses);
        }
    };

    startRequest(0);
}
