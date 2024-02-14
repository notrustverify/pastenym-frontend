import * as React from 'react'
import { Icon } from '@iconify/react'
import Typography from '@mui/joy/Typography'
import Link from '@mui/joy/Link'
import EmailIcon from '@mui/icons-material/Email'
import TelegramIcon from '@mui/icons-material/Telegram'
import Medium from '@iconify-icons/bi/medium'
import Matrix from '@iconify/icons-simple-icons/matrix'
import TwitterIcon from '@mui/icons-material/Twitter'
import GitHubIcon from '@mui/icons-material/GitHub'

import { CssVarsProvider } from '@mui/joy/styles'


function Copyright() {
    return (
        <CssVarsProvider>
            <br />
            <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                rel="noreferrer"
                target="_blank"
            >
                Powered by{' '}
                <Link href="https://nymtech.net" underline="none">
                    Nym
                </Link> | <Link href=" https://nymvpn.com/" underline="none">
                    NymVPN
                </Link>
                <br />
                {!process.env.DISABLE_DEVELOPPEDBY ? 'Developed by ' : ''}
                {!process.env.DISABLE_DEVELOPPEDBY ? (
                    <Link
                        href="https://notrustverify.ch"
                        underline="none"
                        rel="noreferrer"
                        target="_blank"
                    >
                        No Trust Verify
                    </Link>
                ) : (
                    ''
                )}
                {!process.env.DISABLE_DEVELOPPEDBY ? <br /> : ''}
                {process.env.HOSTED_BY_URL ? 'Hosted by ' : ''}
                {process.env.HOSTED_BY_URL ? (
                    <Link
                        href={process.env.HOSTED_BY_URL}
                        underline="none"
                        rel="noreferrer"
                        target="_blank"
                    >
                        {process.env.HOSTED_BY_NAME}
                    </Link>
                ) : (
                    ''
                )}
                {process.env.HOSTED_BY_URL ? <br /> : ''}
                {process.env.SOCIAL_EMAIL ? (
                    <Link
                        href={`mailto:` + process.env.SOCIAL_EMAIL}
                        underline="none"
                        color="primary"
                        rel="noreferrer"
                        target="_blank"
                    >
                        <EmailIcon />{' '}
                    </Link>
                ) : (
                    ''
                )}{' '}
                {process.env.SOCIAL_TELEGRAM? (
                    <Link
                        href={process.env.SOCIAL_TELEGRAM}
                        underline="none"
                        color="primary"
                        rel="noreferrer"
                        target="_blank"
                    >
                        <TelegramIcon />{' '}
                    </Link>
                ) : (
                    ''
                )}{' '}
                {process.env.SOCIAL_MEDIUM ? (
                    <Link
                        href={process.env.SOCIAL_MEDIUM}
                        color="primary"
                        rel="noreferrer"
                        target="_blank"
                    >
                        <Icon icon={Medium} />
                    </Link>
                ) : (
                    ''
                )}{' '}
                {process.env.SOCIAL_MATRIX ? (
                    <Link
                        href={process.env.SOCIAL_MATRIX}
                        color="primary"
                        rel="noreferer"
                        target="_blank"
                    >
                        <Icon icon={Matrix} />
                    </Link>
                ) : (
                    ''
                )}{' '}
                {process.env.SOCIAL_TWITTER ? (
                    <Link
                        href={process.env.SOCIAL_TWITTER}
                        color="primary"
                        rel="noreferrer"
                        target="_blank"
                    >
                        <TwitterIcon />
                    </Link>
                ) : (
                    ''
                )}{' '}
                {process.env.SOCIAL_GITHUB ? (
                    <Link
                        href={process.env.SOCIAL_GITHUB}
                        color="primary"
                        rel="noreferrer"
                        target="_blank"
                    >
                        <GitHubIcon />
                    </Link>
                ) : (
                    ''
                )}
            </Typography>
        </CssVarsProvider>
    )
}

class Footer extends React.Component {
    render() {
        return <Copyright />
    }
}

export default Footer
