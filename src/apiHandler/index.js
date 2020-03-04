import axois from 'axios'
import { parseResponse } from './common';
import GetCurrencies from './currencies'
import GetCountryCodes from './countryCodes'; 
import getProducts from './products';


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
      // list of supported currencies from api
      currencies: GetCurrencies({ actions, store, cache, createNodeId, createContentDigest })(options),
      // list of iso country codes from file
      countryCodes: GetCountryCodes({ actions, store, cache, createNodeId, createContentDigest })(options),
      // list of products from api
      // sublist of product variants from api
      // sublist of product templates from api
      products: getProducts({ actions, store, cache, createNodeId, createContentDigest })(options),
    })
  }
}
