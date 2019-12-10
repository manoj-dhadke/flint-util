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

log.trace("Started executing example:zendesk_aws_ec2_router.js flintbit")

try {
    log.trace(input)
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

    ticket_name = zendesk_request_body['ticketname']
    log.trace(ticket_name)
    ticket_name = ticket_name.replace(/[+]/g, ' ')

    log.info("Ticket Form Name : " + ticket_name)

    switch (ticket_name) {

        case 'Create AWS EC2 Instance':
            log.info('Inside Create AWS EC2 Instance switch case')
            create_instance_response = call.bit('example:zendesk_aws.js')
                .set(input)
                .sync()

            exit_code = create_instance_response.get('exit-code')
            log.trace('Create Instance Router Exit Code :: ' + exit_code)
            if (exit_code == 0) {

                output.set('exit-code', exit_code)
                output.set('result', create_instance_response.get('exit-code'))
            }
            break

        case 'AWS EC2 Instance Operation':
            log.info('Inside AWS EC2 Instance Operations switch case')

            instance_operation_response = call.bit('example:zendesk_aws_instance_operations.js')
                .set(input)
                .sync()

            exit_code = instance_operation_response.get('exit-code')
            log.trace("Router Instance Operations Exit Code :: " + exit_code)
            if (exit_code == 0) {
                
                output.set('exit-code', exit_code)
                output.set('result', instance_operation_response.message())
            }

            break

        default:
            log.trace('No cases matched')

    }


} catch (error) {
    log.trace(error)
    output.set('error', error)
}
