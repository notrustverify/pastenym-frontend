[![Frontend CI](https://github.com/notrustverify/pastenym-frontend/actions/workflows/frontend.yml/badge.svg)](https://github.com/notrustverify/pastenym-frontend/actions/workflows/frontend.yml)

# Frontend - Pastenym

This project is inspired from [pastebin](https://pastebin.com/) service.
The main goal is to offer a solution for sharing text with [Nym](https://nymtech.net/) products
to offer full anonymity, even on metadata level

### Demo
Get shared text: Get shared text: [https://pastenym.ch/#/jD6Vhmrz&key=b2d6ae002a1674daa43a07be7fc4f01c](https://pastenym.ch/#/jD6Vhmrz&key=b2d6ae002a1674daa43a07be7fc4f01c)


Share a text: [http://pastenym.ch/](http://pastenym.ch/)

## What Nym is developping ?
> Nym is developing the infrastructure to prevent this data leakage by protecting every packet’s metadata at the network and application layers.

## How pastenym service will use Nym product
Your text is sent to a client which is connected to the Nym network and which stores it in a database (eventually a more distributed solution will be considered),



This system allows you to share information while respecting your privacy by protecting your data and metadata.

On the side of No Trust Verify we only see an anonymous id when sending the text, and therefore impossible to know who is behind and from where the data was sent. Moreover, data is end-to-end encrypted: your browser generates a key used to encrypt the text, the key is placed in the URL you share with your friends and is used in their browser to decrypt the text received by the server.


## Donate

If you enjoy pastenym, please consider buying us a cup of coffee. We worked hard to make it free and plan to spend alot of time supporting it. Donations are greatly appreciated.

BTC: `bc1q5j4tq0yr75j90xwegwtfpaccdx3xdaxxzjtzt8`


*The best way to support us is by delegated NYM to our nodes*
* No Trust Verify 2 `4yRfauFzZnejJhG2FACTVQ7UnYEcFUYw3HzXrmuwLMaR`
* No Trust Verify 1 `APxUbCmGp4K9qDzvwVADJFNu8S3JV1AJBw7q6bS5KN9E`

## Init the project

### Frontend
NodeJS (`v18.2.0`) and NPM (`v9.20.0`) are used for the frontend.

1. Copy the `.env.example` to `.env`. Detailled values are explained in `.env details` section at the bottom
2. Run `npm install -g yarn && yarn` and grab a cup of coffee
3. Run `yarn dev` and go to [http://localhost:8080](http://localhost:8080) in your favorite browser.

or

Run `yarn build` to build the project, everything will be in the `dist` folder. Just copy it to host it with a webserver


If you don't have a backend you can use this one, just set the `REACT_APP_NYM_CLIENT_SERVER=` to this value: `HWm3757chNdBq9FzKEY9j9VJ5siRxH8ukrNqYwFp9Unp.D34iYLRd5vzpCU4nZRcFVmoZpTQQMa6mws4Q65LdRosi@Fo4f4SQLdoyoGkFae5TpVhRVoXCF8UiypLVGtGjujVPf` 

### Host it publicly with Docker

If you want to host it publicly here's some steps that can help you

To run it:

1. Copy the `.env.example` to `.env` and edit the variables in it.
The `REACT_APP_NYM_CLIENT_SERVER` value should match the address displayed by the backend. You can use the one written in the example file, it's a working backend.

2. Copy and paste the content displayed [here](https://github.com/notrustverify/pastenym-frontend/main/README.md#docker-composeyml) in a `docker-compose.yml` file

3. set your hostname on this line (keep the ` `` `)
```
traefik.http.routers.pastenym-frontend.rule=Host(`YOUR HOSTNAME`)
```
5. start it `docker compose up --build -d`

##### Docker-compose.yml

```yaml
version: "3"

services:

  traefik:
    image: "traefik:v2.9"
    container_name: "traefik"
    restart: unless-stopped
    command:
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsEncrypt.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.letsEncrypt.acme.httpchallenge=true"
      - "--certificatesresolvers.letsEncrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - 443:443
      - 80:80
    volumes:
      - ./letsencrypt:/letsencrypt
      - /var/run/docker.sock:/var/run/docker.sock:ro

  pastenym-frontend:
    image: notrustverify/pastenym-frontend:latest
    restart: unless-stopped
    labels:
      - traefik.http.routers.pastenym-frontend.entrypoints=websecure
      - traefik.http.routers.pastenym-frontend.rule=Host(`YOUR HOSTNAME`)
      - traefik.http.routers.pastenym-frontend.tls=true
      - traefik.http.routers.pastenym-frontend.tls.certresolver=letsEncrypt
      - traefik.enable=true
    env_file: .env
    ports:
      - 8001:80 
```

## .env details

This section list the options for personnal branding and optionnal config

### Backend connection

| Variable | Default value | Explanation |
|----------|---------------|--------------|
| `REACT_APP_NYM_CLIENT_SERVER` | `HWm3757chNdBq9FzKEY9j9VJ5siRxH8ukrNqYwFp9Unp.D34iYLRd5vzpCU4nZRcFVmoZpTQQMa6mws4Q65LdRosi@Fo4f4SQLdoyoGkFae5TpVhRVoXCF8UiypLVGtGjujVPf` | Configure the backend server that the frontend will use to send and retrieve pastes |
| `SERVER_NAME` | `https://pastenym.ch` | Links displayed when paste URL ID are generated |

### Instance info exposition
Setting the env variable `GENERATE_INFO_FILE_ABOUT_INSTANCE` to `"true"` will generate a _info.json_ file at the root of your instance (so at the `<SERVER_NAME>/info.json` according the server name value above). If the env variable is undefined or has any other value, it will not be generated. It allows you to expose the following parameters of your instance, in a static json file (without loading the whole webpack):
| Key | Example | Condition |
|-------|---------|-----------|
| hosted_by | "https://notrustverify.ch" | If provided in the _.env_ file |
| hosted_by_name | "No Trust Verify" | If provided in the _.env_ file |
| version | "1.4.2" | From the _package.json_ file |
| country | "NZ" | If provided in the _.env_ file |
| backend_addr | "HrXyP...yBAdEp" | |

If you list your instance in our directory service ([here](directory.pastenym.ch)), this file will be queried recently to ensure the liveness of your instance as well as to allow users to choose or compare instances. The backend address will be used to query the backend you are using directly for the list of supported operations. For more information about the directory, [check our repo](https://github.com/notrustverify/pastenym-directory)!

### Personnal branding
To change logo, create a new `logo-header.png` in the `/public` folder. The size should be 25px

#### Header
| Variable | Default value | Explanation |
|----------|---------------|--------------|
| `DISABLE_ABOUT` | `false` | Disable the `About` page. Set `true` to disable it |


#### Footer
| Variable | Default value | Explanation |
|----------|---------------|--------------|
| `SOCIAL_TWITTER` | Empty | Enable the twitter icon in the footer by giving the URL (eg. https://twitter.com/notrustverif) |
| `SOCIAL_EMAIL` | Empty | Enable the email icon in the footer by giving the URL|
| `SOCIAL_TELEGRAM` | Empty | Enable the email icon in the footer by giving the URL|
| `SOCIAL_MATRIX` | Empty | Enable the matrix icon in the footer by giving the URL|
| `SOCIAL_GITHUB` | Empty | Enable github icon in the footer by giving the URL|
| `SOCIAL_MEDIUM` | Empty | Enable the medium icon in the footer by giving the URL|
| `HOSTED_BY_URL` | Empty                            | Enable the `hosted by` text in the footer. Set a value to enable it |
| `HOSTED_BY_NAME`| Empty                            | Set a name for the `hosted by` text |
| `DISABLE_DEVELOPPEDBY`| `false`                     | Disable the `Developed by` text in the footer. Set to `true` to disable it |
