import * as React from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Alert from '@mui/joy/Alert'
import IconButton from '@mui/joy/IconButton'
import Typography from '@mui/joy/Typography'
import Link from '@mui/joy/Link'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

import CopyToClipBoard from './CopyToClipboard'

const SERVER_NAME = process.env.SERVER_NAME || 'https://pastenym.ch'

class SuccessUrlId extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            url: SERVER_NAME + '/#/' + this.props.urlId.url_id,
            key: this.props.encKey,
            urlId: this.props.urlId.url_id,
            urlWithKey:
                this.props.encKey && this.props.encKey.length > 0
                    ? SERVER_NAME +
                      '/#/' +
                      this.props.urlId.url_id +
                      '&key=' +
                      this.props.encKey
                    : undefined,
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
                    <Typography fontWeight="lg" mt={0.25} fontSize="16px">
                        <strong>Text saved!</strong>
                    </Typography>
                    <Typography
                        level="body"
                        fontSize="13px"
                        sx={{ opacity: 0.8, wordBreak: 'break-word',color: 'black' }}
                    >
                        Your text is accessible using this link:{' '}
                        <Link
                            href={
                                this.state.urlWithKey
                                    ? this.state.urlWithKey
                                    : this.state.url
                            }
                            title="Go to your newly created paste!"
                        >
                            {this.state.urlWithKey
                                ? this.state.urlWithKey
                                : this.state.url}
                        </Link>
                        <CopyToClipBoard
                            textToCopy={
                                this.state.urlWithKey
                                    ? this.state.urlWithKey
                                    : this.state.url
                            }
                        />
                        {this.state.urlWithKey ? (
                            <details style={{ color: 'black' }}>
                                <summary>
                                    <strong>Or separately...</strong>
                                </summary>
                                <p style={{marginLeft: "13px", marginTop:"-0.2em", marginBottom: "-0.2em"}}>
                                Using this link:{' '}
                                <Link
                                    href={this.state.url}
                                    title="Go to your newly created paste!"
                                >
                                    {this.state.url}
                                </Link>
                                <CopyToClipBoard textToCopy={this.state.url} />
                                and this key: <b>{this.state.key}</b>{' '}
                                <CopyToClipBoard textToCopy={this.state.key} />
                                </p>
                            </details>
                        ) : (
                            ''
                        )}
                        {this.state.ipfs ? (
                            <>
                                {' '}
                                <br />{' '}
                                <ErrorOutlineIcon
                                    style={{ position: 'relative', top: '3px' }}
                                />{' '}
                                IPFS CID: ipfs://{this.state.hash}
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
