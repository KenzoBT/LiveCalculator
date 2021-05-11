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
let ips = []

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  //res.send('<h1>Hello, World!</h1>')
  res.sendFile(__dirname + '/public/calculator.html')
})

io.on('connection', (socket) => {

  console.log('a user connected')
  socket.emit('refresh cells', cells)
  socket.emit('refresh ip', ips)

  socket.on('add exp', (exp) => {
    //console.log('Counter++ request received')
    let ip = socket.request.connection.remoteAddress.split(':')[3]
    ips.unshift(ip)
    cells.unshift(exp)
    if(cells.length > 5){
      cells.pop()
      ips.pop()
    }
    //console.log(cells)
    console.log(ips)
    io.emit('refresh cells', cells)
    io.emit('refresh ip', ips)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

})

server.listen(port, () => {
  console.log('listening on *:' + port)
})
