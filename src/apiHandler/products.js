const axois = require('axios')

const { parseResponse, spy } = require('./common')

const renameIdField = ({Products: products}) => products.map(
  product => {
    const newDefinition = {GootenId: product.Id, ...product}
    // Object.defineProperty(product, 'GootenId', Object.getOwnPropertyDescriptor(product, 'Id'))
    delete newDefinition['Id']
    return newDefinition
  }
)

const parseResponseAndRenameIdField = input => renameIdField( parseResponse( input ) )


const getProducts = ({
  actions,
  store,
  cache,
  createNodeId,
  createContentDigest
}) => async options => {
  const { createNode } = actions
  const {url, recipeId, countryCode, currencyCode } = options

  const apiParams = {recipeId, countryCode, currencyCode};
  const apiResults = [
    // products currently set up the users in Gooten's Product Hub
    axois.get(`${url}\products`, {params: apiParams }),
    // all products avaliable to region
    axois.get(`${url}\products`, {params: { ...apiParams, all: true }}),
  ].map(requestPromise => requestPromise.then(parseResponseAndRenameIdField))
  
  const [setupProducts, allProducts] = await Promise.all(apiResults)

  allProducts.forEach(product => {
    const nodeData = { ...product }
    // is the product setup by user in there productHub section of gooten website
    nodeData.HasDefinitionInProductHub = Boolean(setupProducts.find(readyProduct => readyProduct['GootenId'] === nodeData["GootenId"]))
    
    const nodeMeta = {
      id: createNodeId(`GootenProduct-${nodeData.GootenId}`),
      parent: null,
      children: [],
      internal: {
        type: 'GootenProduct',
        mediaType: 'text/html',
        content: JSON.stringify(nodeData),
        contentDigest: createContentDigest(nodeData),
      }
    }
    console.log(nodeData.GootenId)
    const node = Object.assign({}, nodeData, nodeMeta)
    createNode(node)
  })
}

exports.default = getProducts
