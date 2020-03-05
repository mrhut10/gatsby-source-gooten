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


/*
  function retryWithGeometryInterval
  will Make a certain number of attempts to get a value from function
  where time between each attempt increases by the geometic sequence
    t = ratio ** i    where t is the timeInterval and i is the index of attempts
  and where the total estimated elasp time follows the sum of geometric series
    T = (1 - ratio ** n)/(1-ratio)
      = ratio**n - 1
*/
export const retryWithGeometryInterval = async (fn, ratio, attempts) => await Array(attempts).reduce(async (accP, next, i) => {
  const acc = await accP;
  const value = acc ? acc : fn();
  if (!value) await setTimeoutPromise(1000 * ratio**i);
  return value;
}, null)
