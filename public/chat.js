const socket = io()

const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get('username');
const room = urlSearch.get('select_room');

const userNameDiv = document.getElementById('username');
userNameDiv.innerHTML = `Olá ${username} - Você está na sala ${room}`;

socket.emit("select_room", { username, room }, (response) => {
  response.forEach(data => createMessage(data));
})

document
  .getElementById('input_message')
  .addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      const message = e.target.value;
      const data = { message, username, room };
      socket.emit('message', data);
      e.target.value = '';
    }
  })

socket.on('message', (data) => {
  createMessage(data);
});

function createMessage(data) {
  const { text, username, createdAt } = data;
  const messageElement = document.getElementById('messages');
  messageElement.innerHTML += `
  <div class="new_message">
    <label class="form-label">
      <strong> ${username}: </strong> <span> ${text} - ${dayjs(createdAt).format("DD/MM hh:mm")} </span>
    </label>
  </div>
  `;
}