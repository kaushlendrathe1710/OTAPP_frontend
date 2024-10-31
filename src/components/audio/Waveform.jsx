import React, { memo, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import {
  AiFillAudio,
  AiOutlineArrowDown,
  AiOutlineAudio,
} from "react-icons/ai";
import styles from "../../styles/audio.module.scss";
import formatDuration from "../../lib/formatDuration";

const formWaveSurferOptions = (
  ref,
  height = 60,
  progressColor = "#666",
  waveColor = "#ccc"
) => ({
  container: ref,
  waveColor: waveColor,
  progressColor: progressColor,
  cursorColor: "#ba3ff3",
  barWidth: 2,
  barRadius: 2,
  barGap: 3,
  hideScrollbar: true,
  cursorWidth: 2,
  responsive: true,
  height: height,
  maxCanvasWidth: 380,
  // If true, normalize by the maximum peak instead of 1.0.
  normalize: true,
  // Use the PeakCache to improve rendering speed of large waveforms.
  partialRender: true,
  scrollParent: false,
  xhr: {
    mode: "no-cors",
  },
});

const PLAYBACK_RATES = [0.25, 0.5, 1, 1.5, 2];

function Waveform({
  url,
  height = 60,
  width = 280,
  isOwnMessage = false,
  showPlaybackRate = true,
  waveColor = "",
  micButtonSize = 48,
}) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlay] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState({
    playbackIndex: 2,
    playbackRate: PLAYBACK_RATES[2],
  });
  const [error, setError] = useState(null);

  // create new WaveSurfer instance
  useEffect(() => {
    // console.log("url: ", url);
    setPlay(false);

    const options = formWaveSurferOptions(
      waveformRef.current,
      height,
      isOwnMessage ? "#ba3ff3" : "#666",
      waveColor !== "" ? waveColor : isOwnMessage ? "#f1f1f1" : "#ccc"
    );
    wavesurfer.current = WaveSurfer.create(options);

    wavesurfer.current.load(url);

    wavesurfer.current.on("ready", function () {
      // make sure object still available when file loaded
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(1);
        wavesurfer.current.setPlaybackRate(playbackRate.playbackRate);
        setDuration(wavesurfer.current?.getDuration());
      }
    });
    wavesurfer.current.on("audioprocess", () => {
      setCurrentTime(wavesurfer.current?.getCurrentTime());
    });
    wavesurfer.current.on("finish", () => {
      // reset audio seek bar
      wavesurfer.current.seekTo(0);
      setPlay(false);
    });
    wavesurfer.current.on("error", (error) => {
      // reset audio seek bar
      console.error("This error occurs while loading audio: ", error);
      setError(error);
    });

    // Removes events, elements and disconnects Web Audio nodes.
    return () => {
      wavesurfer.current.destroy();
      wavesurfer.current.unAll();
    };
  }, [url]);

  const handlePlayPause = () => {
    setPlay(!playing);
    wavesurfer.current.playPause();
  };
  const handlePlaybackRate = () => {
    let newPlaybackRateIndex = playbackRate.playbackIndex + 1;
    let newPlaybackRate = PLAYBACK_RATES[newPlaybackRateIndex];
    if (newPlaybackRate) {
      wavesurfer.current.setPlaybackRate(newPlaybackRate);
      setPlaybackRate({
        playbackIndex: newPlaybackRateIndex,
        playbackRate: newPlaybackRate,
      });
    } else {
      newPlaybackRateIndex = 0;
      newPlaybackRate = PLAYBACK_RATES[newPlaybackRateIndex];
      wavesurfer.current.setPlaybackRate(newPlaybackRate);
      setPlaybackRate({
        playbackIndex: newPlaybackRateIndex,
        playbackRate: newPlaybackRate,
      });
    }
  };

  return (
    <div style={{ width }} className={styles.waveformContainer}>
      {error && (
        <div style={{ color: "#333", fontSize: 12 }}>Something went wrong.</div>
      )}
      <div className={styles.waveform} ref={waveformRef} />
      <div
        className={styles.controls}
        style={{ width: micButtonSize, height: micButtonSize }}
      >
        {!error ? (
          <button onClick={handlePlayPause}>
            {!playing ? (
              <AiOutlineAudio size={24} color="white" />
            ) : (
              <AiFillAudio size={24} fill="white" />
            )}
          </button>
        ) : (
          <button title="Download recording">
            <a href={url} download={true}>
              <AiOutlineArrowDown size={24} fill="white" />
            </a>
          </button>
        )}
      </div>
      <div className={styles.timingWrapper}>
        <span>
          {playing ? formatDuration(currentTime) : formatDuration(duration)}
        </span>
        {showPlaybackRate && (
          <button onClick={handlePlaybackRate}>
            {playbackRate.playbackRate} x
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(Waveform);
