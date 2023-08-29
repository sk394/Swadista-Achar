[Demo Video]![Animation](https://github.com/sk394/Swadista-Achar/assets/99689849/eed9b5c7-6b93-49c9-8670-8b39df9e08e6)



# Welcome to Swadista Achar!

This is the md file for the idea project called **Swadista Achar** which is built using React, libraries and node js using Express framework.

# Getting Started with Create React App for EcommerceApp

## Available Scripts

In the project directory, you can run:

# Backend Setup
### `npm init`
`Make the entry point as backend/server.js`

### `npm i express mongoose dotenv nodemon`
`Install the dependencies`

### `Add these in the package.json`
`"start": "node backend/server.js",`
`"dev": "nodemon backend/server.js",`

## for the post method in Postman
`http://localhost:5000/api/v1/product/new`
-> Body -> form-data -> key: name, value: "name of the product"

for deleting the product, use .deleteOne() method for the newer versions

## Authentication dependencies parser and validator
`npm i bcryptjs jsonwebtoken validator nodemailer cookie-parser body-parser` 

# Frontend Setup
1. cd .\frontend\
2. npx create-react-app . (npx is used to create the react app in the current directory)
3. npm start ( to start the react app)
4. npm i axios react-alert react-alert-template-basic react-helmet react-redux redux redux-thunk redux-devtools-extension react-router-dom overlay-navbar --legacy-peer-deps 
    Use the --legacy-peer-deps flag when running npm install to allow npm to use an older mechanism for handling peer dependencies. This flag can help resolve dependency conflicts in some cases.

