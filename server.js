const express = require('express')
const app     = express()
const path    = require('path')
const PORT    = process.env.PORT || 5000

app
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res)=> res.render(index))
    .listen(PORT, ()=>console.log('Listening...'))