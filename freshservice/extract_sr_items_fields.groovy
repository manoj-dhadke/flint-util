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
log.info("Started executing flintbit 'extract_sr_items_fields.groovy'")
log.info("Inputs to flintbit are: "+input)

//log.info("Input is"+input.toString())

String rawTable = input.get("ticket_service_item_fields")
rawTable = rawTable.replaceAll("style='margin:0px;padding:0px;'","")
rawTable = rawTable.replaceAll("style='text-align:left; vertical-align:top;'","")
rawTable = rawTable.replaceAll("<td style='vertical-align:top;'> : </td>","")
rawTable = rawTable.replaceAll("<table >","<table>")
rawTable = rawTable.replaceAll("<td >","<td>")
log.info("Clean string is::"+rawTable)
String xml = rawTable
def parsed = new XmlSlurper().parseText(xml)
//log.info("Value ::: "+parsed.tr[0].td[0].text())
def list = parsed.tr*.td*.list()
log.info("List of Inputs ::: "+list)

def json = new groovy.json.JsonBuilder()

json{
  list.collect {"${it.get(0).toString().trim()}"  "${it.get(1).toString().trim()}"}
}

log.info("Json ::: "+json.toString())

output.setraw("data",json.toString())

log.info("Finished executing flintbit 'extract_sr_items_fields.groovy'")
