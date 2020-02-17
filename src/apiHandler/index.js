const axois = require('axios')
const GetCountryCodes = require('./countryCodes').default

const parseResponse = response => {
  if (response.status === 200){
    return response.data
  } else {
    console.warm(`\n unable to parse Response code:${response.status}\n full server reply`, response)
  }
}

// const GetCurrencies = require('./currencies').default

const GetCurrencies = ({
  actions,
  store,
  cache,
  createNodeId,
  createContentDigest
}) => async options => {
  const { recipeId } = options
  const { createNode } = actions

  await (
    axois.get(`https://api.print.io/api/v/5/source/api/currencies`, {params: {recipeId}})
    .then(parseResponse)
    .then(data => {
      const { Currencies: currencies } = data

      currencies.forEach(currency => {
        const {Name: name, Code: code, Format: format} = currency
        const id = createNodeId(`Gootencurrency-${code}`)
        const nodeData = {name, code, format}
        const nodeMeta = {
          id,
          parent: null,
          children: [],
          internal: {
            type: 'GootenCurrency',
            mediaType: 'text/html',
            content : JSON.stringify(nodeData),
            contentDigest: createContentDigest(nodeData),
          },
        }
        const node = Object.assign({}, nodeData, nodeMeta)
        createNode(node)
      })
    })
    .catch(response => console.error(response))
  )
};

const spy = input => {
  console.warn('spy', input)
  return input
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
  if (!options.recipeId){
    console.warn('gooten-source-plugin didn\'t run as recipeId not configured')
  } else if (!options.countryCode){
    console.warn('gooten-source-plugin didn\'t run as countryCode not configured')
  } else {
    return ({
      currencies: GetCurrencies({ actions, store, cache, createNodeId, createContentDigest })(options),
      countryCodes: GetCountryCodes({ actions, store, cache, createNodeId, createContentDigest })(options),
    })
  }
}

exports.parseResponse = parseResponse
