import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import BottomIcon from "../components/BottomIcon";
import { flexOne, grayBackground, mainBackground, mainText } from "../misc/styles";
import { useAppSettings } from "../context/AppProvider";
import { audioType, documentType, imageType, infoType, todoType } from "../misc/types";
import InfoItem from "../components/InfoItem";
import TasksItem from "../components/TasksItem";
import Ant from "react-native-vector-icons/AntDesign"
import Evil from "react-native-vector-icons/EvilIcons"
import { colors } from "../misc/config";
import ModalTextEditor, { context, details } from "../components/ModalTextEditor";
import documentPicker from "react-native-document-picker"
import ImageItem from "../components/ImageItem";
import Loading from "../components/Loading";
import AudiosItem from "../components/AudiosItem";
import DocumentsItem from "../components/DocumentsItem";
import { handleDelete } from "../misc/helpers";
import { deleteFileComponent, insertIntoAudio, insertIntoDocuments, insertIntoImage, insertIntoInfo, insertIntoTodo } from "../misc/Database";

interface Props {
  route: any,
  navigation: any
}

const initialContext = {
  CONTEXT: [],
  setCONTEXT: () => null,
  data1: "",
  data2: "",
  uri: false,
  borderExist: undefined,
  index: undefined,
  files: []
}

const initialDetails = {
  multiline1: false,
  multiline2: false,
  placeholder1: "",
  placeholder2: "",
  type: "info",
  multipleFileChoice: false,
  fileType: ""
}

