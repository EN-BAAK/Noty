import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { todoType } from "../misc/types";
import Ant from "react-native-vector-icons/AntDesign"

interface Props {
  item: todoType,
  mainColor: string,
  secondColor: string,
  textColor: string,
  handleCheck: () => Promise<void | undefined>;
}

const TasksItem = ({ item, mainColor, secondColor, textColor, handleCheck }: Props): React.JSX.Element => {

  const checkStyle = item.checked
    ? { backgroundColor: mainColor, }
    : { borderColor: mainColor, borderWidth: 2, }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.taskCycle, checkStyle]} onPress={handleCheck}>
        {item.checked && (
          <Ant name="check" color={secondColor} size={32} />
        )}
      </TouchableOpacity>
      <Text style={[styles.title, { color: textColor, textDecorationLine: item.checked ? "line-through" : "none" }]}>{item.title}</Text>
    </View>
  )
}

export default TasksItem

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  taskCycle: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontWeight: "400",
    fontSize: 25,
  }
})