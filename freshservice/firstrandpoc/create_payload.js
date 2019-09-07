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

// Basic auth username & password
// if (input_clone.hasOwnProperty('username')) {
//     username = input.get('username')
//     if (username != null && username != "") {
//         log.trace("Username is " + username)
//         // Password
//         if (input_clone.hasOwnProperty('password')) {
//             password = input.get('password')
//             if (password != null && password != "") {
//                 log.trace("Password is given "+password)

//                 log.trace("Encoding username:password")
//                 base64creds = util.encode64(username + ":" + password)
//                 base64creds = 'Basic ' + base64creds
//                 log.trace("Base64 encoding: "+base64creds)
//             }
//         }
//     }
// }

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
        log.trace("=============>> "+headers[index].indexOf('Authorization') >=0)
        if (headers[index].indexOf('Authorization') >=0) {
            log.trace("Current header :: "+headers[index])
            headers[index] = headers[index].replace(':', ':Basic ')
            log.trace("Basic appended >>>>>>> "+headers[index])
            
        }else{
            headers[index].replace(/ /, '')
            log.trace('Removing whitespaces  >>> '+headers)
        }
    }
    log.trace("Final headers: "+headers)

    log.trace("Multiple headers are given")

    

    // // Add basic auth header 
    // if (base64creds != null && base64creds != "") {
    //     log.trace("Basic auth: Base64 encoding is given")
    //     headers.insert('Authorization:Basic '+base64creds)
    //     log.trace(headers)
    // }

    flintbit_request.set("headers", headers);
} else {
    // Single headers
    headers = headers.replace(/ /g, '')
    // Add basic auth header 
    if (base64creds != null && base64creds != "") {
        log.trace("Basic auth: Base64 encoding is given " + base64creds)
        log.trace(headers)

    }
    flintbit_request.set("headers", headers);
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
