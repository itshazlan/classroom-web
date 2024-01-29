/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';

import '../../assets/stream-peer-block/stream-peer-block.css';
import AppLogo from '../../components/app-logo/app-logo';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import PeerJsService from '../../services/peerjs/peer-js.service';
import 'primeicons/primeicons.css';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [nickname, setNickname] = useState<string>('');
    const [missingNickname, setMissingNickname] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(false);
    }, []);

    const tryConnect = () => {
        if (nickname === '') {
            setMissingNickname(true);
            return;
        }
        setMissingNickname(false);

        setLoading(true);
        // const peerJsService = new PeerJsService();
        PeerJsService.connect(nickname, () => {
            console.log('Connected?');
            setLoading(false);
            navigate('/home');
        });
    };

    return (
        <React.Fragment>
            <div className="h-[100vh] w-full flex flex-col justify-evenly items-center">

                <AppLogo />
                <div>
                    <span className="p-float-label">
                        <InputText
                            id='float-input'
                            name='nickname'
                            type='text'
                            className={`${missingNickname ? 'p-invalid' : ''}`}
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)} />
                        <label htmlFor='float-input'>Choose your nickname</label>
                    </span>
                </div>
                <div>
                    <Button label="Connect" type='button' icon={`pi ${loading ? 'pi-spin pi-spinner' : 'pi-check'}`} style={{marginLeft: '10px', marginRight: '10px'}} onClick={tryConnect} />
                </div>
            </div>
        </React.Fragment>
    )
}

export default Login;
