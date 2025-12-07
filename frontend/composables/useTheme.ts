import { useColorMode } from '#imports'

export const useTheme = () => {
  const colorMode = useColorMode()

  const isDark = computed(() => colorMode.value === 'dark')
  const theme = computed(() => colorMode.value)

  const toggleTheme = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    colorMode.preference = newTheme
  }

  return {
    isDark,
    theme,
    toggleTheme,
    setTheme
  }
}
