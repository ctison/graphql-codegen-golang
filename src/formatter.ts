import { GolangPluginConfig } from './config'

export class GolangFormatter {
  private config: GolangPluginConfig

  constructor(config: GolangPluginConfig) {
    this.config = config
  }

  // formatName formats a name from GraphQL schema into Golang
  formatName(name: string): string {
    if (name.match(/^id$/i) || name.match(/^uuid$/i)) {
      return name.toUpperCase()
    }
    return name
      .replace(/(^_|_$)/, '')
      .split('_')
      .map(word => word[0].toUpperCase() + word.substr(1))
      .join('')
  }

  formatType(type: string): string {
    return this.formatName(type)
  }
}
