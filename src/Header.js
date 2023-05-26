import * as React from 'react'
import { Link as RouterLink } from 'react-router-dom'

import Link from '@mui/joy/Link'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { deepmerge } from '@mui/utils'
import { experimental_extendTheme as extendMuiTheme } from '@mui/material/styles'
import colors from '@mui/joy/colors'
import Avatar from '@mui/joy/Avatar'
import {
    extendTheme as extendJoyTheme,
    CssVarsProvider,
    useColorScheme,
} from '@mui/joy/styles'

import Logo from '../public/logo-header.png'
import Disclaimer from './components/Disclaimer'

const { unstable_sxConfig: muiSxConfig, ...muiTheme } = extendMuiTheme({
    // This is required to point to `var(--joy-*)` because we are using
    // `CssVarsProvider` from Joy UI.
    cssVarPrefix: 'joy',
    colorSchemes: {
      light: {
        palette: {
          primary: {
            main: colors.blue[500],
          },
          grey: colors.grey,
          error: {
            main: colors.red[500],
          },
          info: {
            main: colors.purple[500],
          },
          success: {
            main: colors.green[500],
          },
          warning: {
            main: colors.yellow[200],
          },
          common: {
            white: '#FFF',
            black: '#09090D',
          },
          divider: colors.grey[200],
          text: {
            primary: colors.grey[800],
            secondary: colors.grey[600],
          },
        },
      },
      dark: {
        palette: {
          primary: {
            main: colors.blue[600],
          },
          grey: colors.grey,
          error: {
            main: colors.red[600],
          },
          info: {
            main: colors.purple[600],
          },
          success: {
            main: colors.green[600],
          },
          warning: {
            main: colors.yellow[300],
          },
          common: {
            white: '#FFF',
            black: '#09090D',
          },
          divider: colors.grey[800],
          text: {
            primary: colors.grey[100],
            secondary: colors.grey[300],
          },
        },
      },
    },
  });
  
  const { unstable_sxConfig: joySxConfig, ...joyTheme } = extendJoyTheme();
  
  const mergedTheme = ({
    ...muiTheme,
    ...joyTheme,
    colorSchemes: deepmerge(muiTheme.colorSchemes, joyTheme.colorSchemes),
    typography: {
      ...muiTheme.typography,
      ...joyTheme.typography
    }})
  
  mergedTheme.generateCssVars = (colorScheme) => ({
    css: {
      ...muiTheme.generateCssVars(colorScheme).css,
      ...joyTheme.generateCssVars(colorScheme).css
    },
    vars: deepmerge(
      muiTheme.generateCssVars(colorScheme).vars,
      joyTheme.generateCssVars(colorScheme).vars
    )
  });
  
  mergedTheme.unstable_sxConfig = {
    ...muiSxConfig,
    ...joySxConfig
  };

const headerStyle = {
    maxWidth: '1000px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '10px',
    paddingRight: '10px'
}


class Header extends React.Component {


  
    render() {
        return (
            <CssVarsProvider theme={mergedTheme}>
                <header style={headerStyle}>
                <Toolbar
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        borderBottom: 1,
                        borderColor: 'divider',
                    }}
                >
                    <Link component={RouterLink}  to={"/"}>
                        <Avatar
                            alt="PN"
                            src={Logo}
                            variant="outlined"
                            style={{
                                position: 'relative',
                                left: '-10px',
                                top: '-2px',
                            }}
                        />

                        <Button size="small">New paste</Button>
                    </Link>
                    <Typography color="inherit" size="small" level="body1">
                        /
                    </Typography>
                    {!process.env.DISABLE_ABOUT ? (
                        <Link component={RouterLink} to="/about">
                            <Button size="small">About</Button>
                        </Link>
                    ) : (
                        ''
                    )}
                    {!process.env.DISABLE_ABOUT ? (
                        <Typography color="inherit" size="small" level="body1">
                            /
                        </Typography>
                    ) : (
                        ''
                    )}
                    <Typography
                        component="h2"
                        variant="h5"
                        color="inherit"
                        align="center"
                        noWrap
                        sx={{ flex: 1 }}
                    >
                        <Link
                            component={RouterLink}
                            to="/"
                            underline="none"
                            color="inherit"
                            variant="outlined"
                        >
                            Pastenym
                        </Link>
                    </Typography>

                    <Button
                        variant="outlined"
                        size="sm"
                        disabled
                        sx={{
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            align: 'right',
                            wordBreak: 'break-word',
                        }}
                    >
                        Connect
                    </Button>
                </Toolbar>

                <Disclaimer />
                </header>
            </CssVarsProvider>
        )
    }
}

export default Header
