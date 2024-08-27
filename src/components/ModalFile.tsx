import React, { useEffect, useState } from "react";
import { Alert, Dimensions, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useAppSettings } from "../context/AppProvider";
import { colors, rainbowColor } from "../misc/config";
import { deleteFile, insertIntoFiles, updateFiles } from "../misc/Database";
import { fileType } from "../misc/types";
import Feather from 'react-native-vector-icons/Feather'

const width = Dimensions.get("window").width

interface Props {
  visible: boolean,
  onClose: () => void,
  mainColor: string,
  reverseColor: string,
  grayColor: string,
  parent_id: number,
  file: fileType,
  onRefresh: () => void
}

const ModalFile = ({ visible, onClose, mainColor,
  reverseColor, grayColor,
  parent_id, file,
  onRefresh }: Props): React.JSX.Element => {
  const [title, setTitle] = useState<string>("")
  const [desc, setDesc] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("none")
  const [isEdit, setIsEdit] = useState<boolean>(false)

  const { setToast } = useAppSettings()

  const confirmData = async () => {
    await insertIntoFiles(title.trim(), desc.trim(), parent_id, selectedColor);
    setToast("New file added successfully")
  }

  const editData = async () => {
    await updateFiles(title.trim(), desc.trim(), file._id, selectedColor);
    setToast("The file edited successfully")
  }

  const primaryButton = async () => {
    if (!title.trim() && !desc.trim()) {
      setToast("Please provide all details (title and description)")
      return onClose()
    }

    if (!title.trim()) {
      setToast("Please add a title")
      return onClose()
    }

    if (!desc.trim()) {
      setToast("Please add a description")
      return onClose()
    }

    if (title.trim().length > 18) {
      setToast("The title should be less than 18 letters")
      return onClose()
    }

    isEdit ? await editData() : await confirmData()


    setTitle("")
    setDesc("")
    setSelectedColor("none")

    onRefresh()
    onClose()
  }

  const confirmDelete = async (): Promise<void> => {
    Alert.alert("Warning", `Are you sure you wanna delete ${file.title} file?`,
      [
        {
          text: "cancel"
        },
        {
          text: 'yes',
          onPress: await deleteButton,
        },
      ]
    )
  }

  const deleteButton = async (): Promise<void> => {
    await deleteFile(file._id)
    setToast("File deleted successfully")

    onRefresh()
    onClose()
  }

  useEffect(() => {
    setTitle(file.title)
    setDesc(file.desc)
    setSelectedColor(file.color)

    file.title ? setIsEdit(true) : setIsEdit(false)
  }, [file._id, file.title])

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.container}>
        <View style={[styles.content, { backgroundColor: mainColor }]}>
          <FlatList
            contentContainerStyle={{ gap: 8 }}
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            horizontal
            data={rainbowColor}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedColor(item)}
                style={[[styles.colorHolder,
                {
                  borderWidth: item === selectedColor ? 5 : 2,
                  borderColor: reverseColor, backgroundColor: item === "none"
                    ? mainColor
                    : item,
                }]]}
              />
            )}
            keyExtractor={item => item}
          />

          <TextInput
            multiline={false}
            placeholder="Title"
            placeholderTextColor={reverseColor}
            style={[styles.input, { backgroundColor: grayColor, color: reverseColor }]}
            value={title}
            onChangeText={text => setTitle(text)}
          />

          <TextInput
            multiline={false}
            placeholder="Description"
            placeholderTextColor={reverseColor}
            style={[styles.input, { backgroundColor: grayColor, color: reverseColor, marginBottom: 15 }]}
            value={desc}
            onChangeText={text => setDesc(text)}
          />

          {isEdit && (
            <TouchableOpacity style={[styles.confirmButton, { marginBottom: 5, backgroundColor: colors.danger }]} onPress={confirmDelete}>
              <Text style={[styles.confirmText, { color: reverseColor }]}>
                <Feather name="trash" color={reverseColor} size={25} />
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.confirmButton} onPress={primaryButton}>
            <Text style={[styles.confirmText, { color: reverseColor }]}>
              {isEdit ? "Edit" : "Confirm"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            style={[styles.exitButton, { backgroundColor: mainColor }]}
          >
            <Text style={{ color: reverseColor, fontSize: 22 }}>X</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.modalBG, StyleSheet.absoluteFillObject]} />
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default ModalFile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
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
  iconHolder: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    marginTop: 15,
    paddingHorizontal: 12,
    borderRadius: 25,
    fontSize: 18,
  },
  confirmButton: {
    backgroundColor: colors.orange,
    width: 300,
    marginHorizontal: "auto",
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