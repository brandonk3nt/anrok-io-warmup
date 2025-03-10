def start_http_get_parallel(urls, callback):
    responses = [None] * len(urls) # Pre-size the response list.
    num_outstanding = 0;

    def handle_response(i, r):
        nonlocal num_outstanding
        responses[i] = r
        num_outstanding -= 1
        if num_outstanding == 0:
            # If this was the last outstanding request, we're done.
            callback(responses)

    def start_request(i, url):
        nonlocal num_outstanding
        num_outstanding += 1
        start_http_get(url, lambda r: handle_response(i, r))

    for i, url in enumerate(urls):
        start_request(i, url)

def start_http_get_serial(urls, callback):
    responses = []

    def start_next():
        i = len(responses)
        if i < len(urls):
            start_http_get(urls[i], handle_response)
        else:
            callback(responses)

    def handle_response(r):
        responses.append(r)
        start_next()

    start_next()

