import * as React from 'react'
import { useParams } from 'react-router-dom'

import he from 'he'
import Linkify from 'linkify-react'

import { extendTheme as extendJoyTheme, CssVarsProvider } from '@mui/joy/styles'
import Sheet from '@mui/joy/Sheet'
import Typography from '@mui/joy/Typography'
import Divider from '@mui/joy/Divider'
import { deepmerge } from '@mui/utils'
import { experimental_extendTheme as extendMuiTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import colors from '@mui/joy/colors'
import Skeleton from '@mui/material/Skeleton'
import WarningIcon from '@mui/icons-material/Warning'
import Alert from '@mui/joy/Alert'
import IconButton from '@mui/joy/IconButton'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import Button from '@mui/joy/Button'
import FileRender from './components/FileRender'
import Header from './Header'
import Footer from './Footer'
import E2EEncryptor from './e2e'
import TextStats from './components/TextStats'
import CopyToClipBoard from './components/CopyToClipboard'
import {
    connectMixnet,
    pingMessage,
    checkNymReady,
    sendMessageTo,
} from './context/createConnection'
import MixnetInfo from './components/MixnetInfo'
import { Buffer } from 'buffer'
import MarkdownViewer from './components/MarkdownViewer'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import { Html } from '@mui/icons-material'

const { unstable_sxConfig: muiSxConfig, ...muiTheme } = extendMuiTheme({
    // This is required to point to `var(--joy-*)` because we are using
    // `CssVarsProvider` from Joy UI.
    cssVarPrefix: 'joy',
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    main: colors.blue[500],
                },
                grey: colors.grey,
                error: {
                    main: colors.red[500],
                },
                info: {
                    main: colors.purple[500],
                },
                success: {
                    main: colors.green[500],
                },
                warning: {
                    main: colors.yellow[200],
                },
                common: {
                    white: '#FFF',
                    black: '#09090D',
                },
                divider: colors.grey[200],
                text: {
                    primary: colors.grey[800],
                    secondary: colors.grey[600],
                },
            },
        },
        dark: {
            palette: {
                primary: {
                    main: colors.blue[600],
                },
                grey: colors.grey,
                error: {
                    main: colors.red[600],
                },
                info: {
                    main: colors.purple[600],
                },
                success: {
                    main: colors.green[600],
                },
                warning: {
                    main: colors.yellow[300],
                },
                common: {
                    white: '#FFF',
                    black: '#09090D',
                },
                divider: colors.grey[800],
                text: {
                    primary: colors.grey[100],
                    secondary: colors.grey[300],
                },
            },
        },
    },
})

const { unstable_sxConfig: joySxConfig, ...joyTheme } = extendJoyTheme()

const mergedTheme = {
    ...muiTheme,
    ...joyTheme,
    colorSchemes: deepmerge(muiTheme.colorSchemes, joyTheme.colorSchemes),
    typography: {
        ...muiTheme.typography,
        ...joyTheme.typography,
    },
}

mergedTheme.generateCssVars = (colorScheme) => ({
    css: {
        ...muiTheme.generateCssVars(colorScheme).css,
        ...joyTheme.generateCssVars(colorScheme).css,
    },
    vars: deepmerge(
        muiTheme.generateCssVars(colorScheme).vars,
        joyTheme.generateCssVars(colorScheme).vars
    ),
})

mergedTheme.unstable_sxConfig = {
    ...muiSxConfig,
    ...joySxConfig,
}

function withParams(Component) {
    return (props) => <Component {...props} params={useParams()} />
}

let recipient = process.env.REACT_APP_NYM_CLIENT_SERVER

