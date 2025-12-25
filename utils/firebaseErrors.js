export const handleFirebaseError = (error) => {
  let errorMessage = "";
  switch (error.code) {
    // Handle Firebase Auth errors
    case "auth/email-already-in-use":
      errorMessage =
        " This email address is already in use by another account.";
      break;
    case "auth/session-cookie-expired":
      errorMessage = "Your session has expired. Please sign in again.";
      break;
    case "auth/session-cookie-revoked":
      errorMessage = "Your session has expired. Please sign in again.";
      break;
    case "auth/id-token-expired":
      errorMessage = "Your session has expired. Please sign in again.";
      break;
    case "auth/id-token-revoked":
      errorMessage = "Your session has expired. Please sign in again.";
      break;
    case "too-many-requests":
      errorMessage = "Too many requests. Try again later.";
      break;
    case "auth/insufficient-permission":
      errorMessage = "You do not have permission to perform this action.";
      break;
    case "auth/internal-error":
      errorMessage = "An internal error has occurred. Please try again later.";
      break;
    case "auth/invalid-argument":
      errorMessage = "Invalid argument. Please check the values provided.";
      break;
    case "auth/invalid-credential":
      errorMessage =
        "Invalid Email or Password. Please check your credentials and try again.";
      break;
    case "auth/weak-password":
      errorMessage = "Password is too weak.";
      break;

    // Handle Firebase Firestore errors
    // Handle Firebase Storage errors
    // Handle Firebase Realtime Database errors
    // Handle Firebase Cloud Functions errors
    // Handle Firebase Messaging errors
    // Handle Firebase Remote Config errors
    // Handle Firebase Performance Monitoring errors
    // Handle Firebase Crashlytics errors
    // Handle Firebase Analytics errors
    // Handle Firebase Predictions errors
    // Handle Firebase A/B Testing errors
    // Handle Firebase In-App Messaging errors
    // Handle Firebase Dynamic Links errors
    // Handle Firebase Invites errors
    // Handle Firebase AdMob errors

    default:
      errorMessage =
        "Something went wrong. An unknown error occurred. Please try again later.";
      break;
  }

  return errorMessage;
};
