import { colors, type Theme } from "@mui/material";

export const MuiCssBaseline = {
    styleOverrides: (theme: Theme) => ({
        "*::-webkit-scrollbar": {
            width: 8,
            height: 8,
        },
        "*::-webkit-scrollbar-thumb": {
            borderRadius: 10,
            backgroundColor: '#959595'

        },
        "*::-webkit-scrollbar-thumb:hover ": {
            backgroundColor: '#959595'
        },
        "*:hover::-webkit-scrollbar-thumb": {
            backgroundColor: '#959595'
        },

        "*::-webkit-scrollbar-thumb:active": {
            backgroundColor: theme.palette.primary.main
        },

        "*::-moz-selection": {
            color: (theme.palette.mode === "dark" ? colors.common.black : colors.common.white),
            backgroundColor: theme.palette.primary.main
        },
        "*::selection": {
            color: (theme.palette.mode === "dark") ? colors.common.black : colors.common.white,
            backgroundColor: theme.palette.primary.main
        }
    })
}