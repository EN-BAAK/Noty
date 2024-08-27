import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../misc/config";

interface Props {
  text: string,
  onEffect: () => void,
  onLongPress?: () => void
  color: string,
}

const PrimaryButton = ({ text, onEffect, color, onLongPress = () => { console.log("long") } }: Props): React.JSX.Element => {
  return (
    <TouchableOpacity
      style={styles.primaryButton}
      onPress={onEffect}
      onLongPress={onLongPress}
    >
      <Text style={[styles.textPrimary, { color: color }]}>{text}</Text>
    </TouchableOpacity>
  )
}

export default PrimaryButton;

const styles = StyleSheet.create({
  primaryButton: {
    position: "absolute",
    bottom: 25,
    left: 0,
    right: 0,
  },
  textPrimary: {
    backgroundColor: colors.orange,
    width: 300,
    marginHorizontal: "auto",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
    textAlign: 'center',
    fontSize: 18,
  }
})