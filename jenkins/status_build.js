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

log.trace("Started execution of 'flint-util:jenkins:status_build.js' flintbit..")

log.debug("Inputs :: "+input)

jenkins_username = input.get("username") // Username of the jenkins user
jenkins_api_token = input.get("api_token") //Api token of Jenkins
jenkins_host = input.get("jenkins_url")  //Jenkins host URL
build_name = input.get('build_name')
crumburl = jenkins_host + "/crumbIssuer/api/json"
lastSuccessfulBuild= "/lastSuccessfulBuild/api/json"
log.info ("crumburl ::" +crumburl)


if (jenkins_username == null || jenkins_username == "") {
  throw "Please provide Jenkins username"
}

if (jenkins_api_token == null || jenkins_api_token == "") {
  throw "Please provide Jenkins API token"
}

if (jenkins_host == null || jenkins_host == "") {
  throw "Please provide Jenkins Host URL to connect"
}

if (crumburl == null || crumburl == "") {
  throw "Please provide valid Crumb URL"
}

if (lastSuccessfulBuild == null || lastSuccessfulBuild == "") {
  throw "Please provide Jenkins Last-Successful build URL"
}


status_url = jenkins_host + "/job/" + build_name.replace(" ", "%20") + lastSuccessfulBuild
build_name.replace("%20", " ")

log.info("print_url::" + status_url)

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
log.info("crumbLastBuild::: " + crumb)

if (exitcode == 0) {
  response_buildstatus = call.connector("http")
                             .set("method", "GET")
                             .set("url", status_url)
                             .set("headers", "Authorization:" + concatenate_authorization)
                             .set("body", "abc")
                             .set("timeout", 300000)
                             .sync()

  response_body = response_buildstatus.get("body")           //Response Body
}

else {
  log.error("message :" + crum_message)
}

log.info("response_build:::::" + response_buildstatus)

buildstatus_exitcode = response_buildstatus.exitcode()
buildstatus_message = response_buildstatus.message()

log.info("BUILD MESSAGE:::" + buildstatus_message)

responseJson = util.json(response_body)
responseResult = responseJson.get('result')
responseFullDisplayName = responseJson.get('fullDisplayName')
responseUrl = responseJson.get('url')

if (buildstatus_exitcode == 0) {
  log.info("Success in getting last build status ")
  user_message = 'Hello ' + ',Build status is : ' + responseResult + ' |Full Build-name: ' + responseFullDisplayName + ' |Build URL: ' + responseUrl
  output.set("user_message", user_message)
}

else {
  log.error("message ::" + buildstatus_message)
  user_message = 'Hello ' + ',Failed in getting build status of: ' + build_name +
    output.set("user_message", user_message)
  output.exit(-1, message)
}

log.trace("Finished execution of 'flint-util:jenkins:status_build.js' flintbit..")
