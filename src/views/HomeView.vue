<template>
  <div class="home-view">
    <div class="container">
      <header class="page-header">
        <h1>用户实时位置追踪系统</h1>
        <p>基于Flink和HBase的用户位置信息查询平台</p>
      </header>

      <main class="main-content">
        <!-- 查询表单 -->
        <UserQueryForm
          :loading="store.loading"
          @query="handleUserQuery"
          @clear="handleClear"
        />

        <!-- 错误提示 -->
        <el-alert
          v-if="store.error"
          :title="store.error"
          type="error"
          show-icon
          closable
          @close="store.error = null"
          class="error-alert"
        />

        <!-- 用户信息和地图 -->
        <div v-if="store.hasUser" class="content-grid">
          <div class="info-section">
            <UserInfoDisplay
              :user-info="store.currentUser"
              :location-history="store.locationHistory"
              :loading="store.loading"
            />
          </div>
          
          <div class="map-section">
            <el-card class="map-card">
              <template #header>
                <div class="card-header">
                  <h3>实时位置地图</h3>
                  <el-button
                    v-if="store.hasLocationHistory"
                    @click="toggleHistoryView"
                    size="small"
                    :type="showHistory ? 'primary' : 'default'"
                  >
                    {{ showHistory ? '隐藏轨迹' : '显示轨迹' }}
                  </el-button>
                </div>
              </template>
              
              <LocationMap
                :user-info="store.currentUser"
                :location-history="showHistory ? store.locationHistory : null"
                :loading="store.loading"
              />
            </el-card>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="store.loading" class="loading-container">
            <el-icon class="is-loading" size="32">
                <Loading />
            </el-icon>
          <p>正在查询用户信息...</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import { useUserLocationStore } from '@/stores/userLocation'
import UserQueryForm from '@/components/UserQueryForm.vue'
import UserInfoDisplay from '@/components/UserInfoDisplay.vue'
import LocationMap from '@/components/LocationMap.vue'

const store = useUserLocationStore()
const showHistory = ref(true)

const handleUserQuery = async (userId: string) => {
  await store.fetchUserInfo(userId)
  if (store.hasUser) {
    await store.fetchLocationHistory(userId)
  }
}

const handleClear = () => {
  store.clearUserData()
}

const toggleHistoryView = () => {
  showHistory.value = !showHistory.value
}
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
  color: white;
}

.page-header h1 {
  margin: 0 0 8px 0;
  font-size: 36px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.page-header p {
  margin: 0;
  font-size: 18px;
  opacity: 0.9;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.error-alert {
  margin-bottom: 16px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: start;
  min-height: 600px;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.map-section {
  position: sticky;
  top: 20px;
  height: fit-content;
}

.map-card {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.map-card .card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
}

.map-card .card-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.loading-container p {
  margin: 16px 0 0 0;
  color: #666;
  font-size: 16px;
}

/* 桌面端优化 */
@media (min-width: 1200px) {
  .container {
    max-width: 1600px;
  }
  
  .content-grid {
    gap: 40px;
  }
  
  .page-header h1 {
    font-size: 42px;
  }
  
  .page-header p {
    font-size: 20px;
  }
}

/* 平板端 */
@media (max-width: 1199px) and (min-width: 769px) {
  .content-grid {
    gap: 24px;
  }
  
  .page-header h1 {
    font-size: 32px;
  }
}

/* 移动端响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .map-section {
    position: static;
  }
  
  .page-header h1 {
    font-size: 28px;
  }
  
  .page-header p {
    font-size: 16px;
  }
  
  .map-card .card-header h3 {
    font-size: 16px;
  }
}
</style>