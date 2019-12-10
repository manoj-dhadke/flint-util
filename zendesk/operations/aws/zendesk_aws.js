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

log.trace("Started executing example:zendesk_aws_instance.js flintbit")

try {
    log.trace(input)
    ami_id = ""
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

    max_instance = service_conf.get('max_instance')
    min_instance = service_conf.get('min_instance')


    // Zendesk Input Example : "data":"value=ticketid-90%26ticketstatus-Open%26requester-Akash%26instancesize-t2.nano%26osname-red_hat_enterprise_linux_7.5"

    // Parsing the input we get from Zendesk ticket forms
    zendesk_request_body = input.get('data')
    zendesk_request_body = zendesk_request_body.replace('value=', '\"')
    log.trace(zendesk_request_body)
    zendesk_request_body = zendesk_request_body.replace(/[-]/g, '\"\:\"')
    log.trace(zendesk_request_body)
    zendesk_request_body = zendesk_request_body.replace(/%26/g, '\"\,\"')
    log.trace(zendesk_request_body)
    zendesk_request_body = '{' + zendesk_request_body + '\"}'

    log.trace("Final Json Format :: " + zendesk_request_body)

    zendesk_request_body = JSON.parse(zendesk_request_body)

    // Zendesk Ticket Form Inputs
    os_name = zendesk_request_body['osname']
    log.trace("Operating system :: " + os_name)
    //"ticketid":"92","ticketstatus":"Open","requester":"Akash","instancesize":"t2.nano","osname":"red_hat_enterprise_linux_7.5"

    ticket_priority = zendesk_request_body['ticketpriority']

    // Mapping AMI ID from service conf for corresponding OS
    os_mapping = service_conf.get('os_mapping')
    log.trace(os_mapping)
    os_mapping = util.json(os_mapping)
    log.trace(os_mapping)
    os_map = JSON.parse(os_mapping)
    if (os_map.hasOwnProperty(os_name)) {

        log.trace("Inside os mapping if " + typeof os_mapping)
        ami_id = input.get('zendesk_aws_conf').get('os_mapping').get(os_name)
        log.trace("AMI ID: " + ami_id)
    }

    instance_size = zendesk_request_body['instancesize']
    log.trace("Instance size : " + instance_size)
    ticket_id = zendesk_request_body['ticketid']
    log.trace(ticket_id)
    requester_name = zendesk_request_body['requester']
    ticket_status = zendesk_request_body['ticketstatus']
    requester_id = zendesk_request_body['requesterid']

    ticket_type = zendesk_request_body['tickettypeid']
    log.trace(ticket_type)

    acknowledgement_body = '**Flint Automation:** \n Hi, '+requester_name+'! Flint has acknowledged request for AWS instance creation and automation has been initiated'

    log.trace("About to update ticket")
    response_update_ticket= call.bit("flint-util:zendesk:operations:update_ticket.rb")
                                 .set('connector_name', zendesk_connector_name)
                                 .set("type",ticket_type.toLowerCase())
                                 .set("priority", ticket_priority.toLowerCase())
                                 .set("comment", acknowledgement_body)
                                 .set("ticket-id", ticket_id.toString())
                                 .set("status","open")
                                 .set("requester_id", requester_id.toString())
                                 .sync()
   log.trace(response_update_ticket)
   log.trace(response_update_ticket.get('exitcode'))
   ack_exit_code = response_update_ticket.get('exitcode')
   log.trace("Exit code for ack comment " +ack_exit_code)

    if (response_update_ticket.get('result')!= null || response_update_ticket.get('result')!= '') {
        log.trace("About to call AWS EC2 instance creation flintbit")

        // Call AWS EC2 Instance Creation Flintbit
        create_aws_flintbit_call_response = call.bit("fb-cloud:aws-ec2:operation:create_instance.rb")
            .set('connector_name', aws_connector_name)
            .set('ami_id', ami_id)                  // Image ID
            .set('instance_type', instance_size)
            .set('min_instance', min_instance)
            .set('max_instance', max_instance)
            .set('access-key', access_key)
            .set('security-key', security_key)
            .set('availability_zone', availability_zone)
            .sync()

        // Getting exit-code for create instance flinbit call
        create_instance_exit_code = create_aws_flintbit_call_response.get("exit-code")
        create_instance_response_message = create_aws_flintbit_call_response.get("message")

        log.trace(create_aws_flintbit_call_response)

        if (create_instance_exit_code == 0) {
            // Getting instance information
            instance_info = create_aws_flintbit_call_response.get('instances-info')
            instance_id = instance_info[0].get('instance-id')
            log.info("Instance_Info: " + instance_id)
            // Getting private IP
            private_ip = instance_info[0].get('private-ip')
            log.info("Private IP: " + private_ip)
            //output.set('user_message', create_aws_flintbit_call_response)

            final_ticket_comment = '**Flint Automation:**\n'+ requester_name +', here are the instance details: \nInstance ID: '+instance_id+'\n Private IP: '+private_ip
            // Update ticket with instance details
            response_update_ticket = call.bit("flint-util:zendesk:operations:update_ticket.rb")
                .set('connector_name', zendesk_connector_name)
                .set("type", ticket_type.toLowerCase())
                .set("priority", ticket_priority.toLowerCase())
                .set("comment", final_ticket_comment)
                .set("ticket-id", ticket_id.toString())
                .set("status", "closed")
                .set("requester_id", requester_id.toString())
                .sync()

            log.trace('Second update ticket response :: '+response_update_ticket)
            log.trace(response_update_ticket.get('exitcode'))
            ack_exit_code = response_update_ticket.get('exitcode')
        }
    }
} catch (error) {
    output.set('user_message', error)
}

log.trace("Finished executing example:zendesk_aws_instance.js flintbit")
