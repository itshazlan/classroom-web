import React, { useEffect, useRef } from 'react';
import '../../assets/stream-peer-block/stream-peer-block.css';

type StreamPeerBlockProps = {
    mediaStream: MediaStream
    title: string
    focused?: boolean
}

const StreamPeerBlock: React.FC<StreamPeerBlockProps> = ({ mediaStream, ...props }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        console.log(videoRef.current);
        console.log(mediaStream);

        if (videoRef.current && mediaStream) {
            videoRef.current.srcObject = mediaStream;
            // videoRef.current.onloadedmetadata = () => videoRef.current!.play();
        }
    }, [mediaStream]);

    return (
        // <React.Fragment>
        <div className={`block ${props.focused ? 'focused-block' : ''}`}>
            <div className={`video-container ${props.focused ? 'focused-video-container' : ''}`}>
                <div className={`wrap-video ${props.focused ? 'focused-wrap-video' : ''}`}>
                    <video className="media" ref={videoRef} playsInline autoPlay></video>
                    <div className="video-overlay">
                        {props.title}
                    </div>
                </div>
            </div>
        </div>
        // </React.Fragment>
    )
}

export default StreamPeerBlock;
