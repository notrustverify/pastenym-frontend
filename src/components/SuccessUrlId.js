import * as React from 'react'

/*
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
*/
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Alert from '@mui/joy/Alert'
import IconButton from '@mui/joy/IconButton'
import Typography from '@mui/joy/Typography'
import Link from '@mui/joy/Link'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

import CopyToClipBoard from './CopyToClipboard'

const SERVER_NAME = process.env.SERVER_NAME || 'https://pastenym.ch'

/*
const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} sx={{ backgroundColor: "blue" }} {...props} />
    ))(({ theme }) => ({
        backgroundColor: "success",
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        sx={{ backgroundColor: "blue" }}
        {...props}
    />
))(({ theme }) => ({
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled((props) => (
    <MuiAccordionDetails sx={{ backgroundColor: 'blue' }} {...props} />
))(({ theme }) => ({
    padding: theme.spacing(2),
}));
*/

class SuccessUrlId extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            url: SERVER_NAME + '/#/' + this.props.urlId.url_id,
            key: this.props.encKey,
            urlId: this.props.urlId.url_id,
            urlWithKey: this.props.encKey && this.props.encKey.length > 0 ?
                SERVER_NAME + '/#/' + this.props.urlId.url_id + '&key=' + this.props.encKey
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
                    <Typography fontWeight="lg" mt={0.25} fontSize="13px">
                        Text saved!
                    </Typography>
                    <Typography
                        fontSize="13px"
                        sx={{ opacity: 0.8, wordBreak: 'break-word' }}
                    >                       
                        Your text is accessible using this link:{' '}
                        <Link
                            href={this.state.urlWithKey ? this.state.urlWithKey : this.state.url}
                            title="Go to your newly created paste!"
                        >
                            {this.state.urlWithKey ? this.state.urlWithKey : this.state.url}
                        </Link>
                        <CopyToClipBoard textToCopy={this.state.urlWithKey ? this.state.urlWithKey : this.state.url} />
                        {this.state.urlWithKey ? (
                           /* Accordion WIP
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                                    <Typography>Or separately...</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        Using this link:{' '}
                                        <Link
                                            href={this.state.url}
                                            title="Go to your newly created paste!"
                                        >
                                            {this.state.url}
                                        </Link>
                                        <CopyToClipBoard textToCopy={this.state.url} />
                                        and this key: <b>{this.state.key}</b>{' '}
                                        <CopyToClipBoard textToCopy={this.state.key} />.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            */
                            <details>
                                <summary>Or separately...</summary>
                                <p>
                                    Using this link:{' '}
                                    <Link
                                        href={this.state.url}
                                        title="Go to your newly created paste!"
                                    >
                                        {this.state.url}
                                    </Link>
                                    <CopyToClipBoard textToCopy={this.state.url} />
                                    and this key: <b>{this.state.key}</b>{' '}
                                    <CopyToClipBoard textToCopy={this.state.key} />.
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
