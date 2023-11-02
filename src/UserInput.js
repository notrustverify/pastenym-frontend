/* eslint-disable no-unused-vars */
import * as React from 'react'
import Sheet from '@mui/joy/Sheet'
import Typography from '@mui/joy/Typography'
import Button from '@mui/joy/Button'
import Textarea from '@mui/joy/Textarea'
import Box from '@mui/joy/Box'
import SendIcon from '@mui/icons-material/Send'
import Checkbox from '@mui/joy/Checkbox'
import Tooltip from '@mui/joy/Tooltip'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import Header from './Header'
import Footer from './Footer'
import E2EEncryptor from './e2e'
import ShowText from './components/ShowText'
import { withRouter } from './components/withRouter'
import ErrorModal from './components/ErrorModal'
import SuccessUrlId from './components/SuccessUrlId'
import { connectMixnet, pingMessage, checkNymReady, sendMessageTo } from './context/createConnection'
import MixnetInfo from './components/MixnetInfo'
import {
    extendTheme as extendJoyTheme,
    CssVarsProvider,
  } from '@mui/joy/styles'
import { experimental_extendTheme as extendMuiTheme } from '@mui/material/styles'
import colors from '@mui/joy/colors'
import { deepmerge } from '@mui/utils'
import { useParams } from 'react-router-dom'
import Tabs from '@mui/joy/Tabs'
import TabList from '@mui/joy/TabList'
import Tab from '@mui/joy/Tab'
import MarkdownViewer from './components/MarkdownViewer'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'



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
  });
  
  const { unstable_sxConfig: joySxConfig, ...joyTheme } = extendJoyTheme();
  
  const mergedTheme = ({
    ...muiTheme,
    ...joyTheme,
    colorSchemes: deepmerge(muiTheme.colorSchemes, joyTheme.colorSchemes),
    typography: {
      ...muiTheme.typography,
      ...joyTheme.typography
    }})
  
  mergedTheme.generateCssVars = (colorScheme) => ({
    css: {
      ...muiTheme.generateCssVars(colorScheme).css,
      ...joyTheme.generateCssVars(colorScheme).css
    },
    vars: deepmerge(
      muiTheme.generateCssVars(colorScheme).vars,
      joyTheme.generateCssVars(colorScheme).vars
    )
  });
  
  mergedTheme.unstable_sxConfig = {
    ...muiSxConfig,
    ...joySxConfig
  };

const recipient = process.env.REACT_APP_NYM_CLIENT_SERVER

class UserInput extends React.Component {
    constructor(props) {
        super(props)

        this.nym = null
        this.encoder = new TextEncoder()
        this.decoder = new TextDecoder()
        this.unsubscribe = null
        this.unsubscribeRaw = null

        this.state = {
            self_address: null,
            text: '',
            textError: null,
            open: false,
            urlId: null,
            buttonSendClick: false,
            burnChecked: false,
            burnCheckedEnable: true,
            textReceived: null,
            //urlIdGet: null,
            buttonGetClick: false,
            files: null,
            isFileAttached: false,
            isPrivate: true,
            isIpfs: false,
            limitSize: 120_0000,
            mdPreview: false,
            burnView: 0,
            expirationChecked: false,
            expirationTimeRelative: '',
            expirationHeightRelative: null,
            expirationRelativeHeightEnabled: false,
            pingData: null,
            ipfsHostEnabled: false,
            
        }

        this.files = null

        this.burnViewsOption = [
            { view: '1' },
            { view: '10' },
            { view: '50' },
            { view: '100' },
            { view: '256' },
        ]

        this.expirationRelativeTimeOption = [
            { time: '5 minutes' },
            { time: '10 minutes' },
            { time: '30 minutes' },
            { time: '1 hour' },
            { time: '12 hours' },
            { time: '1 week' },
            { time: '1 month' },
            { time: '6 months' },
        ]

        this.expirationRelativeHeightOption = [
            { height: '1 block', value: 1 },
            { height: '5 blocks', value: 5 },
            { height: '10 blocks', value: 10 },
            { height: '50 blocks', value: 50 },
            { height: '100 blocks', value: 100 },
            { height: '256 blocks', value: 256 },
            { height: '500 blocks', value: 500 },
        ]

        // Instanciating a new encryptor will generate new key by default
        this.encryptor = new E2EEncryptor()

        this.sendText = this.sendText.bind(this)
        //this.getPaste = this.getPaste.bind(this)
        this.handleFileUploadError = this.handleFileUploadError.bind(this)
        this.handleFilesChange = this.handleFilesChange.bind(this)
        this.modalHandler = this.modalHandler.bind(this)
    }



