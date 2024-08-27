import React, { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { mainBackground, mainText } from "../misc/styles";

interface Props {
  message: string,
  theme: "light" | "dark",
  onCLose: () => void
}

const width = Dimensions.get("window").width

const Toast = ({ message, theme, onCLose }: Props): React.JSX.Element => {
  const mainColor = mainBackground(theme)
  const secondColor = mainText(theme)

  useEffect(() => {
    const timer = setTimeout(() => {
      onCLose()
    }, 1200)

    return () => {
      clearTimeout(timer)
    }
  }, [onCLose])

  return (
    <View style={styles.toast}>
      <Text style={[styles.text, { backgroundColor: secondColor, color: mainColor }]}>{message}</Text>
    </View>
  )
}

export default Toast

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 15,
    alignItems: 'center',
    zIndex: 1,
  },
  text: {
    maxWidth: width - 20,
    paddingHorizontal: 45,
    paddingVertical: 8,
    borderRadius: 25,
    textAlign: 'center',
    fontSize: 14,
  }
})