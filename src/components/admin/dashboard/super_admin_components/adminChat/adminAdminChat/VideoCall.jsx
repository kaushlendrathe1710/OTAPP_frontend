import Video from "../../../../../Video/Video";
import VideoState from "../../../../../../context/VideoState";

import Options from "../../../../../options/Options";

const VideoCall = () => {
    return (
        <VideoState>
            <div className="App" style={{ height: "100%", width: "100%" }}>
                <Video />
                <Options />
            </div>
        </VideoState>
    );
};

export default VideoCall;
