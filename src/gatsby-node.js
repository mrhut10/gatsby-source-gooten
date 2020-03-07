import apiHandler from './apiHandler'; // const apiHandler = require('./apiHandler')

const defaultOptions = {
  countryCode: 'US',
  currencyCode: 'USD',
  url: 'https://api.print.io/api/v/5/source/api/',
};

const validationMessage = (level, message) => [level, message]

const validateOptions = ({
  recipeId,
  countryCode,
  currencyCode,
}) => {
  let messages = [];
  if (!recipeId) messages.push(validationMessage('error', 'recipeId wasn\'nt defined - plugin wont run'))
  if (!countryCode) messages.push(validationMessage('warn', `countryCode wasn\'nt defined - will default to ${defaultOptions.countryCode}`))
  if (!currencyCode) messages.push(validationMessage('warn', `currencyCode wasn\'nt defined - will default to ${defaultOptions.currencyCode}`))
  return messages;
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDef = `
    type GootenCountryCodes implements Node {
      Name: String!
      Code: String!
      Selected: Boolean!
    }
    type GootenCurrency implements Node {
      Name: String
      Code: String!
      Format: String!
    }
    type GootenPriceInfo implements Node {
      Price: Float!
      CurrencyCode: String!
      FormattedPrice: String!
      CurrencyFormat: String!
      CurrencyDigits: Int!
    }
    type GootenProductImages implements Node {
      Url: String!
      Index: Int!
      Id: Int!
      ImageTypes: [String!]!
    }
    type GootenProductVariantOption implements Node {
      OptionId: String!
      ValueId: String!
      Name: String!
      Value: String!
      ImageUrl: String!
      SortValue: String!
    }
    type GootenProductVariant implements Node {
      Options: [GootenProductVariantOption!]!
      PriceInfo: GootenPriceInfo
      Sku: String!
      MaxImages: Int!
      HasTemplates: Boolean!
    }
    type GootenProductCategories implements Node {
      Id: Int!
      Name: String!
    }
    type GootenProduct implements Node {
      GootenId: Int!
      UId: String!
      Name: String!
      ShortDescription: String!
      HasAvailableProductVariants: Boolean!
      HasProductTemplates: Boolean!
      IsFeatured: Boolean!
      IsComingSoon: Boolean!
      MaxZoom: Int!
      RetailPrice: GootenPriceInfo!
      Info: JSON
      Images: [GootenProductImages!]!
      PriceInfo: GootenPriceInfo!
      Categories: [GootenProductCategories]!
      HasDefinitionInProductHub: Boolean!
      ProductVariants: [GootenProductVariant!]
    }
  `;
  createTypes(typeDef);
};

exports.sourceNodes = async (
  {
    actions,
    store,
    cache,
    createNodeId,
    createContentDigest,
    getNodesByType,
  },
  options,
) => {

  const optionValidationMessages = validateOptions(options)
  const validationErrors = (optionValidationMessages || []).filter(item => item[0] === 'error')
  const validationWarnnings = (optionValidationMessages || []).filter(item => item[0] === 'warn')
  const validationMessageReport = ([level, message]) => message

  if (validationErrors.length > 0) console.error(
    `Plugin Error - See below message${
      validationErrors.length > 1 ? 's' : ''
    }\n${
      validationErrors.map(validationMessageReport).join('\n')
    }`)
  if (validationWarnnings.length > 0) console.warn(
    `Plugin Warmings - See below message${
      validationWarnnings.length > 1 ? 's' : ''
    }\n${
      validationWarnnings.map(validationMessageReport).join('\n')
    }`)
  
  const params = {...defaultOptions, ...options}
  if (!validationErrors.length > 0){
    const api = apiHandler({actions, store, cache, createNodeId, createContentDigest, getNodesByType}, params)
    await Promise.all(api ? Object.keys(api).map(key => api[key]) : [])
    return;
  }
}