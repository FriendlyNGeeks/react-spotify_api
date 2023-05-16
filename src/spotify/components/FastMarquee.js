import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

export default function FastMarquee (props) {
    const [socket, setSocket] = useState(props.socket);
    const [loading, setLoading] = useState(true);
    const [nowPlayingItem, setNowPlayingItem] = useState(null);
    const socketAPI = props.data.api_route;
    
    useEffect(() => {
        if (!socket) return;
        if (socketAPI == 'socket') {
            socket.on("setNowPlayingItem", (nowPlayingItems) => {
                setLoading(false);
                setNowPlayingItem(nowPlayingItems);
            })
        }

    }, [socket]);

    
    return (
        <>
        {loading ?
            <div></div>
            :
            <Marquee>
                <div className="current-artist-song">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{nowPlayingItem.artist} : {nowPlayingItem.title}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
            </Marquee>
        }
        </>
    )
}