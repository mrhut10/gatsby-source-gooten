export const parseResponse = response => {
  if (response.status === 200){
    return response.data
  } else {
    console.error(`\n unable to parse Response code:${response.status}\n full server reply`, response)
  }
}