const EditPage = ({ route, navigation }: Props): React.JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [parent_id, setParent_id] = useState<number>(0)
  const [parent_color, setParent_color] = useState<string>("")
  const [parent_title, setParent_title] = useState<string>("")
  const [parent_desc, setParent_desc] = useState<string>("")
  const [details, setDetails] = useState<details>(initialDetails)
  const [context, setContext] = useState<context>(initialContext)

  const [infoData, setInfoData] = useState<infoType[]>([])
  const [tasks, setTasks] = useState<todoType[]>([])
  const [audios, setAudios] = useState<audioType[]>([])
  const [images, setImages] = useState<imageType[]>([])
  const [documents, setDocuments] = useState<documentType[]>([])

  const [visible, setVisible] = useState<boolean>(false)

  const { theme } = useAppSettings()

  const mainColor = mainBackground(theme)
  const textColor = mainText(theme)
  const grayColor = grayBackground(theme)
  const globalColor = parent_color === "none" || parent_color === "transparent"
    ? textColor
    : parent_color

  const colorVar = {
    mainColor,
    reverseColor: textColor,
    grayColor,
  }

  const handleConfirm = async () => {
    setIsLoading(true)

    await deleteFileComponent(parent_id)

    const infoPromises = infoData.map((data) =>
      insertIntoInfo(data.title, data.info, data.withBorder, parent_id)
    );
    const todoPromises = tasks.map((data) =>
      insertIntoTodo(data.title, data.checked, parent_id)
    );
    const audioPromises = audios.map((data) =>
      insertIntoAudio(data.uri, data.filename, parent_id, data.withBorder)
    );
    const imagePromises = images.map((data) =>
      insertIntoImage(data.uri, data.info, data.withBorder, data.title, parent_id)
    );
    const documentPromises = documents.map((data) =>
      insertIntoDocuments(data.title, parent_id, data.uri, data.type)
    );

    await Promise.all([
      ...infoPromises,
      ...todoPromises,
      ...audioPromises,
      ...imagePromises,
      ...documentPromises,
    ]);

    setIsLoading(false)
    navigation.goBack()
  }

  useEffect(() => {
    setIsLoading(true)

    setParent_id(route.params.parent_id)
    setParent_color(route.params.color)
    setParent_title(route.params.title)
    setParent_desc(route.params.desc)

    setInfoData(route.params.infoData)
    setTasks(route.params.tasks)
    setAudios(route.params.audio)
    setImages(route.params.images)
    setDocuments(route.params.documents)

    setIsLoading(false)
  }, [])

  if (isLoading) return <Loading />

  return (
    <View style={flexOne}>
      <ScrollView style={flexOne} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={[styles.title, { color: globalColor }]}>{parent_title}</Text>
        </View>

        <View>
          <Text style={[styles.desc, { color: textColor }]}>{parent_desc}</Text>
        </View>

        {infoData.length > 0 && (
          infoData.map((item, index) => (
            <View style={styles.row} key={index}>
              <View style={[flexOne, { marginRight: 15 }]}>
                <InfoItem
                  item={item}
                  mainColor={globalColor}
                  textColor={textColor} />
              </View>

              <View>
                <Ant
                  style={styles.edit}
                  name="edit"
                  color={colors.orange}
                  size={15}
                  onPress={() => {
                    setContext({
                      borderExist: item.withBorder,
                      data1: item.title,
                      data2: item.info,
                      uri: false,
                      CONTEXT: infoData,
                      setCONTEXT: setInfoData,
                      index,
                      files: []
                    })
                    setDetails({
                      multiline1: false,
                      multiline2: true,
                      placeholder1: "title",
                      placeholder2: "description",
                      type: "info",
                      multipleFileChoice: false,
                      fileType: ""
                    })
                    setVisible(true)
                  }}
                />

                <Evil
                  style={styles.trash}
                  name="trash"
                  size={18}
                  color={colors.danger}
                  onPress={() => handleDelete(infoData, setInfoData, index)}
                />
              </View>
            </View>
          ))
        )}

        {tasks.length > 0 && (
          <>
            <View style={styles.gap} />

            {tasks.map((item, index) => (
              <View style={styles.row} key={index}>
                <TasksItem item={item}
                  mainColor={globalColor}
                  secondColor={mainColor}
                  textColor={textColor}
                  handleCheck={async () => undefined}
                />

                <View>
                  <Ant
                    style={styles.edit}
                    name="edit"
                    color={colors.orange}
                    size={15}
                    onPress={() => {
                      setContext({
                        borderExist: undefined,
                        data1: undefined,
                        data2: item.title,
                        uri: false,
                        CONTEXT: tasks,
                        setCONTEXT: setTasks,
                        index,
                        files: []
                      })
                      setDetails({
                        multiline1: false,
                        multiline2: true,
                        placeholder1: undefined,
                        placeholder2: "title",
                        type: "todo",
                        multipleFileChoice: false,
                        fileType: ""
                      })
                      setVisible(true)
                    }}
                  />

                  <Evil
                    style={styles.trash}
                    name="trash"
                    size={18}
                    color={colors.danger}
                    onPress={() => handleDelete(tasks, setTasks, index)}
                  />
                </View>
              </View>
            ))}
          </>
        )}

        {images.length > 0 && (
          <>
            <View style={styles.gap} />

            {images.map((item, index) => (
              <View style={{ position: 'relative' }} key={index}>
                <ImageItem
                  item={item}
                  mainColor={textColor}
                  textColor={globalColor}
                  mainBackground={mainColor}
                  grayColor={grayColor}
                />

                <View style={styles.float}>
                  <Ant
                    style={styles.edit}
                    name="edit"
                    color={colors.orange}
                    size={15}
                    onPress={() => {
                      setContext({
                        borderExist: item.withBorder,
                        data1: item.title,
                        data2: item.info,
                        uri: true,
                        CONTEXT: images,
                        setCONTEXT: setImages,
                        index,
                        files: [{ uri: item.uri }]
                      })
                      setDetails({
                        multiline1: false,
                        multiline2: true,
                        placeholder1: "title",
                        placeholder2: "details",
                        type: "image",
                        multipleFileChoice: false,
                        fileType: [documentPicker.types.images]
                      })
                      setVisible(true)
                    }}
                  />

                  <Evil
                    style={styles.trash}
                    name="trash"
                    size={18}
                    color={colors.danger}
                    onPress={() => handleDelete(images, setImages, index)}
                  />
                </View>
              </View>
            ))}
          </>
        )}

        {audios.length > 0 && (
          <>
            <View style={styles.gap} />

            {audios.map((item, index) => (
              <View style={styles.row} key={index}>
                <View style={flexOne}>
                  <AudiosItem
                    item={item}
                    grayColor={colorVar.grayColor}
                    textColor={colorVar.reverseColor}
                    mainColor={globalColor}
                    increaseSpeed={async () => undefined}
                    playAudio={async () => undefined}
                    stopAudio={async () => undefined}
                    seekTo={async () => undefined}
                    handleAudioToggle={async () => undefined}
                  />
                </View>

                <View>
                  <Ant
                    style={styles.edit}
                    name="edit"
                    color={colors.orange}
                    size={15}
                    onPress={() => {
                      setContext({
                        borderExist: item.withBorder,
                        data1: undefined,
                        data2: item.filename,
                        uri: true,
                        CONTEXT: audios,
                        setCONTEXT: setAudios,
                        index,
                        files: [{ uri: item.uri }]
                      })
                      setDetails({
                        multiline1: false,
                        multiline2: false,
                        placeholder1: undefined,
                        placeholder2: "title",
                        type: "audio",
                        multipleFileChoice: false,
                        fileType: [documentPicker.types.audio]
                      })
                      setVisible(true)
                    }}
                  />

                  <Evil
                    style={styles.trash}
                    name="trash"
                    size={18}
                    color={colors.danger}
                    onPress={() => handleDelete(audios, setAudios, index)}
                  />
                </View>
              </View>
            ))}
          </>
        )}

        {documents.length > 0 && (
          <>
            <View style={styles.gap} />

            <View style={styles.fileContainer}>
              {documents.map((item, index) => (
                <View key={index}>
                  <View style={flexOne}>
                    <DocumentsItem
                      item={item}
                      grayColor={grayColor}
                      textColor={textColor}
                    />
                  </View>

                  <View style={styles.float}>
                    <Ant
                      style={[styles.edit, { backgroundColor: grayColor }]}
                      name="edit"
                      color={colors.orange}
                      size={15}
                      onPress={() => {
                        setContext({
                          borderExist: undefined,
                          data1: undefined,
                          data2: item.title,
                          uri: true,
                          CONTEXT: documents,
                          setCONTEXT: setDocuments,
                          index,
                          files: [{ uri: item.uri }]
                        })
                        setDetails({
                          multiline1: false,
                          multiline2: false,
                          placeholder1: undefined,
                          placeholder2: "title",
                          type: "document",
                          multipleFileChoice: false,
                          fileType: [
                            documentPicker.types.doc,
                            documentPicker.types.docx,
                            documentPicker.types.pdf,
                            documentPicker.types.ppt,
                            documentPicker.types.pptx,
                          ]
                        })
                        setVisible(true)
                      }}
                    />

                    <Evil
                      style={[styles.trash, { backgroundColor: grayColor }]}
                      name="trash"
                      size={18}
                      color={colors.danger}
                      onPress={() => handleDelete(documents, setDocuments, index)}
                    />
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

      </ScrollView>

      <Ant
        name="checkcircleo"
        color={colors.orange}
        size={35} style={styles.finalCheck}
        onPress={handleConfirm}
      />

      <ModalTextEditor
        color={colorVar}
        visible={visible}
        onClose={() => {
          setContext(initialContext)
          setDetails(initialDetails)
          setVisible(false)
        }}
        details={details}
        context={context}
      />

      <ScrollView
        style={[styles.bottomBar, { backgroundColor: grayColor }]}
        contentContainerStyle={styles.bottomBarContent}>
        <BottomIcon
          type="Ant"
          icon="picture"
          color={textColor}
          handlePress={() => {
            setContext({
              borderExist: false,
              data1: "",
              data2: "",
              CONTEXT: images,
              uri: true,
              setCONTEXT: setImages,
              index: undefined,
              files: []
            })
            setDetails({
              multiline1: false,
              multiline2: true,
              placeholder1: "title",
              placeholder2: "details",
              type: "image",
              multipleFileChoice: true,
              fileType: [documentPicker.types.images]
            })
            setVisible(true)
          }} />
        <BottomIcon
          type="Ant"
          icon="filetext1"
          color={textColor}
          handlePress={() => {
            setContext({
              borderExist: undefined,
              data1: undefined,
              data2: "",
              CONTEXT: documents,
              uri: true,
              setCONTEXT: setDocuments,
              index: undefined,
              files: []
            })
            setDetails({
              multiline1: false,
              multiline2: true,
              placeholder1: undefined,
              placeholder2: "title",
              type: "document",
              multipleFileChoice: true,
              fileType: [
                documentPicker.types.doc,
                documentPicker.types.docx,
                documentPicker.types.pdf,
                documentPicker.types.ppt,
                documentPicker.types.pptx,
              ]
            })
            setVisible(true)
          }} />
        <BottomIcon
          type="Feather"
          icon="mic"
          color={textColor}
          handlePress={() => {
            setContext({
              borderExist: false,
              data1: undefined,
              data2: "",
              CONTEXT: audios,
              uri: true,
              setCONTEXT: setAudios,
              index: undefined,
              files: []
            })
            setDetails({
              multiline1: false,
              multiline2: false,
              placeholder1: undefined,
              placeholder2: "title",
              type: "audio",
              multipleFileChoice: false,
              fileType: [documentPicker.types.audio]
            })
            setVisible(true)
          }} />
        <BottomIcon
          type="Feather"
          icon="check-square"
          color={textColor}
          handlePress={() => {
            setContext({
              borderExist: undefined,
              data1: undefined,
              data2: "",
              CONTEXT: tasks,
              uri: false,
              setCONTEXT: setTasks,
              index: undefined,
              files: []
            })
            setDetails({
              multiline1: false,
              multiline2: true,
              placeholder1: undefined,
              placeholder2: "title",
              type: "todo",
              multipleFileChoice: false,
              fileType: ""
            })
            setVisible(true)
          }} />
        <BottomIcon
          type="Ant"
          icon="profile"
          color={textColor}
          handlePress={() => {
            setContext({
              borderExist: false,
              data1: "",
              data2: "",
              CONTEXT: infoData,
              uri: false,
              setCONTEXT: setInfoData,
              index: undefined,
              files: []
            })
            setDetails({
              multiline1: false,
              multiline2: true,
              placeholder1: "title",
              placeholder2: "description",
              type: "info",
              multipleFileChoice: false,
              fileType: ""
            })
            setVisible(true)
          }} />
      </ScrollView>
    </View>
  )
}

export default EditPage;

const styles = StyleSheet.create({
  bottomBar: {
    padding: 12,
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
  },
  bottomBarContent: {
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between'
  },
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "flex-start"
  },
  edit: {
    marginHorizontal: 5,
    padding: 5,
    borderColor: colors.orange,
    borderWidth: 1,
  },
  trash: {
    marginTop: 5,
    marginHorizontal: 5,
    padding: 5,
    borderColor: colors.danger,
    borderWidth: 1,
  },
  float: {
    position: 'absolute',
    top: 15,
    right: 15
  },
  fileContainer: {
    marginBottom: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 5,
    rowGap: 50,
  },
  finalCheck: {
    position: 'absolute',
    top: 5,
    right: 20,
  }
})