class Texts extends React.Component {
    constructor(props) {
        super(props)
        //window.nym = null
        this.encoder = new TextEncoder()
        this.decoder = new TextDecoder()
        this.unsubscribeRaw = null

        const items = this.props.params.urlId
            .replace('#/', '')
            .replace('#', '')
            .split('&')
            .map((l) => l.split('='))
        const urlId = items[0][0]
        this.params = {}
        for (let elt of items) {
            let [key, val] = elt
            this.params[key] = val
        }

        this.state = {
            self_address: null,
            text: null,
            num_view: null,
            burn_view: 0,
            urlId: urlId,
            isKeyProvided:
                this.params.hasOwnProperty('key') && this.params.key.length > 1,
            created_on: null,
            ready: false,
            isPasteRetrieved: false,
            isFileRetrieved: false,
            isText: true,
            isDataRetrieved: false,
            isPrivate: true,
            // For copying to clipboard
            copyToClipboardButton: 'Copy to clipboard',
            copyToClipboardTooltipOpen: false,
        }

        this.userFile = {}

        if (this.state.isKeyProvided) {
            this.encryptor = new E2EEncryptor(this.params.key)
        }

        this.getPaste = this.getPaste.bind(this)
        this.isMarkdown = this.isMarkdown.bind(this)
    }

    getPaste() {
        if (!window.nym) {
            console.error(
                'Could not send message because worker does not exist'
            )
            return
        }

        const data = {
            event: 'getText',
            data: {
                urlId: this.state.urlId,
            },
        }
        const message = JSON.stringify(data)

        sendMessageTo(message, 20)
    }

    initNym() {
        const messageProcessor = (e) => {
            this.displayReceived(this.decoder.decode(e.args.payload))
        }

        this.unsubscribeRaw =
            window.nym.events.subscribeToRawMessageReceivedEvent(
                messageProcessor
            )

        sendMessageTo(pingMessage(), 3)
    }

    componentDidMount() {
        checkNymReady()
            .then(() => this.initNym())
            .then(() => {
                this.setState({
                    self_address: window.self_address,
                })
                sendMessageTo(pingMessage(), 3)
            }
            )
    }

    componentWillUnmount() {
        console.log('unmount')
        this.unsubscribeRaw()
    }

    displayReceived(message) {
        const data = JSON.parse(message)
        if (!data.hasOwnProperty('error') && !data.hasOwnProperty('version')) {
            let userData = he.decode(data['text'])
            let textToDisplay = ''
            const isPasteEncrypted =
                data.hasOwnProperty('encParams') &&
                data['encParams'].salt !== '' &&
                data['encParams'].iv !== ''

            // Decrypt if message is encrypted
            if (isPasteEncrypted) {
                // If key is not provided, ask for it.
                if (!this.state.isKeyProvided) {
                    console.warn(
                        'Text seems to be encrypted but no key is provided. Asking for key'
                    )
                    const userProvidedKey = prompt(
                        'Paste seems to be encrypted and no key is provided. Please provide it here if you want to decrypt the paste:'
                    )

                    if (
                        null !== userProvidedKey &&
                        '' !== userProvidedKey &&
                        userProvidedKey.length > 0
                    ) {
                        this.setState({
                            isKeyProvided: true,
                        })
                        this.encryptor = new E2EEncryptor(userProvidedKey)
                    } else {
                        console.warn(
                            'Still no key provided, displaying encrypted text'
                        )
                    }
                }

                // If now have a key, display
                if (undefined !== this.encryptor && null !== this.encryptor) {
                    console.log('Decrypting')
                    const encParams = data['encParams']
                    userData = JSON.parse(
                        this.encryptor.decrypt(userData, encParams)
                    )
                    textToDisplay = he.decode(userData['text'])
                }
                // We do not decrypt, only display message as is.
                else {
                    textToDisplay = `Unable to decrypt the following paste:\n${userData}`
                }

                // Message is not encrypted
            } else {
                userData = JSON.parse(userData)
                textToDisplay = userData['text']
            }

            // Stats
            this.setState({
                num_view: data['num_view'],
                created_on: data['created_on'],
                is_burn: data['is_burn'],
                is_ipfs: data['is_ipfs'],
                burn_view: data['burn_view'],
                expiration_time: data['expiration_time'],
                expiration_height: data['expiration_height'],
            })

            // Display text if any
            if (userData['text'] !== '' || textToDisplay.length > 1) {
                this.setState({
                    text: textToDisplay,
                    isPasteRetrieved: true,
                })
            } else {
                // No text shared, remove the textarea
                this.setState({
                    isText: false,
                })
            }

            // Display document if any
            if (
                userData.hasOwnProperty('file') &&
                undefined !== userData['file'] &&
                userData['file'] !== null &&
                userData.file.data !== null
            ) {
                // js object to array, remove the keys
                let fileData
                if (
                    typeof userData.file['data'] === 'string' ||
                    userData.file['data'] instanceof String
                )
                    fileData = Buffer.from(userData.file['data'], 'base64')
                else
                    fileData = Uint8Array.from(
                        Object.keys(userData.file['data']).map(
                            (key) => userData.file['data'][key]
                        )
                    )

                this.userFile = {
                    fileData: URL.createObjectURL(
                        new Blob([fileData], {
                            type: userData.file['mimeType'],
                        })
                    ),
                    filename: userData.file['filename'],
                    mimeType: userData.file['mimeType'],
                }
                this.setState({ isFileRetrieved: true })
            }

            // Global state to stop sending message when text or file is fetched
            this.setState({ isDataRetrieved: true })
        } else if (data.hasOwnProperty('version')) {
            this.setState({
                pingData: data.version,
                ready: true,
            })
        } else {
            this.setState({
                text: he.decode(data['error']),
                isDataRetrieved: true,
                isPasteRetrieved: true,
            })
        }
    }

