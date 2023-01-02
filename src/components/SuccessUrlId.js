import * as React from 'react'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Alert from '@mui/joy/Alert'
import IconButton from '@mui/joy/IconButton'
import Typography from '@mui/joy/Typography'
import Link from '@mui/joy/Link'
import ContentCopy from '@mui/icons-material/ContentCopy'
import Tooltip from '@mui/joy/Tooltip'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const SERVER_NAME = process.env.SERVER_NAME || 'https://pastenym.ch'

class SuccessUrlId extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            url:
                SERVER_NAME +
                '/#/' +
                this.props.urlId.url_id +
                (this.props.encKey ? '&key=' + this.props.encKey : ''),
            urlId: this.props.urlId.url_id,
            copyToClipboardButton: 'Copy to clipboard',
            copyToClipboardTooltipOpen: false,
            ipfs: this.props.urlId.ipfs,
            hash: this.props.urlId.hash,
        }

        this.copyToClipboard = this.copyToClipboard.bind(this)
    }

    copyToClipboard() {
        try {
            this.setState({
                copyToClipboardTooltipOpen: true,
                copyToClipboardButton: 'Copied',
            })
            const textToCopy = this.state.url
            //from  https://stackoverflow.com/a/65996386
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(textToCopy)
            } else {
                // text area method
                let textArea = document.createElement('textarea')
                textArea.value = textToCopy
                // make the textarea out of viewport
                textArea.style.position = 'fixed'
                textArea.style.left = '-999999px'
                textArea.style.top = '-999999px'
                document.body.appendChild(textArea)
                textArea.focus()
                textArea.select()
                return new Promise((res, rej) => {
                    // here the magic happens
                    document.execCommand('copy') ? res() : rej()
                    textArea.remove()
                })
            }
        } catch (err) {
            console.log(err)
        }
    }

    render() {
        return (
            <Alert
                sx={{ alignItems: 'flex-start' }}
                startDecorator={React.cloneElement(<CheckCircleIcon />, {
                    sx: { mt: '2px', mx: '4px' },
                    fontSize: 'xl2',
                })}
                variant="soft"
                color="success"
                endDecorator={
                    <IconButton
                        variant="soft"
                        size="sm"
                        color="success"
                    ></IconButton>
                }
            >
                <div>
                    <Typography fontWeight="lg" mt={0.25}>
                        Text saved
                    </Typography>
                    <Typography
                        fontSize="sm"
                        sx={{ opacity: 0.8, wordBreak: 'break-word' }}
                    >
                        Your text is accessible at <Link href={this.state.url} title="Go to your newly created paste!">{this.state.url}</Link>
                        {'   '}
                        <ClickAwayListener
                            onClickAway={() => {
                                this.setState({
                                    copyToClipboardTooltipOpen: false,
                                    copyToClipboardButton: 'Copy to clipboard',
                                })
                            }}
                        >
                            {
                                //To handle hover and on click tooltip are used
                            }
                            <Tooltip title={this.state.copyToClipboardButton}>
                                <Tooltip
                                    popperprops={{
                                        disablePortal: true,
                                    }}
                                    onClose={() => {
                                        this.setState({
                                            copyToClipboardTooltipOpen: false,
                                            copyToClipboardButton: 'Copy to clipboard',
                                        })
                                    }}
                                    open={this.state.copyToClipboardTooltipOpen}
                                    disableFocusListener
                                    disableTouchListener
                                    title={this.state.copyToClipboardButton}
                                >
                                    <IconButton
                                        variant="plain"
                                        color="neutral"
                                        onClick={this.copyToClipboard}
                                        size="sm"
                                    >
                                        <ContentCopy />
                                    </IconButton>
                                </Tooltip>
                            </Tooltip>
                        </ClickAwayListener>
                        {this.state.ipfs ? (
                            <>
                                {' '}
                                <br /> <ErrorOutlineIcon style={{position: 'relative', top: '3px'}} />  IPFS CID: ipfs://{this.state.hash}
                            </>
                        ) : (
                            ''
                        )}
                    </Typography>
                </div>
            </Alert>
        )
    }
}

export default SuccessUrlId
