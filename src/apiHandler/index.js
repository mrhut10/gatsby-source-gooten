const axois = require('axios')
const { parseResponse } = require('./common')
const GetCountryCodes = require('./countryCodes').default
const getProducts = require('./products').default


const GetCurrencies = ({
  actions,
  store,
  cache,
  createNodeId,
  createContentDigest
}) => async options => {
  const { recipeId, url, currencyCode} = options
  const { createNode } = actions

  if (url, recipeId){
    const request = await axois.get(`${url}/currencies`, {params: {recipeId}})
    const response = parseResponse(request)
    const { Currencies: currencies } = response
      currencies.forEach(currency => {
      ''.toLowerCase
      const {Name, Code, Format} = currency
      const nodeData = {Name, Code, Format, Selected: currencyCode && currencyCode.toLowerCase() === Code.toLowerCase()}
        const nodeMeta = {
        id: createNodeId(`Gootencurrency-${Code}`),
          parent: null,
          children: [],
          internal: {
            type: 'GootenCurrency',
            mediaType: 'text/html',
            content : JSON.stringify(nodeData),
            contentDigest: createContentDigest(nodeData),
          },
        }
      createNode({...nodeData, ...nodeMeta})
    })
    if (!currencies.find(currency => currency.Code.toLowerCase() === currencyCode.toLowerCase())) console.warn(`currencyCode: ${currencyCode} doesn't appear to be a valid option please verify`)
  }
};

exports.default = (
  {
    actions,
    store,
    cache,
    createNodeId,
    createContentDigest
  },
  options
) => {
  if (options.url && options.recipeId){
    return ({
      currencies: GetCurrencies({ actions, store, cache, createNodeId, createContentDigest })(options),
      countryCodes: GetCountryCodes({ actions, store, cache, createNodeId, createContentDigest })(options),
      products: getProducts({ actions, store, cache, createNodeId, createContentDigest })(options),
    })
  }
}

exports.parseResponse = parseResponse
