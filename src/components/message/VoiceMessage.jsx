import React, { memo } from "react";
import Waveform from "../audio/Waveform";

const VoiceMessage = ({ url, width = 280, isOwnMessage=false }) => {
  return <Waveform url={url} height={48} width={width} isOwnMessage={isOwnMessage} />;
};

export default memo(VoiceMessage);
