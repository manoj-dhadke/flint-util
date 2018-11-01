log.trace("Started executing freshservice:router:router.js")
log.info("Input from freshservice.....:: " + input)
flint_job_id = input.jobid()
//AWS inputs
aws_config = input.get("aws_config")
aws_connector_name = aws_config.get('aws_connector_name')         // Name of the Amazon EC2 Connector
access_key = aws_config.get('access-key')
security_key = aws_config.get('security-key')
aws_region = aws_config.get('region')	                             // Amazon EC2 region (default region is 'us-east-1')
//Azure
//GCP
ticket_id = input.get('freshdesk_webhook.ticket_id')
ticket_id = ticket_id.replace(/^\D+/g, '')
log.info("Ticket ID " + ticket_id)
freshservice_config = input.get("freshservice_config")
domain_name = freshservice_config.get('domain_name')
email = freshservice_config.get('email')
password = freshservice_config.get('password')
status = freshservice_config.get('status')
freshservice_connector_name = freshservice_config.get('freshservice_connector_name')
ticket_type = freshservice_config.get('ticket_type')

// Ticket service item fields to be parsing
ticket_service_item_fields = input.get('freshdesk_webhook.ticket_service_item_fields')
log.trace("Ticket service field...:: " + ticket_service_item_fields)

// Parse the service item fields by calling flintbit
parse_flintbit_call_response = call.bit('flint-util:freshservice:extract_sr_items_fields.groovy')
    .set('ticket_service_item_fields', ticket_service_item_fields)
    .sync()
// Get instance size(type) from the response of freshservice extract_sr_items_fields
flint_action_name = parse_flintbit_call_response.get('data').get("Item Name")
log.info("Flint action name....:: "+flint_action_name)
instance_id = parse_flintbit_call_response.get('data').get('Instance ID')
log.info("Instance id " + instance_id)

switch (flint_action_name) {
    case "Start AWS EC2 Instance":
        {
            log.info("Start aws instance")
            flintbit_response = call.bit("flint-util:freshservice:aws:aws_start_instance.js")
                .set("connector_name", aws_connector_name)
                .set("security-key", security_key)
                .set("access-key", access_key)
                .set("instance-id", instance_id)
                .set("region", aws_region)
                .set('domain_name', domain_name)
                .set('email', email)
                .set('password', password)
                .set('status', status)
                .set('connector_name', freshservice_connector_name)
                .set('ticket_id', ticket_id)
                .set('ticket_type', ticket_type)
                .sync()
        

        } break;

}
