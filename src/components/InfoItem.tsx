import React from "react";
import { infoType } from "../misc/types";
import { StyleSheet, Text, View } from "react-native";
import { useAppSettings } from "../context/AppProvider";
import { colors } from "../misc/config";

interface Props {
  item: infoType,
  mainColor: string,
  textColor: string
}

const InfoItem = ({ item, mainColor, textColor }: Props): React.JSX.Element => {
  const containerStyle = item.withBorder
    ? { marginTop: 20, borderLeftWidth: 5, paddingLeft: 10, borderLeftColor: mainColor }
    : { marginTop: 20 }

  const { search } = useAppSettings()

  const sentence = item.info.split(' ');;

  const highlightLetter = (word: string) => {
    const regex = new RegExp(search, 'i');
    if (word.match(regex)) {
      return <Text style={styles.highlightedLetter}>{word + " "}</Text>;
    }
    return <Text>{word + " "}</Text>;
  };

  return (
    <View style={containerStyle}>
      {item.title && (
        <Text style={[styles.title, { color: mainColor }]}>
          {item.title}
        </Text>
      )}
      <Text style={[styles.text, { color: textColor }]}>
        {!search ?
          item.info
          :
          sentence.map((letter, index) => (
            <React.Fragment key={index}>{highlightLetter(letter)}</React.Fragment>
          ))}
      </Text>
    </View>
  )
}

export default InfoItem

const styles = StyleSheet.create({
  title: {
    fontWeight: "400",
    fontSize: 25
  },
  text: {
    marginTop: 4,
    fontSize: 18
  },
  highlightedLetter: {
    backgroundColor: colors.orange
  }
})