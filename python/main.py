# 1. 'start_http_get' is provided for you. Do not change that code.
# 2. You have to implement 'start_http_get_parallel' and 'start_http_get_serial'
#    using 'start_http_get'.
# 3. Do everything with non-blocking, callback-style I/O. Do not use async/await,
#    futures, or threads.
#
# Expected results after implementing 'start_http_get_parallel':
# 
#    $ python main.py parallel
#    [12:23:03.4] Started!
#    [12:23:03.4] HTTP start "https://httpbin.org/delay/1"
#    [12:23:03.4] HTTP start "https://httpbin.org/delay/2"
#    [12:23:03.4] HTTP start "https://httpbin.org/delay/1"
#    [12:23:04.8] HTTP finish "https://httpbin.org/delay/1" -> "{\n  \"args\": {}, \n  \""
#    [12:23:04.9] HTTP finish "https://httpbin.org/delay/1" -> "{\n  \"args\": {}, \n  \""
#    [12:23:06.9] HTTP finish "https://httpbin.org/delay/2" -> "{\n  \"args\": {}, \n  \""
#    [12:23:06.9] Got responses: [
#        "{\n  \"args\": {}, \n  \"",
#        "{\n  \"args\": {}, \n  \"",
#        "{\n  \"args\": {}, \n  \""
#    ]
#
# Expected results after implementing 'start_http_get_serial':
#
#    $ python main.py serial
#    [12:23:23.3] Started!
#    [12:23:23.3] HTTP start "https://httpbin.org/delay/1"
#    [12:23:24.7] HTTP finish "https://httpbin.org/delay/1" -> "{\n  \"args\": {}, \n  \""
#    [12:23:24.7] HTTP start "https://httpbin.org/delay/2"
#    [12:23:27.0] HTTP finish "https://httpbin.org/delay/2" -> "{\n  \"args\": {}, \n  \""
#    [12:23:27.0] HTTP start "https://httpbin.org/delay/1"
#    [12:23:28.4] HTTP finish "https://httpbin.org/delay/1" -> "{\n  \"args\": {}, \n  \""
#    [12:23:28.4] Got responses: [
#        "{\n  \"args\": {}, \n  \"",
#        "{\n  \"args\": {}, \n  \"",
#        "{\n  \"args\": {}, \n  \""
#    ]
#
# (Your timestamps might be different.)

def start_http_get_parallel(urls, callback):
    """
    This function should initiate parallel HTTP GET requests for all URLs in
    the 'urls' list. After all requests are complete, call 'callback' with
    an list of response bodies, matching the order of the `urls` list.
    """
    # - You have to write this code.
    raise AssertionError('todo')

def start_http_get_serial(urls, callback):
    """
    This function should make HTTP GET requests for the URLs in the 'urls'
    list one at a time. After the last request is complete, call 'callback'
    with an list of response bodies, matching the order of the `urls` list.
    """
    # - You have to write this code.
    # - You can use 'start_http_get', but don't use async/await, futures,
    #   threads, or any other HTTP library functions.
    # - It is a non-blocking function, so it should return soon after kicking
    #   things off.
    raise AssertionError('todo')

# ---------------------------------------------------------------------------------
# Don't change anything below this.

def start_http_get(url, callback):
    """
    A callback-style function to make an HTTP GET request. This function does not
    block -- it will return after starting the HTTP request, but will not wait for
    it to finish. When the request is complete, your passed-in 'callback' will be
    called with the response body text. For simplicity, we're ignoring errors.

    Example (single HTTP request)
        def handle_response(response_body):
            print('Got response: {!r}'.format(response_body))
        start_http_get('https://example.org/', handle_response)

    Example (two HTTP requests, one after another)
        def handle_response_1(response_body_1):
            print('Got first response: {!r}'.format(response_body_1))
            target_url = extract_first_link(response_body_1)
            def handle_response_2(response_body_2):
                print('Got second response: {!r}'.format(response_body_2))
            start_http_get(target_url, handle_response_2)
        start_http_get('https://example.org/', handle_response_1)
    """
    log("HTTP start {}".format(q(url)))
    # Use threads to simulate a callback-style API. This is just an internal implementation
    # detail of 'start_http_get'. In this exercise, you should do everything with callbacks.
    # Do not use threads, async/await, or futures.
    def run_request():
        body = urllib.request.urlopen(url).read().decode('utf8')
        truncated = body[0:20]
        log("HTTP finish {} -> {}".format(q(url), q(truncated)))
        callback(truncated)
    threading.Thread(target=run_request).start()

import datetime
import json
import threading
import urllib.request
import sys

def main(args):
    if len(args) != 1:
        print('Expecting exactly one argument, got: {!r}'.format(args))
        sys.exit(1)
    mode = args[0]

    # httpbin.org provides several convenient test endpoints. We're using
    # httpbin.org/delay/N, which just waits N seconds before responding.
    urls = [
        'https://httpbin.org/delay/1',
        'https://httpbin.org/delay/2',
        'https://httpbin.org/delay/1',
    ]
    def log_responses(responses):
        log('Got responses: {}'.format(json.dumps(responses, indent=4)))

    if mode == 'parallel':
        start_http_get_parallel(urls, log_responses)
    elif mode == 'serial':
        start_http_get_serial(urls, log_responses)
    else:
        print('Expecting "serial" or "parallel", got {}.'.format(q(mode)))
        sys.exit(1)

    log('Started!')

def log(message):
    ts = datetime.datetime.now().strftime('%H:%M:%S.%f')[:-5]
    print('[{}] {}'.format(ts, message))

def q(s):
    return json.dumps(s)

if __name__ == '__main__':
    main(sys.argv[1:])
