import React, { useEffect, useState } from "react";
import { Box, Button, Stack, CircularProgress, LinearProgress, linearProgressClasses, styled as MU_Styled, } from "@mui/material";
import { SpotifyLogo, PlayingAnimation, SpotifyAPI as getNowPlayingItem } from "./_index";
import styled from "styled-components";

export default function SpotifyNowPlayingReact (props) {

  const [loading, setLoading] = useState(true);
  const [APIerror, setAPIerror] = useState(false);
  const [result, setResult] = useState({});
  const [progress, setProgress] = useState(0);
  const BorderLinearProgress = MU_Styled(LinearProgress)(({ theme }) => ({
    height: '100%',
    borderRadius: 0,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
  }));

  useEffect(() => {
    Promise.all([
      getNowPlayingItem(
        props.client_id,
        props.client_secret,
        props.refresh_token
      ),
    ]).then((results) => {
      setResult(results[0]);
      setLoading(false);
      setProgress(((result.position/result.duration)*100));
    });
  });

  return (
    <Center>
      <Box>
        {loading ?
          <Stack align="center" mb={8}>
            <CircularProgress />
          </Stack>
          :
          <Stack width="full" mb={result.isPlaying ? 2 : 4} spacing={3}>
            <Stack spacing={2} direction="row" align="center">
              { APIerror && <Button href="/error-api"><SpotifyLogo /></Button>}
              {!result.isPlaying && !APIerror && <Button href="/react"><SpotifyLogo /></Button>}
              {result.isPlaying && <PlayingAnimation />}
            </Stack>
            {result.isPlaying &&
              <Box sx={{p:2, border: '1px', borderRadius:'3px'}}>
                <image  style={{width:'40px', height:'40px'}}
                    alt={`${result.title} album art`}
                    src={result.albumImageUrl}
                    width={12}
                    height={12}
                    borderRadius="sm"
                  />
                <Box component="img"
                  sx={{
                    height: 350,
                    width: 350,
                  }}
                  alt={`${result.title} album art`}
                  src={result.albumImageUrl}
                />
                <p fontWeight="semibold">'Now playing' : {result.title}</p>
                <div className="spotifyProgressBar" style={{height:'40px'}}>
                  <BorderLinearProgress variant="determinate" value={progress} />
                </div>
                {/* <p fontWeight="semibold">'Duration' : {Math.trunc(((result.position/1000)/Math.trunc(result.duration/1000)*100))}</p> */}
              </Box>
            }
          </Stack>
        }
      </Box>
    </Center>
  )
};

const Center = styled.div`
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
`;