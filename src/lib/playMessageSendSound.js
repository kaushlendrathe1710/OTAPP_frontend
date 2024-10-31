import popSendSound from "../assets/sound_effects/pop-send.mp3";

let audio = new Audio(popSendSound);
export async function playMessageSendSound(){
    await audio.play();
}