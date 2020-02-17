const parseResponse = response => {
  if (response.status === 200){
    return response.data
  } else {
    console.error(`\n unable to parse Response code:${response.status}\n full server reply`, response)
  }
}

exports.parseResponse = parseResponse;


exports.spy = input => {
  console.info('spy typeof',typeof input, input)
  return input
}