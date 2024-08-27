import React, { useEffect, useState } from "react";
import { Alert, Dimensions, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { antIcons1, antIcons2, colors, rainbowColor } from "../misc/config";
import Ant from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import { deleteFolder, insertIntoFolders, updateFolders } from "../misc/Database";
import { useAppSettings } from "../context/AppProvider";
import { folderType } from "../misc/types";

interface Props {
  visible: boolean,
  onClose: () => void,
  mainColor: string,
  reverseColor: string,
  grayColor: string,
  folder: folderType,
  onRefresh: () => void
}

const width = Dimensions.get("window").width

const ModalFolder = ({
  visible, onClose, mainColor,
  reverseColor, grayColor, folder,
  onRefresh
}: Props): React.JSX.Element => {
  const [selectedColor, setSelectedColor] = useState<string>("none");
  const [selectedIcon, setSelectedIcon] = useState<string>("check");
  const [title, setTitle] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false)

  const { setToast } = useAppSettings()

  const confirmData = async (): Promise<void> => {
    await insertIntoFolders(title.trim(), selectedIcon, selectedColor);

    setToast("New folder added successfully")
  }

  const editData = async (): Promise<void> => {
    await updateFolders(title.trim(), selectedIcon, selectedColor, folder._id)

    setToast("Folder edited successfully")
  }

  const PrimaryButton = async (): Promise<void> => {
    if (!title.trim()) {
      setToast("Please add a title")
      return onClose()
    }

    if (title.trim().length > 18) {
      setToast("The title should be less than 18 letter")
      return onClose()
    }

    isEdit ? await editData() : await confirmData()

    setTitle("")
    setSelectedIcon("check")
    setSelectedColor("none")

    onRefresh()
    onClose()
  }

  const confirmDelete = async (): Promise<void> => {
    Alert.alert(`Warning`,
      `Are you sure you wanna delete ${folder.title} folder?`, [
      {
        text: "cancel",
      },
      {
        text: "yes",
        onPress: await deleteButton
      },
    ])
  }

  const deleteButton = async (): Promise<void> => {
    await deleteFolder(folder._id)
    setToast("folder deleted successfully")

    onRefresh()

    onClose()
  }

  useEffect(() => {
    setSelectedColor(folder.color)
    setSelectedIcon(folder.icon)
    setTitle(folder.title)

    folder.title ? setIsEdit(true) : setIsEdit(false)
  }, [folder._id, folder.title])

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

          <FlatList
            contentContainerStyle={{ gap: 8, marginVertical: 15 }}
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            horizontal
            data={antIcons1}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedIcon(item)}
                style={[[styles.iconHolder,
                {
                  borderWidth: item === selectedIcon ? 5 : 2,
                  borderColor: reverseColor, backgroundColor: item === "none"
                    ? mainColor
                    : item,
                }]]}
              >
                <Ant name={item} size={25} color={reverseColor} />
              </TouchableOpacity>
            )}
            keyExtractor={item => item}
          />

          <FlatList
            contentContainerStyle={{ gap: 8, marginBottom: 15 }}
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            horizontal
            data={antIcons2}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedIcon(item)}
                style={[[styles.iconHolder,
                {
                  borderWidth: item === selectedIcon ? 5 : 2,
                  borderColor: reverseColor, backgroundColor: item === "none"
                    ? mainColor
                    : item,
                }]]}
              >
                <Ant name={item} size={25} color={reverseColor} />
              </TouchableOpacity>
            )}
            keyExtractor={item => item}
          />

          <TextInput
            multiline={false}
            placeholder="Title"
            placeholderTextColor={reverseColor}
            style={[styles.titleInput, { backgroundColor: grayColor, color: reverseColor }]}
            value={title}
            onChangeText={text => setTitle(text)}
          />

          {isEdit && (
            <TouchableOpacity style={[styles.confirmButton, { marginBottom: 5, backgroundColor: colors.danger }]} onPress={confirmDelete}>
              <Text style={[styles.confirmText, { color: reverseColor }]}>
                <Feather name="trash" color={reverseColor} size={25} />
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.confirmButton, { backgroundColor: colors.orange, }]} onPress={PrimaryButton}>
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

export default ModalFolder

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
    alignItems: 'center',
    borderRadius: 15,
  },
  titleInput: {
    marginVertical: 15,
    paddingHorizontal: 12,
    borderRadius: 25,
    fontSize: 18,
  },
  confirmButton: {
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