fetch('/data')
  .then(response => response.json())
  .then(data => { document.querySelector('#app').innerText = data.message })
