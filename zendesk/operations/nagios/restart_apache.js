/**
** Creation Date: 3rd Jan 2019
** Summary: This is Auto-remediate Apache server flintbit.
** Description: This flintbit is developed to remediate apache server after receiving server status from nagios.
**/
log.trace("Started executing 'flint-util:serviceaide:nagios:restart_apache.js' flintbit...")
try {
    // Apache Server Details
    nagios_apache_config = input.get("nagios_apache_config")
    target = nagios_apache_config.get('target')
    username = nagios_apache_config.get('username')
    target_password = nagios_apache_config.get('target_password')
    port = nagios_apache_config.get('port')
    user_message = "Flint Automation: Apache server has been restarted"
    log.info("Input parameters..... target " + target + " | username " + username + " | target_password" + target_password + " | port " + port)
    // Get flint service request ID
    flint_job_id = input.jobid()
    log.trace("Flint Job ID: " + flint_job_id)
    log.info("")
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
    incident_description = "Apache server is Down or Critical"
    incident_description_long = "Alert Source: Nagios, Affected System: " + hostaddress + ", Remediation System: Flint, Alert Details: Apache server at host " + hostaddress +" "+ " is down."
    // Service goes ‘Down’, i.e. if service state is 'CRITICAL' raise a ticket, create ticket, add comment & change ticket status 
    if (servicestate == 'CRITICAL') {

    }
} catch (error) {
    output.set('user_message', error)
    output.set('exit-code', -1)
}