import { ref, onMounted } from 'vue'

export function useTheme() {
  const isDark = ref(false)

  const setTheme = (dark) => {
    isDark.value = dark

    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
    }
  }

  const toggleTheme = () => {
    setTheme(!isDark.value)
  }

  onMounted(() => {
    if (localStorage.theme === 'dark' || localStorage.theme === 'light') {
      setTheme(localStorage.theme === 'dark')
    } else {
      setTheme(false)
    }
  })

  return { isDark, toggleTheme }
}
