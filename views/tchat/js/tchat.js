let socket = io()
let input = document.getElementById('m')
let form = document.querySelector('form')

form.addEventListener('submit', event => {
  event.preventDefault() // prevents page reloading
  socket.emit('chat message', input.value)
  input.value = ''
  return false
})

const renderMsg = msg => {
  let msgs = document.getElementById('messages')
  let li = document.createElement('li')
  li.innerText = msg
  msgs.appendChild(li)
}

socket.on('chat message', msg => {
  renderMsg(msg)
})
