#begin
@log.trace("Started executing 'flint-util:aws:operation:reboot_amazon_instance.rb' flintbit...")
begin
#Flintbit Input Parameters
#Mandatory
connector_name=@input.get("connector_name")             #Name of the Amazon EC2 Connector
action="reboot-instances"                               #Reboot Amazon EC2 instance action
instance_id = @input.get("instance_id")                 #Amazon Instance ID to reboot Instance

#Optional
region = @input.get("region")													  #Amazon EC2 region (default region is 'us-east-1')
request_timeout=@input.get("timeout")									  #Execution time of the Flintbit in milliseconds

@log.info("Flintbit input parameters are, action :            #{action} |
	                                        instance_id :       #{instance_id} |
	                                        region :            #{region}")


@log.trace("Calling Amazon EC2 Connector...")

call_connector = @call.connector(connector_name)
                .set("action",action)

if connector_name.nil? || connector_name.empty?
   raise 'Please provide Amazon EC2 "connector name (connector_name)" to reboot Instance'
end

if instance_id.nil? || instance_id.empty?
   raise 'Please provide "Amazon instance ID (instance_id)" to reboot Instance'
else
   call_connector.set("instance-id",instance_id)
end

if !region.nil? && !region.empty?
   call_connector.set("region",region)
else
   @log.trace("Region is not provided so using default region 'us-east-1'")     
end

if request_timeout.nil? || request_timeout.is_a?(String)
   response = call_connector.sync
else
	 response = call_connector.timeout(request_timeout).sync
end

#Amazon EC2 Connector Response Meta Parameters
response_exitcode=response.exitcode              	      #Exit status code
response_message=response.message                       #Execution status messages

#Amazon EC2 Connector Response Parameters
instances_set=response.get("reboot-instance-id")        #Set of Amazon EC2 rebooted instances

if response_exitcode == 0
	@log.info("SUCCESS in executing Amazon EC2 Connector where, exitcode : #{response_exitcode} | 
																															message :  #{response_message}")
	vertx_json_array = org.vertx.java.core.json.JsonArray.new(instances_set.to_s)
	instances_set.each do |instance_id|
  @log.info("Amazon EC2 rebooted instances : #{instance_id.to_s}")
	end
	@output.setraw("rebooted-instance-set",instances_set.to_s)
else
	@log.error("ERROR in executing Amazon EC2 Connector where, exitcode : #{response_exitcode} |
																															 message :  #{response_message}")
  @output.set("error",response_message)
  #@output.exit(1,response_message)															#Used to exit from flintbit
end
rescue Exception => e
  @log.error(e.message)
end
  @log.trace("Finished executing 'flint-util:aws:operation:reboot_amazon_instance.rb' flintbit")
#end
