[![Node.js CI](https://github.com/notrustverify/pastenym/actions/workflows/frontend.yml/badge.svg)](https://github.com/notrustverify/pastenym/actions/workflows/frontend.yml)

# pastenym

This project is inspired from [pastebin](https://pastebin.com/) service.
The main goal is to offer a solution for sharing text with [Nym](https://nymtech.net/) products
to offer full anonymity, even on metadata level

#### Demo
Get shared text: [https://pastenym.ch/#/cuc0yBM7&key=331362fb93d7d7730ae182660edba661](https://pastenym.ch/#/cuc0yBM7&key=331362fb93d7d7730ae182660edba661)

Share a text: [http://pastenym.ch/](http://pastenym.ch/)

## What Nym is developping ?
> Nym is developing the infrastructure to prevent this data leakage by protecting every packet’s metadata at the network and application layers.

### Architecture

<img src="./resources/img/nym-platform.png" alt="drawing" width="50%"/>

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

## Structure

* `backend/` manage the websockets connections and DB
* `frontend/` web application
* `nym-client/` store the configuration,keys for the nym-client
* `resources/` store img or files for documentation
