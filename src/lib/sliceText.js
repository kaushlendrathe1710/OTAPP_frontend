/**
 * 
 * @param {string} text 
 * @param {number} sliceUpto 
 * @returns {string}
 */
export default function sliceText(text, sliceUpto=20){
    if(typeof text !== "string"){
        return "";
    }
    return text.length > sliceUpto ? text.slice(0, sliceUpto) + "...": text;
}