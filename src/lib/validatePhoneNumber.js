import * as Yup from "yup";
import "yup-phone";

export function validatePhoneNumber(phoneNumber, countryCode, phoneCode) {
  if (!phoneNumber || !countryCode || !phoneCode) return false;
  const phoneSchema = Yup.string()
    .phone(countryCode.toUpperCase() || "", true, "Phone number is invalid")
    .required();

  try {
    phoneSchema.validateSync(phoneCode + phoneNumber);
    // console.log("*** PHONE NUMBER VALIDATE ***: ", phoneCode + phoneNumber)
    return true;
  } catch (error) {
    // console.log("*** ", error.message); // → this is invalid
    return false;
  }
}
