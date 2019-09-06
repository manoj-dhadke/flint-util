/**
 * Creation date: 6th September 2019
 * Flintbit written to convert string to JSON payload
 */

 log.trace("Started executing 'flint-util:create_payload.js' flintbit")

 log.info("Inputs to flintbit are: "+input)

 payload = input.get("payload")
 log.trace("Payload is "+payload)

log.trace("Payload Type: "+typeof payload)

// Make Http Post Request
flintbit_response = call.bit('flint-util:http:operation:workflow:post.js')
.set('url', url)
.set('body', payload)
.set('method', 'post')
.sync()

log.trace("POST flintbit reponse: "+flintbit_response)
exit_code = flintbit_response.exitcode()
message = flintbit_response.message()

if(exit_code == 0){
    log.trace("Exit code is "+exit_code)
    output.set(0, message).set('result', flintbit_response.get('result'))
}else{
    log.trace("POST request failed due to "+message)
    output.set(-1, message).set('error', message)
}

ouput.set("result", payload).set("exit-code", 0)
