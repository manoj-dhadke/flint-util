#begin
@log.trace("Started executing 'flint-util:aws:operation:reboot_amazon_instance.rb' flintbit...")
begin
#Flintbit Input Parameters
#Mandatory
connector_name = @input.get("connector_name")             #Name of the Amazon EC2 Connector
action = "reboot-instances"                               #Reboot Amazon EC2 instance action
instance_id = @input.get("instance_id")                 	#Amazon Instance ID to reboot Instance

#Optional
region = @input.get("region")													  	#Amazon EC2 region (default region is 'us-east-1')
request_timeout = @input.get("timeout")									  #Execution time of the Flintbit in milliseconds

@log.info("Flintbit input parameters are, action :            #{action} |
	                                        instance_id :       #{instance_id} |
	                                        region :            #{region}")

connector_call = @call.connector(connector_name)
                .set("action",action)

if connector_name.nil? || connector_name.empty?
   raise 'Please provide "Amazon EC2 connector name (connector_name)" to reboot Instance'
end

if instance_id.nil? || instance_id.empty?
   raise 'Please provide "Amazon instance ID (instance_id)" to reboot Instance'
else
   connector_call.set("instance-id",instance_id)
end

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
response_exitcode = response.exitcode              	      #Exit status code
response_message = response.message                       #Execution status messages

#Amazon EC2 Connector Response Parameters
instances_set=response.get("reboot-instance-id")          #Set of Amazon EC2 rebooted instances

if response_exitcode == 0
	@log.info("SUCCESS in executing #{connector_name} where, exitcode : #{response_exitcode} | 
																															message : #{response_message}")
	instances_set.each do |instance_id|
  	@log.info("Amazon EC2 rebooted instance : #{instance_id.to_s}")
	end
	@output.setraw("rebooted-instances",instances_set.to_s)
else
	@log.error("ERROR in executing #{connector_name} where, exitcode : #{response_exitcode} |
																															 message : #{response_message}")
  @output.set("error",response_message)
  #@output.exit(1,response_message)												#Use to exit from flintbit
end
rescue Exception => e
  @log.error(e.message)
  @output.set("error",e.message)
end
  @log.trace("Finished executing 'flint-util:aws:operation:reboot_amazon_instance.rb' flintbit")
#end
