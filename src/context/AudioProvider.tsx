import React, { createContext, useContext, useEffect, useState } from "react";
import { onRegisterPlayback } from "../misc/services";
import TrackPlayer, { useProgress } from "react-native-track-player";
import { AudioService } from "../misc/types";
import { colors, audioSpeeds as speed } from "../misc/config";
import { Animated, PanResponder } from "react-native";
import Ant from "react-native-vector-icons/AntDesign"
import { isToggle } from "../misc/helpers";
import { useAppSettings } from "./AppProvider";
import { grayBackground, mainText } from "../misc/styles";

const AudioContext = createContext<AudioService>({
  audioURI: "",
  isPlaying: false,
  handleAudioToggle: async () => { },
  handleDelete: async () => { },
  isAudioExist: false,
  progress: "",
  seekTo: async () => { },
  stopAudio: async () => { },
  playAudio: async () => { },
  increaseSpeed: async () => { },
  speedIndex: 0
})

const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [audioURI, setAudioURI] = useState<string>("")
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isAudioExist, setIsAudioExist] = useState<boolean>(false)
  const [speedIndex, setSpeedIndex] = useState<number>(0)

  const pan = useState(new Animated.ValueXY())[0]

  const panResponder = useState(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => {
        return true
      },
      onPanResponderGrant: () =>
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        })
      ,
      onPanResponderMove: Animated.event([null, {
        dx: pan.x, dy: pan.y
      }]),
      onPanResponderRelease: () => {
        return pan.flattenOffset()
      }
    })
  )

  const { theme } = useAppSettings()

  const textColor = mainText(theme)
  const grayColor = grayBackground(theme)

  const progress = useProgress()

  const setUpAudio = async (uri: string, filename: string) => {
    try {
      await TrackPlayer.add({
        id: 0,
        url: uri,
        title: filename,
        artist: "Artist",
      })

      setAudioURI(uri)

    } catch (err) {
      console.log("Error setting up the audio")
    }
  }

  const handleAudioToggle = async (newAudioURI: string, newAudioName: string) => {
    try {
      if (newAudioURI !== audioURI) {
        await TrackPlayer.stop()
        try {
          await TrackPlayer.remove([0])
        } catch (err) {
          console.log("Error removing Audio")
        }
        await setUpAudio(newAudioURI, newAudioName)
        TrackPlayer.play()
        setIsAudioExist(true)
        return setIsPlaying(true)
      }
      if (!isPlaying) {
        TrackPlayer.play()
        return setIsPlaying(true)
      }
      TrackPlayer.pause()
      return setIsPlaying(false)
    } catch (err) {
      console.error("Error Toggle music", err)
    }
  }

  const handleDelete = async () => {
    await TrackPlayer.stop()
    try {
      await TrackPlayer.remove([0])
    } catch (err) {
      console.log("Error removing Audio")
    }
    setIsPlaying(false)
    setAudioURI("")
    setIsAudioExist(false)
  }

  const handleStop = async () => {
    await TrackPlayer.pause()
    setIsPlaying(false)
  }

  const handlePlay = async () => {
    await TrackPlayer.play()
    setIsPlaying(true)
  }

  const increaseRate = async () => {
    const newRateIndex = (speedIndex + 1) % 3
    const rate = speed[newRateIndex]

    await TrackPlayer.setRate(+rate)
    setSpeedIndex(newRateIndex)
  }

  const handleSeekTo = async (position: number) => {
    try {
      await TrackPlayer.seekTo(position)
    } catch (err) {
      console.error("Error seeking audio playback:", err)
    }
  }

  useEffect(() => {
    const settingUp = async () => {
      TrackPlayer.registerPlaybackService(() => onRegisterPlayback)
      await TrackPlayer.setupPlayer()
    }

    settingUp()
  }, [])

  return (
    <AudioContext.Provider
      value={{
        audioURI,
        isPlaying,
        handleAudioToggle,
        handleDelete,
        isAudioExist,
        progress,
        seekTo: handleSeekTo,
        stopAudio: handleStop,
        playAudio: handlePlay,
        increaseSpeed: increaseRate,
        speedIndex
      }}>
      {children}

      {audioURI && (
        <Animated.View style={[{
          backgroundColor: grayColor,
          width: 100,
          paddingVertical: 5,
          paddingHorizontal: 10,
          borderRadius: 25,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'absolute',
        }, pan.getLayout()]}
          {...panResponder[0].panHandlers}
        >
          {
            isToggle(audioURI, audioURI, isPlaying)
              ? <Ant
                name="pausecircleo"
                size={36}
                color={colors.orange}
                onPress={async () => await handleAudioToggle(audioURI, "new")}
              />
              : <Ant
                name="playcircleo"
                size={36}
                color={textColor}
                onPress={async () => await handleAudioToggle(audioURI, "new")}
              />
          }

          <Ant
            name="closecircle"
            size={36}
            color={colors.danger}
            onPress={async () => handleDelete()}
          />
        </Animated.View>
      )}
    </AudioContext.Provider>
  )
}

export default AudioProvider;

export const useAudioContext = (): AudioService => {
  const CONTEXT = useContext<AudioService>(AudioContext)
  return CONTEXT
}