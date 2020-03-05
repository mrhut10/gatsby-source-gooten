export const parseResponse = response => {
  if (response.status === 200){
    return response.data
  } else {
    console.error(`\n unable to parse Response code:${response.status}\n full server reply`, response)
  }
}

export const setTimeoutPromise = (time, fn) => new Promise((resolve, reject) => {
  setTimeout(
    () => {
      resolve('sucessfully waited')
    },
    time
  );
})

