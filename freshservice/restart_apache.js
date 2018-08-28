log.trace("Started executing 'flint-util:freshservice:restart_apache.js' flintbit...")

try{
    // Apache Server Details
     target =   input.get('target')
     username = input.get('username')
     target_password = input.get('target_password')
     port = input.get('port')


    //Freshservice Inputs from JSON for connector and flintbits

    domain_name = input.get('domain_name')
    username = input.get('username')
    password = input.get('password') 
    type = input.get('type')

    connector_name = input.get('connector_name')

    email = input.get('email')
    subject = input.get('subject')
    acknowledge_body = input.get('acknowledge_body')
    final_body = input.get('final_body')                // Will be set in service config
    
    initial_status = input.get('initial_status')
    final_status = input.get('final_status')
    priority = input.get('priority')
    ticket_type = input.get('ticket_type')
    acknowledge_private_note= input.get('acknowledge_private_note')
    final_private_note=input.get('final_private_note')    

    //User message definition
    user_message = "<b>Flint Automation:</b> Apache server has been restarted"

    // Logging current execution status
    log.trace("Inputs are valid")
    log.trace("Input is : " + input.toString())

    // Getting the values from JSON
    servicename = input.get('servicename') 
    hostname = input.get('hostname')
    servicestate = input.get('servicestate')
    hoststatetype = input.get('hoststatetype')
    hostattempt = input.get('hostattempt')
    servicedesc = input.get('servicedesc')
    hoststateid = input.get('servicestateid')
    serviceeventid = input.get('serviceeventid')
    serviceproblemid = input.get('serviceproblemid')
    servicelatency = input.get('servicelatency')
    serviceexecutiontime = input.get('serviceexecutiontime')
    serviceduration = input.get('serviceduration')
    hostaddress = input.get('hostaddress')

    description = "Flint Automation: \nApache server host " + hostaddress + " is down"

    // Service goes ‘Down’, i.e. if service state is 'CRITICAL' raise a ticket, create ticket, add comment & change ticket status 
    if (servicestate == 'CRITICAL'){ 
        // Call flintbit to raise ticket
        response = call.bit("flint-util:freshservice:create_ticket.js")
                       .set('domain_name', domain_name)
                       .set('connector_name', connector_name)
                       .set('password',password)
                       .set('email', email)
                       .set('subject', subject)
                       .set('description', description)
                       .set('status', initial_status)
                       .set('priority', priority)
                       .set('ticket_type', ticket_type)
                       .timeout(300000)
                       .sync()

        // Get ticket id
        ticket_id = response.get('ticket_id')
        ticket_id = ticket_id.toString()

        // Call flintbit to add comment regarding acknowledgement of incident
        call.bit("flint-util:freshservice:add_note.js")
        .set('domain_name', domain_name)
        .set('private_note',acknowledge_private_note)        //boolean true = set note as private  or false set note as public
        .set('email', email)
        .set('password',password)
        .set('body', acknowledge_body)
        .set('connector_name', connector_name)
        .set('ticket_id', ticket_id)
        .set('ticket_type', ticket_type)
        .sync()


    // Calling SSH connector
        connector_response = call.connector('ssh') 
                        .set('target',hostaddress)
                        .set('type', 'exec')
                        .set('port',port)
                        .set('username', username)
                        .set('password', target_password)
                        .set('command', 'sudo service apache2 start') // Starting web server apache2
                        .set('timeout', 60000)
                        .sync()

        //  SSH Connector Response Parameter
        result = connector_response.get('result')
        log.info(result)
        response_exitcode = connector_response.exitcode()

        if(response_exitcode == 0){
        // Call flintbit to add comment after issue is resolved with exit-code 0   
            call.bit("flint-util:freshservice:add_note.js")
            .set('domain_name', domain_name)
            .set('email', email)
            .set('password', password)
            .set("private_note",final_private_note)
            .set('body',final_body)
            .set('connector_name',connector_name)
            .set('ticket_id',ticket_id)
            .set('ticket_type',ticket_type)
            .sync()

    // Call flintbit to change status of ticket
            call.bit("flint-util:freshservice:update_ticket.js")
            .set('domain_name', domain_name)
            .set('email', email)
            .set('password', password)
            .set('status', final_status)
            .set('connector_name', connector_name)
            .set('ticket_id',ticket_id)
            .set('ticket_type',ticket_type)
            .sync()

        log.info("Successfully executed flintbit with exit-code :" + response_exitcode)
        }
        else{
            log.info("Unable to restart Apache server...")
        }
    }
    // Setting user-message
    output.set('user_message', user_message)
}catch(error){
    log.error("Error message : " + error)

}

log.trace("Finished executing 'flint-demo-box:nagios:restart_apache.rb' flintbit...")
