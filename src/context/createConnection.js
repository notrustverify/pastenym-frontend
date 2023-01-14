import { createNymMixnetClient } from 'ntv-sdk'

export async function connectMixnet() {
    const nym = await createNymMixnetClient()

    const validatorApiUrl = 'https://validator.nymtech.net/api'

    let preferredGatewayIdentityKey =
        'E3mvZTHQCdBvhfr178Swx9g4QG3kkRUun7YnToLMcMbM'
    let gatewayListener = 'wss://gateway1.nymtech.net:443'        

    // start the client and connect to a gateway
    if (process.env.WS_CONNECTION) {
        preferredGatewayIdentityKey = ''
        gatewayListener = ''
    }

    await nym.client.start({
        clientId: 'pastenymClient',
        validatorApiUrl,
        preferredGatewayIdentityKey: preferredGatewayIdentityKey,
        gatewayListener: gatewayListener,
    })

    return nym
}
