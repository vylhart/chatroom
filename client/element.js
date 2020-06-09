const call    = document.getElementById('call')
const receive = document.getElementById('receive')
const join    = document.getElementById('join')
const local   = document.getElementById('local')
const remote1 = document.getElementById('remote1')
const remote2 = document.getElementById('remote2')
var localStream = null
call.addEventListener('click', ()=>{
    console.log('Calling....')
    getLocalMedia()
    reqCall()
})