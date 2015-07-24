#begin
@log.trace("Started executing 'flint-util:jcloud:operation:stop_instance.rb' flintbit...")
#Flintbit Input Parameters
#Mandatory  
@connector_name= @input.get("connector_name")               #Name of the Cloud Connector
@action = @input.get("action")                              #Action
@id = @input.get("id")                                      #Id
@log.info("Flintbit input parameters are, connector name :: #{@connector_name} |
	                                       action ::        #{@action}
                                           id ::            #{@id}")

@log.trace("Calling #{@connector_name}...")

 response = @call.connector(@connector_name)
                  .set("action",@action)
                  .set("id",@id)
                  .sync
#Cloud Connector Response Meta Parameters
response_exitcode=response.exitcode           #Exit status code
response_message=response.message             #Execution status message

#Cloud Connector Response Parameters
result = response.get("message")              #Response body
             
if response.exitcode == 0  
	@log.info("SUCCESS in executing cloud Connector where, exitcode :: #{response_exitcode} | 
    	                                                   message ::  #{response_message}")
	@log.info("HTTP Response Body :: #{result}")
	#@output.set("result",result.to_s)
    @log.info("----response---"+response.to_s)
    @output.setraw("info",response.to_s)
else
	@log.error("ERROR in executing cloud Connector where, exitcode :: #{response_exitcode} | 
		                                               message ::  #{response_message}")
     @output.set("error",response_message)
end
    @log.trace("Finished executing 'flint-util:jcloud:operation:stop_instance.rb' flintbit...")
#end
