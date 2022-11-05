
export const API_BASE_URL = process.env.APIURL;
export const S3_BUCKET_URL = `https://${process.env.BUCKETNAME}.s3.amazonaws.com`;
export const MAX_FILE_SIZE_BYTES = 1000000;
export const JWT_LOCALSTORAGE_KEY = "cognito_id_token";
export const IDENTITY_LOCALSTORAGE_KEY = "cognito_identity_id";
export const TEMP_PWD_LOCALSTORAGE_KEY = "auto_sign_in";
export const ELIGIBLE_STATES = "eligibleStates";
export const GUARANTEED_TERM = "guaranteedTerm";
export const AMOUNT_INVESTING = "amountInvesting";
export const MYGA = "MYGA";
export var ROUTE_PATHS;
(function(ROUTE_PATHS) {
  ROUTE_PATHS["LOGIN"] = "/auth/login";
  ROUTE_PATHS["REGISTER"] = "/auth/register";
  ROUTE_PATHS["CHECK_EMAIL"] = "/auth/check-email";
  ROUTE_PATHS["DASHBOARD"] = "/dashboard";
  ROUTE_PATHS["FUNDS"] = "/application/qualifiedfunds";
  ROUTE_PATHS["POLICYOWNER"] = "/application/policyowner";
  ROUTE_PATHS["YOUALONE"] = "/application/policyowner/youAlone";
  ROUTE_PATHS["JOINTOWNER"] = "/application/policyowner/jointOwner";
  ROUTE_PATHS["TRUST"] = "/application/policyowner/trust";
  ROUTE_PATHS["WELCOME_BACK"] = "/auth/welcome-back";
  ROUTE_PATHS["COMPLETE_REGISTRATION"] = "/auth/complete-registration";
  ROUTE_PATHS["RESEND_REGISTRATION_LINK"] = "/auth/resend-registration-link";
  ROUTE_PATHS["RESET_PASSWORD"] = "/auth/reset-password";
  ROUTE_PATHS["REQUEST_PASSWORD_RESET"] = "/auth/request-password-reset";
  ROUTE_PATHS["CONFIRM_RESET_PASSWORD"] = "/auth/confirm-reset-password";
  ROUTE_PATHS["SUITABILITY_CHECK"] = "/application/suitability-check";
  ROUTE_PATHS["BENEFICIARY"] = "/application/beneficiary";
  ROUTE_PATHS["PRODUCT_DETAILS"] = "/application/product-details";
  ROUTE_PATHS["PREMIUM"] = "/application/premium";
  ROUTE_PATHS["REVIEW"] = "/application/review";
  ROUTE_PATHS["SIGN"] = "/application/sign";
  ROUTE_PATHS["PAYMENT"] = "/application/sign";
  ROUTE_PATHS["MY_POLICIES"] = "/dashboard/my-policies?index=0";
  ROUTE_PATHS["UPDATE_BENEFICIARY"] =
    "/dashboard/my-policies/updatebeneficiary";
  ROUTE_PATHS["ADD_BENEFICIARY"] = "/dashboard/my-policies/addbeneficiary";
  ROUTE_PATHS["CHANGE_BENEFICIARY"] =
    "/dashboard/my-policies/changebeneficiary";
  ROUTE_PATHS["ADD_PRIMARY_BENEFICIARY"] =
    "/dashboard/my-policies/addbeneficiary";
  ROUTE_PATHS["ADD_CONTINGENT_BENEFICIARY"] =
    "/dashboard/my-policies/addcontingentbeneficiary";
  ROUTE_PATHS["EDIT_PRIMARY_BENEFICIARY"] =
    "/dashboard/my-policies/editbeneficiary";
  ROUTE_PATHS["EDIT_CONTINGENT_BENEFICIARY"] =
    "/dashboard/my-policies/editcontingentbeneficiary";
  ROUTE_PATHS["MY_APPLICATIONS"] = "/dashboard/my-applications";
  ROUTE_PATHS["VIEW_APP"] = "/dashboard/my-policies/viewapplication";
  ROUTE_PATHS["SETTINGS"] = "/settings";
  ROUTE_PATHS["CONTACTS"] = "/contacts";
  ROUTE_PATHS["WITHDRAW_MONEY"] = "/withdrawmoney";
})(ROUTE_PATHS || (ROUTE_PATHS = {}));
export var IMAGE_PATHS;
(function(IMAGE_PATHS) {
  IMAGE_PATHS["OPEN_GRAPH"] = "/images/global/og.webp";
  IMAGE_PATHS["PERSON"] = "/images/contacts/person.svg";
  IMAGE_PATHS["MAILING"] = "/images/contacts/mailing.svg";
  IMAGE_PATHS["RESIDENCE"] = "/images/contacts/residence.svg";
  IMAGE_PATHS["ANNUITANT"] = "/images/contacts/annuitant.svg";
  IMAGE_PATHS["TRUSTADDRESS"] = "/images/contacts/trustaddress.svg";
  IMAGE_PATHS["TRUST"] = "/images/contacts/trust.svg";
  IMAGE_PATHS["ARROW"] = "/images/contacts/app-arrow.svg";
  IMAGE_PATHS["REVIEW_EDIT"] = "/images/contacts/review-edit.svg";
  IMAGE_PATHS["NEWAPP"] = "/images/contacts/newapplication.svg";
  IMAGE_PATHS["POLICY"] = "/images/contacts/mypolicies.svg";
  IMAGE_PATHS["EDIT"] = "/images/contacts/edit.svg";
  IMAGE_PATHS["MYAPP"] = "/images/contacts/myapp.svg";
  IMAGE_PATHS["PAGE_NOT_FOUND"] = "/images/404/page-not-found.svg";
  IMAGE_PATHS["MAN_DOOR"] = "/images/auth/login/man-door.svg";
  IMAGE_PATHS["COMPLETE_PASSWORD_RESET"] =
    "/images/auth/complete-password-reset/man-shield.svg";
  IMAGE_PATHS["WOMAN_SIGNING_UP"] =
    "/images/auth/register/woman-signing-up.svg";
  IMAGE_PATHS["TEXT_FIELD"] =
    "/images/auth/request-password-reset/text-field.svg";
  IMAGE_PATHS["WOMAN_CONFIRMING"] =
    "/images/auth/resend-registration-link/woman-confirming.svg";
  IMAGE_PATHS["CONTACTS"] = "/images/contacts/contacts.svg";
  IMAGE_PATHS["MAIL_ICON"] = "/images/contacts/mail-icon.svg";
  IMAGE_PATHS["LOGO"] = "/images/navbar/Pillar_Logo_stsm.png";
  IMAGE_PATHS["CHAT"] = "/images/navbar/Group 179.png";
  IMAGE_PATHS["AWAIT_PAYMENT"] = "/images/contacts/awaiting-payment.svg";
  IMAGE_PATHS["DECLINED"] = "/images/contacts/declined.svg";
  IMAGE_PATHS["UNDER_REVIEW"] = "/images/contacts/under-review.svg";
  IMAGE_PATHS["DELETE"] = "/images/contacts/delete.svg";
  IMAGE_PATHS["DELETE_BIG"] = "/images/contacts/deleteiconbig.svg";
  IMAGE_PATHS["ADD_ICON"] = "/images/contacts/addicon.svg";
  IMAGE_PATHS["CROSS_DELETE_ICON"] = "/images/contacts/crossdeleteicon.svg";
  IMAGE_PATHS["BACK_ARROW"] = "/images/contacts/backarrow.svg";
  IMAGE_PATHS["EDIT_PENCIL_ICON"] = "/images/contacts/pencilediticon.svg";
  IMAGE_PATHS["SHOW_EYE"] = "/images/contacts/openeye.svg";
  IMAGE_PATHS["HIDE_EYE"] = "/images/contacts/closeeye.svg";
  IMAGE_PATHS["ACTIVEPOL"] = "/images/navbar/activepol-img.png";
  IMAGE_PATHS["APPLICATION"] = "/images/navbar/application-img.png";
})(IMAGE_PATHS || (IMAGE_PATHS = {}));
