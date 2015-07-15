#begin
@log.trace("Started executing 'flint-util:aws:operation:describe_amazon_instance.rb' flintbit...")
begin
#Flintbit Input Parameters
#Mandatory
connector_name=@input.get("connector_name")           		#Name of the Amazon_EC2 Connector
action="describe-instances"                              	#Contains the name of the operation: describe-instances
instance_id = @input.get("instance_id")                  	#Specifies the instance ID of amazon ec2

#Optional
availability_zone = @input.get("availability_zone")   		#Specifies the availability zones for 
																													#launching the required instances availability zone element.
region = @input.get("region")															#Amazon EC2 region (default region is "us-east-1")
request_timeout=@input.get("timeout")											#Execution time of the Flintbit in milliseconds (default timeout is 60000 milloseconds) 

@log.info("Flintbit input parameters are, action :   				  #{action} |
	                                        instance_id : 			#{instance_id} |
	                                        availability_zone : #{availability_zone} |
																	 			  region : 					  #{region}|") 

@log.trace("Calling Amazon EC2 Connector...")

if connector_name.nil? || connector_name.empty?
   raise 'Please provide Amazon EC2 "connector name (connector_name)" to describe amazon instance'
end

if instance_id.nil? || instance_id.empty?
   raise 'Please provide "Amazon EC2 instance ID (instance_id)" to describe amazon instance'
end

call_connector = @call.connector(connector_name)
							  .set("action",action)
                .set("instance-id",instance_id)

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

if request_timeout.nil? || request_timeout.is_a?(String)
   response = call_connector.sync
else
	 response = call_connector.timeout(request_timeout).sync
end

#Amazon EC2 Connector Response Meta Parameters
response_exitcode=response.exitcode              		#Exit status code
response_message=response.message                		#Execution status messages

#Amazon EC2 Connector Response Parameters
instances_set=response.get("instances-info")            #Set of Amazon EC2 described instances

if response_exitcode == 0
	@log.info("SUCCESS in executing Amazon EC2 Connector where, exitcode : #{response_exitcode} | 
																															message :  #{response_message}")
	vertx_json_array = org.vertx.java.core.json.JsonArray.new(instances_set.to_s)
	instances_set.each do |instance|
  @log.info("Amazon EC2 described instance image id :             #{instance.get("image-id")} |
 						 Amazon EC2 described instance public ip :            #{instance.get("public-ip")} |
						 Amazon EC2 described instance instance type :        #{instance.get("instance-type")} |
						 Amazon EC2 described instance key-name :             #{instance.get("key-name")} |
 						 Amazon EC2 described instance private ip :           #{instance.get("private-ip")} |
						 Amazon EC2 described instance hypervisor :           #{instance.get("hypervisor")} |
             Amazon EC2 described instance kernel id :            #{instance.get("kernel-id")} |
 						 Amazon EC2 described instance instance id :          #{instance.get("instance-id")} |
						 Amazon EC2 described instance architecture :         #{instance.get("architecture")} |
						 Amazon EC2 described instance client-token :         #{instance.get("client-token")} |
 						 Amazon EC2 described instance instance-lifecycle :   #{instance.get("instance-lifecycle")} |
						 Amazon EC2 described instance platform :             #{instance.get("platform")} |
						 Amazon EC2 described instance state code :           #{instance.get("instance-state-code")} |
						 Amazon EC2 described instance state name :           #{instance.get("instance-state-name")} |
             Amazon EC2 described instance ramdisk id :           #{instance.get("ramdisk-id")} |
             Amazon EC2 described instance ebs optimized :        #{instance.get("ebs-optimized")} |
             Amazon EC2 described instance placement tenancy :    #{instance.get("placement-tenancy")} |
						 Amazon EC2 described instance placement group name : #{instance.get("placement-group-name")} |
						 Amazon EC2 described instance public DNS name :      #{instance.get("public-DNSname")} |
						 Amazon EC2 described instance root device name :     #{instance.get("root-device-name")} |
             Amazon EC2 described instance root device type :     #{instance.get("root-device-type")} |
             Amazon EC2 described instance launch time :          #{instance.get("launch-time")} |
             Amazon EC2 described instance subnet id :            #{instance.get("subnet-id")} |
						 Amazon EC2 described instance virtualization type :  #{instance.get("virtualization-type")} |
             Amazon EC2 described instance vpc id :               #{instance.get("vpc-id")} |
             Amazon EC2 described instance ami launch index :     #{instance.get("ami-launch-index")} |")
	end
	@output.setraw("rebooted-instance-set",instances_set)
else
	@log.error("ERROR in executing Amazon EC2 Connector where, exitcode : #{response_exitcode} |
																															 message :  #{response_message}")
  @output.set("error",response_message)
  #@output.exit(1,response_message)															#Used to exit from flintbit
end
rescue Exception => e
  @log.error(e.message)
end
  @log.trace("Finished executing 'flint-util:aws:operation:describe_amazon_instance.rb' flintbit")
#end
