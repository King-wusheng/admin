import homeController from './controllers/home'
import positionController from './controllers/position'

homeController.render()
positionController.render()


$('body').on('abc', () => {
  console.log('aaa')
})

setTimeout(() => {
  $('body').trigger('abc')
}, 2000)

var socket = io.connect('http://localhost:9002')

socket.on('connect', function () {
  socket.emit('msg', 'hello!')
  socket.on('title', (data) => {
    console.log(data)
  })
});