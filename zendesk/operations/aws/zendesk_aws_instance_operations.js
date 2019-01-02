log.trace("Started executing example:zendesk_aws_instance_operations.js flintbit")

try {
    log.trace(input)

    // Get all inputs
    service_conf = input.get('zendesk_aws_conf')
    region = service_conf.get('region')
    key_name = service_conf.get('key_name')
    subnet_id = service_conf.get('subnet_id')
    access_key = service_conf.get('access-key')
    security_key = service_conf.get('security-key')
    availability_zone = service_conf.get('availability_zone')
    zendesk_connector_name = service_conf.get('zendesk_connector_name')
    aws_connector_name = service_conf.get('aws_connector_name')

    // Zendesk Input Example : "data":"value=ticketid-90%26ticketstatus-Open%26requester-Akash%26instancesize-t2.nano%26osname-red_hat_enterprise_linux_7.5"

    // Parsing the input we get from Zendesk ticket forms
    zendesk_request_body = input.get('data')
    zendesk_request_body = zendesk_request_body.replace('value=', '\"')
    log.trace(zendesk_request_body)
    zendesk_request_body = zendesk_request_body.replace(/[.]/g, '\"\:\"')
    log.trace(zendesk_request_body)
    zendesk_request_body = zendesk_request_body.replace(/%26/g, '\"\,\"')
    log.trace(zendesk_request_body)
    zendesk_request_body = '{' + zendesk_request_body + '\"}'

    log.trace("Final Json Format :: " + zendesk_request_body)

    zendesk_request_body = JSON.parse(zendesk_request_body)

    // Instance related variables
    instance_id = zendesk_request_body['instanceid']
    instance_action = zendesk_request_body['instanceaction']

    // Zendesk Ticket Inputs
    ticket_priority = zendesk_request_body['ticketpriority']
    ticket_id = zendesk_request_body['ticketid']
    log.trace(ticket_id)
    requester_name = zendesk_request_body['requester']
    ticket_status = zendesk_request_body['ticketstatus']
    requester_id = zendesk_request_body['requesterid']
    ticket_type = zendesk_request_body['tickettypeid']
    log.trace(ticket_type)

    // Acknowledgement body
    acknowledgement_body = '**Flint Automation:** \n Hi, ' + requester_name + '! Flint has acknowledged your request for AWS EC2 ' + instance_action + ' instance action and automation has been initiated'

    // Final body
    final_ticket_comment = '**Flint Automation:**\n' + requester_name + ', the requested instance with ID **' + instance_id + '**, has been successfully ' + instance_action + 'ed.'

    log.trace("About to add acknowledgement ticket comment")
    response_update_ticket = call.bit("flint-util:zendesk:operations:update_ticket.rb")
        .set('connector_name', zendesk_connector_name)
        .set("type", ticket_type.toLowerCase())
        .set("priority", ticket_priority.toLowerCase())
        .set("comment", acknowledgement_body)
        .set("ticket-id", ticket_id.toString())
        .set("status", ticket_status.toLowerCase())
        .set("requester_id", requester_id.toString())
        .sync()

    log.trace(response_update_ticket)
    log.trace(response_update_ticket.get('exitcode'))
    ack_exit_code = response_update_ticket.get('exitcode')
    log.trace("Exit code for ack comment " + ack_exit_code)
    log.info(response_update_ticket.get('result'))

    // If acknowledgement comment is successfully posted, switch instance action
    if (response_update_ticket.get('result') != null || response_update_ticket.get('result') != '') {

        switch (instance_action) {
            // Start Instance
            case 'start':
                // Update ticket with instance details

                log.trace("About to call AWS EC2 instance start flintbit")

                // switch(instance_action){}
                start_aws_flintbit_call_response = call.bit("fb-cloud:aws-ec2:operation:start_instance.rb")
                    .set("connector_name", aws_connector_name)
                    .set("access-key", access_key)
                    .set("security-key", security_key)
                    .set("region", region)
                    .set("instance-id", instance_id)
                    .set('timeout', 60000)
                    .sync()

                // Getting exit-code for start instance flinbit call
                start_instance_exit_code = start_aws_flintbit_call_response.get("exit-code")
                start_instance_response_message = start_aws_flintbit_call_response.get("message")

                log.trace(start_aws_flintbit_call_response)

                if (start_instance_exit_code == 0) {
                    output.set('user_message', final_ticket_comment)

                    // Update ticket upon success
                    response_update_ticket = call.bit("flint-util:zendesk:operations:update_ticket.rb")
                        .set('connector_name', zendesk_connector_name)
                        .set("type", ticket_type.toLowerCase())
                        .set("priority", ticket_priority.toLowerCase())
                        .set("comment", final_ticket_comment)
                        .set("ticket-id", ticket_id.toString())
                        .set("status", ticket_status.toLowerCase())
                        .set("requester_id", requester_id.toString())
                        .sync()

                    log.trace(response_update_ticket)
                    // log.trace(response_update_ticket.get('exitcode'))
                    // ack_exit_code = response_update_ticket.get('exitcode')
                    // log.trace("Exit code for ack comment " + ack_exit_code)
                    log.info(response_update_ticket.get('result'))

                    output.set('exit-code', 0)
                    // output.set('user_message', start_instance_response_message)

                } else {
                    // Update ticket upon success
                    response_update_ticket = call.bit("flint-util:zendesk:operations:update_ticket.rb")
                        .set('connector_name', zendesk_connector_name)
                        .set("type", ticket_type.toLowerCase())
                        .set("priority", ticket_priority.toLowerCase())
                        .set("comment", final_ticket_comment)
                        .set("ticket-id", ticket_id.toString())
                        .set("status", ticket_status.toLowerCase())
                        .set("requester_id", requester_id.toString())
                        .sync()



                    output.set('error', start_instance_response_message)
                }
                break

            // Stop Instance
            case 'stop':

                // Update ticket with instance details
                log.trace("About to call AWS EC2 instance stop flintbit")

                // switch(instance_action){}
                stop_aws_flintbit_call_response = call.bit("fb-cloud:aws-ec2:operation:stop_instance.rb")
                    .set("connector_name", aws_connector_name)
                    .set("access-key", access_key)
                    .set("security-key", security_key)
                    .set("region", region)
                    .set("instance-id", instance_id)
                    .set('timeout', 60000)
                    .sync()

                // Getting exit-code for start instance flinbit call
                stop_instance_exit_code = stop_aws_flintbit_call_response.get("exit-code")
                stop_instance_response_message = stop_aws_flintbit_call_response.get("message")

                log.trace(stop_aws_flintbit_call_response)

                if (stop_instance_exit_code == 0) {

                    // Update ticket upon success
                    response_update_ticket = call.bit("flint-util:zendesk:operations:update_ticket.rb")
                        .set('connector_name', zendesk_connector_name)
                        .set("type", ticket_type.toLowerCase())
                        .set("priority", ticket_priority.toLowerCase())
                        .set("comment", final_ticket_comment)
                        .set("ticket-id", ticket_id.toString())
                        .set("status", ticket_status.toLowerCase())
                        .set("requester_id", requester_id.toString())
                        .sync()

                    log.trace(response_update_ticket)
                    // log.trace(response_update_ticket.get('exitcode'))
                    // ack_exit_code = response_update_ticket.get('exitcode')
                    // log.trace("Exit code for ack comment " + ack_exit_code)
                    log.info(response_update_ticket.get('result'))

                    //output.set('user_message', stop_instance_response_message)
                    output.set('exit-code', 0)
                }
                break

            // Restart Instance
            case 'restart':

                // Update ticket with instance details
                log.trace("About to call AWS EC2 instance reboot flintbit")

                // switch(instance_action){}
                restart_aws_flintbit_call_response = call.bit("fb-cloud:aws-ec2:operation:reboot_instance.rb")
                    .set("connector_name", aws_connector_name)
                    .set("access-key", access_key)
                    .set("security-key", security_key)
                    .set("region", region)
                    .set("instance-id", instance_id)
                    .set('timeout', 60000)
                    .sync()

                // Getting exit-code for start instance flinbit call
                restart_instance_exit_code = restart_aws_flintbit_call_response.get("exit-code")
                restart_instance_response_message = restart_aws_flintbit_call_response.get("message")

                log.trace(restart_aws_flintbit_call_response)

                if (restart_instance_exit_code == 0) {


                    // Update ticket upon success
                    response_update_ticket = call.bit("flint-util:zendesk:operations:update_ticket.rb")
                        .set('connector_name', zendesk_connector_name)
                        .set("type", ticket_type.toLowerCase())
                        .set("priority", ticket_priority.toLowerCase())
                        .set("comment", final_ticket_comment)
                        .set("ticket-id", ticket_id.toString())
                        .set("status", ticket_status.toLowerCase())
                        .set("requester_id", requester_id.toString())
                        .sync()

                    log.trace('Ticket updated. \nResult:::')
                    log.trace(response_update_ticket)
                    // log.trace(response_update_ticket.get('exitcode'))
                    // ack_exit_code = response_update_ticket.get('exitcode')
                    // log.trace("Exit code for ack comment " + ack_exit_code)
                    // log.info(response_update_ticket.get('result'))

                    //output.set('user_message', restart_instance_response_message)
                    log.trace('user_message' + restart_instance_response_message)
                    output.set('exit-code', 0)
                    log.trace('After exit-code')
                }
                break

            // Delete Instance
            case 'delete':

                // Update ticket with instance details
                log.trace("About to call AWS EC2 instance deletetion flintbit")

                // switch(instance_action){}
                delete_aws_flintbit_call_response = call.bit("fb-cloud:aws-ec2:operation:terminate_instance.rb")
                    .set("connector_name", aws_connector_name)
                    .set("access-key", access_key)
                    .set("security-key", security_key)
                    .set("region", region)
                    .set("instance-id", instance_id)
                    .set('timeout', 60000)
                    .sync()

                // Getting exit-code for start instance flinbit call
                delete_instance_exit_code = delete_aws_flintbit_call_response.get("exit-code")
                delete_instance_response_message = delete_aws_flintbit_call_response.get("message")

                log.trace(delete_aws_flintbit_call_response)

                if (delete_instance_exit_code == 0) {

                    // Update ticket upon success
                    response_update_ticket = call.bit("flint-util:zendesk:operations:update_ticket.rb")
                        .set('connector_name', zendesk_connector_name)
                        .set("type", ticket_type.toLowerCase())
                        .set("priority", ticket_priority.toLowerCase())
                        .set("comment", final_ticket_comment)
                        .set("ticket-id", ticket_id.toString())
                        .set("status", ticket_status.toLowerCase())
                        .set("requester_id", requester_id.toString())
                        .sync()

                    log.trace(response_update_ticket)
                    //log.trace(response_update_ticket.get('exitcode'))
                    //ack_exit_code = response_update_ticket.get('exitcode')
                    //log.trace("Exit code for ack comment " + ack_exit_code)
                    log.info(response_update_ticket.get('result'))

                    output.set('user_message', delete_instance_response_message)
                    output.set('exit-code', 0)

                }
                break
        }


    }

} catch (error) {
    output.set('user_message', error)
    output.set('exit-code', -1)
}

log.trace("Finished executing example:zendesk_aws_instance_operations.js flintbit")
