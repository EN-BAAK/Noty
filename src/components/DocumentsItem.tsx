import React from "react";
import { StyleSheet, Image, Dimensions, Text, View } from "react-native";
import { formatText, poster } from "../misc/helpers";
import { documentType } from "../misc/types";

const width = Dimensions.get('window').width

interface Props {
  item: documentType,
  grayColor: string,
  textColor: string
}

const DocumentsItem = ({ item, grayColor, textColor }: Props): React.JSX.Element => {
  return (
    <View
      style={[styles.fileHolder, { backgroundColor: grayColor }]}
    >
      <Image
        style={styles.poster}
        source={poster(item.type)}
      />
      <Text style={[styles.filename, { color: textColor }]} >{formatText(item.title, 18)}</Text>
    </View>
  )
}

export default DocumentsItem;

const styles = StyleSheet.create({
  fileHolder: {
    width: width / 4 - 8,
    height: 115,
  },
  poster: {
    resizeMode: "contain",
    width: width / 4 - 8,
    height: 115,
  },
  filename: {
    textAlign: "center",
    fontSize: 14,
  },
})