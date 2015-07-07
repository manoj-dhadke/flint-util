#begin
@log.trace("Started executing 'ssh' flintbit...")

#Flintbit Input Parameters
@connector_name=@input.get("connector_name")     #Name of the SSH Connector
@target=@input.get("target")                     #Target machine where the command will be executed
@type=@input.get("type")                         #Type of execution - shell or exec
@username=@input.get("username")                 #Target username
@password=@input.get("password")                 #Target password
#@passphrase=@input.get("passphrase")             #Passphrase to be used
@key_file=@input.get("key-file")                 #SSH Key-file placed in "/flint-dist/gridconfig/keystore"
@command=@input.get("command")                   #Command/Commands to be executed
@timeout=@input.get("timeout")                   #Timeout in milliseconds, taken by
@type=@input.get("type")                         #the Connetor to serve the request



if @connector_name.nil? || @connector_name.empty?
	@connector_name = "ssh_test"
end
if @target.nil? || @target.empty?
	@target = "192.168.0.109"
end
if @type.nil? || @type.empty?
	@type = "exec"
end
if @username.nil? || @username.empty?
	@username = "pratap"
end
if @password.nil? || @password.empty?
	@password = "pratap1"
end
if @passphrase.nil? || @passphrase.empty?
	@passphrase = ""
end
if @key_file.nil? || @key_file.empty?
	@key_file = "id_rsa.pub"
end
if @command.nil? || @command.empty?
	@command = "whoami"
end
if @timeout.nil? || @timeout.empty?
	@timeout = 100000
end
if @type.nil? || @type.empty?
	@type = "exec"
end
@log.info("Flintbit input parameters are, connector name :: #{@connector_name} |
                                          target ::         #{@target} |
                                          type ::           #{@type} |
                                          username ::       #{@username} |
                                          password ::       #{@password} |
                                          passphrase ::     #{@passphrase} |
                                          key-file ::       #{@key_file} |
                                          command  ::       #{@command} |
                                          timeout  ::       #{@timeout}")

@log.trace("Calling SSH Connector...")
if @timeout.to_s.empty?
  response=@call.connector(@connector_name)
              .set("target",@target)
              .set("type",@type)
              .set("username",@username)
              .set("password",@password)
              .set("passphrase",@passphrase)
              .set("key-file",@key_file)
              .set("command",@command)
              .set("type",@type)
              .sync
              #.timeout(10000) # Execution time of the Flintbit in milliseconds
else
  response=@call.connector(@connector_name)
              .set("target",@target)
              .set("type",@type)
              .set("username",@username)
              .set("password",@password)
              .set("passphrase",@passphrase)
              .set("key-file",@key_file)
              .set("command",@command)
              .set("timeout",@timeout)
              .set("type",@type)
              .sync
              #.timeout(10000) # Execution time of the Flintbit in milliseconds
end



#SSH Connector Response Meta Parameters
response_exitcode=response.exitcode              #Exit status code
response_message=response.message                #Execution status messages

#SSH Connector Response Parameters
response_body=response.get("result")             #Response Body

if response_exitcode == 0
  @log.info("Success in executing SSH Connector, where exitcode :: #{response_exitcode} |
                                                        message :: #{response_message}")
  @log.info("Command executed :: #{@command} | Command execution results :: #{response_body}")
  @output.set("result",response_body)
  @log.trace("Finished executing 'ssh' flintbit with success...")
else
  @log.error("Failure in executing SSH Connector where, exitcode :: #{response_exitcode} |
                                                         message :: #{response_message}")
  @output.set("error",response_message)
  @log.trace("Finished executing 'ssh' flintbit with error...")
end
#end
