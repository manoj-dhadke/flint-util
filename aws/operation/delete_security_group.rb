#begin
@log.trace("Started executing 'flint-util:aws:operation:delete_security_group.rb' flintbit...")
#Flintbit Input Parameters
#Mandatory
connector_name = @input.get("connector_name")             		#Name of the Amazon EC2 Connector
action = "delete-security-group"                              #Specifies the name of the operation: delete-security-group
group_name = @input.get("group_name")              		    	  #Contain security group name corresponding to the
																															#region that you want to delete
#Optional
region = @input.get("region")													  			#Amazon EC2 region (default region is 'us-east-1')
request_timeout = @input.get("timeout")									  		#Execution time of the Flintbit 
																															#in milliseconds (default timeout is 60000 milloseconds)

@log.info("Flintbit input parameters are, action :      #{action} |
	                                        group_name : #{group_name} |
	                                        region :      #{region}")

connector_call = @call.connector(connector_name)
								 .set("action",action)
								 .set("group-name",group_name)

if !region.nil? && !region.empty?
   connector_call.set("region",region)
else
   @log.trace("region is not provided so using default region 'us-east-1'")     
end

if request_timeout.nil? || request_timeout.is_a?(String)
   @log.trace("Calling #{connector_name} with default timeout...")
	 response = connector_call.sync
else
   @log.trace("Calling #{connector_name} with given timeout #{request_timeout.to_s}...")
	 response = connector_call.timeout(request_timeout).sync
end

#Amazon EC2 Connector Response Meta Parameters
response_exitcode = response.exitcode              	          #Exit status code
response_message = response.message                           #Execution status messages

if response_exitcode == 0
	@log.info("SUCCESS in executing #{connector_name} where, exitcode : #{response_exitcode} | 
																															message : #{response_message}")
	@output.set("result",response.message)
else
	@log.error("ERROR in executing #{connector_name} where, exitcode : #{response_exitcode} |
																															 message : #{response_message}")  
  @output.set("error",response_message)
  #@output.exit(1,response_message)														#Use to exit from flintbit
end
  @log.trace("Finished executing 'flint-util:aws:operation:delete_security_group.rb' flintbit")
#end
