/**
 * Created date: 26th July 2019
 * Sync users in Onelogin from Azure Active Directory
 * Flintbit to get all Azure AD users and sync Onelogin with Azure AD
 */

log.info("Started executing 'flint-util:onelogin:sync_onelogin_azure_ad.js' flintbit")
// log.trace(input)

// Inputs
azure_ad_users_list = azure_ad_users_list_json.get('get_azure_ad_users').get('output').get('result').get('value')
azure_ad_users_list = util.json(azure_ad_users_list)
 
// log.trace("List is "+azure_ad_users_list)

for (user_no in azure_ad_users_list) {

    // Current user details json
    current_user = azure_ad_users_list.get(user_no)

    // Check if the user exists on Onelogin
    username = current_user.get('userPrincipalName').split("@")[0]
    log.trace("Username for user no. " + user_no + " is " + username)

    // Get Onelogin details
    onelogin_configurations = input.get('input').get('onelogin_configurations')
    // log.trace("Onelogin configs "+onelogin_configurations)
    client_id = onelogin_configurations.get('client_id')
    client_secret = onelogin_configurations.get('client_secret')
    connector_name = onelogin_configurations.get('connector_name')
    region = onelogin_configurations.get('onelogin_region')

    // Call onelogin connector to get details of the user which exists in Azure AD
    onelogin_get_details_response = call.connector(connector_name)
        .set('action', 'get-user-details')
        .set('client_id', client_id)
        .set('client_secret', client_secret)
        .set('username', username)
        .set('region', region)
        .sync()

    message = onelogin_get_details_response.message()

    // If the user exists in Onelogin, we update it
    if (onelogin_get_details_response.exitcode() == 0) {
        log.trace("Message: " + message)
        log.info("Azure AD user " + username + " already exists in Onelogin. Updating user.")
        log.trace("Onelogin user no " + user_no + " response is " + onelogin_get_details_response)

        // Update user

        log.info("Updating user in Onelogin")

        update_user_request = call.connector(connector_name)
            .set('client_id', client_id)
            .set('client_secret', client_secret)
            .set('region', region)
            .set('username', username)
            .set('action', "update-user")

        // Setting optional parameter to OneLogin connector
        if (current_user.get('companyName') != null && current_user.get('companyName') != "") {
            // company = input.get('company')
            company = current_user.get('companyName')
            update_user_request.set('company', company)
            log.trace("Company is " + company)
        }

        if (current_user.get('department') != null && current_user.get('department') != "") {
            department = current_user.get('department')
            update_user_request.set('department', department)
            log.trace("Department is " + department)
        }

        if (current_user.get('onPremisesDistinguishedName') != null && current_user.get('onPremisesDistinguishedName') != "") {
            distinguished_name = current_user.get('onPremisesDistinguishedName')

            update_user_request.set('distinguished_name', distinguished_name)
            log.trace("Distinguished Name is " + distinguished_name)
        }

        // External ID is taken as Azure AD object ID, to link the onelogin user with Azure AD
        if (current_user.get('objectId') != null && current_user.get('objectId') != "") {
            external_id = current_user.get('objectId')
            update_user_request.set('external_id', external_id)
            log.trace("External ID is " + external_id)

        }

        if (current_user.get('odata.type') != null && current_user.get('odata.type') != "") {
            member_of = current_user.get('odata.type')
            update_user_request.set('member_of', member_of)
            log.trace("Member of " + member_of)
        }


        if (current_user.get('telephoneNumber') != null && input_clone['telephoneNumber'] != "") {
            phone = current_user.get('telephoneNumber')

            update_user_request.set('phone', phone)
            log.trace("Phone is " + phone)

        }

        if (current_user.get('jobTitle') != null && current_user.get('jobTitle') != "") {
            title = current_user.get('jobTitle')
            update_user_request.set('title', title)
            log.trace("Title is " + title)
        }

        update_user_response = update_user_request.sync()

        log.trace("Made connector request to update user")
        if (update_user_response.exitcode() == 0) {
            log.trace("Successfully updated user " + username)
        } else {
            log.error("Failed to update user: " + update_user_response.message())
        }
        // Update User ends here

        log.trace("Successfully updated user " + username + " on onelogin")
    }
    // Since the user does not exist in Onelogin, we create a new user in Onelogin
    else {
        log.trace("No match found: " + message)
        log.trace("Creating user in onelogin, based on Azure AD user details")
        // Create user in Azure AD
        // Get inputs to create user in Onelogin
        onelogin_username = username    // Azure AD User principle name with regex to remove AD domain

        log.trace(current_user)
        log.trace("Connector name " + connector_name + "\n Username: " + onelogin_username + "\n First Name: " + current_user.get('displayName'))

        onelogin_create_user_response = call.connector(connector_name)
            .set('client_id', client_id)
            .set('client_secret', client_secret)
            .set('region', region)
            .set('action', "create-user")
            .set('firstname', current_user.get('displayName'))
            .set('lastname', current_user.get('mailNickname'))
            .set('email', onelogin_username)
            .set('username', onelogin_username)

        // Setting Optional parameters
        log.trace("Display name is " + current_user.get('odata.type'))
        // input_clone = current_user.replace("=",":")
        // log.trace(input_clone)

        log.info("Setting optional parameters for user creation")
        // Setting optional parameter to OneLogin connector
        if (current_user.get('companyName') != null && current_user.get('companyName') != "") {
            // company = input.get('company')
            company = current_user.get('companyName')
            onelogin_create_user_response.set('company', company)
            log.trace("Company is " + company)
        }

        if (current_user.get('department') != null && current_user.get('department') != "") {
            department = current_user.get('department')
            onelogin_create_user_response.set('department', department)
            log.trace("Department is " + department)

        }

        if (current_user.get('onPremisesDistinguishedName') != null && current_user.get('onPremisesDistinguishedName') != "") {
            distinguished_name = current_user.get('onPremisesDistinguishedName')

            onelogin_create_user_response.set('distinguished_name', distinguished_name)
            log.trace("Distinguished Name is " + distinguished_name)
        }

        // External ID is taken as Azure AD object ID, to link the onelogin user with Azure AD
        if (current_user.get('objectId') != null && current_user.get('objectId') != "") {
            external_id = current_user.get('objectId')
            onelogin_create_user_response.set('external_id', external_id)
            log.trace("External ID is " + external_id)

        }

        if (current_user.get('odata.type') != null && current_user.get('odata.type') != "") {
            member_of = current_user.get('odata.type')
            onelogin_create_user_response.set('member_of', member_of)
            log.trace("Member of " + member_of)
        }


        if (current_user.get('telephoneNumber') != null && input_clone['telephoneNumber'] != "") {
            phone = current_user.get('telephoneNumber')

            onelogin_create_user_response.set('phone', phone)
            log.trace("Phone is " + phone)

        }

        // if (input_clone.hasOwnProperty('sam_account_name') && input_clone['sam_account_name'] != null && input_clone['sam_account_name'] != "") {
        //     samaccountname = current_user.get('sam_account_name')

        //     onelogin_create_user_response.set('samaccountname', samaccountname)
        //     log.trace("Sam Account Name is " + samaccountname)

        // }

        if (current_user.get('jobTitle') != null && current_user.get('jobTitle') != "") {
            title = current_user.get('jobTitle')
            onelogin_create_user_response.set('title', title)
            log.trace("Title is " + title)
        }

        // Optional parameters end here
        log.trace("Calling Onelogin connector to create user")
        create_user_response = onelogin_create_user_response.sync()

        onelogin_create_user_message = create_user_response.message()
        if (create_user_response.exitcode() == 0) {
            log.trace("Onelogin user creation message: " + onelogin_create_user_message)
            log.trace("Successfully created user in Onelogin with username " + onelogin_username)
        } else {
            log.error("Failed to create user in Onelogin: " + onelogin_create_user_message)
        }
    }
}

log.info("Finished executing 'flint-util:onelogin:sync_onelogin_azure_ad.js' flintbit")