    async sendMessageTo(payload, numberOfSurbs) {
        if (!window.nym) {
            console.error(
                'Could not send message because worker does not exist'
            )
            return
        }

        if (numberOfSurbs === undefined) numberOfSurbs = 20

        await window.nym.client.rawSend({
            payload: this.encoder.encode(payload),
            recipient: recipient,
            replySurbs: numberOfSurbs,
        })
    }

    isMarkdown() {
        let likelihood = 0

        const regHeaders = new RegExp('(#{1,6}s)(.*)')
        const regLinks = new RegExp('([.*])(((http)(?:s)?(://).*))', 'g')
        const regImageFile = new RegExp(
            '(!)([(?:.*)?])((.*(.(jpg|png|gif|tiff|bmp))(?:(s"|\')(w|W|d)+("|\'))?))',
            'g'
        )
        const regInlineCode = new RegExp('(\\`{1})(.*)(\\`{1})', 'g')
        const regCodeBlock = new RegExp('(\\`{3}\\n+)(.*)(\\n+\\`{3})', 'g')
        const regBlockQuote = new RegExp('((^(>{1})(s)(.*)(?:$)?)+)', 'g')
        const regTable = new RegExp(
            '^(|[^\\n]+|\\r?\\n)((?:|:?[-]+:?)+|)(\\n(?:|[^\\n]+|\\r?\\n?)*)?$',
            'mg'
        )

        // little ashamed of this will have to work on it
        if (regHeaders.test(this.state.text)) likelihood += 1
        if (regLinks.test(this.state.text)) likelihood += 1
        if (regBlockQuote.test(this.state.text)) likelihood += 1
        if (regInlineCode.test(this.state.text)) likelihood += 1
        if (regCodeBlock.test(this.state.text)) likelihood += 1
        if (regImageFile.test(this.state.text)) likelihood += 1
        if (regTable.test(this.state.text)) likelihood += 3

        return likelihood >= 3
    }

