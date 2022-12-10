[![Node.js CI](https://github.com/notrustverify/pastenym/actions/workflows/frontend.yml/badge.svg)](https://github.com/notrustverify/pastenym-frontend/actions/workflows/frontend.yml)

# Frontend - Pastenym

This project is inspired from [pastebin](https://pastebin.com/) service.
The main goal is to offer a solution for sharing text with [Nym](https://nymtech.net/) products
to offer full anonymity, even on metadata level

#### Demo
Get shared text: [https://pastenym.ch/#/cuc0yBM7&key=331362fb93d7d7730ae182660edba661](https://pastenym.ch/#/cuc0yBM7&key=331362fb93d7d7730ae182660edba661)

Share a text: [http://pastenym.ch/](http://pastenym.ch/)

## What Nym is developping ?
> Nym is developing the infrastructure to prevent this data leakage by protecting every packet’s metadata at the network and application layers.

## How pastenym service will use Nym product
Your text is sent to a client which is connected to the Nym network and which stores it in a database (eventually a more distributed solution will be considered),



This system allows you to share information while respecting your privacy by protecting your data and metadata.

On the side of No Trust Verify we only see an anonymous id when sending the text, and therefore impossible to know who is behind and from where the data was sent. Moreover, data is end-to-end encrypted: your browser generates a key used to encrypt the text, the key is placed in the URL you share with your friends and is used in their browser to decrypt the text received by the server.

### Schema

<img src="./resources/img/paste.jpg" alt="drawing" width="60%"/>

## Init the project

### Frontend
NodeJS (`v16.13.1`) and NPM (`v8.19.2`) are used for the frontend.

1. Create a `.env` file with the same keys are in `.env.example` with your values. The `REACT_APP_NYM_CLIENT_SERVER` value should match the address displayed by the backend.
2. Run `npm install` and grab a cup of coffee
3. Run `npm run start` and go to [http://localhost:8080](http://localhost:8080) in your favorite browser.


#### Host it publicly

If you want to host it publicly here's a docker-compose file you can use

To run it: `docker compose up --build -d`

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
    build: .
    restart: unless-stopped
    labels:
      - traefik.http.routers.pastenym-frontend.entrypoints=websecure
      - traefik.http.routers.pastenym-frontend.rule=Host(`<YOUR HOSTNAME>`)
      - traefik.http.routers.pastenym-frontend.tls=true
      - traefik.http.routers.pastenym-frontend.tls.certresolver=letsEncrypt
      - traefik.enable=true
    ports:
      - 8001:80
    volumes:
      - ./dist:/app/dist  
```


## Structure

* `backend/` manage the websockets connections and DB
* `frontend/` web application
* `nym-client/` store the configuration,keys for the nym-client
* `resources/` store img or files for documentation
