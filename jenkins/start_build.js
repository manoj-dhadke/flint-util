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

  log.trace("Started execution of 'flint-util:jenkins:start_build.js'flintbit..")

  log.debug("Inputs :: "+input)
  
  jenkins_username = input.get("username")     // Username of the jenkins user
  jenkins_api_token = input.get("api_token")  //Api token of Jenkins
  jenkins_host = input.get("jenkins_url")    //Jenkins host URL
  crumburl = input.get("crumb_url")         //Jenkins Crumburl 
  build_name = input.get('build_name')     //jenkins build name 
  connector_name = "http"
  crumburl = jenkins_host + "/crumbIssuer/api/json"

  log.info ("crumburl ::" +crumburl)

  if (jenkins_username == null || jenkins_username == "") {
    throw "Please provide Jenkins username"
  }
  if (jenkins_api_token == null || jenkins_api_token == "") {
    throw "Please provide Jenkins account API token"
  }

  if (jenkins_host == null || jenkins_host == "") {
    throw "Please provide Jenkins Host URL to connect"
  }

  if (crumburl == null || crumburl == "") {
    throw "Please provide valid Crumb URL"
  }

  build_url = jenkins_host + "/job/" + build_name.replace(" ", "%20") + "/build"
  build_name.replace("%20", " ")

  log.info("build_url:" + build_url)
  log.info("build_name:" + build_name)

  concatenate_string = jenkins_username + ":" + jenkins_api_token

  encoded_string = util.encode64(concatenate_string)

  concatenate_authorization = "Basic" + " " + encoded_string

  response_crumb = call.connector("http")
                       .set("method", "GET")
                       .set("url", crumburl)
                       .set("headers", "Authorization:" + concatenate_authorization)
                       .set("timeout", 300000)
                       .sync()

  log.info("Response :::" + response_crumb)

  exitcode = response_crumb.exitcode()
  crum_message = response_crumb.message()


  response_crumb_body = response_crumb.get("body")
  response_body1 = util.json(response_crumb_body)         //Response Body

  crumb = response_body1.get("crumb")
  log.info("crumb::: " + crumb)

  if (exitcode == 0) {
    
    response_build = call.connector("http")
                         .set("method", "POST")
                         .set("url", build_url)
                         .set("headers", ["Authorization:" + concatenate_authorization, "Jenkins-Crumb:" + crumb])
                         .set("body", "abc")
                         .set("timeout", 300000)
                         .sync()


    log.info("response_build:::::" + response_build)
    response_body2 = response_build.get("body")
    response_message = response_build.message()	 // Execution status messages
  }
  else {
    log.error("message : " + crum_message)
  }

  build_exitcode = response_build.exitcode()
  build_message = response_build.message()

  log.info("BUILD MESSAGE:::" + build_message)

  if (build_exitcode == 0) {
    user_message = 'Hello ' + ',The build request for ' + build_name + ' is complete.'
    output.set("user_message", user_message)
  }
  else {
    user_message = 'Hello ' + ', Build Failed for ' + "build_name + :" + response_build.get('error')
    output.set("user_message", user_message)
    output.exit(-1, message)
  }

log.trace("Finished execution of 'flint-util:jenkins:start_build.js'flintbit..")
