var request = (url, data, json = false) => {
  let fo = null
  if(data) {
    if(data.length > 0) fo = {method: "POST", body: serverQuery(data)}
  }
  
  document.querySelector('body').classList.add('load-fetch')

  const f = fetch(url, fo)
  .then((res) => {
    if(json) return res.json()
    else return res.text()
  })
  .then((res) => {
    document.querySelector('body').classList.remove('load-fetch')
    return res
  })
  .catch((error) => {
    console.error(error)
  })
  return f

  function serverQuery(obj) {
    const form = new FormData();
    Object.entries(obj).forEach(entry => {
      const [key, value] = entry;
      form.append(key, value)
    })
    return form
  }
}