=begin
#
#  INFIVERVE TECHNOLOGIES PTE LIMITED CONFIDENTIAL
#  _______________________________________________
# 
#  (C) INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE
#  All Rights Reserved.
#  Product / Project: Flint IT Automation Platform
#  NOTICE:  All information contained herein is, and remains
#  the property of INFIVERVE TECHNOLOGIES PTE LIMITED.
#  The intellectual and technical concepts contained
#  herein are proprietary to INFIVERVE TECHNOLOGIES PTE LIMITED.
#  Dissemination of this information or any form of reproduction of this material
#  is strictly forbidden unless prior written permission is obtained
#  from INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE.
=end

# begin
@log.trace("Started executing 'flint-util:ad-winrm:winrm_commonconnect.rb' flintbit...")
begin
@target = @input.get('target')
@username = @input.get('username')
@password = @input.get('password')
@transport = @config.global('winrm').get('transport')
@port = @config.global('winrm').get('port')
@connector_name = "winrm"
@operation_timeout= 80
@shell = "ps"
@command = @input.get('command')
call_connector = @call.connector(@connector_name)
                               .set("target", @target)
                               .set("username", @username)
                               .set("password", @password)
                               .set("shell", @shell)
                               .set("port", @port)
                               .set("transport", @transport)
                               .set("command",@command)
                               .set("operation_timeout",@operation_timeout)
if @timeout.to_s.empty?
     connector_response = call_connector.sync
else
     connector_response = call_connector.set('timeout', @timeout).sync
end

# WinRM Connector Response Meta Parameters
response_exitcode = connector_response.exitcode       # Exit status code
response_message = connector_response.message         # Execution status messages

# WinRM Connector Response Parameters
response_body = connector_response.get('result')                # Response Body

if response_exitcode == 0
    @log.info("Success in executing WinRM Connector, where exitcode :: #{response_exitcode} | message :: #{response_message}")
    @log.info("Command executed :: #{@command} | Command execution results :: #{response_body}")
    @output.set('result', response_body).set('exit-code', 0)
    @log.trace("Finished executing 'winrm' flintbit with success...")
else
    @log.error("Failure in executing WinRM Connector where, exitcode :: #{response_exitcode} | message :: #{response_message}")
    @output.set('error', response_message).set('exit-code', -1)
    @log.trace("Finished executing 'winrm' flintbit with error...")
end

rescue Exception => e
    @log.error(e.message)
    @output.set('message', e.message).set('exit-code', -1)
    @log.info('output in exception')
end
#end
