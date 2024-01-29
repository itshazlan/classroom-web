import { BehaviorSubject } from "rxjs";
import PeerConfiguration from "../../shared/peerjs/peer-configuration";
import PeerInstance from "../../shared/peerjs/peer-instance";

class PeerJsService {
    public connectionSubject = new BehaviorSubject<PeerInstance>(null!);
    readonly connection = this.connectionSubject.asObservable();
    peerConnection: PeerInstance | undefined = undefined;
    peerConfiguration: PeerConfiguration | undefined = undefined;

    constructor() {
        this.peerConfiguration = new PeerConfiguration();
        this.peerConfiguration.host = '0.peerjs.com';
        this.peerConfiguration.port = 443;
        this.peerConfiguration.secure = true;
        this.peerConfiguration.pingInterval = 2000;
        this.peerConfiguration.iceServers = ['stun:stun.l.google.com:19302'];
    }

    public connect(nickname: string, connectedCallback: () => void) {
        if (this.peerConnection !== undefined) {
            this.peerConnection.connected.unsubscribe();
        }
        console.log('Create PeerConnection Instance');

        this.peerConnection = new PeerInstance(nickname, this.peerConfiguration!);
        this.peerConnection.connected.subscribe((isConnected) => {
            if (isConnected) {
                console.log('Notify new peerConnection instance');
                connectedCallback();
                this.connectionSubject.next(this.peerConnection!);
                console.log(this.connectionSubject.getValue());
                
            }
        });
    }

    public disconnect() {
        console.log(this.connectionSubject.value);

        if (this.connectionSubject.value !== null) {
            this.connectionSubject.getValue().destroy();
            this.connectionSubject.next(null!);
            console.log('Disconnect.');
        }
    }
}

const peerJsService = new PeerJsService();
export default peerJsService;
