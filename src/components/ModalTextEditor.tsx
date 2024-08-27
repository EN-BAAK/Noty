import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Switch, Text, TextInput, View, TouchableOpacity, TouchableWithoutFeedback, Dimensions, PermissionsAndroid } from "react-native";
import { colors } from "../misc/config";
import { audioType, documentType, imageType, infoType, todoType } from "../misc/types";
import { useAppSettings } from "../context/AppProvider";
import { selectFile } from "../misc/services";

const width = Dimensions.get("window").width


interface color {
  mainColor: string,
  reverseColor: string,
  grayColor: string
}

export interface details {
  multiline1: boolean,
  multiline2: boolean,
  placeholder1: string | undefined,
  placeholder2: string | undefined,
  type: string,
  multipleFileChoice: boolean,
  fileType: any
}

export interface context {
  CONTEXT: any[],
  setCONTEXT: (data: any[]) => any,
  data1: string | undefined,
  data2: string | undefined,
  borderExist: boolean | undefined,
  uri: boolean,
  index: number | undefined,
  files: any[]
}

interface Props {
  visible: boolean;
  color: color,
  context: context
  onClose: () => void,
  details: details;
}

const ModalTextEditor = ({ visible, color, onClose, context, details }: Props): React.JSX.Element => {
  const [text1, setText1] = useState<string | undefined>(undefined)
  const [text2, setText2] = useState<string | undefined>(undefined)
  const [allowMultipleLine1, setAllowMultipleLine1] = useState<boolean>(false)
  const [allowMultipleLine2, setAllowMultipleLine2] = useState<boolean>(false)
  const [placeholder1, setPlaceholder1] = useState<string | undefined>(undefined)
  const [placeholder2, setPlaceholder2] = useState<string | undefined>("")
  const [withBorder, setWithBorder] = useState<boolean | undefined>(undefined)
  const [uri, setUri] = useState<boolean>()
  const [type, setType] = useState<string>("")
  const [fileType, setFileType] = useState<string>("")
  const [multipleFileChoice, setMultipleFileChoice] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [index, setIndex] = useState<number>(-1)
  const [files, setFiles] = useState<any[]>([])

  const { setToast } = useAppSettings()

  const confirmInfo = (data: infoType[]) => {
    if (!text2 || !text2.trim()) {
      setToast("please write details")
      onClose()
      return data;
    }

    if (text1 && text1.trim().length > 15) {
      setToast("The title should be less than 15 character")
      onClose()
      return data;
    }

    data.push({
      _id: 1,
      title: text1 || "",
      info: text2 || "",
      withBorder: withBorder || false
    })

    return data;
  }

  const confirmTodo = (data: todoType[]) => {
    if (!text2 || !text2.trim()) {
      setToast("please write a title")
      onClose()
      return data;
    }

    if (text2.trim().length > 15) {
      setToast("The title should be less than 15 character")
      onClose()
      return data;
    }

    data.push({
      _id: 1,
      checked: false,
      title: text2 || ""
    })

    return data;
  }

  const confirmAudio = async (data: audioType[]) => {
    if (text2?.trim() && text2.trim().length > 15) {
      setToast("The title should be less than 15 character")
      onClose()
      return data;
    }

    if (!files.length) {
      setToast("Please select an audio")
      onClose()
      return data;
    }

    data.push({
      _id: 0,
      filename: text2 || files[0].name,
      uri: files[0].uri,
      withBorder: withBorder || false
    })

    return data;
  }

  const confirmImage = (data: imageType[]) => {
    if (text1 && text1.trim().length > 15) {
      setToast("The title should be less than 15 character")
      onClose()
      return data;
    }

    if (!files.length) {
      setToast("Please select an image")
      onClose()
      return data;
    }

    for (var i = 0; i < files.length; i++) {
      data.push({
        _id: 0,
        title: text1 || "",
        info: text2 || "",
        uri: files[i].uri,
        withBorder: withBorder || false
      })
    }

    return data
  }

  const confirmDocument = (data: documentType[]) => {
    if (text2 && text2.trim().length > 12) {
      setToast("The title should be less than 12 character")
      onClose()
      return data;
    }

    if (!files.length) {
      setToast("Please select a document")
      onClose()
      return data;
    }

    for (var i = 0; i < files.length; i++) {
      data.push({
        _id: 0,
        title: text2 || files[i].name,
        uri: files[i].uri,
        type: files[i].type
      })
    }

    return data
  }

  const confirmData = async (newData: any[]) => {
    switch (type) {
      case "info":
        newData = confirmInfo(newData); break;
      case "todo":
        newData = confirmTodo(newData); break;
      case "audio":
        newData = await confirmAudio(newData); break;
      case "image":
        newData = confirmImage(newData); break;
      case "document":
        newData = confirmDocument(newData); break;
    }

    return newData;
  }

  const editInfo = (data: infoType[]) => {
    if (!text2 || !text2.trim()) {
      setToast("please write details")
      onClose()
      return data;
    }

    if (text1 && text1.trim().length > 15) {
      setToast("The title should be less than 15 character")
      onClose()
      return data;
    }

    data[index] = {
      title: text1 || "",
      info: text2 || "",
      withBorder: withBorder || false,
      _id: 0
    }

    return data
  }

  const editTodo = (data: todoType[]) => {
    if (!text2 || !text2.trim()) {
      setToast("please write a title")
      onClose()
      return data;
    }

    if (text2.trim().length > 15) {
      setToast("The title should be less than 15 character")
      onClose()
      return data;
    }

    data[index] = {
      _id: 1,
      checked: false,
      title: text2 || ""
    }
    return data;
  }

  const editAudio = (data: audioType[]) => {
    if (!text2 || !text2.trim()) {
      setToast("please write a title")
      onClose()
      return data;
    }

    if (text2.trim().length > 15) {
      setToast("The title should be less than 15 character")
      onClose()
      return data;
    }

    if (!files.length) {
      setToast("Please select an audio")
      onClose()
      return data;
    }

    data[index] = {
      _id: 1,
      filename: text2 || "",
      withBorder: withBorder || false,
      uri: files[0].uri
    }
    return data;
  }

  const editImage = (data: imageType[]) => {
    if (text1 && text1.trim().length > 15) {
      setToast("The title should be less than 15 character")
      onClose()
      return data;
    }

    if (!files.length) {
      setToast("Please select an image")
      onClose()
      return data;
    }

    data[index] = {
      _id: 1,
      title: text1 || "",
      info: text2 || "",
      withBorder: withBorder || false,
      uri: files[0].uri
    }
    return data;
  }

  const editDocument = (data: documentType[]) => {
    if (!text2 || !text2.trim()) {
      setToast("please write a title")
      onClose()
      return data;
    }

    if (text2.trim().length > 12) {
      setToast("The title should be less than 12 character")
      onClose()
      return data;
    }

    if (!files.length) {
      setToast("Please select a document")
      onClose()
      return data;
    }

    data[index] = {
      _id: 1,
      title: text2 || "",
      uri: files[0].uri,
      type: ""
    }
    return data;
  }

  const editData = (newData: any[]) => {
    switch (type) {
      case "info":
        newData = editInfo(newData); break;
      case "todo":
        newData = editTodo(newData); break;
      case "audio":
        newData = editAudio(newData); break;
      case "image":
        newData = editImage(newData); break;
      case "document":
        newData = editDocument(newData); break;
    }

    return newData;
  }

  const primaryData = async () => {
    let newData: any[] = context.CONTEXT;
    newData = isEdit ? await editData(newData) : await confirmData(newData)

    context.setCONTEXT(newData);
    onClose()
  }

  useEffect(() => {
    setText1(context.data1)
    setText2(context.data2)
    setAllowMultipleLine1(details.multiline1)
    setAllowMultipleLine2(details.multiline2)
    setPlaceholder1(details.placeholder1)
    setPlaceholder2(details.placeholder2)
    setWithBorder(context.borderExist)
    setUri(context.uri)
    setType(details.type)
    setFileType(details.fileType)
    setMultipleFileChoice(details.multipleFileChoice)
    setFiles(context.files)

    context.index !== undefined && setIndex(context.index)

    context.data2 === "" ? setIsEdit(false) : setIsEdit(true)

    if (context.files.length > 0)
      setIsEdit(true)

  }, [context.data1, context.data2, context.borderExist, details.type])

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.container}>
        <View style={[styles.content, { backgroundColor: color.mainColor }]}>

          {
            (text1 !== undefined && placeholder1) && (

              <TextInput
                multiline={allowMultipleLine1}
                placeholder={placeholder1}
                placeholderTextColor={color.reverseColor}
                style={[
                  styles.input, {
                    backgroundColor: color.grayColor, color: color.reverseColor
                  }]}
                value={text1}
                onChangeText={text => setText1(text)}
              />
            )
          }

          <TextInput
            multiline={allowMultipleLine2}
            placeholder={placeholder2}
            placeholderTextColor={color.reverseColor}
            style={[styles.input, styles.gap, { backgroundColor: color.grayColor, color: color.reverseColor, }]}
            value={text2}
            onChangeText={text => setText2(text)}
          />

          {uri && (
            <TouchableOpacity
              style={[styles.input, { paddingVertical: 8 }, { backgroundColor: color.grayColor }]}
              onPress={() =>
                selectFile(
                  PermissionsAndroid,
                  multipleFileChoice,
                  fileType,
                  setFiles
                )
              }
            >
              <Text style={[styles.modalText, { color: color.reverseColor, textAlign: 'center' }]}>
                {files.length === 0 ? "select file" : `${files.length} files selected`}
              </Text>
            </TouchableOpacity>
          )}

          {withBorder !== undefined && (
            <View style={styles.switchHolder}>
              <Text style={[styles.modalText, { color: color.reverseColor }]}>Add border: </Text>

              <Switch
                style={styles.switch}
                value={withBorder}
                onValueChange={() => setWithBorder(!withBorder)}
                thumbColor={withBorder ? colors.orange : color.reverseColor}
                trackColor={{ true: color.grayColor, false: color.grayColor }}
              />
            </View>
          )}

          <TouchableOpacity style={styles.confirmButton} onPress={primaryData}>
            <Text style={[styles.confirmText, { color: color.reverseColor }]}>
              {isEdit ? "Edit" : "confirm"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            style={[styles.exitButton, { backgroundColor: color.mainColor }]}
          >
            <Text style={{ color: color.reverseColor, fontSize: 22 }}>X</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.modalBG, StyleSheet.absoluteFillObject]} />
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default ModalTextEditor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  gap: {
    marginVertical: 15
  },
  content: {
    width: width,
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  colorHolder: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },
  input: {
    maxHeight: 200,
    paddingHorizontal: 12,
    borderRadius: 25,
    verticalAlign: "top",
    fontSize: 18,
  },
  switchHolder: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalText: {
    fontWeight: "600",
    fontSize: 18,
  },
  switch: {
    transform: [
      { scaleX: 1.5 },
      { scaleY: 1.5 }
    ]
  },
  confirmButton: {
    backgroundColor: colors.orange,
    width: 300,
    marginHorizontal: "auto",
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 25,
  },
  confirmText: {
    textAlign: 'center',
    fontSize: 20,
  },
  exitButton: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    position: 'absolute',
    top: -20,
    right: 5
  },
  modalBG: {
    backgroundColor: colors.transparent,
    zIndex: -1,
  }
})