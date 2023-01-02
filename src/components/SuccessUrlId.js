import * as React from 'react'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Alert from '@mui/joy/Alert'
import IconButton from '@mui/joy/IconButton'
import Typography from '@mui/joy/Typography'
import Link from '@mui/joy/Link'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CopyToClipBoard from './CopyToClipboard'

const SERVER_NAME = process.env.SERVER_NAME || 'https://pastenym.ch'

class SuccessUrlId extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            url:
                SERVER_NAME +
                '/#/' +
                this.props.urlId.url_id,
            key: this.props.encKey,
            urlId: this.props.urlId.url_id,
            copyToClipboardButton: 'Copy to clipboard',
            copyToClipboardTooltipOpen: false,
            ipfs: this.props.urlId.ipfs,
            hash: this.props.urlId.hash,
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
                        Text saved!
                    </Typography>
                    <Typography
                        fontSize="sm"
                        sx={{ opacity: 0.8, wordBreak: 'break-word' }}
                    >
                        Your text is accessible at <Link href={this.state.url} title="Go to your newly created paste!">{this.state.url}</Link>
                        <CopyToClipBoard textToCopy={this.state.url} />
                        {this.state.key ? (
                            <>
                            {' '} using key: <b>{this.state.key}</b> <CopyToClipBoard textToCopy={this.state.key} />.
                            <br />Or using this link: <Link href={this.state.url + "&key=" + this.state.key} title="Go to your newly created paste!">{this.state.url + "&key=" + this.state.key}</Link>
                            <CopyToClipBoard textToCopy={this.state.url + "&key=" + this.state.key} />
                            </>
                        ) : ('')}
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
