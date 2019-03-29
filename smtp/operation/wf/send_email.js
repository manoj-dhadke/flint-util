/**
** Creation Date: 29th March 2019
** Summary: Send Email with SMTP. 
** Description: This flintbit is developed to send email.
**/

log.info("Started execution of 'flint-util:smtp:operation:smtp.rb' script")

log.trace("Inputs: " + input.toString())

// Flintbit Input Parameters
input_type = typeof input
// this input parameters are not used

if (input_type == 'application/xml') { // Input type of Request
    // All mandatory if jdbc_url not provided
    connector_name = input.get('/connector_name/text()') // Name of the SMTP Connector
    target = input.get('/target/text()') // Target for smtp
    from = input.get('/from/text()') // Mail adress of sender
    user_name = input.get('/user_name/text()')           // User name of sender
    password = input.get('/password/text()')             // Password of sender
    to = input.get('/to/text()') // Mail address of reciver
    cc = input.get('/cc/text()') // cc
    bcc = input.get('/bcc/text()') // bcc
    subject = input.get('/subject/text()') // Subject line of mail
    body = input.get('/body/text()') //Body of mail
    attachments = input.get('/attachments/text()') //Attachments add to mail
}
else {
    // All mandatory if jdbc_url not provided
    connector_name = input.get('connector_name') // Name of the SMTP Connector
    target = input.get('target') // Target for smtp
    from = input.get('from') // Mail adress of sender
    user_name = input.get('user_name')           // User name of sender
    password = input.get('password')             // Password of sender
    to = input.get('to') // Mail address of reciver
    cc = input.get('cc') // cc
    bcc = input.get('bcc') // bcc
    subject = input.get('subject') // Subject line of mail
    body = input.get('body') //Body of mail
    attachments = input.get('attachments') //Attachments add to mail
}

log.trace("Connector Name: " + connector_name + "\nTarget: " + target + "\nFrom: " + from + "\nUsername: " + user_name + "\nPassword is given \nTo: " + to + "\nCC: " + cc + "\nSubject: " + subject + "\nBody: " + body)
if (attachments != null || attachments != "") {
    log.info("Attachments are present.")
}

log.trace('Calling SMTP Connector')

response = call.connector(connector_name)
    .set('target', target)
    .set('from', from)
    .set('username', user_name)
    .set('password', password)
    .set('to', to)
    .set('cc', cc)
    .set('bcc', bcc)
    .set('subject', subject)
    .set('body', body)
    .set('attachments', attachments)
    .set('action', 'send')
    .set('port', 587)
    .sync

log.trace("SMTP Email response is :" + response)

// SMTP Connector Response Meta Parameters
response_exitcode = response.exitcode()     // Exit status code
response_message = response.message()       // Execution status message

// SMTP Connector Response Parameters
result = response.get('result') // Response Body

if (response_exitcode == 0) {
    log.info("Success in executing SMTP Connector")
    log.info("Exit Code: "+repsonse_exitcode+"\n Message: "+response_message)
    log.info("SMTP Response Body :"+result)
    output.set('result', result)
} else {
    log.error("Failure in executing SMTP Connector ")
    log.error("Exit Code: "+repsonse_exitcode+"\n Message: "+response_message)
    output.set('result', response_message)
}
