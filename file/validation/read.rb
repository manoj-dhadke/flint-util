#begin
@log.trace("Started executing 'flint-util:file:validation:read.rb' flintbit...")

#Flintbit Input Parameters
connector_name=@input.get("connector_name")      #Name of the File Connector
action=@input.get("action")                      #Action
file_path=@input.get("file")                     #File Name and File Location

if connector_name.nil? || connector_name.empty?
   connector_name="File Connector"
end
if action.nil? || action.empty?
   action="read"
end
if file_path.nil? || file_path.empty?
   file_path=Dir.pwd + "/flintbox/example/hello.rb"
end



@log.info("Flintbit input parameters are, connector name : #{connector_name} |
	                                      action :         #{action} |
	                                      file_path :      #{file_path}")

@log.trace("Calling #{connector_name}..")

response=@call.connector(connector_name)
              .set("action",action)
              .set("file",file_path)
              .sync
              

#File Connector Response Meta Parameters
response_exitcode=response.exitcode             #Exit status code
response_message=response.message               #Execution status messages


#File Connector Response Parameters
response_file=response.get("file")              #File read
response_body=response.get("body")              #Response Body, data read from the file

if response_exitcode == 0
	@log.info("SUCCESS in executing #{connector_name} where, exitcode :: #{response_exitcode} |
		                                                      message :: #{response_message}")
	@log.info("File read :: #{response_file} | Data read from the File ::#{response_body}")
    @output.set("file-path",response_file)	
    @output.set("content",response_body)
    
else
	@log.error("ERROR in executing #{connector_name} where, exitcode :: #{response_exitcode} |
		                                                     message :: #{response_message}")
    @output.exit(1,response_message)
        
end
    @log.trace("Finished executing 'flint-util:file:validation:read.rb' flintbit...")
#end
