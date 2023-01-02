import * as React from 'react'

import IconButton from '@mui/joy/IconButton'
import ContentCopy from '@mui/icons-material/ContentCopy'
import Tooltip from '@mui/joy/Tooltip'
import ClickAwayListener from '@mui/material/ClickAwayListener'

class CopyToClipBoard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
        textToCopy: this.props.textToCopy,
        copyToClipboardButton: 'Copy to clipboard',
        copyToClipboardTooltipOpen: false,
    }
    this.copyToClipboard = this.copyToClipboard.bind(this)
  }

  copyToClipboard() {
    try {
        this.setState({
            copyToClipboardTooltipOpen: true,
            copyToClipboardButton: 'Copied',
        })
        //from  https://stackoverflow.com/a/65996386
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(this.state.textToCopy)
        } else {
            // text area method
            let textArea = document.createElement('textarea')
            textArea.value = this.state.textToCopy
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
      <>
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
      </>
    )
  }
}


export default CopyToClipBoard