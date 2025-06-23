<template>
    <div class="user-info-display">
      <el-card v-if="userInfo" class="info-card">
        <template #header>
          <div class="card-header">
            <h3>用户信息</h3>
            <el-tag :type="getStatusType" size="small">
              {{ getStatusText }}
            </el-tag>
          </div>
        </template>
        
        <div class="user-details">
          <div class="detail-row">
            <div class="detail-item">
              <span class="label">用户ID:</span>
              <span class="value">{{ userInfo.userId }}</span>
            </div>
            <div class="detail-item">
              <span class="label">年龄:</span>
              <span class="value">{{ userInfo.age }}岁</span>
            </div>
            <div class="detail-item">
              <span class="label">性别:</span>
              <span class="value">{{ getGenderText(userInfo.gender) }}</span>
            </div>
          </div>
          
          <div class="detail-row">
            <div class="detail-item">
              <span class="label">当前位置:</span>
              <span class="value">{{ userInfo.currentLocation.region }}</span>
            </div>
            <div class="detail-item">
              <span class="label">纬度:</span>
              <span class="value">{{ userInfo.currentLocation.latitude.toFixed(6) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">经度:</span>
              <span class="value">{{ userInfo.currentLocation.longitude.toFixed(6) }}</span>
            </div>
          </div>
          
          <div class="detail-row">
            <div class="detail-item full-width">
              <span class="label">最后更新时间:</span>
              <span class="value">{{ formatDateTime(userInfo.lastUpdateTime) }}</span>
            </div>
          </div>
        </div>
      </el-card>
  
      <el-card v-if="locationHistory" class="history-card">
        <template #header>
          <div class="card-header">
            <h3>位置历史</h3>
            <span class="history-count">{{ locationHistory.locations.length }} 个位置点</span>
          </div>
        </template>
        
        <div class="history-list">
          <div
            v-for="(location, index) in locationHistory.locations"
            :key="index"
            class="history-item"
          >
            <div class="history-index">{{ index + 1 }}</div>
            <div class="history-content">
              <div class="history-location">
                <span class="region">{{ location.region }}</span>
                <span class="coordinates">
                  ({{ location.latitude.toFixed(6) }}, {{ location.longitude.toFixed(6) }})
                </span>
              </div>
              <div class="history-time">
                {{ formatDateTime(location.timestamp) }}
              </div>
            </div>
          </div>
        </div>
      </el-card>
  
      <el-empty
        v-if="!userInfo && !loading"
        description="请输入用户ID查询信息"
        :image-size="120"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import type { UserInfo, LocationHistory } from '@/types'
  
  interface Props {
    userInfo?: UserInfo | null
    locationHistory?: LocationHistory | null
    loading?: boolean
  }
  
  const props = withDefaults(defineProps<Props>(), {
    loading: false
  })
  
  const getGenderText = (gender: string) => {
    switch (gender) {
      case 'male':
        return '男'
      case 'female':
        return '女'
      default:
        return '其他'
    }
  }
  
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }
  
  const getStatusType = computed(() => {
    if (!props.userInfo) return 'info'
    
    const lastUpdate = new Date(props.userInfo.lastUpdateTime)
    const now = new Date()
    const diffMinutes = (now.getTime() - lastUpdate.getTime()) / (1000 * 60)
    
    if (diffMinutes < 5) return 'success'
    if (diffMinutes < 30) return 'warning'
    return 'danger'
  })
  
  const getStatusText = computed(() => {
    if (!props.userInfo) return '未知'
    
    const lastUpdate = new Date(props.userInfo.lastUpdateTime)
    const now = new Date()
    const diffMinutes = (now.getTime() - lastUpdate.getTime()) / (1000 * 60)
    
    if (diffMinutes < 5) return '实时在线'
    if (diffMinutes < 30) return '最近在线'
    return '离线'
  })
  </script>
  
  <style scoped>
  .user-info-display {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .info-card,
  .history-card {
    border-radius: 8px;
  }
  
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .card-header h3 {
    margin: 0;
    color: #333;
    font-size: 16px;
    font-weight: 600;
  }
  
  .history-count {
    font-size: 12px;
    color: #999;
  }
  
  .user-details {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .detail-row {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
  }
  
  .detail-item {
    display: flex;
    align-items: center;
    min-width: 200px;
  }
  
  .detail-item.full-width {
    width: 100%;
  }
  
  .label {
    font-weight: 500;
    color: #666;
    margin-right: 8px;
    min-width: 80px;
  }
  
  .value {
    color: #333;
    font-weight: 500;
  }
  
  .history-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 300px;
    overflow-y: auto;
  }
  
  .history-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 6px;
    border-left: 4px solid #409eff;
  }
  
  .history-index {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: #409eff;
    color: white;
    border-radius: 50%;
    font-size: 12px;
    font-weight: 600;
    flex-shrink: 0;
  }
  
  .history-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .history-location {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .region {
    font-weight: 500;
    color: #333;
  }
  
  .coordinates {
    font-size: 12px;
    color: #666;
    font-family: monospace;
  }
  
  .history-time {
    font-size: 12px;
    color: #999;
  }
  </style>