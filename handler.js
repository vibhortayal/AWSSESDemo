const aws = require('aws-sdk')
const ses = new aws.SES({apiVersion: '2010-12-01'})
const myEmail = process.env.EMAIL
const myDomain = process.env.DOMAIN

function generateResponse (code, payload) {
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': myDomain,
      'Access-Control-Allow-Headers': 'x-requested-with',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(payload)
  }
}

function generateError (code, err) {
  console.log(err)
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': myDomain,
      'Access-Control-Allow-Headers': 'x-requested-with',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(err.message)
  }
}

function generateEmailParams (body) {
  const { email, otp } = JSON.parse(body)
  console.log(email, otp)
  if (!(email && otp)) {
    throw new Error('Missing parameters! Make sure to add parameters \'email\', \'otp\'.')
  }

  return {
    Source: myEmail,
    Destination: { ToAddresses: [myEmail] },
    ReplyToAddresses: [email],
    Template: 'OTPTemplateEnglish',
  	TemplateData: `{ \"otp\":\"${otp}\" }`,
  }
}

module.exports.send = async (event) => {
  try {
    const emailParams = generateEmailParams(event.body)
    const data = await ses.sendTemplatedEmail(emailParams).promise()
    return generateResponse(200, data)
  } catch (err) {
    return generateError(500, err)
  }
}