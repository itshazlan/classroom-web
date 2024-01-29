import { DataConnection, MediaConnection } from "peerjs";
import PeerMessageData from "./peer-message-data";
import PeerMessageDataType from "./peer-message-data-type";

class PeerConnection {
    id!: string;
    nickname!: string;
    dataConnection!: DataConnection;
    call: MediaConnection | undefined = undefined;
    stream: MediaStream | undefined = undefined;
    selfInitiated = false; // This connection was incoming

    constructor(pDataConnection: DataConnection) {
        if (pDataConnection) {
            this.dataConnection = pDataConnection;
            this.id = this.dataConnection.peer;
            this.nickname = '?';
        }
    }

    close() {
        this.closeCall();
        this.dataConnection.close();
    }

    closeCall() {
        if (this.call !== undefined && this.call.open) {
            console.log('Closed call to: ' + this.call.peer);
            this.call.close();
        }
        this.call = undefined;
        this.stream = undefined;
    }

    sendStopMyStream() {
        this.dataConnection.send(new PeerMessageData(PeerMessageDataType.stopMyStream));
    }

    sendConnectionClose() {
        this.dataConnection.send(new PeerMessageData(PeerMessageDataType.close));
    }
}

export default PeerConnection;
