/*
 *
 * INFIVERVE TECHNOLOGIES PTE LIMITED CONFIDENTIAL
 * _______________________________________________
 *
 *  (C) INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE
 *  All Rights Reserved.
 *  Product / Project: Flint IT Automation Platform
 *  NOTICE:  All information contained herein is, and remains
 *  the property of INFIVERVE TECHNOLOGIES PTE LIMITED.
 *  The intellectual and technical concepts contained
 *  herein are proprietary to INFIVERVE TECHNOLOGIES PTE LIMITED.
 *  Dissemination of this information or any form of reproduction of this material
 *  is strictly forbidden unless prior written permission is obtained
 *  from INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE.
*/

log.trace("Started executing serviceaide:router:router.js flintbit...")
log.info("Input from serviceaide: " + input)
flint_action_name= input.get("service_name")
login_user_name= input.get("login_name")
login_user_name_disable= input.get("login_name_disable")
login_user_name_delete= input.get("login_name_delete")
login_user_name_reset= input.get("login_name_reset")
start_service= input.get("start")
stop_service= input.get("stop_service")
to=input.get("mail-to")
email_to= input.get("to")
password=input.get("password")
group_name = input.get("ad_group_name")
sam_account_name = input.get("samaccountname")
group_description = input.get("group_description")
ticket_id = input.get("ticket_id")
login_user_name_create_user= input.get("login_name_create_user")
first_name = input.get('first_name')
last_name = input.get('last_name')
initial = input.get('initial')
employee_id = input.get('emp_id')
create_ad_user_password = input.get('create_ad_user_password')
create_ad_user_group_name = input.get('create_ad_group_name')
Directory_name=input.get("directory_name")
start_vm_name=input.get("start_vmware_name")
stop_vm_name=input.get("stop_vmware_name")
delete_vm_name=input.get("delete_vmware_name")
vm_name_clone=input.get("clone_vm_name")
datacenter_clone=input.get("datacenter_clone")
clonename_vmclone=input.get("clonename_vmclone")
hostname_clone=input.get("hostname_clone")
vm_name_create_template=input.get("vm_name_create_template")
datacenter_template=input.get("datacenter_template")
clonename_template=input.get("clonename_template")
hostname_template=input.get("hostname_template")
//target_linux_server=input.get("target")
target_linux_server=config.global('ssh.centos_hostname')
log.info("server:"+target_linux_server)
//target_linux_username= input.get("username")
target_linux_username= config.global('ssh.centos_username')
//target_linux_password = input.get("password_linux")
target_linux_password = config.global('ssh.centos_password')
shell_script_path= input.get("execute_shell")
//shell_target=input.get("target_shell_server")
shell_target=config.global('ssh.centos_hostname')
//shell_username=input.get("target_shell_username")
shell_username=config.global('ssh.centos_username')
//shell_password=input.get("target_shell_password")
shell_password=config.global('ssh.centos_password')
status_service=input.get("status_service")
Directory= input.get("directory_name_to_remove")
//target_post_approval=input.get("target_post_approval")
target_post_approval=config.global('ssh.centos_hostname')
//username_post_approval= input.get("username_post_approval")
username_post_approval= config.global('ssh.centos_username')
//password_post_approval = input.get("password_post_approval")
password_post_approval = config.global('ssh.centos_password')
to_post_approval = input.get("to_post_approval")
directory_post_approval = input.get("directory_post_approval")
file_post_approval = input.get("file_post_approval")
//target_one= input.get("first_target_server")
target_one= config.global('ssh.server_hostname')
log.info ("server_hostname:"+ target_one)
//target_two= input.get("second_target_server")
target_two= config.global('ssh.centos_hostname')
log.info ("server_hostname:"+ target_two)
file_one=input.get("first_file")
file_two=input.get("second_file")
//target_one_username=input.get("first_target_username")
target_one_username=config.global('ssh.server_username')
//target_one_password=input.get("first_target_password")
target_one_password=config.global('ssh.server_password')
//target_two_username=input.get("second_target_username")
target_two_username=config.global('ssh.centos_username')
//target_two_password= input.get("second_target_password")
target_two_password= config.global('ssh.centos_password')
power_shell_script_path=input.get("power_shell")
snap_name=input.get("snapshot_name")
snap_desc=input.get("snapshot_desc")
vm_name=input.get("vmname")
delete_snapshot_name=input.get("delete_snapshot_name")
delete_vm_name_of_snapshot=input.get("delete_vm_name_of_snapshot")
delete_all_snapshot=input.get("delete_all_snapshot")
delete_child_snapshot = input.get("delete_child_snapshot")
operating_system_name = input.get("operating_system_name")

