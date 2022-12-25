import * as React from 'react'
import Typography from '@mui/joy/Typography'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import Chip from '@mui/joy/Chip'
import CloudOffIcon from '@mui/icons-material/CloudOff'
import CloudQueueIcon from '@mui/icons-material/CloudQueue'

class TextStats extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Typography
                level="body2"
                startDecorator={<InfoOutlined />}
                endDecorator={
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
                            style={{ position: 'relative', top: '-7px' }}
                        >
                            IPFS
                        </Chip>
                }
                sx={{
                    alignItems: 'flex-start',
                    maxWidth: 500,
                    wordBreak: 'break-all',
                }}
            >
                {'Views: ' +
                    this.props.num_view +
                    ' - ' +
                    'Created on: ' +
                    new Date(this.props.created_on).toLocaleString() +
                    ' - '}
            </Typography>
        )
    }
}

export default TextStats
