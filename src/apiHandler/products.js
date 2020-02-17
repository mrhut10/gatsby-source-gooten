const axois = require('axios')

const { parseResponse, spy } = require('./common')

const renameIdField = ({Products: products}) => products.map(
  product => {
    const newDefinition = {GootenId: product.Id, ...product}
    //Object.defineProperty(product, 'GootenId', Object.getOwnPropertyDescriptor(product, 'Id'))
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

  const [allProducts, setupProducts] = [
    await axois.get(`${url}\products`, {params: {recipeId, countryCode, currencyCode, all: true }}),
    await axois.get(`${url}\products`, {params: {recipeId, countryCode, currencyCode }}),
  ].map(parseResponseAndRenameIdField)

  allProducts.forEach(product => {
    const nodeData = { ...product }
    // is the product setup by user in there productHub section of gooten website
    nodeData.HasDefinitionInProductHub = Boolean(setupProducts.find(readyProduct => readyProduct['GootenId'] === nodeData["GootenId"]))
    const id = createNodeId(`GootenProduct-${product.gootenId}`)
    const nodeMeta = {
      id,
      parent: null,
      children: [],
      internal: {
        type: 'GootenProduct',
        mediaType: 'text/html',
        // content: JSON.stringify(nodeData),
        contentDigest: createContentDigest(nodeData),
      }
    }
    const node = Object.assign({}, nodeData, nodeMeta)
    createNode(node)
  })
}

exports.default = getProducts
