log.trace("Started executing freshservice:router:router.js")
log.info("Input from freshservice.....:: "+input)
flint_action_name= parse_flintbit_call_response.get('data').get("Item Name")

aws_config= input.get("aws_config")
aws_connector_name = aws_config.get('connector_name')         
access_key = aws_config.get('access-key')
security_key = aws_config.get('security-key')
aws_region = aws_config.get('region')
instance_id = parse_flintbit_call_response.get('data').get("Instance ID")
switch(flint_action_name){
case "Start AWS EC2 Instance":
{
    log.info("Start aws instance")
    flintbit_response = call.bit("flint-util:freshservice:aws:aws_start_instance.js")
                            .set("connector_name", aws_connector_name)
                            .set("security-key",security_key)
                            .set("access-key",access_key)
                            .set("instance-id",instance_id)
                            .set("region",aws_region)
                            .sync()

}break;

}
