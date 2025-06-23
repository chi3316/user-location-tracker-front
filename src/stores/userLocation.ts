import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo, LocationHistory } from '@/types'
import { userLocationApi } from '@/services/api'

export const useUserLocationStore = defineStore('userLocation', () => {
  // 状态
  const currentUser = ref<UserInfo | null>(null)
  const locationHistory = ref<LocationHistory | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const allUsers = ref<UserInfo[]>([])

  // 计算属性
  const hasUser = computed(() => currentUser.value !== null)
  const hasLocationHistory = computed(() => locationHistory.value !== null)

  // 动作
  const fetchUserInfo = async (userId: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await userLocationApi.getUserInfo(userId)
      currentUser.value = response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取用户信息失败'
      currentUser.value = null
    } finally {
      loading.value = false
    }
  }

  const fetchLocationHistory = async (userId: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await userLocationApi.getUserLocationHistory(userId)
      locationHistory.value = response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取位置历史失败'
      locationHistory.value = null
    } finally {
      loading.value = false
    }
  }

  const fetchAllUsers = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await userLocationApi.getAllUsers()
      allUsers.value = response.data.users
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取用户列表失败'
      allUsers.value = []
    } finally {
      loading.value = false
    }
  }

  const clearUserData = () => {
    currentUser.value = null
    locationHistory.value = null
    error.value = null
  }

  return {
    // 状态
    currentUser,
    locationHistory,
    loading,
    error,
    allUsers,
    
    // 计算属性
    hasUser,
    hasLocationHistory,
    
    // 动作
    fetchUserInfo,
    fetchLocationHistory,
    fetchAllUsers,
    clearUserData
  }
})