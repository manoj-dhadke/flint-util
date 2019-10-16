/**
** Creation Date: 8th March 2019
** Summary: Create AWS instance service flintbit.
** Description: This flintbit is developed to create an AWS EC2 instance.
**/
log.trace("Started executing flint-util:freshservice:aws:aws_ec2_create_instance_wf.js flintbit.")
log.info("Input.....:: " + input)
input_clone = JSON.parse(input)

// Get Flint Job ID
flint_job_id = input.jobid()

// Inputs to create AWS instance, set in service config
aws_service_params = input.get('aws_service_parameters')

if (typeof aws_service_params == "string") {
    log.trace("Template is given as a JSON string. Coverting to JSON object")
    aws_service_params = util.json(aws_service_params)
} else if (typeof aws_service_params == "object") {
    log.trace("Template JSON is given")
}
region = aws_service_params.get('region')
key_name = aws_service_params.get('key_name')
subnet_id = aws_service_params.get('subnet_id')
max_instance = aws_service_params.get('max_instance')
min_instance = aws_service_params.get('min_instance')
availability_zone = aws_service_params.get('availablity_zone')
log.info("Service Parameters: "+aws_service_params)
// Credential Variables
access_key = ""
security_key = ""
aws_connector_name=""

log.trace(region)
log.trace(key_name)

if (input_clone.hasOwnProperty('cloud_connection')) {
    log.trace("Taking AWS credentials from connection")
    access_key = input.get('cloud_connection').get('encryptedCredentials').get('access_key');
    security_key = input.get('cloud_connection').get('encryptedCredentials').get('security_key');
    log.info("Access Key:: " +access_key + " Secret Key:: " +security_key)
    // Check if credentials are null or empty
  
    }else{
        log.info("Unable to get 'security_key' and 'access_key' from Connection")
    }
    if (access_key == null || access_key == "" || security_key == null || security_key == "") {
            log.trace("AWS credentials are not properly given in connection. Checking in JSON parameter")
            access_key = aws_service_params.get('access_key')
            security_key = aws_service_params.get('security_key')
            aws_connector_name = aws_service_params.get('connector_name')
            // Check if credentials are null or empty
        
        } else {
            log.info("AWS Credentials fetched from Connection")
        }
aws_connector_name = aws_service_params.get('connector_name')
log.trace(aws_connector_name)

// Service Form
instance_size = input.get('instance_size')
os_type = input.get('operating_system')

log.info("Instance Size: " + instance_size)
log.info("OS: " + os_type)
// Getting relevant ami ID
ami_id = aws_service_params.get('os_mapping').get(os_type)
log.trace("AMI ID: " + ami_id)

log.trace("Calling connector")
log.info(aws_connector_name)
log.trace(ami_id)
log.trace(instance_size)
log.trace(min_instance)
log.trace(max_instance)
log.trace(access_key)
log.trace(security_key)
log.trace(availability_zone)

create_aws_flintbit_call_response = call.bit("fb-cloud:aws-ec2:operation:create_instance.rb")
                                        .set('connector_name', aws_connector_name)
                                        .set('ami_id', ami_id)                  // Image ID
                                        .set('instance_type', instance_size)
                                        .set('min_instance', min_instance)
                                        .set('max_instance', max_instance)
                                        .set('access-key', access_key)
                                        .set('security-key', security_key)
                                        .set('availability_zone', availability_zone)
                                        .set('subnet_id', subnet_id)
                                        .sync()

    log.trace("Called connector")
// Getting exit-code for create instance flinbit call
create_instance_exit_code = create_aws_flintbit_call_response.get("exit-code")
log.trace("Exit code: "+create_instance_exit_code)
create_instance_response_message = create_aws_flintbit_call_response.get("message")
log.info("Message: " +create_instance_response_message)
log.info(create_aws_flintbit_call_response)


if(create_instance_exit_code == 0){
    instance_info = create_aws_flintbit_call_response.get('instances-info')
    instance_id = instance_info[0].get('instance-id')
    log.info("Instance_Info: " + instance_id)
    private_ip = instance_info[0].get('private-ip')
    log.info("Private IP: " + private_ip)
    log.trace("Instance created successfully with: \nInstance ID:"+instance_id+"\nPrivate IP: "+private_ip)
    output.set('instance_details', instance_info[0])
    }
else{
    // Setting user message (will be visible on CMP)
    output.set('exit-code', -1).set('error', create_instance_response_message)
    output.exit(-1, create_instance_response_message)
}

log.trace("Finished executing flint-util:freshservice:aws:aws_ec2_create_instance_wf.js flintbit.")