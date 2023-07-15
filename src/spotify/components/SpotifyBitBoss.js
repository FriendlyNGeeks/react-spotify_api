import React, { useEffect, useState } from "react";
import { Box, Button, Stack, CircularProgress, LinearProgress, linearProgressClasses, styled as MU_Styled, } from "@mui/material";
import styled from "styled-components";
import '../assets/css/Bitboss.scss';

export default function SpotifyBitBoss (props) {
    const [socket, setSocket] = useState(props.socket);
    const [loading, setLoading] = useState(true);
    const [APIerror, setAPIerror] = useState(false);
    const [nowPlayingItem, setNowPlayingItem] = useState(null);
    const [progress, setProgress] = useState(0);
    const socketAPI = props.data.api_route;
    const BorderLinearProgress = MU_Styled(LinearProgress)(({ theme }) => ({
        height: '100%',
        borderRadius: 0,
        [`&.${linearProgressClasses.colorPrimary}`]: {
          backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 'hsla(0,0%,71%,.5)' : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
          borderRadius: '0 500px 500px 0',
          backgroundColor: theme.palette.mode === 'light' ? '#f24e5d' : '#308fe8',
        },
      }));
    const Center = styled.div`
    position: fixed;
    top: 0px;
    left: 0px;
    width: 440px;
    height: 86px;
    `;
    const bitBossWrapperStyle = {
        position: 'relative',
        zIndex: '1',
        fontFamily: 'Nunito',
        fontSize: '18px',
        color: 'rgb(255, 255, 255)',
        fontWeight: 'bold',
        textShadow: 'rgb(0, 0, 0) 1px 1px 1px',
        textAlign: 'left',
        lineHeight: '1.5',
        width: '100%',
        height: "100%"
    }

    useEffect(() => {
        if (!socket) return;
        if (socketAPI == 'socket') {
            socket.on("setNowPlayingItem", (nowPlayingItems) => {
                setLoading(false);
                setNowPlayingItem(nowPlayingItems);
                setProgress(((nowPlayingItems.position/nowPlayingItems.duration)*100));
            })
        }

    }, [socket]);

    useEffect(() => {

        async function getNowPlayingItem() {
        try {
            const response = await new Promise((resolve, reject) => {
            socket.emit('getNowPlayingItem', (data) => {
                if (data.error) {
                reject(data.error);
                } else {
                resolve(data);
                }
            });
            });
        
            return response;
        } catch (error) {
            console.log('getNowPlayingItem error:', error);
            return null;
        }
        }
        if (socketAPI == 'socket') {
            socket.on("handShakeEstablished", () => {
                getNowPlayingItem();
            })
        }
    
    }, [socket]);
    
    return (
        <Center>
            <Box sx={{height: '86px', width: '440px', position: 'relative', display: 'block'}}>
                {loading ?
                <Stack align="center" mb={8}>
                    <Button href="/"><CircularProgress /></Button>
                </Stack>
                :
                <div className="widget-default bit-boss-wrapper has-album"  style={bitBossWrapperStyle}>
                    <div className="frame albumArt-container" style={{backgroundColor: '#65507f', '--height':'86px'}}>
                        <Button sx={{position:'absolute', top:'0', right:'0', bottom:'0', left:'0'}} href="/">
                            <div className="albumArt" style={{backgroundImage:`url(${nowPlayingItem.albumImageUrl})`}}></div>
                        </Button>
                    </div>
                    <div className="progress-container" style={{backgroundColor: '#65507f', '--height':'86px'}}>
                        <div className="progress-bar">
                            <BorderLinearProgress className="progress-bar-inner" variant="determinate" value={progress} />
                        </div>
                        <div className="progress-text">{nowPlayingItem.position}/{nowPlayingItem.duration}</div>
                    </div>
                    <div className="frame big-box" style={{backgroundColor: '#65507f', '--height':'86px'}}>
                        <div className="frame-lower">
                        </div>
                    </div>
                </div>
                }
            </Box>
        </Center>
    )
}