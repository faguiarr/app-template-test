import type { PropsWithChildren } from 'react';

import AppBar from '@mui/material/AppBar';
import { useTheme, type Theme } from '@mui/material';
import { Toolbar as MuiToolbar } from '@mui/material';

import clsx from 'clsx';

import EveryskIcon from '../everyskIcon';

const Toolbar = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
    const theme: Theme = useTheme();

    const styles: { [key: string]: any } = {
        light: {
            color: 'transparent',
            elevation: 0,
            sx: {
                border: "1px solid rgba(0, 0, 0, 0.12)"
            }
        },
        dark: {
            color: '',
            elevation: 1
        }
    };

    return (
        <AppBar position='relative' {...styles?.[theme.palette.mode]}>
            <MuiToolbar >
                <div className={clsx("flex items-center gap-4", className)}>
                    <EveryskIcon color='primary' />
                    {children}
                </div>
            </MuiToolbar>
        </AppBar>
    );
}

export default Toolbar;