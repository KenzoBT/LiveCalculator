const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const path = require('path')

let port = process.env.PORT || 3000
let counter = 0
let cells = []

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  //res.send('<h1>Hello, World!</h1>')
  res.sendFile(__dirname + '/public/calculator.html')
})

io.on('connection', (socket) => {

  console.log('a user connected')
  socket.emit('refresh cells', cells)

  socket.on('add exp', (exp) => {
    //console.log('Counter++ request received')
    cells.unshift(socket.request.connection.remoteAddress + "\t" + exp)
    if(cells.length > 5){
      cells.pop()
    }
    //console.log(cells)
    io.emit('refresh cells', cells)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

})

server.listen(port, () => {
  console.log('listening on *:' + port)
})
