import axois from 'axios';
import { parseResponse } from './common';

const renameIdField = ({Products: products}) => products.map(
  product => {
    const newDefinition = {GootenId: product.Id, ...product}
    // Object.defineProperty(product, 'GootenId', Object.getOwnPropertyDescriptor(product, 'Id'))
    delete newDefinition['Id']
    return newDefinition
  }
)

const parseResponseAndRenameIdField = input => renameIdField( parseResponse( input ) )

const _getProductTemplates = options => async sku => {
  const {url, recipeId} = options;
  const apiParams = {recipeId, Sku: sku}
  if (url && recipeId && sku){
    const { Options: productTemplates } = await axois
      .get(`${url}/producttemplates`, {params: apiParams, timeout: 10000 })
      .then(parseResponse)
    return productTemplates;
  } else {
    return []
  }
}

const _getProductVariants = options => async productId => {
  const {url, recipeId, countryCode, currencyCode } = options
  const apiParams = {recipeId, countryCode, currencyCode, productId}
  const getProductTemplates = _getProductTemplates(options)

  if (url, recipeId, countryCode, currencyCode, productId){
    const apiResults = [
      axois.get(`${url}\productvariants`, {params: apiParams}),
      axois.get(`${url}\productvariants`, {params: { ...apiParams, all:true }}),
    ].map(request => request.then(parseResponse))

    const [{ProductVariants: setupVariants}, {ProductVariants: allVariants}] = await Promise.all(apiResults)

    return allVariants
      ? await Promise.all(
          allVariants.map(
            async variant => {
              const templateData = Boolean(variant.HasTemplates) ? await getProductTemplates(variant.Sku).catch(e => {
                // console.log(e);
              }) : mull;

              return {
                ...variant,
                HasDefinitionInProductHub: Boolean(setupVariants && setupVariants.find(item => item.Sku === variant.Sku)),
                productTemplates: templateData ? templateData : [],
              };
            }
          )
        )
      : []
  } else {
    return []
  }
}


const getProducts = ({
  actions,
  store,
  cache,
  createNodeId,
  createContentDigest
}) => async options => {
  const { createNode } = actions
  const {url, recipeId, countryCode, currencyCode } = options
  const getProductVariants = _getProductVariants(options)

  const apiParams = {recipeId, countryCode, currencyCode};

  if (url, recipeId && countryCode && currencyCode){
    const apiResults = [
      // products currently set up the users in Gooten's Product Hub
      axois.get(`${url}\products`, { params: apiParams }),
      // all products avaliable to region
      axois.get(`${url}\products`, { params: { ...apiParams, all: true } } )
    ].map(request => request.then(parseResponseAndRenameIdField))

    const [setupProducts, allProducts] = await Promise.all(apiResults)
    allProducts.forEach(async product => {
      const nodeData = { ...product }
      // is the product setup by user in there productHub section of gooten website
      nodeData.HasDefinitionInProductHub = Boolean(setupProducts.find(readyProduct => readyProduct['GootenId'] === nodeData["GootenId"]))
      nodeData.ProductVariants = Boolean(nodeData.HasAvailableProductVariants) ? await getProductVariants(nodeData.GootenId) : []
      const nodeMeta = {
        id: createNodeId(`GootenProduct-${nodeData.GootenId}`),
        parent: null,
        children: [], // await getProductVariant(nodeData.GootenId),
        internal: {
          type: 'GootenProduct',
          mediaType: 'text/html',
          content: JSON.stringify(nodeData),
          contentDigest: createContentDigest(nodeData),
        }
      }
      //const node = Object.assign({}, nodeData, nodeMeta)
      createNode({...nodeData, ...nodeMeta})
    })
  }
}

export default getProducts;
