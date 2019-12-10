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
@log.trace("Started executing 'example:start_winrm_service.rb' flintbit...")
begin

@connector_name = @config.global('winrm.connector_name')  # Name of the WinRM connector
@target = @input.get("target")                  # target where the command will be executed
@username = @input.get("username")               # Target username
@password = @input.get("password")               # Target password
@shell = "ps"                     # Type of execution - powershell or cmd
@transport = @config.global('winrm.transport')           # Transport type protocol
@service_name= @input.get("Service")
@command = "net start #{@service_name} "                 # Command to be executed
@operation_timeout = 80
@port = @config.global('winrm.port') 
#@no_ssl_peer_verification= @input.get("no_ssl_peer_verification")
@timeout = 80                 # Timeout in milliseconds, taken by

if @transport.empty?
    @transport = "negotiate"
end

@log.info("Flintbit input parameters are, connector name :: #{@connector_name} |
                                                    target :: #{@target} |
                                                    username :: #{@username} |
                                                    password :: #{@password} |
                                                    shell :: #{@shell} |
                                                    transport :: #{@transport} |
                                                    operation_timeout :: #{@operation_timeout}
                                                    command :: #{@command} |
                                                    port :: #{@port}" )

@log.trace('Calling WinRM Connector...')

call_connector = @call.connector(@connector_name)
                               .set("target", @target)
                               .set("username", @username)
                               .set("password", @password)
                               .set("shell", @shell)
                               .set("transport", @transport)
                               .set("command",@command)
                               .set("operation_timeout",@operation_timeout)
                               .set("port",@port)

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
    @user_message = "#{@service_name} running as service on #{@target} server has been started successfully"
    @output.set('result', response_body).set('user_message',@user_message)
    @log.trace("Finished executing 'winrm' flintbit with success...")
else
    @log.error("Failure in executing WinRM Connector where, exitcode :: #{response_exitcode} | message :: #{response_message}")
   
    @output.set('error', response_message)
    @log.trace("Finished executing 'winrm' flintbit with error...")
end

rescue Exception => e
    @log.error(e.message)
    @output.set('message', e.message).set('exit-code', -1)
    @log.info('output in exception')
end
# end
