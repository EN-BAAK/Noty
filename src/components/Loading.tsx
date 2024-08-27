import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAppSettings } from "../context/AppProvider";
import { mainText } from "../misc/styles";

const Loading = (): React.JSX.Element => {
  const { theme } = useAppSettings()

  const color = mainText(theme)

  return (
    <View style={styles.loadingHolder}>
      <ActivityIndicator size={45} color={color} />
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({
  loadingHolder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})