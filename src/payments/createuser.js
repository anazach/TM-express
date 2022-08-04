const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18",
});

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.createUserHandler = async (event, context) => {
  try {
    console.log(event);
    let userInfo = {
      //email: "appstoreuser@market.com",
      username: "*",
    };

    const user = await cognito
      .adminUpdateUserAttributes({
        UserAttributes: [
          {
            Name: "email",
            Value: "elsalenartsson@gmail.com",
          },
          {
            Name: "email_verified",
            Value: "true",
          },
        ],
        UserPoolId: process.env.COGNITO_USER_POOL,
        Username: "0b3d6b4a-21c5-4528-afb5-92d3d4871db4",
      })
      .promise();

    /*     const user = await cognito
      .adminCreateUser({
        UserAttributes: [
          {
            Name: "email",
            Value: userInfo.email,
          },
          {
            Name: "birthdate",
            Value: userInfo.birthday,
          },
          {
            Name: "family_name",
            Value: userInfo.family_name,
          },
          {
            Name: "given_name",
            Value: userInfo.given_name,
          },
          {
            Name: "custom:country_of_residence",
            Value: userInfo.country_of_residence,
          },
          {
            Name: "custom:nationality",
            Value: userInfo.nationality,
          },
        ],
        UserPoolId: process.env.COGNITO_USER_POOL,
        Username: userInfo.email,
        TemporaryPassword: "pwd123"
      })
      .promise(); */
  } catch (err) {
    console.log(err);
    return err;
  }
  return event;
};
