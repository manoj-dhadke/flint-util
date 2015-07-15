#begin
@log.trace("Started executing 'flint-util:aws:operation:create_amazon_instance.rb' flintbit...")
begin
#Flintbit Input Parameters
#Mandatory
connector_name=@input.get("connector_name")           		#Name of the Amazon_EC2 Connector
action="create-instance"                              		#Contains the name of the operation: create-instance
image_id = @input.get("image_id")                     		#Specifies the unique ID for the AMI
instance_type = @input.get("instance_type")								#Specifies the type of the instance
min_instance = @input.get("min_instance")									#Specifies the minimum number of instances to launch
max_instance = @input.get("max_instance")									#Specifies the maximum number of instances to launch
#Optional
availability_zone = @input.get("availability_zone")   		#Specifies the availability zones for 
																													#launching the required instances availability zone element.
region = @input.get("region")															#Amazon EC2 region (default region is "us-east-1")
key_name = @input.get("key_name")													#Specifies the name of the key pair
subnet_id = @input.get("subnet_id")												#Subnet ID for VPC instances
request_timeout=@input.get("timeout")											#Execution time of the Flintbit in milliseconds (default timeout is 60000 milloseconds) 

@log.info("Flintbit input parameters are, action :   				  #{action} |
	                                        image_id : 			 	  #{image_id} |
	                                        availability_zone : #{availability_zone} |
																	 			  instance_type : 		#{instance_type} |
																	 			  key_name : 				  #{key_name} |
																	 			  min_instance : 		  #{min_instance} |
																	 			  max_instance : 		  #{max_instance} |
																	 			  region : 					  #{region} |
																	 			  subnet_id : 				#{subnet_id}") 

@log.trace("Calling Amazon EC2 Connector...")

if connector_name.nil? || connector_name.empty?
   raise 'Please provide Amazon EC2 "connector name (connector_name)" to launch Instance'
end

if image_id.nil? || image_id.empty?
   raise 'Please provide "Amazon machine image ID (image_id)" to launch Instance'
end

if instance_type.nil? || instance_type.empty?
   raise 'Please provide Amazon EC2 "instance type (instance_type)" to launch Instance'
end

if min_instance.nil? || min_instance.is_a?(String)
	raise 'Please provide "Minimum instance value (min_instance)" to launch Instance'
end

if max_instance.nil? || max_instance.is_a?(String)
   raise 'Please provide "Maximum instance value (max_instance)" to launch Instance'
end

call_connector = @call.connector(connector_name)
							  .set("action",action)
                .set("image-id",image_id)
                .set("instance-type",instance_type)
                .set("min-instance",min_instance)
                .set("max-instance",max_instance)

if !region.nil? && !region.empty?
   call_connector.set("region",region)
else
   @log.trace("region is not provided so using default region 'us-east-1'")     
end

if !availability_zone.nil? && !availability_zone.empty?
   call_connector.set("availability-zone",availability_zone)
else
   @log.trace("availability zone is not provided so using default availability zone 'us-east-1a'")     
end

if !key_name.nil? && !key_name.empty?
   call_connector.set("key-name",key_name)
end

if !subnet_id.nil? && !subnet_id.empty?
   @log.trace("Creating instance in VPC (Virtual Private Cloud)")
   call_connector.set("subnet-id",subnet_id)
end

if request_timeout.nil? || request_timeout.is_a?(String)
   response = call_connector.sync
else
	 response = call_connector.timeout(request_timeout).sync
end

#Amazon EC2 Connector Response Meta Parameters
response_exitcode=response.exitcode              		#Exit status code
response_message=response.message                		#Execution status messages

#Amazon EC2 Connector Response Parameters
instance_info=response.get("instance-info")         #Amazon EC2 created instance info set

if response_exitcode == 0
	@log.info("SUCCESS in executing Amazon EC2 Connector where, exitcode : #{response_exitcode} | 
																															message :  #{response_message}")
  instance_info.each do |instance|
  @log.info("Amazon EC2 Instance ID : 				#{instance.get("instance-id")} |						
						 Amazon EC2 Instance Type : 			#{instance.get("instance-type")} |
						 Amazon EC2 Instance public IP :  #{instance.get("public-ip")} |
						 Amazon EC2 Instance private IP : #{instance.get("private-ip")} ")	
  end
	@output.setraw("instance-info",instance_info.to_s)
else
	@log.error("ERROR in executing Amazon EC2 Connector where, exitcode :  #{response_exitcode} |
																															 message : #{response_message}")
  @output.set("error",response_message)
  #@output.exit(1,response_message)															#Used to exit from flintbit	
end
rescue Exception => e
  @log.error(e.message)
end
  @log.trace("Finished executing 'flint-util:aws:operation:create_amazon_instance.rb' flintbit")
#end
