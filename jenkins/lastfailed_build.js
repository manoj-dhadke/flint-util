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

/**
** Creation Date: 7th November 2019
** Summary: This flintbit is used to find jenkins last failed build
** Description: This flintbit is used to find jenkins last failed build
**/

  log.trace("Started execution of 'flint-util:jenkins:lastfailed_build.js' flintbit..")

  log.debug("Inputs :: "+input)

  jenkins_username = input.get("username") // Username of the jenkins user
  jenkins_api_token = input.get("api_token") //Api token of Jenkins
  jenkins_host = input.get("jenkins_url")  //Jenkins host URL
  build_name = input.get('build_name')
  connector_name = "http"
  crumburl = jenkins_host + "/crumbIssuer/api/json"
  lastfailedBuild = "/lastFailedBuild/api/json"

  
   log.info ("crumburl ::" +crumburl)

   log.info ("lastfailedBuild::" +lastfailedBuild)


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

  if (build_name == null || build_name == "") {
    throw "Please provide build name"
  }

  if (lastfailedBuild == null || lastfailedBuild == "") {
    throw "Please provide lastfailedBuild to connect"
  }

  status_url = jenkins_host + "/job/" + build_name.replace(" ", "%20") + lastfailedBuild
  build_name.replace("%20", " ")


  concatenate_string = jenkins_username + ":" + jenkins_api_token

  encoded_string = util.encode64(concatenate_string)

  concatenate_authorization = "Basic" + " " + encoded_string

  response_crumb = call.connector(connector_name)
                       .set("method", "GET")
                       .set("url", crumburl)
                       .set("headers", "Authorization:" + concatenate_authorization)
                       .set("body", "abc")
                       .set("timeout", 300000)
                       .sync()

  exitcode = response_crumb.exitcode()
  crum_message = response_crumb.message()

  response_crumb_body = response_crumb.get("body")
  response_body1 = util.json(response_crumb_body)         //Response Body

  crumb = response_body1.get("crumb")
  log.info("crumbLastBuild:::" + crumb)

  if (exitcode == 0) {

    response_buildstatus = call.connector(connector_name)
                               .set("method", "GET")
                               .set("url", status_url)
                               .set("headers", ["Authorization:" + concatenate_authorization, "Jenkins-Crumb:" + crumb])
                               .set("body", "abc")
                               .set("timeout", 300000)
                               .sync()
    response_body = response_buildstatus.get("body")    //Response Body
    log.info("response :" + response_body)
  }
  else {
    log.error("message ::" + crum_message)
  }
  buildstatus_exitcode = response_buildstatus.exitcode()
  buildstatus_message = response_buildstatus.message()
  responseJson = util.json(response_body)
  responseResult = responseJson.get('result')
  responseFullDisplayName = responseJson.get('fullDisplayName')
  responseUrl = responseJson.get('url')
  if (buildstatus_exitcode == 0) {

    log.info("Success in getting last build status ")
    user_message = 'Hello ' + 'Last failed Build status is : ' + responseResult + ' |Full Build-name: ' + responseFullDisplayName + ' |Build URL: ' + responseUrl
    output.set("user_message", user_message)
  }
  else {
    log.info("message :" + buildstatus_message + "There is no last failed build found for" + build_name)
    user_message = 'Hello ' + ' There is no last failed build found for build-name: ' + build_name
    output.set("user_message", user_message)
    output.exit(-1, buildstatus_message)

  }
log.trace("Finished execution of 'flint-util:jenkins:lastfailed_build.js' flintbit..")
