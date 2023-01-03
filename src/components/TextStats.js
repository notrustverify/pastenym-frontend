import * as React from 'react'
import Typography from '@mui/joy/Typography'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import Chip from '@mui/joy/Chip'
import CloudOffIcon from '@mui/icons-material/CloudOff'
import CloudQueueIcon from '@mui/icons-material/CloudQueue'
import Box from '@mui/joy/Box'

class TextStats extends React.Component {
    render() {
        return (
            <Box sx={{ display: 'inline-block' }}>
                <Typography
                    level="body2"
                    startDecorator={
                        <InfoOutlined
                            style={{ position: 'relative', top: '3px' }}
                        />
                    }
                    sx={{
                        display: 'inline-block',
                        alignItems: 'flex-start',
                        maxWidth: 500,
                        wordBreak: 'break-all',
                    }}
                >
                    {this.props.num_view
                        ? `Views: ` + this.props.num_view + ` - `
                        : ''}
                    {'Created on: ' +
                        new Date(this.props.created_on).toLocaleString()
                        }
                </Typography>
                    
                {this.props.is_ipfs ? ' -  ' : ''}    
                {this.props.is_ipfs ?  (
                    <Chip
                        color={this.props.is_ipfs ? 'success' : 'neutral'}
                        variant="soft"
                        size="md"
                        startDecorator={
                            this.props.is_ipfs ? (
                                <CloudQueueIcon />
                            ) : (
                                <CloudOffIcon />
                            )
                        }
                        style={{ position: 'relative', top: '-2px' }}
                    >
                       IPFS
                    </Chip>
                ) : (
                    ''
                )}
            </Box>
        )
    }
}

export default TextStats
