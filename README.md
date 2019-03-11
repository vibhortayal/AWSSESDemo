# AWS SES Demo with HTTPS Endpoint

What are we trying to do: Setup a simple HTTPS endpoint that takes a destination email address and an OTP and sends the email with OTP.

## Basic Steps
1. Configure AWS SES
2. Build the API with the Serverless Framework
3. Deploy the API to AWS Lambda

## Tech Stack:
1. AWS Simple Email Service(SES)
2. AWS Lamda with API Gateway. We will be using Serverless for our development- https://serverless.com/

## Prerequisite: 
1. Verify your email via SES. This is fairly easy and GUI driven - https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-email-addresses.html

2. Setup AWS command Line - https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html
Easiest way is using pip

`pip install awscl`

## Configure AWS SES
1. We will be using AWS CLI to create an Email Template - You can use mytemplate.json for reference

```
{
  "Template": {
    "TemplateName": "OTPTemplateEnglish",
    "SubjectPart": "Your OTP password",
    "HtmlPart": "<h1>Hello,</h1><p>Your OTP password is {{otp}}.</p>",
    "TextPart": "Your OTP password is {{otp}}."
  }
}
```
2. At the command line, type the following command to create a new template using the CreateTemplate API operation: 
`aws ses create-template --cli-input-json file://mytemplate.json`

Note: use aws ses create-template --cli-input-json file://mytemplate.json` to update template in future

3. Test your template using CLI. Create an test email json file - save it as it "myemail.json"

````
{
  "Source": "your_verified_email_id",
  "Template": "OTPTemplateEnglish",
  "Destination": {
    "ToAddresses": [ "your_verified_email_id"
    ]
  },
  "TemplateData": "{ \"otp\":\"1234\"}"
}
````
4. At the command line, type the following command to send the email:

````aws ses send-templated-email --cli-input-json file://myemail.json````

The SES setup is completed. Now we move to a HTTPS endpoint using AWS Lambda and API Gateway.

## Build the API with the Serverless Framework

1.  Install the Serverless Framework (make sure you have NodeJS)
`$ npm i -g serverless`

2. Create a service
`serverless create --template aws-nodejs --path otp-sender`

This will create boiler plate code for you. Navigate to otp-sender directory.

Copy and overwrite contents from serverless.yml and handler.js from repository.

3. Add the secrets file.
```
{
  "NODE_ENV":"dev",
  "EMAIL":"your_verified_email_id",
  "DOMAIN":"*"
}
````

## Deploy the API to AWS Lambda
Just this
`$ serverless deploy`

Logs on the console will give you the endpoint.

Test your end point 

````
  curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"email":"your_verified_email_id","otp":"1234"}' \
 https://{your_aws_end_point}/dev/email/send
 ````
 
 ## Done. Have a beer.

I have ingested a lot of tutorials from web to build this. Credit to the most useful tutorial
https://dev.to/adnanrahic/building-a-serverless-contact-form-with-aws-lambda-and-aws-ses-4jm0
