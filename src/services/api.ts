import axios from 'axios'
import type { UserInfo, LocationHistory, ApiResponse } from '@/types'

// eslint-disable-next-line
const mockUsers: Record<string, UserInfo> = {
  'user001': {
    userId: 'user001',
    age: 25,
    gender: 'male',
    currentLocation: {
      latitude: 39.9042,
      longitude: 116.4074,
      region: '北京市朝阳区'
    },
    lastUpdateTime: new Date().toISOString()
  },
  'user002': {
    userId: 'user002',
    age: 30,
    gender: 'female',
    currentLocation: {
      latitude: 31.2304,
      longitude: 121.4737,
      region: '上海市浦东新区'
    },
    lastUpdateTime: new Date().toISOString()
  },
  'user003': {
    userId: 'user003',
    age: 28,
    gender: 'male',
    currentLocation: {
      latitude: 23.1291,
      longitude: 113.2644,
      region: '广州市天河区'
    },
    lastUpdateTime: new Date().toISOString()
  }
}

// 模拟位置历史数据
const mockLocationHistory: Record<string, LocationHistory> = {
  'user001': {
    userId: 'user001',
    locations: [
      { latitude: 39.9042, longitude: 116.4074, timestamp: new Date(Date.now() - 3600000).toISOString(), region: '北京市朝阳区' },
      { latitude: 39.9142, longitude: 116.4174, timestamp: new Date(Date.now() - 7200000).toISOString(), region: '北京市海淀区' },
      { latitude: 39.8942, longitude: 116.3974, timestamp: new Date(Date.now() - 10800000).toISOString(), region: '北京市西城区' }
    ]
  },
  'user002': {
    userId: 'user002',
    locations: [
      { latitude: 31.2304, longitude: 121.4737, timestamp: new Date(Date.now() - 1800000).toISOString(), region: '上海市浦东新区' },
      { latitude: 31.2204, longitude: 121.4637, timestamp: new Date(Date.now() - 5400000).toISOString(), region: '上海市黄浦区' },
      { latitude: 31.2404, longitude: 121.4837, timestamp: new Date(Date.now() - 9000000).toISOString(), region: '上海市静安区' }
    ]
  },
  'user003': {
    userId: 'user003',
    locations: [
      { latitude: 23.1291, longitude: 113.2644, timestamp: new Date(Date.now() - 2700000).toISOString(), region: '广州市天河区' },
      { latitude: 23.1191, longitude: 113.2544, timestamp: new Date(Date.now() - 6300000).toISOString(), region: '广州市越秀区' },
      { latitude: 23.1391, longitude: 113.2744, timestamp: new Date(Date.now() - 9900000).toISOString(), region: '广州市荔湾区' }
    ]
  }
}

// 创建axios实例
const api = axios.create({
  baseURL: '/api/v1', // 交由 Vite proxy 转发
  timeout: 10000
})


function adaptUserInfo(raw: any): UserInfo {
  return {
    userId: raw.userId,
    age: raw.age,
    gender: raw.gender === '男' ? 'male' : raw.gender === '女' ? 'female' : 'other',
    currentLocation: {
      latitude: raw.latitude,
      longitude: raw.longitude,
      region: raw.region
    },
    lastUpdateTime: typeof raw.lastUpdate === 'number' ? new Date(raw.lastUpdate).toISOString() : raw.lastUpdate
  }
}

// 用户位置查询API
export const userLocationApi = {
  // 获取用户实时信息
  async getUserInfo(userId: string): Promise<ApiResponse<UserInfo>> {
    const res = await api.get(`/users/coordinates/${userId}`)
    return {
      success: true,
      data: adaptUserInfo(res.data)
    }
  },

  

  // 获取用户位置历史
  async getUserLocationHistory(userId: string): Promise<ApiResponse<LocationHistory>> {
    // const res = await api.get(`/users/coordinates/history/${userId}`)
    const mockRes = mockLocationHistory[userId]
    return {
      success: true,
      data: mockRes ? { ...mockRes, userId } : { userId, locations: [] }
    }
  },

  // 获取所有用户信息（分页）
  async getAllUsers(page: number = 1, pageSize: number = 20): Promise<ApiResponse<{ users: UserInfo[], total: number }>> {
    // await new Promise(resolve => setTimeout(resolve, 200))
    // return {
    //   success: true,
    //   data: Object.values(mockUsers)
    // }
    const res = await api.get('/users/coordinates', {
      params: { page, pageSize }
    })
    // 后端返回 { users: UserInfo[], total: number }
    return {
      success: true,
      data: res.data
    }
  }
}

export default api