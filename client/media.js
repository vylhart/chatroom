function reqCall(){
    socket.emit('reqCall')
}

socket.on('reqCall',(id)=>{
    console.log('Receiving : '+ id)
    receive.removeAttribute("disabled")
    receive.setAttribute("value", "Receiving Call")
    receive.addEventListener('click', ()=>{
        receive.setAttribute("value", "Connecting")
        socket.emit('resCall', id)
        makePeer(id)
    })
})

socket.on('resCall', (id)=>{
    if(peer[id]==null){
        console.log('Connected : ' + id)
        makePeerLocal(id)
    }
})


socket.on('answer', (id, answer)=>{
    if(peer[id]!=null){
        peer[id].setRemoteDescription(new RTCSessionDescription(answer))
    }
})


socket.on('offer',async function(id, offer){
    if(peer[id]!=null){
        await peer[id].setRemoteDescription(new RTCSessionDescription(offer))
        const answer =await peer[id].createAnswer()
        await peer[id].setLocalDescription(answer)
        socket.emit('answer', id, answer)        
    }
})

socket.on('ice', (id, ice)=>{
        console.log('got ice');
        peer[id].addIceCandidate(new RTCIceCandidate(ice))
})


function makePeer(id){
    peer[id] = new RTCPeerConnection(config)
    peer[id].addStream(localStream)
    peer[id].ontrack = getRemoteStream
    peer[id].onconnectionstatechange = (event)=>{
        if(peer[id].connectionstate ==='connected'){
            conn = true
            console.log('Peer connected: '+ id)  
        }
        access.setAttribute('hidden', true)
        call.setAttribute('hidden', true)
        receive.setAttribute('value', 'Connected')
    }
}

async function makePeerLocal(id){
    makePeer(id)
    const offer =await peer[id].createOffer()
    await peer[id].setLocalDescription(offer)
    socket.emit('offer', id, offer)

    peer[id].onicecandidate =  (event)=>{
        if(event.candidate){
            socket.emit('ice', id, event.candidate)
        }
    }
}

function getRemoteStream(event){
    console.log('track');
    var remote = document.createElement('video')
    remote.setAttribute('autoplay', true)
    remote.srcObject = event.streams[0]
    div.appendChild(remote)
}

function getLocalMedia(){
    const constraints = {
        'video': true,
        'audio': false
    }
    navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
        console.log('Got MediaStream:', stream)
        local.srcObject = stream
        localStream = stream
    })
    .catch(showError)
}

function showError(e){
    console.error('Error::', error)
}

