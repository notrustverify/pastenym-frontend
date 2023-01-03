import * as React from 'react'
import Typography from '@mui/joy/Typography'
import CircularProgress from '@mui/joy/CircularProgress'

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
                    <b>Anon text sharing service</b>
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
                                '--CircularProgress-track-thickness': '3px',
                                '--CircularProgress-progress-thickness': '3px',
                            }}
                        />
                    )}
                <br/>
             
                    <b>Connected Gateway</b>{' '}
                    {this.props.self_address ? (
                        this.props.self_address.split('@')[1]
                    ) : (
                        <CircularProgress
                            sx={{
                                '--CircularProgress-size': '17px',
                                '--CircularProgress-track-thickness': '3px',
                                '--CircularProgress-progress-thickness': '3px',
                            }}
                        />
                    )}
                </Typography>
            </>
        )
    }
}

export default MixnetInfo
