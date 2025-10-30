import { colors, type PaletteOptions } from "@mui/material";

const DarkPalette: PaletteOptions = {
    primary: {
        main: '#FF9933',
        light: '#ffc68e',
        dark: '#d66b00',
        contrastText: '#242424',
    },
    secondary: {
        main: '#2a7cf8',
        light: '#75aafa',
        dark: '#1b51a1',
        contrastText: colors.common.black,
    }
};
const LightPalette: PaletteOptions = {
    primary: {
        main: colors.blue[700],
        light: colors.blue[400],
        dark: colors.blue[900],
        contrastText: colors.common.white,
    }
};

export const Palettes: { [key: string]: PaletteOptions } = {
    dark: DarkPalette,
    light: LightPalette
};

