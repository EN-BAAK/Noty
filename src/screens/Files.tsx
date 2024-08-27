import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { selectFromFiles } from "../misc/Database";
import { fileType } from "../misc/types";
import Loading from "../components/Loading";
import { flexOne, grayBackground, mainBackground, mainText } from "../misc/styles";
import PrimaryButton from "../components/PrimaryButton";
import { searchText } from "../misc/helpers";
import File from "../components/File";
import { useAppSettings } from "../context/AppProvider";
import ModalFile from "../components/ModalFile";

interface Props {
  route: any,
  navigation: any
}

const Files = ({ route, navigation }: Props): React.JSX.Element => {
  const [parent_id, setParent_id] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [data, setData] = useState<fileType[]>([])
  const [selectedFile, setSelectedFile] = useState<fileType | undefined>(undefined)

  const { theme, search } = useAppSettings()

  const textColor = mainText(theme)
  const backgroundColor = mainBackground(theme)
  const grayBackgroundColor = grayBackground(theme)

  const fetchData = async (): Promise<void> => {
    setIsLoading(true)
    await selectFromFiles(setData, parent_id)
    setIsLoading(false)
  }

  useEffect(() => {
    setParent_id(route.params._id)
  }, [])

  useEffect(() => {
    if (parent_id)
      fetchData()

  }, [parent_id])

  if (isLoading)
    return <Loading />

  return (
    <View style={flexOne}>
      {data.length <= 0
        ? <View style={flexOne}>
          <Text style={{ textAlign: 'center', fontWeight: "600", fontSize: 25, color: textColor }}>
            There is no data yet
          </Text>
        </View> : (
          <View style={[flexOne, {
            flexDirection: 'row',
            alignItems: "flex-start",
            gap: 10
          }]}>
            <FlatList
              style={flexOne}
              contentContainerStyle={{ paddingBottom: 35 }}
              removeClippedSubviews={true}
              maxToRenderPerBatch={7}
              windowSize={2}
              refreshControl={
                <RefreshControl
                  refreshing={isLoading}
                  onRefresh={fetchData}
                />
              }
              data={data.filter(item => searchText(search, item.title))}
              renderItem={({ item, index }: { item: fileType, index: number }) => (
                index % 2 == 0 ? (
                  <File
                    title={item.title}
                    desc={item.desc}
                    color={item.color}
                    _id={item._id}
                    key={item._id}
                    handleLongPress={() => {
                      setSelectedFile(item)
                      setVisible(true)
                    }}
                    handlePress={() =>
                      navigation.navigate(
                        "Page",
                        {
                          _id: item._id, color: item.color, title: item.title, desc: item.desc
                        })}
                  />) : null
              )}
              ItemSeparatorComponent={() => (
                <View style={{ height: 4 }} />
              )}
            />

            <FlatList
              style={flexOne}
              contentContainerStyle={{ paddingBottom: 35 }}
              removeClippedSubviews={true}
              maxToRenderPerBatch={7}
              windowSize={2}
              refreshControl={
                <RefreshControl
                  refreshing={isLoading}
                  onRefresh={fetchData}
                />
              }
              data={data.filter(item => searchText(search, item.title))}
              renderItem={({ item, index }: { item: fileType, index: number }) => (
                index % 2 == 1 ? (
                  <File
                    title={item.title}
                    desc={item.desc}
                    color={item.color}
                    _id={item._id}
                    key={item._id}
                    handleLongPress={() => {
                      setSelectedFile(item)
                      setVisible(true)
                    }}
                    handlePress={() =>
                      navigation.navigate(
                        "Page",
                        {
                          _id: item._id, color: item.color, title: item.title, desc: item.desc
                        })}
                  />) : null
              )}
              ItemSeparatorComponent={() => (
                <View style={{ height: 4 }} />
              )}
            />
          </View>
        )
      }

      <PrimaryButton
        text="+ Add new files"
        onEffect={() => {
          setSelectedFile({
            title: "",
            desc: "",
            color: "none",
            _id: 0
          })
          setVisible(true)
        }}
        color={textColor}
      />

      <ModalFile
        visible={visible}
        onClose={() => setVisible(false)}
        mainColor={backgroundColor}
        reverseColor={textColor}
        grayColor={grayBackgroundColor}
        parent_id={parent_id}
        file={selectedFile || { title: "", desc: "", color: "none", _id: 0 }}
        onRefresh={fetchData}
      />
    </View>
  )
}

export default Files