/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from 'react';
import '../../assets/stream-peer-block/stream-peer-block.css';
import '../../assets/home/home.css';

import { Sidebar } from 'primereact/sidebar';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import 'primeicons/primeicons.css';

import AppLogo from '../../components/app-logo/app-logo';
import StreamPeerBlock from '../../components/stream-peer-block/stream-peer.block';
import PeerConnection from '../../shared/peerjs/peer-connection';
import PeerConfiguration from '../../shared/peerjs/peer-configuration';
import PeerJsService from '../../services/peerjs/peer-js.service';
import { Subscription } from 'rxjs';
import { EventEmitter } from '../../shared/peerjs/event-emitter';
import { useNavigate } from 'react-router-dom';
import PeerInstance from '../../shared/peerjs/peer-instance';

function Home() {
    const [nickname, setNickname] = useState<string>('');
    const [peerId, setPeerId] = useState<string>('');
    let [connectionList, setConnectionList] = useState<Array<PeerConnection>>([]);
    const [mediaStreams, setMediaStreams] = useState<Array<PeerConnection>>([]);
    const [newPeerId, setNewPeerId] = useState<string>('');
    const [streaming, setStreaming] = useState<boolean>(false);
    const [connection, setConnection] = useState<PeerInstance | undefined>(undefined);
    let [peerConnectionSubscription, setPeerConnectionSubscription] = useState<Subscription>();
    const [focusedConnection, setFocusedConnection] = useState<PeerConnection | undefined>(undefined);
    const [hasFocusedConnection, setHasFocusedConnection] = useState<boolean>(false);
    const [newConnection, setNewConnection] = useState<PeerConnection | undefined>(undefined);
    const [showConnectionDialog, setShowConnectionDialog] = useState<boolean>(false);
    const [configuration, setConfiguration] = useState<PeerConfiguration>();
    const [mediaStreamSelected, setMediaStreamSelected] = useState<EventEmitter<MediaStream>>(new EventEmitter());
    const [visible, setVisible] = useState(true);

    const toast = useRef<any>(null);

    useEffect(() => {
        console.log('hasFocusedConnection', hasFocusedConnection);
        setConnectionList([]);
        setHasFocusedConnection(false);
        setFocusedConnection(undefined);
        setNickname('');
        setPeerId('');

        peerConnectionSubscription = PeerJsService.connection.subscribe(
            (connection: PeerInstance | null) => {
                if (connection === null || connection === undefined) {
                    console.log('No peer connection exists');
                    setConnection(undefined);
                    setTimeout(() => {
                        // navigate('/login');
                    }, 200);
                    return;
                }
                // if (connection !== undefined) {
                //     return;
                // }
                console.log('PeerInstance: ', connection);

                setConnection(connection);

                connection?.onNewPeerConnectedEvent.subscribe(
                    (newConnection: PeerConnection) => {
                        connectionList.push(newConnection);
                        connectionList = removeDuplicateObjects(connectionList);
                        setConnectionList(connectionList);
                        console.log('connectionList', connectionList);
                        // TODO: If another peer connects, the previous popup gets overwritten.
                        if (newConnection.selfInitiated) {
                            setNewConnection(newConnection);
                            setShowConnectionDialog(true);
                        }
                        toast.current.show({ severity: 'success', summary: newConnection.nickname, detail: 'Peer connected' });
                    }
                );
                connection?.onPeerDisconnectedEvent.subscribe(
                    (removedPeer: PeerConnection) => {
                        const n = connectionList.findIndex(
                            (value) => value.id === removedPeer.id
                        );
                        // console.log(n);
                        if (n !== -1) {
                            toast.current.show({ severity: 'warning', summary: removedPeer.nickname, detail: 'Peer disconnected' });
                            connectionList.splice(n, 1);
                        }
                    }
                );
                connection?.onMediaStreamsChanged.subscribe(
                    (mediaStreams: PeerConnection[]) => {
                        console.log('mediaStreams', mediaStreams);
                        setMediaStreams(mediaStreams);
                    }
                );
                connection?.onStoppedStreaming.subscribe(() => {
                    setStreaming(false);
                });
                console.log('nickname', connection.nickname);
                setNickname(connection?.nickname);

                setPeerId(connection?.id);
            }
        );
        setConfiguration(PeerJsService.peerConfiguration);
    }, []);

    const onStreamSelected = (stream: MediaStream) => {
        connection?.startStream(stream);
        setStreaming(true);
    }

    const copyMyId = () => {
        navigator.clipboard.writeText(peerId);
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'ID Copied!' });
    };

    const disconnect = () => {
        PeerJsService.disconnect();
    }

    const addPeer = () => {
        connection?.addPeer(newPeerId);
        setNewPeerId('');
    }

    const removePeer = (peerId: string) => {
        connection?.removePeer(peerId);
        connectionList = connectionList.filter(item => item.id !== peerId);
        setConnectionList((arr) => [
            ...arr,
            ...connectionList
        ]);
    }

    const openStreamScreenPicker = () => {
        if (streaming) {
            connection?.stopStream();
        } else {
            navigator.mediaDevices.getDisplayMedia().then((stream) => {
                console.log('stream', stream);
                mediaStreamSelected.emit(stream);
                onStreamSelected(stream);
            });
        }
    }

    const toggleFocus = (connection: PeerConnection) => {
        console.log('focus');
        if (focusedConnection === undefined && connection !== undefined) {
            setFocusedConnection(connection);
            setHasFocusedConnection(true);
            console.log('hasFocusedConnection', hasFocusedConnection);

        } else {
            setHasFocusedConnection(false);
            setFocusedConnection(undefined);
        }
    }

    const removeDuplicateObjects = (array: PeerConnection[]): PeerConnection[] => {
        // Use a Set to keep track of unique IDs
        const uniqueIds = new Set<string>();

        // Filter the array to keep only objects with unique IDs
        const uniqueArray = array.filter((obj) => {
            if (!uniqueIds.has(obj.id)) {
                uniqueIds.add(obj.id);
                return true;
            }
            return false;
        });

        return uniqueArray;
    };

    const openCredits = () => {
        // this.settingsDialog.showDialog();
    }

    return (
        <React.Fragment>
            <div className="connected-container h-full w-full">
                <Toast ref={toast} />
                <Sidebar visible={visible} onHide={() => setVisible(true)}>
                    <div>
                        <div className="p-2 sidepanel-container">
                            <AppLogo />
                            <div className="peer-info">
                                <div className="id-line">
                                    <div className="float-left id-line"><span onClick={copyMyId} className="clipboard mt-1 float-left"></span> <span className="float-right">ID:</span></div>
                                    <div className="float-right text-right max-width-100">{peerId}</div>
                                </div>
                                <div className="id-line">
                                    <div className="float-left">Name:</div>
                                    <div className="float-right">{nickname}</div>
                                </div>
                            </div>
                            <div className="conn-stream-container">
                                <div className="connections-section">
                                    <h5 className="text-center">CONNECTIONS</h5>
                                    <div className="add-peer">
                                        <InputText value={newPeerId} placeholder='Remote ID' className='add-peer-textfield' onChange={(e) => setNewPeerId(e.target.value)} />
                                        <Button label="+" className='add-peer-button p-button-sm' onClick={addPeer} />
                                    </div>
                                    <ul className="peer-collection-container">
                                        {connectionList.map((connection) => {
                                            console.log('connection', connection);

                                            return (
                                                <li className='peer-connection' key={connection.id}>
                                                    <span className={`peer-status-connected ${connection.stream !== undefined ? 'peer-status-streaming' : ''}`}></span>
                                                    <span className='peer-status-line'>
                                                        {connection.nickname}
                                                        <Tooltip target='.connection-id' autoZIndex />
                                                        <i className='pi pi-info-circle connection-id' data-pr-tooltip={connection.id}></i>
                                                        <div className='peer-remove' onClick={() => removePeer(connection.id)}>X</div>
                                                    </span>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                                <div className="stream-section" onClick={openStreamScreenPicker}>
                                    <h5>STREAM</h5>
                                    <div className={`${streaming ? 'screen-streaming' : ''}`}></div>
                                </div>
                            </div>
                            <div className="footer">
                                <a className="disconnect-button" onClick={disconnect}>
                                    <Tooltip target='.disconnect' />
                                    <i className="pi pi-times-circle disconnect" data-pr-tooltip='Disconnect'></i>
                                </a>
                                <a onClick={openCredits}>
                                    <Tooltip target='.settings' />
                                    <i className="pi pi-cog settings" data-pr-tooltip='Settings'></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </Sidebar>

                <div className="peer-stream-container">
                    {hasFocusedConnection === false ?
                        mediaStreams.map((stream: any) => {
                            return (
                                <StreamPeerBlock
                                    key={stream.nickname}
                                    title={stream.nickname}
                                    mediaStream={stream.stream}
                                // onDoubleClick={() => toggleFocus(stream)}
                                />
                            )
                        })
                        :
                        <StreamPeerBlock
                            // className='focused-peer-block'
                            key={focusedConnection!.nickname}
                            title={focusedConnection!.nickname}
                            mediaStream={focusedConnection!.stream!}
                            // onDoubleClick={() => toggleFocus(focusedConnection!)}
                            focused={true} />
                    }
                </div>
            </div>
            {/* <app-stream-screen-picker (mediaStreamSelected) = "onStreamSelected($event)" #streamScreenPicker ></app - stream - screen - picker >
            <app-peer-connection-dialog * ngIf="showConnectionDialog"(accepted) = "connection.acceptConnection($event); showConnectionDialog = false"(rejected) = "connection.denyConnection($event); showConnectionDialog = false"[newConnection] = "newConnection"[display] = "true" #peerConnectionDialog ></app - peer - connection - dialog >
                <app-settings-dialog #settingsDialog [configuration] = "configuration" ></app - settings - dialog > */}
        </React.Fragment>
    )
}

export default Home;
