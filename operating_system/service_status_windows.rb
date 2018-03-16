# begin
@log.trace("Started executing 'flint-util:operating_system:service_status_windows.rb' flintbit...")
begin
@connector_name = @config.global("winrm.connector_name")   # Name of the WinRM connector
@target = @input.get("target")                   # target where the command will be executed
@username = @input.get("username")               # Target username
@password = @input.get("password")               # Target password
@shell = @config.global("winrm.shell")                     # Type of execution - powershell or cmd
@transport = @config.global("winrm.transport")             # Transport type protocol
@operation_timeout = 80
@port = @config.global("winrm.port")
@no_ssl_peer_verification= @config.global("winrm.no_ssl_peer_verification")
@timeout = 60000                                       # Timeout in milliseconds, taken by
@service_name = @input.get('service_name')
@command = "Get-Service #{@service_name} |Convertto-json"

if @transport.empty?
    @transport = "negotiate"
end

@log.trace('Calling WinRM Connector...')

call_connector = @call.connector(@connector_name)
                               .set("target", @target)
                               .set("username", @username)
                               .set("password", @password)
                               .set("shell", @shell)
                               .set("transport", @transport)
                               .set("command",@command)
                               .set("operation_timeout",@operation_timeout)
                               .set("no_ssl_peer_verification",@no_ssl_peer_verification)
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
response_body = @util.json(response_body)
@status= response_body.get("Status")
@log.info("Status::#{@status}")
if @status == 4
   @log.info("The service status for service name: #{@service_name} is running" )
   @user_message= ("The service status for service name: #{@service_name} is Running")
elsif @status == 1
      @log.info("The service status for service name: #{@service_name} is not running" )
      @user_message= ("The service status for service name: #{@service_name} is not running")
  else
    @log.info("Unable to find the service status of service: #{@service_name}" )
    @user_message= ("Unable to find the service status of service: #{@service_name}")
end

if response_exitcode == 0
    @log.info("Success in executing WinRM Connector, where exitcode :: #{response_exitcode} | message :: #{response_message}")
    #@log.info("The service status for service name #{@service_name} :: #{response_body}")
    @output.set('user_message',@user_message)
    @log.trace("Finished executing 'winrm' flintbit with success...")
else
    @log.info("Failed to get service status on remote target server : #{@target}")
    @log.error("Failure in executing WinRM Connector where, exitcode :: #{response_exitcode} | message :: #{response_message}")
    @output.set('error', response_message).set('user_message',@user_message)
    @log.trace("Finished executing 'winrm' flintbit with error...")
end

rescue Exception => e
    @log.error(e.message)
    @output.set('message', e.message).set('exit-code', -1)
    @log.info('output in exception')
end
@log.trace("Finished executing 'flint-util:operating_system:service_status_windows.rb' flintbit...")
# end
