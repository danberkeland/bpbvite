/* eslint-disable */
// WARNING: DO NOT EDIT. This file is automatically generated by AWS Amplify. It will be overwritten.

const awsmobile = {
    "aws_project_region": "us-east-2",
    "aws_cloud_logic_custom": [
        {
            "name": "bpbGateway",
            "endpoint": "https://sicmwf1c2k.execute-api.us-east-2.amazonaws.com/devtwo",
            "region": "us-east-2"
        }
    ],
    "aws_appsync_graphqlEndpoint": "https://w62uxpwwbvglvei22czphwsgoq.appsync-api.us-east-2.amazonaws.com/graphql",
    "aws_appsync_region": "us-east-2",
    "aws_appsync_authenticationType": "API_KEY",
    "aws_appsync_apiKey": "da2-665hu7c4pjflbc3adkqe4hmqxm",
    "aws_cognito_identity_pool_id": "us-east-2:3f113741-f772-4cf5-bd9c-054ff5600f69",
    "aws_cognito_region": "us-east-2",
    "aws_user_pools_id": "us-east-2_eE0F2fVdp",
    "aws_user_pools_web_client_id": "4tqvvc196lmq29m22hnildhp84",
    "oauth": {
        "domain": "bpbadmin23adeaa4d-3adeaa4d-devtwo.auth.us-east-2.amazoncognito.com",
        "scope": [
            "phone",
            "email",
            "openid",
            "profile",
            "aws.cognito.signin.user.admin"
        ],
        "redirectSignIn": "https://www.bpborder.com/",
        "redirectSignOut": "https://www.bpborder.com/",
        "responseType": "code"
    },
    "federationTarget": "COGNITO_USER_POOLS",
    "aws_cognito_username_attributes": [],
    "aws_cognito_social_providers": [
        "FACEBOOK",
        "GOOGLE"
    ],
    "aws_cognito_signup_attributes": [
        "EMAIL"
    ],
    "aws_cognito_mfa_configuration": "OFF",
    "aws_cognito_mfa_types": [
        "SMS"
    ],
    "aws_cognito_password_protection_settings": {
        "passwordPolicyMinLength": 8,
        "passwordPolicyCharacters": []
    },
    "aws_cognito_verification_mechanisms": [
        "EMAIL"
    ]
};


export default awsmobile;
