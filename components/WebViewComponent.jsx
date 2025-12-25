import { WebView } from "react-native-webview";

const WebViewComponent = ({ otherStyles, navUrl, onNavigationStateChange }) => {
  return (
    <>
      <WebView
        className={`mt-6 ${otherStyles}`}
        source={{ uri: navUrl }}
        onNavigationStateChange={onNavigationStateChange}
      />
    </>
  );
};

export default WebViewComponent;
