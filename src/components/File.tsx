import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppSettings } from "../context/AppProvider";
import { grayBackground, mainText } from "../misc/styles";
import { formatText } from "../misc/helpers";
import { select1FromImage, select1FromInfo, selectSomeFromTodo } from "../misc/Database";
import Ant from 'react-native-vector-icons/AntDesign'
import { Image } from "react-native-elements";

const width = Dimensions.get("window").width

interface Props {
  title: string,
  desc: string,
  color: string,
  _id: number,
  handleLongPress: () => void
  handlePress: () => void
}

const File = ({ title, desc, color, _id, handleLongPress, handlePress }: Props): React.JSX.Element => {
  const { theme } = useAppSettings()

  const [info, setInfo] = useState<string | undefined>(undefined)
  const [tasks, setTasks] = useState<{ title: string, checked: boolean }[]>([])
  const [uri, setUri] = useState<string | undefined>(undefined)

  const mainTextColor = mainText(theme)
  const grayBackgroundColor = grayBackground(theme)

  const fetchData = async () => {
    await select1FromInfo(setInfo, _id)
    await selectSomeFromTodo(setTasks, _id)
    await select1FromImage(setUri, _id)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <TouchableOpacity style={[styles.file,
    {
      backgroundColor: color === "none"
        ? grayBackgroundColor : color
    }
    ]}
      onLongPress={handleLongPress}
      onPress={handlePress}
    >
      <Text style={[styles.title, { color: mainTextColor }]}>{formatText(title, 9)}</Text>
      <Text style={[styles.desc, { color: mainTextColor }]}>{desc}</Text>

      {info && (
        <Text style={[styles.info, { color: mainTextColor }]}>
          {formatText(info, 165)}
        </Text>
      )}

      {((!info || info.length < 165) && tasks.length > 0) && (
        tasks.map((item, index) => {
          const checkStyle = item.checked
            ? { backgroundColor: color !== "none" ? mainTextColor : grayBackgroundColor, }
            : { borderColor: mainTextColor, borderWidth: 2, }

          return (
            <View key={index} style={styles.container}>
              <View style={[styles.taskCycle, checkStyle]}>
                {item.checked && (
                  <Ant name="check" color={color} size={28} />
                )}
              </View>
              <Text style={[styles.taskTitle, { color: mainTextColor, textDecorationLine: item.checked ? "line-through" : "none" }]}>{formatText(item.title, 9)}</Text>
            </View>
          )
        })
      )}

      {(((!info || info.length < 165) && !tasks.length) && uri !== undefined) && (
        <Image
          source={{ uri }}
          resizeMode="contain"
          style={styles.image}
        />
      )}

    </TouchableOpacity>
  )
}

export default File

const styles = StyleSheet.create({
  file: {
    width: width / 2 - 18,
    marginHorizontal: 5,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 25,
  },
  title: {
    fontSize: 23,
  },
  desc: {
    fontSize: 12,
  },
  info: {
    marginTop: 8,
    fontSize: 15,
  },
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
  taskTitle: {
    fontWeight: "400",
    fontSize: 18,
  },
  image: {
    width: "100%",
    height: 100,
    marginTop: 8,
  }
})