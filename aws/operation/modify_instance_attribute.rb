#begin
@log.trace("Started executing 'flint-util:aws:operation:modify_instance_attribute.rb' flintbit...")
#Flintbit Input Parameters
#Mandatory
connector_name = @input.get("connector_name")             		#Name of the Amazon EC2 Connector
action = "modify-instance-attribute"                          #Specifies the name of the operation: modify-instance-attribute
instance_id = @input.get("instance_id")              		    	#Contain instance ID corresponding to the
																															#instance that you want to modify
attribute = @input.get("attribute")														#Specifies the name of the Instance attribute
attribute_value = @input.get("attribute_value")								#Specifies the value of the Instance attribute
#Optional
region = @input.get("region")													  			#Amazon EC2 region (default region is 'us-east-1')
request_timeout = @input.get("timeout")									  		#Execution time of the Flintbit in milliseconds (default timeout is 60000 milloseconds)

@log.info("Flintbit input parameters are, action : #{action} |
	                                        instance_id : #{instance_id} |
	                                        attribute : #{attribute} |
	                                        attribute_value : #{attribute_value} |
	                                        region : #{region}")

connector_call = @call.connector(connector_name)
								 .set("action",action)
								 .set("instance-id",instance_id)
								 .set("attribute",attribute)
								 .set("attribute-value",attribute_value)
								 .set("region",region)

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
	@output.set("result",response_message)
else
	@log.error("ERROR in executing #{connector_name} where, exitcode : #{response_exitcode} |
																															 message : #{response_message}")  
  @output.set("error",response_message)
  #@output.exit(1,response_message)														#Use to exit from flintbit
end
  @log.trace("Finished executing 'flint-util:aws:operation:modify_instance_attribute.rb' flintbit")
#end