ticket_id = input.get('ticket_id')
instance_size = input.get("instance_size")
aws_config= input.get("aws_config")
aws_region = aws_config.get('region')
key_name = aws_config.get('key_name')
subnet_id = aws_config.get('subnet_id')
access_key = aws_config.get('access-key')
max_instance = aws_config.get('max_instance')
min_instance = aws_config.get('min_instance')
security_key = aws_config.get('security-key')
aws_connector_name = aws_config.get('aws_connector_name')
availability_zone = aws_config.get('availability_zone')
//log.trace("instance_size::"+instance_size+"|ticket_id::"+ticket_id+"|operating_system_name::"+operating_system_name+"|region::"+region+"|key_name::"+key_name+"|subnet_id::"+subnet_id+"|access_key::"+access_key+"|max_instance::"+max_instance+"|min_instance"+min_instance+"|security_key::"+security_key+"|aws_connector_name::"+aws_connector_name)
instance_id = input.get('instance_id')
log.info("Flintbit input parameters are, : aws_region :"+aws_region+"|access_key::"+access_key+"|security_key::"+security_key)

gcp_config = input.get('gcp_config')
project_id = gcp_config.get("project-id")
zone_name = gcp_config.get("zone-name")
service_account_credenetials = gcp_config.get("service-account-credentials")
instance_name = input.get("instance-name")
disk_type = gcp_config.get("disk-type")
machine_type = input.get("machine_type")
image_project_id = gcp_config.get("image-project-id")
gcp_connector_name = gcp_config.get('connector_name')
operating_system_type = input.get("operating_system_type")

log.info("Input Parameters.....:: ticket_id "+ticket_id+ " | project_id "+project_id+" | zone_name "+zone_name+" | service_account_credenetials "+service_account_credenetials+" | instance_name "+instance_name+" | disk_type "+disk_type+" | machine_type "+machine_type+" | image_project_id "+image_project_id+" | gcp_connector_name "+gcp_connector_name+" | operating_system_type "+operating_system_type)

delete_instance_name = input.get("delete_instance_name")


azure_config = input.get('azure_config')
azure_connector_name = azure_config.get("connector_name")
tenant_id = azure_config.get('tenant-id')
subscription_id = azure_config.get('subscription-id')
client_id = azure_config.get('client-id')
region = azure_config.get('region')
key = azure_config.get('key')
resource_group_name = input.get('resource_group_name')

log.info("Azure input.....:: azure_connector_name "+azure_connector_name+" | tenant_id "+tenant_id+" | subscription_id "+subscription_id+" | client_id "+client_id+" | region "+region+" | key "+key+" | resource_group_name "+resource_group_name)

delete_resource_group_name = input.get('delete_resource_group_name')



