import type { PropsWithChildren } from "react"

import { clsx } from 'clsx';
import Paper from "@mui/material/Paper";
import { useTheme, type Theme } from "@mui/material";


const Footer = ({ className, children }: PropsWithChildren<{ className?: string }>) => {
    const theme: Theme = useTheme();
    const paperProps: { [key: string]: any } = {
        light: {
            variant: 'outlined',
        },
        dark: {
            variant: 'elevation'
        }
    };

    return (
        <Paper
            square
            elevation={1}
            component="footer"
            className={clsx("flex shrink-0 grow-0 basis-auto h-16 pl-6 pr-6", className)}
            {...paperProps?.[theme.palette.mode]} >
            {children}
        </Paper>
    );
}

export default Footer;