/**
* Flintbit to send data to RabbitMQ queue
*
**/

log.info("Started executing 'flint-util:freshservice:post_data_to_mq.js' flintbit")

log.debug("Inputs are "+input)

log.info(+ new Date())

queue_name = "freshworks-jobrequestcount"
log.debug("RabbitMQ queue name is "+queue_name)

body = input.get('body')
log.debug("Body to post to queue "+queue_name+" is "+body)

util.sendToQueue(queue_name, util.json(body))
log.info("Sent "+body+" to RabbitMQ queue "+queue_name)

output.set("result", "Attempted to send freshworks data to MQ")

log.info("Finished executing 'example:post_data_to_mq.js' flintbit")


// timestamp
// input.context()
// fw_subdomain, fw_account_id

// To be added to auth.ini on Flint SaaS platform
// freshservice
// FreshSrv$

// Queuename : freshworks-jobrequestcount