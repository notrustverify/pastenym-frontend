import * as React from 'react'
import Typography from '@mui/joy/Typography'
import CircularProgress from '@mui/joy/CircularProgress'
import Chip from '@mui/joy/Chip'
import CheckCircle from '@mui/icons-material/CheckCircle'
import Unpublished from '@mui/icons-material/Unpublished'


class MixnetInfo extends React.Component {
    render() {
        return (
            <>
                <Typography
                    level="h6"
                    sx={{
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                    }}
                >
                    <b>Anon text sharing service</b> - {' '}
                    <Chip
                        color={this.props.pingData ? 'success' : 'neutral'}
                        variant="soft"
                        size="md"
                        startDecorator={
                            this.props.pingData ?  <CheckCircle /> : <Unpublished />
                        }
                        style={{
                            maxWidth: '20%'
                        }}
                    >
                         
                         
                         <Typography
                         
                         style={{ position: 'relative', top: '3px' }}
                         >
                         Connected
                         </Typography>
                    </Chip>
                </Typography>
                <Typography
                    fontSize="13px"
                    sx={{
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                    }}
                >
                    <b>Client id</b>{' '}
                    {this.props.self_address ? (
                        this.props.self_address.split('@')[0].slice(0, 60) +
                        '...'
                    ) : (
                        <CircularProgress
                            sx={{
                                '--CircularProgress-size': '17px',
                                '--CircularProgress-trackThickness': '3px',
                                '--CircularProgress-progressThickness': '3px'
                            }}
                        />
                    )}
                    <br />
                    <b>Connected Gateway</b>{' '}
                    {this.props.self_address ? (
                        this.props.self_address.split('@')[1]
                    ) : (
                        <CircularProgress
                            sx={{
                                '--CircularProgress-size': '17px',
                                '--CircularProgress-trackThickness': '3px',
                                '--CircularProgress-progressThickness': '3px',
                            }}
                        />
                    )}
                </Typography>
            </>
        )
    }
}

export default MixnetInfo
