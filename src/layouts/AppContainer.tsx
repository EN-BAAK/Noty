import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import { useAppSettings } from '../context/AppProvider'
import { container, grayBackground, mainBackground, mainText, reverseBackground, reverseText } from '../misc/styles'
import Ent from 'react-native-vector-icons/Entypo'
import Ant from 'react-native-vector-icons/AntDesign'
import AppNavigation from '../navigation/AppNavigation'
import { callEveryThing } from '../misc/Database'

const AppContainer = () => {
  const { theme, setTheme, search, setSearch } = useAppSettings()

  const mainTextColor = mainText(theme)
  const reverseTextColor = reverseText(theme)
  const mainBackgroundColor = mainBackground(theme)
  const reverseBackgroundColor = reverseBackground(theme)
  const grayBackgroundColor = grayBackground(theme)

  return (
    <View style={[container, { backgroundColor: mainBackgroundColor }]}>
      <View style={styles.header}>
        <Text style={[{ color: mainTextColor }, styles.title]}>Noty</Text>
        <TouchableOpacity style={[{ backgroundColor: reverseBackgroundColor }, styles.theme]} onPress={setTheme}>
          <Ent name={theme === "light" ? "light-up" : "moon"} size={20} color={reverseTextColor} />
        </TouchableOpacity>
      </View>

      <View style={[{ backgroundColor: grayBackgroundColor }, styles.search]}>
        <TextInput
          multiline={false}
          value={search}
          onChangeText={text => setSearch(text)}
          placeholder='Search'
          placeholderTextColor={mainTextColor}
          style={{ color: mainTextColor }}
        />

        <View style={[styles.searchIcon]}>
          <Ant name="search1" size={25} color={mainTextColor} />
        </View>
      </View>

      <AppNavigation mainColor={mainBackgroundColor} />

      {/* <TouchableOpacity
        onPress={async () => {
          await callEveryThing()
        }}
        style={{
          backgroundColor: 'red',
          position: 'absolute',
          top: 50,
          padding: 5,
        }}>
        <Text>Click me</Text>
      </TouchableOpacity> */}

    </View >
  )
}

export default AppContainer;

const styles = StyleSheet.create({
  header: {
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontWeight: "600",
    fontSize: 35,
  },
  theme: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  search: {
    height: 50,
    marginBottom: 15,
    borderRadius: 25,
    paddingLeft: 50,
    position: 'relative',
    overflow: 'hidden'
  },
  searchIcon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
})