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

/**
** Creation Date: 23th August 2018
** Summary: This is Create AWS instance service flintbit.
** Description: This flintbit is developed to create an AWS instance after receiving request from Freshserver.
**/

log.trace("Started executing flint-util:freshservice:wrapper_aws_create_instance.js flintbit.")
log.info("Input.....:: "+input)
try{
    // Get Flint Job ID
    flint_job_id = input.jobid()

    // Inputs to create AWS instance, set in service config
    region = input.get('region')
    key_name = input.get('key_name')
    subnet_id = input.get('subnet_id')
    access_key = input.get('access-key')    
    max_instance = input.get('max_instance')
    min_instance = input.get('min_instance')
    security_key = input.get('security-key')
    aws_connector_name = input.get('aws_connector_name')
    availability_zone = input.get('availability_zone')

    // Service ID/ Ticket ID
    ticket_id = input.get('freshdesk_webhook.ticket_id')
    ticket_id = ticket_id.replace(/^\D+/g, '')
    log.info(ticket_id)

    // Ticket service item fields to be parsing
     ticket_service_item_fields = input.get('freshdesk_webhook.ticket_service_item_fields')
 
    // Parse the service item fields by calling flintbit
    parse_flintbit_call_response = call.bit('flint-util:freshservice:extract_sr_items_fields.groovy')
                                       .set('ticket_service_item_fields', ticket_service_item_fields)
                                       .sync()
    
    // Get instance size(type) from the response of freshservice extract_sr_items_fields
    instance_size = parse_flintbit_call_response.get('data').get('Instance Size')
    // Getting OS
    os_type = parse_flintbit_call_response.get('data').get('Operating System')
    log.info("Ticket ID " + ticket_id)
    log.info("Instance Size " + instance_size)
    log.info("OS: " + os_type)

    // Inputs for setting service status
    domain_name = input.get('domain_name')
    email = input.get('email')
    password = input.get('password')
    status = input.get('status')
    connector_name = input.get('connector_name')
    ticket_type = input.get('ticket_type')

    // Inputs for creating notes
    acknowledgement_body = "Service request acknowledged and AWS instance provisioning initiated by Flint job id - ("+flint_job_id+")"
    private_note = input.get('private_note')

    // Getting relevant ami ID
    ami_id = input.get('os_mapping').get(os_type)
    log.trace("AMI ID: " + ami_id)

    // Add service acknowledgement note
    flintbit_call_response = call.bit("flint-util:freshservice:add_note.js")
                                 .set('domain_name', domain_name)
                                 .set('email', email)
                                 .set('password', password)
                                 .set('private_note',private_note)
                                 .set('body', acknowledgement_body)
                                 .set('connector_name',connector_name)
                                 .set('ticket_id',ticket_id)
                                 .set('ticket_type',ticket_type)
                                 .sync()

    log.trace("First Add note call is done")

    first_note_exitcode = flintbit_call_response.get("exit-code")
    first_note_response_message = flintbit_call_response.get("message")
    log.trace(first_note_response_message)
    log.trace(first_note_exitcode)
    
    if(first_note_exitcode == 0){
        log.trace(input)

        create_aws_flintbit_call_response = call.bit("fb-cloud:aws-ec2:operation:create_instance.rb")
                                                .set('connector_name',aws_connector_name)   
                                                .set('ami_id', ami_id)                  // Image ID
                                                .set('instance_type', instance_size)    
                                                .set('min_instance', min_instance)
                                                .set('max_instance', max_instance)
                                                .set('access-key',access_key)
                                                .set('security-key', security_key)
                                                .set('availability_zone', availability_zone)
                                                .sync()
        
        // Getting exit-code for create instance flinbit call
        create_instance_exit_code = create_aws_flintbit_call_response.get("exit-code")
        create_instance_response_message = create_aws_flintbit_call_response.get("message")

        // Getting instance information
        instance_info = create_aws_flintbit_call_response.get('instances-info')
        instance_id = instance_info[0].get('instance-id')
        log.info("Instance_Info: " +instance_id)
        // Getting private IP
        private_ip = instance_info[0].get('private-ip')
        log.info("Private IP: " + private_ip)

        // Final note body
        final_body = "Service request is now resolved by Flint. Here are the details of newly provisioned AWS instance -\n Instance ID: " +instance_id + "\n Instance Type: " + instance_size + "\nOS: "+ os_type +"\n Private IP: " + private_ip

        user_message = "<b>Flint Automation:</b>  Created AWS instance successfully. <br><b>Instance ID:</b> " +instance_id + " <br><b>Instance Type:</b> " + instance_size + "<br><b>OS:</b> "+ os_type +"<br><b>Private IP:</b> " + private_ip

        if(create_instance_exit_code == 0){
            // Set service status
            update_ticket_call_response = call.bit('flint-util:freshservice:update_ticket.js')
                                              .set('domain_name', domain_name)
                                              .set('email',email)
                                              .set('password', password)
                                              .set('status', status)
                                              .set('connector_name', connector_name)
                                              .set('ticket_id', ticket_id)
                                              .set('ticket_type', ticket_type)
                                              .sync()
            // Get Service status response message
            update_ticket_response_message = update_ticket_call_response.get("message")
            log.trace(update_ticket_response_message)

            // Add note after instance is created
           second_flintbit_call_response =  call.bit("flint-util:freshservice:add_note.js")
                                                .set('domain_name', domain_name)
                                                .set('email', email)
                                                .set('password', password)
                                                .set('private_note',private_note)
                                                .set('body',final_body)
                                                .set('connector_name',connector_name)
                                                .set('ticket_id',ticket_id)
                                                .set('ticket_type',ticket_type)
                                                .sync()

            second_note_response_message =  second_flintbit_call_response.get("message")
            log.trace(second_note_response_message)  

            // Setting user message (will be visible on CMP)
            output.set('exit-code', 0).set('user_message', user_message)
        }else{
            log.error("Unable to create AWS instance : "+ create_instance_response_message)
        }
    }else{
        log.error("Unable to create note : " + first_note_response_message)
    }
}catch(error){
    log.error("Error : " + error)
}
log.trace("Finished executing flint-util:freshservice:wrapper_aws_create_instance.js flintbit.")
