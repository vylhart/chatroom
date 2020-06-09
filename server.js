const express = require('express')
const app     = express()
const path    = require('path')
const PORT    = process.env.PORT || 5000
const http    = require('http')
const server  = http.Server(app)
const socket  = require('socket.io')(server)

app
    .use(express.static(path.join(__dirname, 'client')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res)=> res.render("index"))
    
server.listen(PORT, ()=>console.log(`Listening on ${PORT}`))

socket.on('connection',(soc)=>{
    console.log('Client connected : ' + soc.id);
    soc
        .on('reqCall', ()=>{
            console.log('Requesting : '+ soc.id)            
            soc.broadcast.emit('reqCall', soc.id)
        })
        .on('resCall', (id)=>{
            console.log(soc.id +': Responsing: to' + id);
            soc.to(id).emit('resCall', soc.id)
        })
        .on('offer', (id, offer)=>{
            console.log(soc.id +': offering: to' + id);
            soc.to(id).emit('offer', soc.id, offer)
        })
        .on('answer', (id, answer)=>{
            console.log(soc.id +': answering: to' + id);
            soc.to(id).emit('answer', soc.id, answer)
        })
        .on('ice', (id, ice)=>{
            console.log(soc.id +': icing: to' + id);
            soc.to(id).emit('ice', soc.id, ice)
        })
        
        

})