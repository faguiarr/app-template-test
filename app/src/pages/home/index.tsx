// import { useContext, useEffect } from 'react';

import { Typography } from '@mui/material';
// import { useMutation, useQuery } from '@tanstack/react-query';

// import useAxios from '../../hooks/useAxios';
import Footer from '../../components/ui/footer';
import Toolbar from '../../components/ui/toolbar';
import { useMemo, type ReactNode } from 'react';
// import type { Datastore } from '../../types/datastore';
import PageContainer from '../../components/ui/pageContainer';
// import AppConfigContext from '../../contexts/appConfigContext';
// import { getDatastore, postDatastore } from '../../utils/api/datastore';
// import { useBroadcastChannel } from '../../contexts/broadcastChannelContext/broadcastChannelProvider'; 

const Home = () => {

    // const { api } = useAxios();
    // const appConfig = useContext(AppConfigContext);

    // Example of retrieving a datastore
    // const { data: datastore, isLoading, error } = useQuery({
    //     queryKey: ["datastore", appConfig?.appEnvironmentVar?.datastoreId, appConfig?.appEnvironmentVar?.workspace],
    //     queryFn: () => getDatastore(api, appConfig?.appEnvironmentVar?.datastoreId, appConfig?.appEnvironmentVar?.workspace),
    //     enabled: true,
    //     staleTime: 5 * 60 * 1000,
    //     retry: false,
    // });

    // useEffect(() => {
    //     console.info(datastore, isLoading, error)
    //     // Error handling here
    // }, [error])

    // Example of creatring a datastore
    // const mutation = useMutation({
    //     mutationFn: (payload: any) => postDatastore(api, payload),
    //     onSuccess: (data) => { },
    //     onError: (error) => { },
    // });

    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();

    //     const payload: Datastore = {
    //         name: "Novo datastore",
    //         description: "Exemplo via mutation",
    //         workspace: appConfig?.appEnvironmentVar?.workspace,
    //         data: [[], []]
    //     };

    //     mutation.mutate(payload);
    // };


    // Example of listening to broadcast channel

    // const { subscribe, post } = useBroadcastChannel();

    // useEffect(() => {
    //     const unsubscribe = subscribe((message: any) => {
    //         const { type, payload } = message.data;
    //         if (type === 'EXAMPLE_EVENT') {
    //             // Event handling here
    //         }
    //     });

    //     return () => {
    //         unsubscribe();
    //     }
    // }, []);

    const header: ReactNode = useMemo(() => (
        <Toolbar>
            <Typography variant="h6" component="h6" sx={{ flexGrow: 1 }}>
                Home
            </Typography>
        </Toolbar>
    ), []);

    const footer: ReactNode = useMemo(() => (
        <Footer className='items-center justify-end'>
        </Footer>
    ), []);

    return (
        <PageContainer header={header} footer={footer}>
            <div className="h-1024 w-full">
                {/* Page content goes here */}
            </div>
        </PageContainer>
    );
};

export default Home;

