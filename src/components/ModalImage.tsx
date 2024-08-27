import React from "react";
import { StyleSheet, Modal, View, TouchableWithoutFeedback, Dimensions, Image } from "react-native";
import { colors } from "../misc/config";
import Ant from 'react-native-vector-icons/AntDesign'

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height

interface Props {
  visible: boolean,
  onClose: () => void,
  uri: string
}

const ModalImage = ({ visible, onClose, uri }: Props): React.JSX.Element => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <View style={styles.content}>
          <Image source={{ uri: uri }} resizeMode="contain" style={styles.image} />
        </View>

        <Ant
          name="close"
          size={32}
          color={colors.orange}
          style={styles.icon}
          onPress={onClose}
        />
      </View>

      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.modalBG, StyleSheet.absoluteFillObject]} />
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default ModalImage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    width: width,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: width - 20,
    height: height - 20
  },
  icon: {
    backgroundColor: `rgba(255,165,0, .2)`,
    padding: 5,
    borderRadius: 50,
    position: 'absolute',
    top: 20,
    right: 35,
  },
  modalBG: {
    backgroundColor: "black",
    zIndex: -1,
  }
})