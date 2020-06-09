const call      = document.getElementById('call')
const receive   = document.getElementById('receive')
const access    = document.getElementById('access')
const local     = document.getElementById('local')
const div       = document.getElementById('videos')
var localStream = null
var peer        = []
var conn        = false

const config    = {
    'iceServers': [
        {'urls': 'stun:stun.stunprotocol.org:3478'},
        {'urls': 'stun:stun.l.google.com:19302'},
    ]
}

access.addEventListener('click', ()=>{
    getLocalMedia()
    if(localStream){
        call.removeAttribute('disabled')
        access.setAttribute('disabled')
    }
})

call.addEventListener('click', ()=>{
    call.setAttribute('value', 'Calling...')
    reqCall()
})

setInterval(()=>{
    if(conn){
        reqCall()
    }
}, 5000)