import type React from "react";
import { useContext, useMemo } from "react";

import CssBaseline from '@mui/material/CssBaseline';
import type { PaletteMode, Theme } from "@mui/material/styles";
import { ThemeProvider, createTheme } from '@mui/material/styles';

// import { Palettes } from "./overrides/palette";
import { MuiCssBaseline } from "./overrides/muiCssBaseline";
import AppConfigContext from "../../contexts/appConfigContext";
import type { AppConfigContextType } from "../../contexts/appConfigContext/appConfigType";

const ThemeProviderWrapper = ({ children }: React.PropsWithChildren) => {
    const appConfig: AppConfigContextType | null = useContext(AppConfigContext);
    const paletteMode: PaletteMode = appConfig?.appEnvironmentVar?.theme || 'dark';

    const theme: Theme = useMemo(() => createTheme({
        // palette: {
        //     mode: paletteMode,
        //     ...Palettes[paletteMode]
        // },
        components: {
            MuiCssBaseline
        }

    }), [paletteMode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}

export default ThemeProviderWrapper;