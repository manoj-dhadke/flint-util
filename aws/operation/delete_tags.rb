#begin
@log.trace("Started executing 'flint-util:aws:operation:delete_tags.rb' flintbit...")
begin
#Flintbit Input Parameters
#Mandatory
connector_name=@input.get("connector_name")           		#Name of the Amazon_EC2 Connector
action="delete-tags"                              		    #Contains the name of the operation: delete-tags
resource_id = @input.get("resource_id")                  	#Specifies the resource ID of amazon ec2
tag_key = @input.get("tag_key")								      			#Specifies the key of the tag
tag_value = @input.get("tag_value")											  #Specifies the value of the tag

#Optional
region = @input.get("region")															#Amazon EC2 region (default region is "us-east-1")
request_timeout=@input.get("timeout")											#Execution time of the Flintbit in milliseconds (default timeout is 60000 milloseconds) 

@log.info("Flintbit input parameters are, action ::   				 #{action} |
	                                        resource_id :: 			 #{resource_id} |
	                                        tag_key :: 		       #{tag_key} |
																	 			  tag_value :: 				 #{tag_value} |
																	 			  region :: 					 #{region} |") 

@log.trace("Calling Amazon EC2 Connector...")

if connector_name.nil? || connector_name.empty?
   raise 'Please provide Amazon EC2 "connector name (connector_name)" to delete Tags'
end

if resource_id.nil? || resource_id.empty?
   raise 'Please provide "Amazon machine resource ID (resource_id)" to delete Tags'
end

if tag_key.nil? || tag_key.empty?
   raise 'Please provide Amazon EC2 "Tag Key (tag_key)" to delete Tags'
end

if tag_value.nil? || tag_value.empty?
	raise 'Please provide "Tag Value (tag_value)" to delete Tags'
end

call_connector = @call.connector(connector_name)
							  .set("action",action)
                .set("resource-id",resource_id)
                .set("tag-key",tag_key)
                .set("tag-value",tag_value)

if !region.nil? && !region.empty?
   call_connector.set("region",region)
else
   @log.trace("region is not provided so using default region 'us-east-1'")     
end

if request_timeout.nil? || request_timeout.is_a?(String)
   response = call_connector.sync
else
	 response = call_connector.timeout(request_timeout).sync
end

#Amazon EC2 Connector Response Meta Parameters
response_exitcode=response.exitcode              		#Exit status code
response_message=response.message                		#Execution status messages

if response_exitcode == 0
	@log.info("SUCCESS in executing Amazon EC2 Connector where, exitcode :: #{response_exitcode} | 
																															message ::  #{response_message}")
	@log.trace("Finished executing 'delete_tags' flintbit with success...")

else
	@log.error("ERROR in executing Amazon EC2 Connector where, exitcode :: #{response_exitcode} |
																															 message ::  #{response_message}")
  @output.set("error",response_message)
  #@output.exit(1,response_message)															#Used to exit from flintbit
end
rescue Exception => e
  @log.error(e.message)
end
  @log.trace("Finished executing 'flint-util:aws:operation:delete_tags.rb' flintbit")
#end