switch(flint_action_name){
case "enable_ad_account":
{
  flintbit_response = call.bit("serviceaide:ad:enable_ad_account.js")
                           .set("login-name", login_user_name)
                           .set("ticket_id", ticket_id)
                           .sync()
}break;
case "disable_ad_account":
{
  flintbit_response = call.bit("serviceaide:ad:disable_ad_account.js")
                           .set("login-name", login_user_name_disable)
                           .set("ticket_id", ticket_id)
                           .sync()
}break;
case "delete_ad_user":
{
  flintbit_response = call.bit("serviceaide:ad:delete_ad_account.js")
                           .set("login-name", login_user_name_delete)
                           .set("ticket_id", ticket_id)
                           .sync()
}break;
case "create_ad_group":
{
  flintbit_response = call.bit("serviceaide:ad:create_group.js")
                           .set("group-name", group_name)
                           .set("SamAccountName", sam_account_name)
                           .set("group-description",group_description)
                           .set("ticket_id", ticket_id)
                           .sync()
}break;
case "reset_ad_password":
{
log.info("reset")
  flintbit_response = call.bit("flint-util:serviceaide:ad:reset_ad_password_send_sms.js")
                           .set("login-name", login_user_name_reset)
                           .set("ticket_id", ticket_id)
                           .set("to", to)
                           .set("password", password)
                           .sync()
}break;
case "unlock_ad_account":
{
log.info("unlock")
  flintbit_response = call.bit("serviceaide:ad:unlock_ad_account.js")
                           .set("to", email_to)
                           .set("ticket_id", ticket_id)
                           .sync()
}break;
case "create_ad_user":
{
log.info("Create AD account")
  flintbit_response = call.bit("serviceaide:ad:provision_account_to_group.js")
                           .set("login-name", login_user_name_create_user)
                           .set("ticket_id", ticket_id)
                           .set("password", create_ad_user_password)
                           .set("first-name", first_name)
                           .set("last-name", last_name)
                           .set("initial", initial)
                           .set("emp-id", employee_id)
                           .set("group-name", create_ad_user_group_name)
                           .sync()
}break;
case "Start":
{
log.info("start service at windows")
  flintbit_response = call.bit("serviceaide:operating_system:start_winrm_service.js")
                           .set("ticket_id", ticket_id)
                           .set("Service", start_service)
                           .sync()
}break;
case "stop_windows_service":
{
log.info("Stop service at windows")
  flintbit_response = call.bit("serviceaide:operating_system:stop_winrm_service.js")
                           .set("ticket_id", ticket_id)
                           .set("service", stop_service)
                           .sync()
}break;
case "remove_directory":
{
log.info("Removes directory on linux server")
  flintbit_response = call.bit("serviceaide:operating_system:remove_files_from_directory.js")
                           .set("ticket_id", ticket_id)
                           .set("Directory", Directory_name)
                           .set("target",target_linux_server)
                           .set("username",target_linux_username)
                           .set("password",target_linux_password)
                           .sync()
}break;
case "poweron_vmware":
{
log.info("Power on Vmware machine")
  flintbit_response = call.bit("serviceaide:vmware:poweron_vmware.js")
                           .set("ticket_id", ticket_id)
                           .set("vm-name",start_vm_name)
                           .sync()
}break;
case "poweroff_vmware":
{
log.info("Power off Vmware machine")
  flintbit_response = call.bit("serviceaide:vmware:poweroff_vmware.js")
                           .set("ticket_id", ticket_id)
                           .set("vm-name",stop_vm_name)
                           .sync()
}break;
case "delete_vmware":
{
log.info("Delete Vmware machine")
  flintbit_response = call.bit("serviceaide:vmware:delete_vmware.js")
                           .set("ticket_id", ticket_id)
                           .set("vm-name",delete_vm_name)
                           .sync()
}break;
case "execute_shell":
{
log.info("execute shell script on linux server")
  flintbit_response = call.bit("serviceaide:operating_system:execute_shell_script.js")
                           .set("ticket_id", ticket_id)
                           .set("File", shell_script_path)
                           .set("target",shell_target)
                           .set("username",shell_username)
                           .set("password",shell_password)
                           .sync()
}break;
case "clone_vmware":
{
log.info("Clone Vmware machine")
  flintbit_response = call.bit("serviceaide:vmware:clone_vmware.js")
                           .set("ticket_id", ticket_id)
                           .set("vm-name",vm_name_clone)
                           .set('datacenter-name', datacenter_clone)
                           .set('clone-from-name', clonename_vmclone)
                           .set('host-name', hostname_clone)
                           .sync()
}break;
case "template_vmware":
{
log.info("Create Vmware machine from template")
  flintbit_response = call.bit("serviceaide:vmware:clone_vmware.js")
                           .set("ticket_id", ticket_id)
                           .set("vm-name",vm_name_create_template)
                           .set('datacenter-name', datacenter_template)
                           .set('clone-from-name', clonename_template)
                           .set('host-name', hostname_template)
                           .sync()
}break;
case "status_windows_service":
{
log.info("Get status of service at windows")
  flintbit_response = call.bit("serviceaide:operating_system:service_status_windows.js")
                           .set("ticket_id", ticket_id)
                           .set("service", status_service)
                           .sync()
}break;
case "file_exist_post_approval":
{
log.info("File post approval")
  flintbit_response = call.bit("serviceaide:operating_system:create_file_post_approval.js")
                           .set("ticket_id", ticket_id)
                           .set("to",to_post_approval)
                           .set("file",file_post_approval)
                           .set("directory",directory_post_approval)
                           .set("target",target_post_approval)
                           .set("username",username_post_approval)
                           .set("password",password_post_approval)
                           .sync()
}break;
case "compare_two_diff_files":
{
log.info("compare_two_diff_files")
  flintbit_response = call.bit("serviceaide:operating_system:compare_file.js")
                          .set("ticket_id",ticket_id)
                          .set("one_file",file_one)
                          .set("two_file",file_two)
                          .set("one_target",target_one)
                          .set("two_target",target_two)
                          .set("one_target_username",target_one_username)
                          .set("one_target_password",target_one_password)
                          .set("two_target_username",target_two_username)
                          .set("two_target_password",target_two_password)
                          .sync()
}break;
case "execute_power_shell":
{
log.info("execute script on windows server")
  flintbit_response = call.bit("serviceaide:operating_system:execute_power_shell.js")
                          .set("ticket_id", ticket_id)
                          .set("File", power_shell_script_path)
                          .sync()
}break;
case "create_snapshot":
{
log.info("create snapshot for vmware")
  flintbit_response = call.bit("serviceaide:vmware:create_snapshot.js")
                          .set("ticket_id", ticket_id)
                          .set("vm-snapshot-name", snap_name)
                          .set("vm-snapshot-description", snap_desc)
                          .set("vm-name", vm_name)
                          .sync()
}break;
case "delete_snapshot":
{
log.info("Delete vmware snapshot")
  flintbit_response = call.bit("serviceaide:vmware:delete_snapshot.js")
                          .set("ticket_id", ticket_id)
                          .set("vm-snapshot-name",delete_snapshot_name)
                          .set("vm-name",delete_vm_name_of_snapshot )
                          .set("delete-all",delete_all_snapshot)
                          .set("delete-child-snapshot",delete_child_snapshot)
                          .sync()
}break;
case "create_aws_instance":
{
log.info("Create aws instance")
  flintbit_response = call.bit("flint-util:serviceaide:aws:aws_create_instance.js")
                          .set("ticket_id", ticket_id)
                          .set("instance_size", instance_size)
                          .set("operating_system_name",operating_system_name) 
                          .set("region",aws_region)
                          .set("key_name",key_name)
                          .set("subnet_id",subnet_id)
                          .set("access-key",access_key)
                          .set("max_instance",max_instance)
                          .set("min_instance",min_instance)
                          .set("security-key",security_key)
                          .set("connector_name",aws_connector_name)
                          .set("availability_zone",availability_zone)
                          .set("aws_config",aws_config)
                          .sync()
}break;
case "start_aws_instance":
{
log.info("Start aws instance")
  flintbit_response = call.bit("flint-util:serviceaide:aws:aws_start_instance.js")
                          .set("ticket_id", ticket_id)
                          .set("connector_name", aws_connector_name)
                          .set("security-key",security_key)
                          .set("access-key",access_key)
                          .set("instance-id",instance_id)
                          .set("region",aws_region)
                          .sync()
}break;
case "create_gcp_instance":
{
log.info("Create GCP instance")
  flintbit_response = call.bit("flint-util:serviceaide:gcp:gcp_create_instance.js")
                          .set("ticket_id", ticket_id)
                          .set('project-id', project_id)
                          .set('zone-name', zone_name)
                          .set('service-account-credentials', service_account_credenetials)
                          .set('instance-name', instance_name)
                          .set('disk-type', disk_type)
                          .set('machine-type', machine_type)
                          .set('image-project-id', image_project_id)
                          .set('connector_name',gcp_connector_name)
                          .set('operating_system_type',operating_system_type)
                          .sync()


}break;
case "delete_gcp_instance":
{
log.info("Delete GCP instance")
  flintbit_response = call.bit("flint-util:serviceaide:gcp:gcp_delete_instance.js")
                          .set("ticket_id", ticket_id)
                          .set('connector_name',gcp_connector_name)
                          .set('project-id', project_id)
                          .set('zone-name', zone_name)
                          .set('service-account-credentials', service_account_credenetials)
                          .set('instance-name', delete_instance_name)
                          .sync()


}break;
case "create_resource_group":
{
log.info("Create azure resource group")
  flintbit_response = call.bit("flint-util:serviceaide:azure:azure_create_resource_group.js")
                          .set("ticket_id", ticket_id)
                          .set('connector_name',azure_connector_name)
                          .set('tenant-id', tenant_id)
                          .set('subscription-id', subscription_id)
                          .set('key', key)
                          .set('client-id', client_id)
                          .set('region',region)
                          .set('group-name',resource_group_name)
                          .sync()

}break;
case "delete_resource_group":
{
log.info("Delete azure resource group")
  flintbit_response = call.bit("flint-util:serviceaide:azure:azure_delete_resource_group.js")
                          .set("ticket_id", ticket_id)
                          .set('connector_name',azure_connector_name)
                          .set('tenant-id', tenant_id)
                          .set('subscription-id', subscription_id)
                          .set('key', key)
                          .set('client-id', client_id)
                          .set('resource-group-name',delete_resource_group_name)
                          .sync()


}break;
}