    render() {
        if (this.state.ready && this.state.isDataRetrieved !== true)
            this.getPaste()

        return (
            <CssVarsProvider theme={mergedTheme}>
                <Header />
                <main style={{ marginRight: '10px', marginLeft: '10px' }}>
                    <Sheet
                        sx={{
                            maxWidth: '950px',
                            height: '100%',
                            borderRadius: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            boxShadow: 3,
                            mx: 'auto',
                            px: 3,
                            my: 1, // margin top & botom
                            py: 3, // padding top & bottom
                        }}
                        variant="outlined"
                    >
                        <MixnetInfo
                            self_address={this.state.self_address}
                            pingData={this.state.pingData}
                        />

                        <Divider />
                        {this.state.is_burn ? (
                            <Alert
                                sx={{ alignItems: 'flex-start' }}
                                startDecorator={React.cloneElement(
                                    <WarningIcon />,
                                    {
                                        sx: { mt: '2px', mx: '2px' },
                                        fontSize: 'xl2',
                                    }
                                )}
                                variant="soft"
                                color="warning"
                                endDecorator={
                                    <IconButton
                                        variant="soft"
                                        size="sm"
                                        color="warning"
                                    ></IconButton>
                                }
                            >
                                <div>
                                    <Typography fontWeight="lg" mt={0.25}>
                                        Burn after reading paste
                                    </Typography>
                                    <Typography
                                        fontSize="sm"
                                        sx={{ opacity: 0.8 }}
                                    >
                                        <>
                                            {this.state.num_view >=
                                            this.state.burn_view
                                                ? 'The paste is now deleted'
                                                : `The paste will be deleted in  
                                                ${
                                                    this.state.burn_view -
                                                    this.state.num_view
                                                }
                                                 views`}
                                        </>
                                    </Typography>
                                </div>
                            </Alert>
                        ) : (
                            <div>
                                {this.state.num_view || this.state.is_ipfs ? (
                                    <TextStats
                                        num_view={this.state.num_view}
                                        created_on={this.state.created_on}
                                        is_ipfs={this.state.is_ipfs}
                                        expiration_time={
                                            this.state.expiration_time
                                        }
                                        expiration_height={
                                            this.state.expiration_height
                                        }
                                    />
                                ) : (
                                    ''
                                )}
                            </div>
                        )}
                        <b>
                            {!this.state.text ? (
                                <Stack
                                    sx={{
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                        color: 'grey.500',
                                    }}
                                    spacing={1}
                                >
                                    Paste is being loaded
                                </Stack>
                            ) : (
                                'Paste'
                            )}
                            {this.state.isText && this.state.text ? (
                                <CopyToClipBoard textToCopy={this.state.text} />
                            ) : (
                                ''
                            )}
                        </b>

                        {this.state.isFileRetrieved &&
                        !this.userFile.mimeType.includes('image/') ? (
                            <Button
                                component="a"
                                href={this.userFile.fileData}
                                download={this.userFile.filename}
                                variant="soft"
                                endDecorator={<KeyboardArrowRight />}
                                color="success"
                                sx={{
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                Download {this.userFile.filename} file
                            </Button>
                        ) : (
                            ''
                        )}
                        {this.state.isFileRetrieved &&
                        this.userFile.mimeType.includes('image/') ? (
                            <FileRender fileData={this.userFile.fileData} />
                        ) : (
                            ''
                        )}
                        {
                            // if no text shared don't render text area
                            this.state.isText ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        whiteSpace: 'pre-wrap',
                                        overflowWrap: 'anywhere',
                                        border: '1px solid  rgb(211,211,211)',
                                        borderRadius: '5px',
                                        p: 1,
                                    }}
                                >
                                    {this.state.text ? (
                                        this.isMarkdown() ? (
                                            <div>
                                                <MarkdownViewer
                                                    text={this.state.text}
                                                />
                                            </div>
                                        ) : (
                                            <Linkify
                                                as="div"
                                                options={{
                                                    target: '_blank',
                                                    rel: 'noreferrer',
                                                }}
                                            >
                                                {this.state.text}
                                            </Linkify>
                                        )
                                    ) : (
                                        <Skeleton
                                            variant="rounded"
                                            width="100%"
                                            height={60}
                                        />
                                    )}
                                </Box>
                            ) : (
                                ''
                            )
                        }
                    </Sheet>
                </main>
                <footer>
                    <Footer />
                </footer>
            </CssVarsProvider>
        )
    }
}

export default withParams(Texts)
