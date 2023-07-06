# SECURE API (SAPI) PASSWORD MANAGER

SAPI is a secure password manager API that allows users to securely store and manage their passwords. This api is provided with high security measures to prevent attacks, penetrations, and injection attacks.


## Features

- User Registration and Authentication
- Password Storage and Encryption
- Account Recovery
- Password Autogeneration
- Password Sharing
- Logging and Monitoring


## Installation Guide

 
### Tools Required

- MySQL database
- Nodejs
- Redis
- Windows (Ubuntu WSL), Mac, Linux OS

### Tools Installation

#### MySQL Installation

 You can skip this process if you have mysql installed on your local server
  Navigate to the root directory and run the script mysql-install.sh
  ```
    ./mysql-install.sh
  ```

#### Redis Installation

 You can skip this process if you have redis installed on your local server
  Navigate to the root directory and run the script redis-install.sh
  ```
    ./redis-install.sh
  ```

#### Nodejs Installation

 You can skip this process if you have nodejs installed on your local server
  Navigate to the root directory and run the script nodejs-install.sh. This might take a couple of minutes depending on your network strength.
  ```
    ./nodejs-install.sh
  ```

## Server Setup

 Carefully follow the procedure below to setup the server.
  - Install the dependencies for the project using the following command
  ```
    npm install 
  ```

  - Create a .env file then copy and modify the configuration below
    ```
      <!-- # env variables for server -->
      PORT=3002

      <!-- # auth -->
      SECRET_KEY=random-text-here

      <!-- # env variables for database connection -->
      SAPI_DB=sapi_db
      SAPI_USER=sapi
      SAPI_PORT=3306
      SAPI_PWD=sapi_v1.0

      <!-- # treblle credentials -->
      TREBLLE_API_KEY=your-treblle-api-key
      TREBLLE_PROJECT_ID=your-treblle-project-id
    ```
  - To get a trebble credentials, go to [trebble](https://www.treblle.com)

  - Start the server 

  ```
    ./start_database.sh
  ```

  - Congratullations! 🎉🌟 The server should be running successfully on your local machine now 😁

## Endpoints

  - ##### Home
  
    Home endpoint
    Method: GET
    Url: '/'

  - ##### Signup

    Signup endpoint
    Method: POST
    Params: username, email, password, securityQuestion ('What is your favourite city?')
    Url: '/signup'
    
  - ##### Signin

    Signin endpoint
    Method: POST
    Params: email, password
    Url: '/signin'

  - ##### Change Password

    Change password endpoint
    Method: POST
    Params: email, password, newPassword, securityQuestion ('What is your favourite city?')
    Url: '/change-password'

  - ##### Forget Password

    Forget password endpoint
    Method: POST
    Params: email, newPassword, confirmPassword, securityQuestion ('What is your favourite city?')
    Url: '/forget-password'

  - ##### API Key

    API key endpoint
    Method: GET
    Url: '/api-key/generate'

  - ##### Testlimiter

    Testlimiter endpoint
    Method: GET
    Url: '/testlimiter'

   #### ONGOING

  - ##### Generate Password

  - ##### Create Password

  - ##### Delete Password

  - ##### Update Password

  - ##### GET all Passwords

 ## API Documentation
 
  ### Overview

  This is a JSON based API with total of 12 endpoints

  To start making requests you should configure a BASE URL which will be used on all the API endpoints. For this project the base url is:

  Base URL
  `https://localhost:3002/api/v1`

  ### Authentication

  Great news! This API uses authentication and does so in a standardized way. This means you shouldn't have problems with adding authentication to your requests and your client library will probably support it out of the box.

  To authenticate the requests you should setup the following:

  | Type | Value | Location |
  | --- |--- | --- |
  | Bearer | Token | headers |

  ### Examples: Request and Response

  GET
  /

  Response

    { string }


  POST 
  signup
    
  Request

    2023-07-05 11:16:00
    {
      username: "string",
      email: "string",
      password: "string",
      securityQuestion: "string"
    }

  Response

    200

    2023-07-05 11:16:00
    {
    id: "string",
    username: "string",
    email: "string"
    }


  GET
  api-key/generate

  Response

    {
      username: "string",
      email: "string",
      apiKey: "string"
    }


  POST
  change-password

  Request

    {
      newPassword: "string",
      email: "string",
      password: "string",
      securityQuestion: "string"
    }

  Response

    {
      info: "string"
    }


  POST
  signin

  Request

    {
      email: "string",
      password: "string"
    }

  Response

    {
      username: "string",
      email: "string",
      id: "string",
      apiKey: "string"
    }


  POST
  signup

  Request

    2023-07-05 10:08:40
    {
      username: "string",
      email: "string",
      password: "string",
      securityQuestion: "string"
    }

  Response

    200

    2023-07-05 10:08:40
    {
      id: "string",
      username: "string",
      email: "string"
    }



  GET
  testlimiter

  Request
  
    {
      email: "string",
      password: "string",
      api_key: "string"
    }

  Response

    {
      username: "string",
      email: "string",
      id: "string",
      apiKey: "string"
    }
