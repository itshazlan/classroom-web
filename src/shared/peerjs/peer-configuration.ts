class PeerConfiguration {
    host!: string;
    port!: number;
    pingInterval!: number;
    secure!: boolean;
    iceServers!: string[];
}

export default PeerConfiguration;
