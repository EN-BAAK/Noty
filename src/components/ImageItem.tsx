import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { imageType } from "../misc/types";
import { useAppSettings } from "../context/AppProvider";
import { colors } from "../misc/config";

interface Props {
  item: imageType,
  mainColor: string,
  textColor: string,
  mainBackground: string,
  grayColor: string,
}

const ImageItem = ({ item, textColor, mainColor, mainBackground, grayColor }: Props): React.JSX.Element => {

  const { search } = useAppSettings()

  const textHolderStyle = item.withBorder
    ? {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderWidth: 12,
      borderRightColor: textColor,
      borderLeftColor: textColor,
      borderBottomColor: textColor,
      borderTopColor: mainBackground,
    }
    : {}


  const highlightLetter = (word: string) => {
    const regex = new RegExp(search, 'i');
    if (word.match(regex)) {
      return <Text style={styles.highlightedLetter}>{word + " "}</Text>;
    }
    return <Text>{word + " "}</Text>;
  };

  const textArray = item.info.split(" ")

  return (
    <View style={styles.imageHolder}>
      <Image
        style={{ width: '100%', height: 250, backgroundColor: grayColor }}
        source={{ uri: item.uri }}
        resizeMode="contain"
      />

      <View style={textHolderStyle}>
        {item.title && (
          <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
        )}
        {item.info && (
          <Text>
            {!search
              ? item.info
              : textArray.map((letter, index) => (
                <React.Fragment key={index}>{highlightLetter(letter)}</React.Fragment>
              ))}
          </Text>
        )}
      </View>
    </View>
  )
}

export default ImageItem;

const styles = StyleSheet.create({
  imageHolder: {
    marginBottom: 15,
  },
  title: {
    marginBottom: 10,
    letterSpacing: 4,
    fontSize: 24,
  },
  info: {
    fontSize: 18,
  },
  highlightedLetter: {
    backgroundColor: colors.orange
  }
})