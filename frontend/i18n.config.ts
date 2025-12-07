import en from './locales/en.json'
import he from './locales/he.json'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en,
    he
  }
}))