    initNym(){
        this.unsubscribe = window.nym.events.subscribeToTextMessageReceivedEvent((e) => {
            this.displayReceived(this.decoder.decode(e.args.payload))
        })

        this.unsubscribeRaw = window.nym.events.subscribeToRawMessageReceivedEvent((e) => {
            this.displayReceived(this.decoder.decode(e.args.payload))
        })

        sendMessageTo(pingMessage(), 3)

    }

     componentDidMount() {

        checkNymReady().then(() => this.initNym()).then(() => (

            this.setState({
                self_address: window.self_address,
            })))
        
    }


     componentWillUnmount() {
        this.unsubscribe()
        this.unsubscribeRaw()
    }

    handleFileUploadError = (error) => {
        // Do something...
    }

    modalHandler(status) {
        this.setState({ open: status })
    }

    handleFilesChange(files) {
        //reset the state for the modal, workaround, would have to change
        // handle validations
        const fileSize = files.target.files[0].size

        if (fileSize > this.state.limitSize) {
            this.setState({
                open: true,
                textError:
                    'Files are limited to ' +
                    this.state.limitSize / 1000000 +
                    ' MB',
                isFileAttached: false,
            })

            return
        }

        this.setState({
            files: [...files.target.files],
            isFileAttached: true,
            estimatedTime: Math.floor(fileSize / 8000), //totally random, but it can help user to not break the app
        })
    }

    

