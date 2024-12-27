import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from '../Components/MUI/AppNavbar';
import Header from '../Components/MUI/Header';
import MainGrid from '../Components/MUI/MainGrid';
import AppTheme from '../Components/theme/customizations/AppTheme';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '../Components/theme/customizations';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard(props) {

  return (
    <>
    <h1>real one wins</h1>
    </>
    // <AppTheme {...props} themeComponents={xThemeComponents}>
    //   <CssBaseline enableColorScheme />
    //   <Box sx={{ display: 'flex' }}>
    //     {/* <SideMenu /> */}
    //     <AppNavbar />
    //     {/* Main content */}
    //     <Box
    //       component="main"
    //       sx={(theme) => ({
    //         flexGrow: 1,
    //         backgroundColor: theme.vars
    //           ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
    //           : alpha(theme.palette.background.default, 1),
    //         overflow: 'auto',
    //       })}
    //     >
    //       <Stack
    //         spacing={2}
    //         sx={{
    //           alignItems: 'center',
    //           mx: 3,
    //           pb: 5,
    //           mt: { xs: 8, md: 0 },
    //         }}
    //       >
    //         <Header />
    //         <MainGrid />
    //       </Stack>
    //     </Box>
    //   </Box>
    // </AppTheme>
  );
}
