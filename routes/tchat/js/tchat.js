// $(function () {
//     var socket = io();
//     $('form').submit(function(e) {
//       e.preventDefault(); // prevents page reloading
//       socket.emit('chat message', $('#m').val());
//       $('#m').val('');
//       return false;
//     });
//   });
let socket = io()
let input = document.getElementById('m')
let form = document.querySelector('form')

form.addEventListener('submit', event => {
  event.preventDefault() // prevents page reloading
  socket.emit('chat message', input.val())
  input.val('')
  return false
})
