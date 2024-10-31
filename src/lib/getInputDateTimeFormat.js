export function getInputOnlyDateFormat(milliseconds){
    // required format: "yyyy-MM-dd"
    return new Date(milliseconds)
    .toLocaleDateString()
    .split("/")
    .reverse()
    .join("-");
}

export function getInputFullDateTimeFormat(milliseconds){
    // required format: "yyyy-MM-ddThh:mm"
    let requireDate = getInputOnlyDateFormat(milliseconds);
    let requiredTime = new Date(milliseconds).toLocaleTimeString().split(":").join(":");
    return requireDate + "T" + requiredTime;
    // return requireDate + requiredTime;
}