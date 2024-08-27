import React from "react";
import { StyleSheet, TouchableOpacity, Text, Dimensions } from "react-native";
import Ant from 'react-native-vector-icons/AntDesign'
import { grayBackground, mainText } from "../misc/styles";
import { useAppSettings } from "../context/AppProvider";

const width = Dimensions.get("window").width

interface Props {
  title: string,
  color: string,
  icon: string,
  handleLongPress: () => void,
  handlePress: () => void
}

const Folder = ({ title, color, icon, handleLongPress, handlePress }: Props): React.JSX.Element => {
  const { theme } = useAppSettings()

  const mainTextColor = mainText(theme)
  const grayBackgroundColor = grayBackground(theme)

  return (
    <TouchableOpacity
      style={[styles.folder,
      {
        backgroundColor: color === "none"
          ? grayBackgroundColor : color
      }]}
      onLongPress={handleLongPress}
      onPress={handlePress}
    >
      <Ant name={icon} size={50} color={mainTextColor} />
      <Text style={[styles.folderTitle, { color: mainTextColor }]}>{title}</Text>
    </TouchableOpacity>
  )
}

export default Folder

const styles = StyleSheet.create({
  folder: {
    width: width / 2 - 18,
    height: 200,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  folderTitle: {
    marginTop: 10,
    textAlign: 'center',
    fontWeight: "600",
    fontSize: 16,
  },
})