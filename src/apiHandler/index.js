import axois from 'axios'

const parseResponse = response => {
  if (response.status === 200){
    return JSON.parse(response.data);
  } else {
    console.warm(`\n unable to parse Response code:${response.status}\n full server reply`, response)
  }
}

const spy = input => {
  console.log('spy', input)
  return input
};

const GetCurrencies = ({
  actions,
  store,
  cache,
  createNodeId,
}) => async options => {
  const { receiptId } = options
  await (
    axois.get(`https://api.print.io/api/v/5/source/api/currencies`, {params: {recipeId}})
    .then(parseResponse)
    .then(response => {
      console.log(response)
    })

    /*
        const createCurrencyNode = params => datum => {
          const {Name: name, Code: code, Format: format} = datum
          return { name, code, format, internal: {type: 'GootenCurrencies'}}
        }
     */
  )
}

export const ApiCurrencies = require('./ApiCurrencies')

export default (
  {
    actions,
    store,
    cache,
    createNodeId,
  },
  options
) => {
  if (!options.receiptId){
    console.warm('gooten-source-plugin didn\'t run as receiptId not configured') 
  } else {
    return ({

    })
  }
}