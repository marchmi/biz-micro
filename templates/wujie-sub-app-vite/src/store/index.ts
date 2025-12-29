import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface UserInfo {
  id: number
  name: string
  avatar: string
  email: string
}

export const useMainStore = defineStore('main', () => {
  const userInfo = ref<UserInfo>({
    id: 1,
    name: '子应用用户',
    avatar: '',
    email: 'subapp@example.com'
  })

  const token = ref('')

  const isAuthenticated = ref(false)

  function setToken(newToken: string) {
    token.value = newToken
    isAuthenticated.value = !!newToken
  }

  function setUserInfo(info: Partial<UserInfo>) {
    userInfo.value = { ...userInfo.value, ...info }
  }

  function logout() {
    token.value = ''
    isAuthenticated.value = false
    userInfo.value = {
      id: 1,
      name: '子应用用户',
      avatar: '',
      email: 'subapp@example.com'
    }
  }

  return {
    userInfo,
    token,
    isAuthenticated,
    setToken,
    setUserInfo,
    logout
  }
})
