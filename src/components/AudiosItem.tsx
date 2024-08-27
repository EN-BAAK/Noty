import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { audioType } from "../misc/types";
import Ent from 'react-native-vector-icons/Entypo'
import Ant from 'react-native-vector-icons/AntDesign'
import { Slider } from "react-native-elements";
import { audioSpeeds as speed } from "../misc/config";
import { useAudioContext } from "../context/AudioProvider";
import { convertSecToMinSec, formatText, isToggle } from "../misc/helpers";

interface Props {
  item: audioType,
  mainColor: string,
  textColor: string,
  grayColor: string,
  increaseSpeed: () => Promise<void | undefined>
  seekTo: (position: number) => Promise<void | undefined>,
  stopAudio: () => Promise<void | undefined>,
  playAudio: () => Promise<void | undefined>,
  handleAudioToggle: (newUri: string, audioName: string) => Promise<void | undefined>
}

const AudiosItem = ({ item, mainColor, textColor, grayColor, increaseSpeed, seekTo, playAudio, stopAudio, handleAudioToggle }: Props): React.JSX.Element => {
  const { isPlaying, audioURI, speedIndex, progress } = useAudioContext()

  const isAudioToggle = isToggle(item.uri, audioURI, isPlaying)
  const audioStyleToggle = isAudioToggle
    ? textColor
    : mainColor

  const audioStyle = item.withBorder
    ? {
      borderWidth: 3,
      borderColor: mainColor
    }
    : {}

  return (
    <View style={[styles.audio, audioStyle, { backgroundColor: grayColor }]}>
      <View style={styles.header}>
        <Text style={[styles.audioName, { color: audioStyleToggle }]}>
          {formatText(item.filename, 18)}
        </Text>

        <TouchableOpacity onPress={() => increaseSpeed()}>
          <Text style={{ color: audioStyleToggle }}>x{speed[speedIndex]}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.audioSlider}>
        <Text
          style={[{ marginRight: 5, fontSize: 15 }, { color: audioStyleToggle }]}>
          {audioURI === item.uri ? convertSecToMinSec(progress.position) : "00:00"}
        </Text>

        <Slider
          value={audioURI === item.uri ? progress.position : 0}
          minimumValue={0}
          maximumValue={progress.duration}
          maximumTrackTintColor={textColor}
          minimumTrackTintColor={mainColor}
          thumbTintColor={mainColor}
          trackStyle={{ width: "100%", borderRadius: 5 }}
          thumbStyle={{ width: 20, height: 20 }}
          thumbTouchSize={{ width: 25, height: 25 }}
          onSlidingStart={async () => await stopAudio()}
          onSlidingComplete={async (value) => {
            await seekTo(value)
            await playAudio()
          }}
          style={{ flex: 1 }}
        />

        <Text
          style={[{ marginLeft: 5, fontSize: 15 }, { color: audioStyleToggle }]}>
          {convertSecToMinSec(progress.duration)}
        </Text>
      </View>

      <View style={styles.audioController}>
        <Ent
          name="back-in-time"
          size={28}
          color={audioStyleToggle}
          onPress={async () => await seekTo(progress.position - 5 * 60)}
        />

        <Ent
          name="back-in-time"
          size={24}
          color={audioStyleToggle}
          onPress={async () => await seekTo(progress.position - 1 * 60)}
        />

        <Ent
          name="back-in-time"
          size={20}
          color={audioStyleToggle}
          onPress={async () => await seekTo(progress.position - 5)}
        />

        {
          isToggle(item.uri, audioURI, isPlaying)
            ? <Ant
              name="pausecircleo"
              size={42}
              color={textColor}
              onPress={async () => await handleAudioToggle(item.uri, item.filename)}
            />
            : <Ant
              name="playcircleo"
              size={42}
              color={mainColor}
              onPress={async () => await handleAudioToggle(item.uri, item.filename)}
            />
        }

        <Ent
          name="back-in-time"
          size={20}
          color={audioStyleToggle}
          style={{ transform: [{ scaleX: -1 }] }}
          onPress={async () => await seekTo(progress.position + 5)}
        />

        <Ent
          name="back-in-time"
          size={24}
          color={audioStyleToggle}
          style={{ transform: [{ scaleX: -1 }] }}
          onPress={async () => await seekTo(progress.position + 1 * 60)}
        />

        <Ent
          name="back-in-time"
          size={28}
          color={audioStyleToggle}
          style={{ transform: [{ scaleX: -1 }] }}
          onPress={async () => await seekTo(progress.position + 5 * 60)}
        />
      </View>
    </View>
  )
}

export default AudiosItem;

const styles = StyleSheet.create({
  audio: {
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  header: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  audioName: {
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: "600",
    fontSize: 18,
  },
  audioSlider: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioController: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
})