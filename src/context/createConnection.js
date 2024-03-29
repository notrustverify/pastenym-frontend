import { createNymMixnetClient } from "@nymproject/sdk-full-fat";


export async function connectMixnet() {
   window.nym = await createNymMixnetClient()
    
    // give the possibility to not force the gateway to use. Can be useful for tor hidden service.
    if (process.env.WS_CONNECTION) {
        preferredGatewayIdentityKey = ''
        gatewayListener = ''
    }


    await window.nym.client.start({
        clientId: crypto.randomUUID(),
        preferredGateway: "EBT8jTD8o4tKng2NXrrcrzVhJiBnKpT1bJy5CMeArt2w",
        forceTls: true
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
        async function checkFlag() {
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

        if(window.nym?.client === undefined)
            await connectMixnet()

        await window.nym.client.rawSend( { payload: new TextEncoder().encode(payload), recipient: recipient,replySurbs: numberOfSurbs})


}

export function pingMessage() {
    const data = {
        event: 'ping',
        data: 'empty',
    }

    return JSON.stringify(data)
}