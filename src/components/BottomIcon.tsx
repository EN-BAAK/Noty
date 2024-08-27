import React from "react";
import { TouchableOpacity } from "react-native";
import Ant from "react-native-vector-icons/AntDesign"
import Feather from "react-native-vector-icons/Feather"

interface Props {
  icon: string,
  color: string,
  type: "Feather" | "Ant",
  handlePress: () => void;
}

const BottomIcon = ({ icon, color, type, handlePress }: Props): React.JSX.Element => {
  return (
    <TouchableOpacity
      onPress={handlePress}
    >
      {type === "Ant" ?
        <Ant name={icon} color={color} size={28} />
        :
        <Feather name={icon} color={color} size={28} />
      }
    </TouchableOpacity>
  )
}

export default BottomIcon;