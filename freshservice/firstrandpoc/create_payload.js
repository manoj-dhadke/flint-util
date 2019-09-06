/**
 * Creation date: 6th September 2019
 * Flintbit written to convert string to JSON payload
 */

 log.trace("Started executing 'flint-util:create_payload.js' flintbit")

 log.info("Inputs to flintbit are: "+input)

 payload = input.get("payload")
 log.trace("Payload is "+payload)

payload = util.json(payload)
log.trace("Payload converted to Json: "+payload)

ouput.set("result", payload)
