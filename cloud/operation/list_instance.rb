#begin
@log.trace("Started executing 'flint-util:jcloud:operation:list_instance.rb' flintbit...")
#Flintbit Input Parameters
#Mandatory
@connector_name= @input.get("connector_name")                 #Name of the Cloud Connector
@action = @input.get("action")                                #Action

@log.info("Flintbit input parameters are, connector name :: #{@connector_name} |
	                                       action ::        #{@action}")

@log.trace("Calling #{@connector_name}...")

 response = @call.connector(@connector_name)
                 .set("action",@action)
                 .sync

#Cloud Connector Response Meta Parameters
response_exitcode=response.exitcode           #Exit status code
response_message=response.message             #Execution status message

#Cloud Connector Response Parameters
result = response.get("list-instance")        #Response body
              

if response.exitcode == 0
    result.each do |instance_id|
	@log.info("Amazon EC2 Instance  id : #{instance_id.get("id")} |
						  Provider id :  #{instance_id.get("provider-id")}
					         Location :  #{instance_id.get("location")}")
end
	@log.info("SUCCESS in executing cloud Connector where, exitcode :: #{response_exitcode} | 
    	                                                   message ::  #{response_message}")
	@log.info("HTTP Response Body :: #{result}")
	#@output.set("result",result.to_s)
    #@log.info("----response---"+response.to_s)
    @output.setraw("info",response.to_s)
else
	@log.error("ERROR in executing cloud Connector where, exitcode :: #{response_exitcode} | 
		                                                  message ::  #{response_message}")
    @output.exit(1,response_message)
end
   @log.trace("FINISHED executing 'flint-util:jcloud:operation:list_instance.rb' flintbit...")
#end
