import React, { useEffect, useState } from "react";
import { Box, Button, Stack, CircularProgress, LinearProgress, linearProgressClasses, styled as MU_Styled } from "@mui/material";
import { SpotifyLogo, PlayingAnimation, SpotifyBitBoss, FastMarquee } from "./_index";
import styled from "styled-components";
import '../assets/css/Bitboss.scss';

export default function SpotifyNowPlayingSocket (props) {

  const bitboss = true;
  const loading = props.loading;
  const result = props.nowPlaying;
  const [APIerror, setAPIerror] = useState(false);
  const progress = props.progress;
  const BorderLinearProgress = MU_Styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
  }));
  const Center = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 380px;
  height: 80px;
  // transform: translate(-50%, -50%);
  `;
  

  useEffect(() => {

    }, []);

  return (
    <>
      {bitboss ?
      <div className="bitBossAssembly">
        <SpotifyBitBoss socket={props.socket} data={props.data}/>
        <div className="fastMarquee-container">
          <FastMarquee socket={props.socket} data={props.data}/>
        </div>
      </div>
      :
      <Center>
        <Box>
          {loading ?
            <Stack align="center" mb={8}>
              <Button href="/"><CircularProgress /></Button>
            </Stack>
            :
            <Stack width="full" mb={result.isPlaying ? 2 : 4} spacing={3}>
              <Stack spacing={2} direction="row" align="center">
                { APIerror && <Button href="/error-api"><SpotifyLogo /></Button>}
                {!result.isPlaying && !APIerror && <Button href="/"><SpotifyLogo /></Button>}
                {result.isPlaying && <PlayingAnimation />}
              </Stack>
              {result.isPlaying &&
                <Box sx={{p:2, border: '1px', borderRadius:'3px'}}>
                  <Box component="img"
                    sx={{
                      height: 80,
                      width: 80,
                    }}
                    alt={`${result.title} album art`}
                    src={result.albumImageUrl}
                  />
                  <p fontWeight="semibold">'Now playing' : {result.title}</p>
                  <div className="spotifyProgressBar" style={{height:'20px'}}>
                    <BorderLinearProgress variant="determinate" value={progress} />
                  </div>
                </Box>
              }
            </Stack>
          }
        </Box>
      </Center>
    }
    </>
  )
};
