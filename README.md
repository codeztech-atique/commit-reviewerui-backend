# commit-reviewerui-backend
This is commit reviewer UI, Backend. 

- Install Application <br />
  npm install

- Start Application <br />
  npm start

- NodeJS Version <br />
  v21.7.1

# API Gateway flush cache
aws apigateway flush-stage-cache --rest-api-id 67864iax0g --stage-name production

# Prod Endpoint -
https://67864iax0g.execute-api.us-west-1.amazonaws.com/production/api

# Deployment - 

- npx serverless deploy --stage production
- npx serverless deploy --stage development