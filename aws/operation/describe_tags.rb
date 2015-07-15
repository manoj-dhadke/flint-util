#begin
@log.trace("Started executing 'flint-util:aws:operation:describe_tags.rb' flintbit...")
begin
#Flintbit Input Parameters
#Mandatory
connector_name=@input.get("connector_name")           		#Name of the Amazon_EC2 Connector
action="describe-tags"                              		  #Contains the name of the operation: describe_tags
resource_id = @input.get("resource_id")                  	#Specifies the resource ID of amazon ec2
resource_type = @input.get("resource_type") 					    #Specifies the type of the resource

#Optional
region = @input.get("region")															#Amazon EC2 region (default region is "us-east-1")
request_timeout=@input.get("timeout")											#Execution time of the Flintbit in milliseconds (default timeout is 60000 milloseconds) 

@log.info("Flintbit input parameters are, action :   				 #{action} |
	                                        resource_id : 		 #{resource_id} |
	                                        resource_type :		 #{resource_type} |
																	 			  region : 					 #{region} |") 

@log.trace("Calling #{connector_name} ...")

if connector_name.nil? || connector_name.empty?
   raise 'Please provide Amazon EC2 "connector name (connector_name)" to describe Tags'
end

if resource_id.nil? || resource_id.empty?
   raise 'Please provide "Amazon EC2 resource ID (resource_id)" to describe Tags'
end

if resource_type.nil? || resource_type.empty?
   raise 'Please provide Amazon EC2 "resource Type (resource_type)" to describe Tags'
end

call_connector = @call.connector(connector_name)
							  .set("action",action)
                .set("resource-id",resource_id)
                .set("resource-type",resource_type)

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
tag_set=response.get("tag-set")											#set of tags

if response_exitcode == 0
	@log.info("SUCCESS in executing #{connector_name} where, exitcode : #{response_exitcode} | 
																															message :  #{response_message}")
	@output.setraw("tag-set",tag_set.to_s)
else
	@log.error("ERROR in executing #{connector_name} where, exitcode :: #{response_exitcode} |
																															 message ::  #{response_message}")
  @output.set("error",response_message)
  #@output.exit(1,response_message)															#Used to exit from flintbit
end
rescue Exception => e
  @log.error(e.message)
end
@log.trace("Finished executing 'flint-util:aws:operation:describe_tags.rb' flintbit")
#end
