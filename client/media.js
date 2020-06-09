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
    .catch((e)=>showError(e))
}

const config = {
    'iceServers': [
        {'urls': 'stun:stun.stunprotocol.org:3478'},
        {'urls': 'stun:stun.l.google.com:19302'},
    ]
}

function showError(e){
    console.error('Error::', error)
}

var peer = []

function reqCall(){
    socket.emit('reqCall')
}

socket.on('resCall', (id)=>{
    console.log('Connected : ' + id)
    makePeerLocal(id)
})

socket.on('reqCall', (id)=>{
    console.log('Receiving : '+ id)
    receive.removeAttribute("disabled")
    receive.setAttribute("value", "Receiving")
    receive.addEventListener('click', ()=>{
        receive.setAttribute("value", "Connecting")
        socket.emit('resCall', id)
        makePeerRemote(id)
        getLocalMedia()
    })
})


socket.on('answer', (id, answer)=>{
    if(peer[id]!=null){
        const remoteDesc = new RTCSessionDescription(JSON.parse(answer))
        peer[id].setRemoteDescription(remoteDesc)
    }
})


async function makePeerLocal(id){
    peer[id] = new RTCPeerConnection(config)
    peer[id].ontrack = (event)=>{
        remote1.srcObject = event.streams[0]
    }
    peer[id].addStream(localStream)
    const offer =await peer[id].createOffer()
    await peer[id].setLocalDescription(offer)
    socket.emit('offer', id, JSON.stringify(offer))

    peer[id].onicecandidate =  (event)=>{
        console.log('here');
        
        if(event.candidate){
            console.log('also here');
            
            socket.emit('ice', id, event.candidate)
        }
    }

    peer[id].addEventListener('connectionstatechange', (event=>{
        if(peer[id].connectionstate ==='connected'){
            console.log('Peer connected: '+ id)  
        }
    }))
}



socket.on('offer',async function(id, offer){
    if(peer[id]!=null){
        const remoteDesc = new RTCSessionDescription(JSON.parse(offer))
        console.log(offer)
        await peer[id].setRemoteDescription(remoteDesc)
        console.log(peer[id].remoteDescription);
        const answer =await peer[id].createAnswer()
        await peer[id].setLocalDescription(answer)
        socket.emit('answer', id, JSON.stringify(answer))        
    }
    else{
        console.log('fuck');
    }
})

function makePeerRemote(id){
    peer[id] = new RTCPeerConnection(config)
    peer[id].addStream(localStream)
    peer[id].ontrack = (event)=>{
        remote1.srcObject = event.streams[0]
    }
}

socket.on('ice', (id, ice)=>{
    try{
        console.log('got ice');
        
        peer[id].addIceCandidate(new RTCIceCandidate(ice))
    }
    catch(e){
        showError(e)
    }
})
