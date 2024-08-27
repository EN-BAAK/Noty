import React, { Component } from "react";
import { SafeAreaView } from "react-native";
import AppProvider from "./src/context/AppProvider";
import { flexOne } from "./src/misc/styles";
import AppContainer from "./src/layouts/AppContainer";
import AudioProvider from "./src/context/AudioProvider";

export default class App extends Component {
  render() {
    return (
      <SafeAreaView style={flexOne}>
        <AppProvider>
          <AudioProvider>
            <AppContainer />
          </AudioProvider>
        </AppProvider>
      </SafeAreaView>
    )
  }
}