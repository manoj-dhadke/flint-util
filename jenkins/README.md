
## Flint integration with Jenkins Build Server

### What is Flint IT Automation Platform?
Flint is a lean IT Process Automation & Orchestration Platform for IT infrastructure and applications. It empowers teams to leverage existing scripting (Ruby or Groovy) skills to develop powerful workflows and processes which can be published as microservices.

Flint helps in automation of routine IT tasks & activities which saves time and cost thus allowing the team to focus on strategic initiatives and innovation. Know more: http://www.getflint.io

### What is Jenkins
Jenkins is a cross-platform, continuous integration and continuous delivery application that increases your productivity.Jenkins is used to build and test your software projects continuously making it easier for developers to integrate changes to the project, and making it easier for users to obtain a fresh build. It also allows you to continuously deliver your software by providing powerful ways to define your build pipelines and integrating with a large number of testing and deployment technologies.

## Add new Flintbox from Flint Console
* Go to flintbox
* Click on Add Flintbox
* set Git url of this repo: https://github.com/getflint/flint-util.git
* Click add
* Enable the flintbox: **flint-util**

## Global Configuration in flint
> You need to make some Global Configurations in flint from Flint Console.

### Name: jenkins_build
### Config JSON

```json
{
"apitoken": "7da9be6250575647hffhjfjg",
"jenkins_host": "http://build.infiverve.com:8080/job/",
"last_failed_build_url": "/lastFailedBuild/api/json",
"last_successful_build_url": "/lastSuccessfulBuild/api/json",
"crumb_url": "http://build.infiverve.com:8080/crumbIssuer/api/json",
"username": "infiverve"
}
```

| Name | Description          |
| ------------- | ----------- |
| apitoken      | Jenkins User Token|
|username  |Jenkins username |
| jenkins_host | Jenkins host URL with port|
| last_failed_build_url |Jenkins API URL for last failed build |
| last_successful_build_url |Jenkins API URL for last successful build |
| crumb_url |Jenkins Crumb generator API URL |

### Name: hipchat_jenkins
### Config JSON

```json
{
	"Flint": {
		"builds": [
			"test_pro1",
			"test_pro2",
		],
	},
  "http_post_url": {
		"header": "Content-Type:application/json",
		"method": "post",
		"name": "http",
		"room_url":"https://infiverve.hipchat.com/v2/room/1283166/notification?auth_token=guv26VyKOtpIx3K0lF"
	},
	"build_operation": "/build"
}
  ```

  | Name | Description          |
  | ------------- | ----------- |
  | builds |Build names in specific Hipchat room|
  | room_url |Hipchat room URL to post messages  |
  | build_operation |Operation to build/get status of the jenkins build |

```ruby
# call the flintbit
#Flintbit to start build deployment
@response_startbuild = @call.bit('flint-util:jenkins:start_build.rb')
                            .set('build_name',@build_name)
                            .sync

#Flintbit to get last successful build status

@response_status = @call.bit('flint-util:jenkins:status_build.rb')  
                        .set('build_name',@build_name)
                        .sync

#Flintbit to get last failed build status

@response_lastfailed_status =	@call.bit('flint-util:jenkins:lastfailed_build.rb')
                                   .set('build_name',@build_name)
                                   .sync                                                 

```
