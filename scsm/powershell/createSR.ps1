<#
#
#  INFIVERVE TECHNOLOGIES PTE LIMITED CONFIDENTIAL
#  _______________________________________________
# 
#  (C) INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE
#  All Rights Reserved.
#  Product / Project: Flint IT Automation Platform
#  NOTICE:  All information contained herein is, and remains
#  the property of INFIVERVE TECHNOLOGIES PTE LIMITED.
#  The intellectual and technical concepts contained
#  herein are proprietary to INFIVERVE TECHNOLOGIES PTE LIMITED.
#  Dissemination of this information or any form of reproduction of this material
#  is strictly forbidden unless prior written permission is obtained
#  from INFIVERVE TECHNOLOGIES PTE LIMITED, SINGAPORE.
#>


#import the smlets
Set-ExecutionPolicy RemoteSigned -force
import-module smlets;
#Required Args for flint 

#$priority=$args[0]
#$urgency=$args[1]
#$srarea=$args[2]
#$srsubarea=$args[2]
#$serviceRequestTitle=$args[2]
$serviceRequestDescription=$args[0]
$vmsize=$args[1]
$operating_system=$args[2]

#Get the Service Request Class
$serviceRequestClass = Get-SCSMClass -name System.WorkItem.ServiceRequest$

#Get the enumeration values needed for the lists in the Service Request
$serviceRequestArea = get-SCSMEnumeration -Name ServiceRequestAreaEnum.Hardware.Server
$serviceRequestPriority = Get-SCSMEnumeration -Name ServiceRequestPriorityEnum.Medium
$serviceRequestUrgency = Get-SCSMEnumeration -Name ServiceRequestUrgencyEnum.Medium

#Create a hash table of the Service Request Arguments
 $serviceRequestHashTable = @{
 Title = $serviceRequestTitle;
 Description = "$serviceRequestDescription";
 Urgency = $serviceRequestUrgency;
 Priority = $serviceRequestPriority;
 ID = 'SR{0}';
 UserInput = "<UserInputs>
<UserInput Question='VM Size' Answer='$vmsize' Type='string' />
<UserInput Question='Operating System' Answer='$operating_system' Type='string' />
</UserInputs>";
Area = $serviceRequestArea
}

#Create initial Service Request
$newServiceRequest = New-SCSMOBject -Class $serviceRequestClass -PropertyHashtable $serviceRequestHashTable -PassThru
$serviceRequestId = $newServiceRequest.ID
echo $serviceRequestId

#Get The Service Request Type Projection
$serviceRequestTypeProjection = Get-SCSMTypeProjection -name System.WorkItem.ServiceRequestProjection$

#Get the Service Request created earlier in a form where we can apply the template
$serviceRequestProjection = Get-SCSMObjectProjection -ProjectionName $serviceRequestTypeProjection.Name -filter "ID -eq $serviceRequestId"

#Get The Service Request Template
$serviceRequestTemplate = Get-SCSMObjectTemplate -DisplayName "Flint Integration"

#Apply the template to the Service Request
Set-SCSMObjectTemplate -Projection $serviceRequestProjection -Template $serviceRequestTemplate
