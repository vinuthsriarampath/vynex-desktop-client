import { useEffect, useState } from "react";
import AppUpdate from "../components/custom/AppUpdate";
import Login from "./auth/login/Login";
import OfflinePage from "../pages/OfflinePage";


function Landing() {
    const isDesktop = Boolean(window.ipcRenderer);
    const isOnline = navigator.onLine;

    const [message, setMessage] = useState('');
    const [updateStatus, setUpdateStatus] = useState(false);
    const [isDev, setIsDev] = useState(false);

    useEffect(() => {
        if (!isDesktop) {
            setUpdateStatus(true);
            return;
        };

        if (!isOnline) {
            return;
        }
        if (process.env.NODE_ENV === 'development') {
            setIsDev(true);
        } else {
            setIsDev
        }


        const handler = (_event: any, msg: string) => {
            setMessage(msg)
        }

        const statusHandler = (_event: any, status: boolean) => {
            setUpdateStatus(status);
        }

        window.ipcRenderer!.on('update-message', handler);
        window.ipcRenderer!.on('update-status', statusHandler);

        return () => {
            window.ipcRenderer!.off('update-message', handler);
            window.ipcRenderer!.off('update-status', statusHandler);
        }
    }, [isDesktop]);
    return (
        <>
            <div className=" h-screen flex justify-center items-center">

                {
                    isDev ? (
                        <Login />
                    ) : (
                        isOnline ? (
                            !updateStatus ? (
                                <AppUpdate message={message} />
                            ) : (
                                <Login />
                            )
                        ) : (
                            <OfflinePage />
                        )
                    )
                }
            </div>
        </>
    )
}

export default Landing;