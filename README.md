# Gatsby-Source-Gooten

Purpose: Source plugin to pull data out from [www.gooten.com](https://www.gooten.com)
Stage: Barebones - first plugin I've made - would love feedback, suggestions and help.

# Current Progress
Currently plugin will provide the following data to gatsbys graphQL data
- All Currencies Supported by Gooten
- Show all ISO 2 digit CountryCodes
- Get all Products ( filtered by your region's availability )
  - each products variants in your selected currencies cost pricing
  - each product templates ( describes to your UI how to generate a realistic product preview )

## Install
`npm install --save gatsby-source-filesystem`

## How to use


```javascript
// In your gatsby-config.js
module.exports = {
  const result = require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
  })
  plugins: [
    {
      resolve: 'gatsby-source-gooten',
      options: {
        // recipeId is required - once you've a gooten account and logined in you can get from https://www.gooten.com/admin#/settings/api  
        recipeId: process.env.GOOTEN_RECIPEID,
        /*
          countryCode, - optional - defaults to "US"
            NOTE: a list of countryCodes (ISO 3166-1 alpha-2) are injected into data model for you to pick one.
        */
        countryCode: process.env.GOOTEN_COUNTRYCODE,
        /*
          currencyCode - optional - defaults to "USD"
            NOTE: a list of supported currencies are injected into data model for you to pick one.
        */
        currencyCode: process.env.GOOTEN_CURRENCY
      }
    }
  ]
}
```


# Further Detail
would love to provide a full tutorial to integrate into a site, with a shopping cart provider (maybe with snipcart or stripe checkout )
I will endeavour to make one when I can however feel free to beat me too it and I'll promote it here.


# Notes & Seeking Advise
I suspect it would be prudent to avoid accessing cost pricing on a page or component level as could be accessed by user in page source.
instead we will need to come up with a best practise.
likely this will need to be one of the following
* a serverless function which only publishes your own pricing (for example [netlify functions](https://functions.netlify.com/))
* a config file which has your own pricing which we could override pricing in data model to make safe to access in UI


Stay tuned
