/*************************************************************************
 * 
 * INFIVERVE TECHNOLOGIES PTE LIMITED CONFIDENTIAL
 * __________________
 * 
 * (C) INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE
 * All Rights Reserved.
 * Product / Project: Flint IT Automation Platform
 * NOTICE:  All information contained herein is, and remains
 * the property of INFIVERVE TECHNOLOGIES PTE LIMITED.
 * The intellectual and technical concepts contained
 * herein are proprietary to INFIVERVE TECHNOLOGIES PTE LIMITED.
 * Dissemination of this information or any form of reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE.
 */

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
