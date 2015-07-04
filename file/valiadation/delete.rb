#begin
@log.trace("Started executing 'delete' flintbit...")

#Flintbit Input Parameters
connector_name=@input.get("connector_name")       #Name of the HTTP Connector
action=@input.get("action")                       #Delete action
file_path=@input.get("file")                      #File Name and File Location

if connector_name.nil? || connector_name.empty?
   connector_name="file"
end
if action.nil? || action.empty?
   action="delete"
end
if file_path.nil? || file_path.empty?
   file_path=ENV['HOME']+"/flint-dist/flintbox/flint-test-workpackage/validations/Sample.txt"
end

@log.info("Flintbit input parameters are, connector name :: #{connector_name} |
	                                  action ::         #{action} |
	                                  file_path ::      #{file_path}")

@log.trace("Calling File Connector...")
response=@call.connector(connector_name)
              .set("action",action)
              .set("file",file_path)
              .sync
            

#File Connector Response Meta Parameters
response_exitcode=response.exitcode              #Exit status code
response_message=response.message                #Execution status messages


if response_exitcode == 0
	@log.info("Success in executing File Connector where, exitcode :: #{response_exitcode} |
	                                                       message :: #{response_message}")
	@log.trace("Finished executing 'delete' flintbit succesfully...")
	@output.set("result",response_message)
else
	@log.error("Failure in executing File Connector where, exitcode :: #{response_exitcode} |
		                                                message :: #{response_message}")
        @output.set("error",response_message)
        @log.trace("Finished executing 'delete' flintbit with error...")
end
#end
