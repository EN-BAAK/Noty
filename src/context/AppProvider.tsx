import React, { Component, createContext, useContext } from 'react'
import { AppSettings as AppSettingsType, Props } from '../misc/types'
import { Appearance } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage"
import Toast from '../components/Toast'

interface State {
  theme: "light" | 'dark',
  search: string,
  toast: string | undefined,
}

const AppSettings = createContext<AppSettingsType | undefined>(undefined)

export default class AppProvider extends Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
      theme: "light",
      search: "",
      toast: undefined,
    }
  }

  fetInitialTheme = async (): Promise<void> => {
    const json: string | null = await AsyncStorage.getItem("theme");
    let theme: string | undefined | null;


    if (!json)
      theme = Appearance.getColorScheme()
    else
      theme = JSON.parse(json)

    theme === "light" || theme === 'dark'
      ? this.setState({ theme }) :
      this.setState({ theme: "dark" });
  }

  setTheme = async (): Promise<void> => {
    const newTheme = this.state.theme === "light" ? 'dark' : 'light'
    this.setState({ theme: newTheme })

    const json = JSON.stringify(newTheme)
    await AsyncStorage.setItem("theme", json)
  }

  setSearch = (text: string): void => {
    this.setState({ search: text })
  }

  setToast = (text: string): void => {
    this.setState({ toast: text })
  }

  componentDidMount = async (): Promise<void> => {
    await this.fetInitialTheme()
  }

  render() {
    return (
      < AppSettings.Provider value={{
        setTheme: this.setTheme,
        setSearch: this.setSearch,
        setToast: this.setToast,
        theme: this.state.theme,
        search: this.state.search,
      }
      }>
        {this.props.children}
        {
          this.state.toast &&
          <Toast
            message={this.state.toast}
            theme={this.state.theme}
            onCLose={() => this.setState({ toast: undefined })} />
        }
      </ AppSettings.Provider>
    )
  }
}

export const useAppSettings = (): AppSettingsType => {
  const CONTEXT = useContext(AppSettings)
  return CONTEXT as AppSettingsType;
}