    displayReceived(message) {
        const content = message
        if (content.length > 0) {
            if (content.toLowerCase().includes('error')) {
                this.setState({
                    open: false,
                    files: null,
                    isFileAttached: false,
                })

                let textError = content

                if (this.isJson(content))
                    textError = JSON.parse(content)['error']

                this.setState({
                    open: true,
                    textError: textError,
                    buttonGetClick: false,
                })
            } else {
                const data = JSON.parse(content)
                if (!Object.hasOwn(data, 'version')) {
                    this.setState({
                        urlId: data,
                        buttonSendClick: false,
                    })

                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                    })
                } else {
                    this.setState({
                        pingData: data.version,
                        expirationRelativeHeightEnabled: data.capabilities.expiration_bitcoin_height,
                        ipfsHostEnabled: data.capabilities.ipfs_hosting
                    })
                }
            }
        }
    }

    isJson(item) {
        item = typeof item !== 'string' ? JSON.stringify(item) : item

        try {
            item = JSON.parse(item)
        } catch (e) {
            return false
        }

        return typeof item === 'object' && item !== null
    }

    async sendMessageTo(payload, numberOfSurbs) {
        if (!window.nym) {
            console.error(
                'Could not send message because worker does not exist'
            )
            return
        }

        if (numberOfSurbs === undefined)
            numberOfSurbs = 20
        console.log(window.nym?.client)
        await window.nym?.client.rawSend( { payload: this.encoder.encode(payload), recipient: recipient,replySurbs: numberOfSurbs})

    }


    async sendText() {
        if (
            (this.state.text.length <= 100000 && this.state.text.length > 0) ||
            ( this.state.files !== null && this.state.files.length > 0 )
        ) {
            this.setState({
                buttonSendClick: true,
            })

            if (this.state.files !== null) {
                await Promise.all(
                    this.state.files.map(async (f) => {
                        const buffer = await f.arrayBuffer()
                        const fileArray = new Uint8Array(buffer)
                        this.files = {
                            data: Array.from(fileArray),
                            filename: f.name,
                            mimeType: f.type,
                        }
                    })
                )
            }

            const clearObjectUser = {
                text: this.state.text,
                file: this.files,
            }

            // Encrypt text
            let encrypted = undefined
            let nonencrypted = undefined
            if (this.state.isPrivate) {
                // If a key was defined before (because previous paste sent), reset it
                // This will cause a new key to be generated for encryption
                if (null != this.encryptor.getKey()) {
                    this.encryptor.resetKey()
                }

                encrypted = this.encryptor.encrypt(
                    JSON.stringify(clearObjectUser)
                )
                if (!encrypted) {
                    console.error('Failed to encrypt message.')
                    return
                }
            } else {
                nonencrypted = JSON.stringify(clearObjectUser)
            }

            // As soon SURB will be implemented in wasm client, we will use it
            const data = {
                event: 'newText',
                data: {
                    text: this.state.isPrivate ? encrypted[0] : nonencrypted,
                    private: this.state.isPrivate,
                    burn: this.state.burnChecked,
                    burn_view: parseInt(this.state.burnView),
                    encParams: this.state.isPrivate ? encrypted[1] : '',
                    ipfs: this.state.isIpfs,
                    expiration_time: this.state.expirationTimeRelative,
                    expiration_height: this.state.expirationHeightRelative
                        ? parseInt(
                              this.state.expirationHeightRelative.split(' ')[0]
                          )
                        : null,
                },
            }

            // Reset urlId to hide SuccessUrlId component
            this.setState({
                urlId: undefined,
            })

            /*if (this.state.text.length > 0)
                this.sendMessageTo(JSON.stringify(data))*/
            if (encrypted || nonencrypted)
                await sendMessageTo(JSON.stringify(data),20)
        } else {
            if (this.state.text.length <= 0)
            {
            this.setState({
                open: true,
                textError: "Text cannot be empty",
            })
        } else if (this.state.text.length >= 10_0000) {
            this.setState({
                open: true,
                textError: "Too many char, limit is 100'000",
            })
        } 
        }
    }

    render() {
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
                        <MixnetInfo self_address={this.state.self_address} pingData={this.state.pingData} />

                        
                        {
                            // use buttonClick to reload the message
                            this.state.urlId && !this.state.buttonSendClick ? (
                                <SuccessUrlId
                                    urlId={this.state.urlId}
                                    encKey={
                                        this.state.isPrivate
                                            ? this.encryptor.getKey()
                                            : undefined
                                    }
                                />
                            ) : (
                                ''
                            )
                        }
                        {this.state.open ? (
                            <ErrorModal
                                open={this.state.open}
                                handler={this.modalHandler}
                                textError={this.state.textError}
                            />
                        ) : (
                            ''
                        )}

                        {this.state.textReceived ? (
                            <ShowText data={this.state.textReceived} />
                        ) : (
                            ''
                        )}

                        <Typography
                            fontSize="sm"
                            sx={{
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            <b>New paste</b>
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 4,
                                width: '100%',
                                justifyContent: 'left',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'normal',
                            }}
                        >
                            <Tooltip
                                title="Your message will be deleted when read. Not compatible with IPFS upload."
                                size="sm"
                                placement="bottom"
                            >
                                <Checkbox
                                    onChange={(event) =>
                                        this.setState({
                                            burnChecked: event.target.checked,
                                        })
                                    }
                                    disabled={this.state.isIpfs}
                                    size="sm"
                                    label="Burn after reading"
                                    checked={this.state.burnChecked}
                                />
                            </Tooltip>
                            {this.state.burnChecked ? (
                                <Autocomplete
                                    disablePortal
                                    onChange={(event, newValue) => {
                                        this.setState({ burnView: newValue })
                                    }}
                                    onInputChange={(event, newInputValue) => {
                                        this.setState({
                                            burnView: newInputValue,
                                        })
                                    }}
                                    options={this.burnViewsOption.map(
                                        (option) => option.view
                                    )}
                                    freeSolo
                                    sx={{
                                        position: 'relative',
                                        top: '-13px',
                                        width: 100,
                                        fontSize: '12px',
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Views before delete"
                                        />
                                    )}
                                    size="small"
                                />
                            ) : (
                                ''
                            )}

                            <Tooltip
                                title="Your message will be deleted after a time. Not compatible with IPFS upload."
                                size="sm"
                                placement="bottom"
                            >
                                <Checkbox
                                    onChange={(event) =>
                                        this.setState({
                                            expirationChecked:
                                                event.target.checked,
                                        })
                                    }
                                    disabled={this.state.isIpfs}
                                    size="sm"
                                    label="Expire in"
                                    checked={this.state.expirationChecked}
                                />
                            </Tooltip>

                            {this.state.expirationChecked ? (
                                <Autocomplete
                                    disablePortal
                                    onChange={(event, newValue) => {
                                        this.setState({
                                            expirationTimeRelative: newValue,
                                        })
                                    }}
                                    onInputChange={(event, newInputValue) => {
                                        this.setState({
                                            expirationTimeRelative:
                                                newInputValue,
                                        })
                                    }}
                                    options={this.expirationRelativeTimeOption.map(
                                        (option) => option.time
                                    )}
                                    freeSolo
                                    sx={{
                                        position: 'relative',
                                        top: '-13px',
                                        width: 150,
                                        fontSize: '12px',
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Time" />
                                    )}
                                    size="small"
                                />
                            ) : (
                                ''
                            )}

                            {this.state.expirationChecked &&
                            this.state.expirationRelativeHeightEnabled ? (
                                <Autocomplete
                                    disablePortal
                                    onChange={(event, newValue) => {
                                        this.setState({
                                            expirationHeightRelative: newValue,
                                        })
                                    }}
                                    onInputChange={(event, newInputValue) => {
                                        this.setState({
                                            expirationHeightRelative:
                                                newInputValue,
                                        })
                                    }}
                                    options={this.expirationRelativeHeightOption.map(
                                        (option) => option.height
                                    )}
                                    freeSolo
                                    sx={{
                                        position: 'relative',
                                        top: '-13px',
                                        width: 150,
                                        fontSize: '12px',
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Block height"
                                        />
                                    )}
                                    size="small"
                                />
                            ) : (
                                ''
                            )}

                            <Tooltip
                                title="Your message will not be encrypted"
                                size="sm"
                                placement="bottom"
                            >
                                <Checkbox
                                    onChange={(event) =>
                                        this.setState({
                                            isPrivate: !event.target.checked,
                                            limitSize: !event.target.checked
                                                ? 120_0000
                                                : 150_0000,
                                        })
                                    }
                                    size="sm"
                                    label="Public paste"
                                    checked={!this.state.isPrivate}
                                    disabled={this.state.isIpfs}
                                />
                            </Tooltip>

                            <Tooltip
                                title="Warning it's an experimental feature. Paste will be uploaded on IPFS"
                                size="sm"
                                placement="bottom"
                            >
                                <Checkbox
                                    onChange={(event) => {
                                        this.setState({
                                            isIpfs: event.target.checked,
                                            burnCheckedEnable:
                                                !event.target.checked,
                                            burnChecked: false,
                                            isPrivate: true,
                                            expirationChecked: false,
                                        })
                                    }}
                                    disabled={!this.state.ipfsHostEnabled}
                                    size="sm"
                                    label="Store on IPFS (experimental)"
                                />
                            </Tooltip>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                flexDirection: 'column',
                            }}
                        >
                            <Tabs
                                sx={{ maxWidth: 200 }}
                                defaultValue={1}
                                onChange={() => {
                                    this.setState({
                                        mdPreview: !this.state.mdPreview,
                                    })
                                }}
                            >
                                <TabList size="sm" sx={{}} variant="outlined">
                                    <Tab
                                        value={1}
                                        variant={
                                            !this.state.mdPreview
                                                ? 'solid'
                                                : 'plain'
                                        }
                                        color={
                                            !this.state.mdPreview
                                                ? 'primary'
                                                : 'neutral'
                                        }
                                    >
                                        Edit paste
                                    </Tab>
                                    <Tab
                                        value={2}
                                        variant={
                                            this.state.mdPreview
                                                ? 'solid'
                                                : 'plain'
                                        }
                                        color={
                                            this.state.mdPreview
                                                ? 'primary'
                                                : 'neutral'
                                        }
                                    >
                                        Preview
                                    </Tab>
                                </TabList>
                            </Tabs>
                        </Box>
                        {this.state.mdPreview ? (
                            <Box
                                sx={{
                                    p: 1,
                                    border: '1px solid #d3d3d3',
                                    borderRadius: '10px',
                                    whiteSpace: 'pre-wrap',
                                    overflowWrap: 'anywhere',
                                }}
                            >
                                <MarkdownViewer text={this.state.text} />
                            </Box>
                        ) : (
                            <>
                                <Textarea
                                    sx={{}}
                                    label="New paste"
                                    placeholder="Type in here…"
                                    minRows={10}
                                    fullwidth="true"
                                    required
                                    autoFocus
                                    value={this.state.text}
                                    onChange={(event) =>
                                        this.setState({
                                            text: event.target.value,
                                        })
                                    }
                                    startDecorator={
                                        <Box
                                            sx={{ display: 'flex', gap: 0.5 }}
                                        ></Box>
                                    }
                                    endDecorator={
                                        <Typography
                                            level="body3"
                                            sx={{ ml: 'auto' }}
                                        >
                                            {this.state.text.length}{' '}
                                            character(s)
                                        </Typography>
                                    }
                                />
                            </>
                        )}
                        <Button
                            variant="outlined"
                            component="label"
                            color="secondary"
                        >
                            {' '}
                            <UploadFileIcon sx={{ mr: 1 }} />
                            {this.state.isFileAttached ? (
                                <>
                                    <Typography
                                        fontSize="sm"
                                        sx={{
                                            wordBreak: 'break-all',
                                        }}
                                    >
                                        File {this.state.files[0].name} is
                                        attached.
                                        <br />
                                        Time to send: ~
                                        {
                                            //https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
                                            new Date(
                                                (this.state.estimatedTime %
                                                    86400) *
                                                    1000
                                            )
                                                .toUTCString()
                                                .replace(
                                                    /.*(\d{2}):(\d{2}):(\d{2}).*/,
                                                    '$2m $3s'
                                                )
                                        }
                                    </Typography>
                                </>
                            ) : (
                                <Typography
                                    fontSize="sm"
                                    sx={{
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    Attach file (Limit:{' '}
                                    {this.state.limitSize / 1000000} MB)
                                </Typography>
                            )}
                            <input
                                type="file"
                                hidden
                                onChange={(file) =>
                                    this.handleFilesChange(file)
                                }
                            />
                        </Button>

                        <Button
                            disabled={this.state.self_address && this.state.pingData ? false : true}
                            loading={this.state.buttonSendClick}
                            onClick={this.sendText}
                            endDecorator={<SendIcon />}
                            sx={{ mt: 1 /* margin top */ }}
                        >
                            Send
                        </Button>
                    </Sheet>
                </main>
                <footer>
                    <Footer />
                </footer>
            </CssVarsProvider>
        )
    }
}

export default withRouter(UserInput)
