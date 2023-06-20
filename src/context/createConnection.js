import { createNymMixnetClient } from '@nymproject/sdk'


export async function connectMixnet() {
   window.nym = await createNymMixnetClient()
    

    const nymApiUrl = 'https://validator.nymtech.net/api'

    let preferredGatewayIdentityKey =
        'E3mvZTHQCdBvhfr178Swx9g4QG3kkRUun7YnToLMcMbM'

    // WSS is mandatory for HTTPS website
    let gatewayListener = 'wss://gateway1.nymtech.net:443'

    // give the possibility to not force the gateway to use. Can be useful for tor hidden service.
    if (process.env.WS_CONNECTION) {
        preferredGatewayIdentityKey = ''
        gatewayListener = ''
    }

    // start the client and connect to a gateway
    
    await window.nym.client.start({
        clientId: 'pastenymClient',
        nymApiUrl,
        preferredGatewayIdentityKey: preferredGatewayIdentityKey,
        gatewayListener: gatewayListener,
    })

    window.nym.events.subscribeToConnected((e) => {
        
        if (e.args.address) {
            window.nymReady = true
            window.self_address = e.args.address

            // send 2 messages first one to get the ping back fast and the other one to generate in advance the SURBs (since it take time to generate them)
            //sendMessageTo(pingMessage(), 3)
            //sendMessageTo(pingMessage(), 200)
    }})

}


export async function checkNymReady(){
    return new Promise(resolve => {
        var start_time = Date.now();
        function checkFlag() {
          if (window.nymReady) {
            resolve();
          } else if (Date.now() > start_time + 3000000) { //set long time before timeout, will have to work on it, TODO
            console.log('not met, time out');
            resolve();
          } else {
            window.setTimeout(checkFlag, 1000); 
          }
        }
        checkFlag();
      });
  }

  export async function sendMessageTo(payload, numberOfSurbs, recipient) {
    if (!window.nym) {
        console.error(
            'Could not send message because worker does not exist'
        )
        return
    }
    
    if (numberOfSurbs === undefined)
        numberOfSurbs = 20

    if (recipient === undefined)
        recipient = process.env.REACT_APP_NYM_CLIENT_SERVER


        await window.nym.client.rawSend( { payload: new TextEncoder().encode(payload), recipient: recipient,replySurbs: numberOfSurbs})

}

export function pingMessage() {
    const data = {
        event: 'ping',
        data: 'empty',
    }

    return JSON.stringify(data)
}