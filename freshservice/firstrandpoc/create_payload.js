/**
 * Creation date: 6th September 2019
 * Flintbit written send payload
 */

log.trace("Started executing 'flint-util:create_payload.js' flintbit")

log.info("Inputs to flintbit are: " + input)

input_clone = JSON.parse(input)

payload = input.get("payload")
log.trace("Payload is " + payload)

log.trace("Payload Type: " + typeof payload)
url = input.get('url')

headers = input.get('headers')

// Make Http Post Request
flintbit_request = call.bit('flint-util:http:operation:workflow:post.js')
    .set('url', url)
    .set('body', payload)
    .set('method', 'post')

// Add headers
// Multiple headers
if (headers.match(',')) {
    log.trace("Removing spaces if any: " + headers)

    // Split header
    headers = headers.split(',')

    for (index in headers) {
        log.trace("=============>> " + headers[index].indexOf('Authorization') >= 0)
        if (headers[index].indexOf('Authorization') >= 0) {
            // log.trace("Current header :: " + headers[index])
            // headers[index] = headers[index].replace(':', ':Basic ')
            log.trace("Basic appended >>>>>>> " + headers[index])

        } else {
            headers[index].replace(/ /g, '')
            log.trace('Removing whitespaces  >>> ' + headers)
        }
    }
    log.trace("Final headers: " + headers)

    log.trace("Multiple headers are given")

    flintbit_request.set("headers", headers);
} else {
    // Single headers
    if (headers.indexOf('Authorization') >= 0) {
        log.trace("Single header: Authorization is given")
        flintbit_request.set("headers", headers)

    } else {
        headers = headers.replace(/ /g, '')
        flintbit_request.set("headers", headers)
    }
}

flintbit_response = flintbit_request.sync()

log.trace("POST flintbit reponse: " + flintbit_response)
exit_code = flintbit_response.exitcode()
message = flintbit_response.message()

if (exit_code == 0) {
    log.trace("Exit code is " + exit_code)
    output.set('exit-code', 0).set('result', flintbit_response.get('result'))
} else {
    log.trace("POST request failed due to " + message)
    output.set('exit-code', -1).set('error', message)
}
