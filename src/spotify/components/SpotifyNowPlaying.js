import React, { useEffect, useState } from "react";
import {  Box, Stack, Image, TextField } from "@mui/material";
import styled from "styled-components";
import {getNowPlayingItem, Logo, Animation} from "./index";
import SpotifyLogo from "./SpotifyLogo";
import PlayingAnimation from "./PlayingAnimation";

const SpotifyNowPlaying = (props) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState({});

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
    });
  });

  return (
    <Center>
      <Box>
        {loading ?
          <Stack align="center" mb={8}>
            <CircularProgress color="gray.500" />
          </Stack>
          :
          <Stack width="full" mb={result.isPlaying ? 2 : 4} spacing={3}>
            <Stack spacing={2} direction="row" align="center">
              <Logo />
              <Text fontWeight="semibold">{result.isPlaying ? 'Now playing' : "Currently offline"}</Text>
              {result.isPlaying && <PlayingAnimation />}
            </Stack>
            {result.isPlaying &&
              <Box sx={{p:2, border: '1px', borderRadius:'3px'}}>
                <Stack direction="row" spacing={4} align="center">
                  <Image
                    alt={`${result.title} album art`}
                    src={result.albumImageUrl}
                    width={12}
                    height={12}
                    borderRadius="sm"
                  />
                  <Stack spacing={0} overflow="hidden">
                    <TextField
                      fontWeight="semibold"
                      width="full"
                      isTruncated
                      color="alph"
                    >
                      {result.title}
                    </TextField>
                    <TextField
                      color="gray.500"
                      isTruncated
                    >
                      {result.artist}
                    </TextField>
                    <TextField></TextField>
                  </Stack>
                </Stack>
              </Box>
            }
          </Stack>
        }
      </Box>
    </Center>
  )
};

export default SpotifyNowPlaying;

const Center = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;