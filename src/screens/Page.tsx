import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Pressable, PermissionsAndroid, Linking } from "react-native";
import { flexOne, grayBackground, mainBackground, mainText } from "../misc/styles";
import Loading from "../components/Loading";
import { useAppSettings } from "../context/AppProvider";
import { selectFromAudio, selectFromDocuments, selectFromImage, selectFromInfo, selectFromTodo, updateCheckedInTodo } from "../misc/Database";
import { audioType, documentType, imageType, infoType, todoType } from "../misc/types";
import InfoItem from "../components/InfoItem";
import TasksItem from "../components/TasksItem";
import Ant from "react-native-vector-icons/AntDesign"
import { colors } from "../misc/config";
import ImageItem from "../components/ImageItem";
import AudiosItem from "../components/AudiosItem";
import DocumentsItem from "../components/DocumentsItem";
import ModalImage from "../components/ModalImage";
import { useAudioContext } from "../context/AudioProvider";
// import Share from 'react-native-share';

interface Props {
  route: any,
  navigation: any
}

const Page = ({ route, navigation }: Props): React.JSX.Element => {
  const [parent_id, setParent_id] = useState<number>(0)
  const [parent_color, setParent_color] = useState<string>("")
  const [parent_title, setParent_title] = useState<string>("")
  const [parent_desc, setParent_desc] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [selectedUri, setSelectedUri] = useState<string>("")

  const [infoData, setInfoData] = useState<infoType[]>([])
  const [tasks, setTasks] = useState<todoType[]>([])
  const [images, setImages] = useState<imageType[]>([])
  const [documents, setDocuments] = useState<documentType[]>([])
  const [audio, setAudio] = useState<audioType[]>([])

  const { theme } = useAppSettings()
  const { handleAudioToggle, increaseSpeed, playAudio, stopAudio, seekTo } = useAudioContext()

  const mainColor = mainBackground(theme)
  const textColor = mainText(theme)
  const grayColor = grayBackground(theme)
  const globalColor = parent_color === "none" || parent_color === "transparent"
    ? textColor
    : parent_color

  const checkItem = async (id: number) => {
    const newArray = [...tasks]
    const index = newArray.findIndex(item => item._id === id)

    const reverseCheck = !newArray[index].checked

    newArray[index].checked = reverseCheck

    setTasks(newArray)

    await updateCheckedInTodo(id, reverseCheck)
  }

  const fetchData = async () => {
    setIsLoading(true)
    await selectFromInfo(setInfoData, parent_id)
    await selectFromTodo(setTasks, parent_id)
    await selectFromImage(setImages, parent_id)
    await selectFromAudio(setAudio, parent_id)
    await selectFromDocuments(setDocuments, parent_id)
    setIsLoading(false)
  }

  useEffect(() => {
    setParent_id(route.params._id)
    setParent_color(route.params.color)
    setParent_title(route.params.title)
    setParent_desc(route.params.desc)
  }, [])

  useEffect(() => {
    if (parent_id)
      fetchData()

  }, [parent_id])

  if (isLoading)
    <Loading />

  return (
    <View style={[flexOne, { backgroundColor: mainColor }]}>
      <ScrollView style={flexOne} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: globalColor }]}>{parent_title}</Text>
        <Text style={[styles.desc, { color: textColor }]}>{parent_desc}</Text>

        {infoData.length > 0 && (
          infoData.map(item => (
            <InfoItem item={item} key={item._id} mainColor={globalColor} textColor={textColor} />
          ))
        )}

        {tasks.length > 0 && (
          <>
            <View style={styles.gap} />

            {tasks.map(item => (
              <TasksItem
                item={item}
                key={item._id}
                mainColor={globalColor}
                secondColor={mainColor}
                textColor={textColor}
                handleCheck={() => checkItem(item._id)}
              />
            ))}
          </>
        )}

        {images.length > 0 && (
          <>
            <View style={styles.gap} />

            {images.map(item => (
              <Pressable
                key={item._id}
                onPress={() => {
                  setSelectedUri(item.uri)
                  setVisible(true)
                }}>
                <ImageItem
                  item={item}
                  grayColor={grayColor}
                  mainBackground={mainColor}
                  textColor={globalColor}
                  mainColor={textColor}
                />
              </Pressable>
            ))}
          </>
        )}

        {audio.length > 0 && (
          <>
            <View style={styles.gap} />

            {audio.map(item => (
              <AudiosItem
                item={item}
                key={item._id}
                grayColor={grayColor}
                textColor={globalColor}
                mainColor={textColor}
                handleAudioToggle={handleAudioToggle}
                increaseSpeed={async () => await increaseSpeed()}
                playAudio={async () => await playAudio()}
                stopAudio={async () => await stopAudio()}
                seekTo={seekTo}
              />
            ))}
          </>
        )}

        {documents.length > 0 && (
          <>
            <View style={styles.gap} />

            <View style={styles.documentsContainer}>
              {documents.map(item => (
                <TouchableOpacity
                  key={item._id}
                  onPress={async () => {
                    console.log(`${item.uri}.${item.type}`)
                    await Linking.openURL(`${item.uri}.${item.type}`)
                  }
                  }
                >
                  <DocumentsItem
                    item={item}
                    grayColor={grayColor}
                    textColor={globalColor}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <ModalImage
        visible={visible}
        onClose={() => setVisible(false)}
        uri={selectedUri}
      />

      <TouchableOpacity
        style={styles.editIcon}
        onPress={() => navigation.replace("Edit",
          {
            parent_id, title: parent_title, desc: parent_desc, color: parent_color,
            infoData, tasks, images, documents, audio
          })}
      >
        <Ant name="edit" color={colors.orange} size={25} />
      </TouchableOpacity>

    </View >
  )
}

export default Page

const styles = StyleSheet.create({
  title: {
    marginBottom: 10,
    fontWeight: "600",
    fontSize: 45
  },
  desc: {
    marginBottom: 28,
    fontSize: 14,
  },
  gap: {
    marginVertical: 15
  },
  editIcon: {
    padding: 5,
    borderWidth: 1,
    borderColor: colors.orange,
    borderRadius: 5,
    position: 'absolute',
    right: 10,
    top: 10
  },
  documentsContainer: {
    marginBottom: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 5,
    rowGap: 50,
  }
})