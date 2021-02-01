define({ "api": [
  {
    "type": "post",
    "url": "/v1/auth/login",
    "title": "User Login",
    "name": "userLogin",
    "group": "Auth",
    "version": "1.0.0",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-api-key",
            "description": "<p>API key to access enter the server</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"email\" : \"sankarbiswas07@gmail.com\",\n    \"password\" : \"thisIsNotPass\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "name",
            "description": "<p>description</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"statusCode\": \"10000\",\n  \"message\": \"Signup Successful\",\n  \"data\": {\n      \"user\": {\n          \"_id\": \"6008176562ec703afa55c874\",\n          \"name\": {\n              \"first\": \"sankar\",\n              \"last\": \"prasad biswas\"\n          },\n          \"email\": \"sankarbiswas07+3@gmail.com\",\n          \"roles\": [\n              {\n                  \"_id\": \"600802c13af8036e2be5d13c\",\n                  \"code\": \"USER\"\n              }\n          ]\n      },\n      \"tokens\": {\n          \"accessToken\": \"jwt.access.token\",\n          \"refreshToken\": \"jwt.refresh.token\"\n      }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/rest/v1/access/login.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/v1/auth/refresh",
    "title": "User refresh token",
    "name": "userRefreshToken",
    "group": "Auth",
    "version": "1.0.0",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-api-key",
            "description": "<p>API key to access enter the server</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>JWT access token</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-user-id",
            "description": "<p>UserId</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"refreshToken\" : \"jwt.refresh.token\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "name",
            "description": "<p>description</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"statusCode\": \"10000\",\n  \"message\": \"Token Issued\",\n  \"data\": {\n      \"tokens\": {\n          \"accessToken\": \"jwt.access.token\",\n          \"refreshToken\": \"jwt.refresh.token\"\n      }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/rest/v1/access/refreshToken.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/v1/auth/signup",
    "title": "User registration",
    "name": "userRegistration",
    "group": "Auth",
    "version": "1.0.0",
    "permission": [
      {
        "name": "Public"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-api-key",
            "description": "<p>API key to access enter the server</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "phone",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone.countryCode",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "phone.number",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "name",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name.first",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name.last",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "password",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"email\" : \"sankarbiswas07@gmail.com\",\n    \"phone\": {\n              \"countryCode\": \"91\",\n              \"number\": \"8961766682\"\n          },\n    \"name\"  :{\n         \"first\":\"sankar\",\n         \"last\" :\"prasad biswas\"\n     }\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "name",
            "description": "<p>description</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"error\" : false,\n     tokens: {\n            accessToken: \"encryptionDetails.payload.signature\",\n            refreshToken: \"encryptionDetails.payload.signature\"\n          }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/rest/v1/access/signup.js",
    "groupTitle": "Auth"
  }
] });