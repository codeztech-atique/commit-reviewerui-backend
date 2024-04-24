# commit-reviewerui-backend
This is commit reviewer UI, Backend. 

- Install Application <br />
  npm install

- Start Application <br />
  npm start

- NodeJS Version <br />
  v14.18.1

# API Gateway flush cache
aws apigateway flush-stage-cache --rest-api-id 9rxczrthyh --stage-name production

# Prod Endpoint -
https://k0rz1qn5hb.execute-api.us-west-1.amazonaws.com/production

# Deployment - 

- npx serverless deploy --stage production
- npx serverless deploy --stage development