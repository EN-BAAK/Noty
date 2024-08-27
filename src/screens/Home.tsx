import React, { useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl, Text, View } from "react-native";
import { folderType } from "../misc/types";
import { clearDB, selectFromFolders } from "../misc/Database";
import ModalFolder from "../components/ModalFolder";
import { flexOne, grayBackground, mainBackground, mainText } from "../misc/styles";
import { useAppSettings } from "../context/AppProvider";
import PrimaryButton from "../components/PrimaryButton";
import { searchText } from "../misc/helpers";
import Folder from "../components/Folder";
import Loading from "../components/Loading";

const Home = ({ navigation }: { navigation: any }): React.JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [visible, setVisible] = useState<boolean>(false)
  const [selectedFolder, setSelectedFolder] = useState<folderType | undefined>(undefined)
  const [folders, setFolders] = useState<folderType[]>([])

  const { theme, search } = useAppSettings()

  const mainTextColor = mainText(theme)
  const mainBackgroundColor = mainBackground(theme)
  const grayBackgroundColor = grayBackground(theme)
  const numColumns = 2

  const fetchData = async () => {
    setIsLoading(true)
    await selectFromFolders(setFolders)
    setIsLoading(false)
  }

  const clearAllData = async () => {
    await clearDB()
    await fetchData()
  }

  const confirmClearData = async () => {
    Alert.alert("Warning", "Are you sure you want to clear all data in the app?",
      [
        {
          text: "Cancel"
        },
        {
          text: "Sure",
          onPress: await clearAllData
        },
      ]
    )
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (isLoading)
    return <Loading />

  return (
    <View style={flexOne}>
      <FlatList
        style={flexOne}
        contentContainerStyle={{ marginTop: 20, paddingBottom: 35 }}
        numColumns={numColumns}
        removeClippedSubviews={true}
        maxToRenderPerBatch={8}
        windowSize={2}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchData}
          />
        }
        data={folders.filter(item => searchText(search, item.title))}
        renderItem={({ item }: { item: folderType }) => (
          <Folder
            title={item.title}
            color={item.color}
            icon={item.icon}
            key={item._id}
            handleLongPress={() => {
              setSelectedFolder(item)
              setVisible(true)
            }}
            handlePress={() => navigation.navigate("Files", { _id: item._id })}
          />
        )}
        ItemSeparatorComponent={() => (
          <View style={{ height: 16 }} />
        )}
        ListEmptyComponent={() => (
          <View style={flexOne}>
            <Text style={{ textAlign: 'center', fontWeight: "600", fontSize: 25, color: mainTextColor }}>
              There is no data yet
            </Text>
          </View>
        )}
      />

      <PrimaryButton
        text="+ Add new folder"
        onEffect={() => {
          setSelectedFolder({ title: "", icon: "check", color: "none", _id: 0 })
          setVisible(true)
        }
        }
        onLongPress={confirmClearData}
        color={mainTextColor}
      />

      <ModalFolder
        visible={visible}
        onClose={() => {
          setVisible(false)
        }}
        mainColor={grayBackgroundColor}
        reverseColor={mainTextColor}
        grayColor={mainBackgroundColor}
        folder={selectedFolder || { title: "", icon: "check", color: "none", _id: 0 }}
        onRefresh={fetchData}
      />
    </View>
  )
}

export default Home