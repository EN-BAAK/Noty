import documentPicker from "react-native-document-picker";
import TrackPlayer from "react-native-track-player";

const requestMediaPermission = async (
  PermissionsAndroid: any
): Promise<boolean> => {
  try {
    const storagePermission =
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    const hasStoragePermission = await PermissionsAndroid.check(
      storagePermission
    );

    if (!hasStoragePermission) {
      const grantedStoragePermission = await PermissionsAndroid.request(
        storagePermission
      );

      return grantedStoragePermission === PermissionsAndroid.RESULTS.GRANTED;
    } else return true;
  } catch (err) {
    console.log("Error While Get Image Permission", err);
    return false;
  }
};


export const selectFile = async (
  PermissionsAndroid: any,
  allowMultiSelection: boolean,
  type: any,
  setContext: (data: any[]) => void
): Promise<any> => {
  try {
    const status: boolean = await requestMediaPermission(PermissionsAndroid);
    if (!status) return;

    const result = await documentPicker.pick({
      allowMultiSelection,
      type,
      mode: "import",
      copyTo: "cachesDirectory",
      transitionStyle: "flipHorizontal",
      presentationStyle: "fullScreen",
    });

    setContext(result);
  } catch (err) {
    console.error("Select file failed", err);
  }
};

export const onRegisterPlayback = async () => {
  try {
    TrackPlayer.addEventListener("remote-play", () => {
      TrackPlayer.play();
    });

    TrackPlayer.addEventListener("remote-pause", () => {
      TrackPlayer.pause();
    });

    TrackPlayer.addEventListener("remote-next", () => {
      TrackPlayer.skipToNext();
    });

    TrackPlayer.addEventListener("remote-previous", () => {
      TrackPlayer.skipToPrevious();
    });

    TrackPlayer.addEventListener("remote-stop", () => {
      TrackPlayer.destroy();
    });
  } catch (error) {
    console.error("Error inside audio services", error);
  }
};
