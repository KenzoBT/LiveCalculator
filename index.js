// Live calculator application
// Uses express and socket.io to serve HTML and handle client/server interaction

const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const path = require('path')

// Set port to environment variable or 3000 for local testing
let port = process.env.PORT || 3000
// Arrays to hold operations and ip addresses of clients
let cells = []
let ips = []

// Serve the static HTML located in /public when root requested
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/calculator.html')
})

// When connection is established
io.on('connection', (socket) => {
  console.log('a user connected')
  // Feed operation/IP data to DOM elements
  socket.emit('refresh cells', cells)
  socket.emit('refresh ip', ips)

  // On event of calculation by client (exp: equation)
  socket.on('add exp', (exp) => {
    // Get client IP
    let ip = socket.request.connection.remoteAddress.split(':')[3]
    if(typeof ip == "undefined" ){
      ip = "Unknown IP"
    }
    // Add IP + Equation to corresponding queues
    ips.unshift(ip)
    cells.unshift(exp)
    // If queue exceeds size, remove one element
    if(cells.length > 10){
      cells.pop()
      ips.pop()
    }
    // Broadcast event to clients to refresh their tables with new data
    io.emit('refresh cells', cells)
    io.emit('refresh ip', ips)
  })

  // On event of disconnection: log
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

// Start listening on specified port
server.listen(port, () => {
  console.log('listening on *:' + port)
})
