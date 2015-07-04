#begin
@log.trace("Started executing 'append' flintbit...")

#Flintbit Input Parameters
connector_name=@input.get("connector_name")      #Name of the File Connector
action="append"                                  #Action
file_path=@input.get("file")                     #File Name and File Location
data=@input.get("data")                          #Data to be appended to the File


if connector_name.nil? || connector_name.empty?
   connector_name="file"
end
if action.nil? || action.empty?
   action="append"
end
if file_path.nil? || file_path.empty?
   file_path=ENV['HOME']+"/flint-dist/flintbox/flint-test-workpackage/file/validations/Sample.txt"
end
if data.nil? || data.empty?
   data=" -by Infiverve Technologies"
end

@log.info("Flintbit input parameters are, connector name :: #{connector_name} |
	                                  action ::         #{action} |
	                                  file_path ::      #{file_path} |
	                                  file_content ::   #{data}")

@log.trace("Calling File Connector...")
response=@call.connector(connector_name)
              .set("action",action)
              .set("file",file_path)
              .set("data",data)
              .sync
              

#File Connector Response Meta Parameters
response_exitcode=response.exitcode               #Exit status code
response_message=response.message                 #Execution status messages


#File Connector Response Parameters
response_file=response.get("file")                #File, data is appended to
response_body=response.get("body")                #Response Body, data appended to the file

if response_exitcode == 0
	@log.info("Success in executing File Connector where, exitcode :: #{response_exitcode} |
		                                               message :: #{response_message}")
	@log.info("File :: #{response_file} | Data appended to the File:: #{response_body}")
	@output.set("result",response_body)
	@log.trace("Finished executing 'append' flintbit with success...")
else
	@log.error("Failure in executing File Connector where, exitcode :: #{response_exitcode} |
		                                                message :: #{response_message}")
        @output.set("error",response_message)
        @log.trace("Finished executing 'append' flintbit with error...")
end
#end
