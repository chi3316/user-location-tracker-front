<template>
    <div class="location-map">
      <div ref="mapContainer" class="map-container"></div>
      <div v-if="loading" class="map-loading">
        <el-icon class="is-loading" size="24">
          <Loading />
        </el-icon>
        <span>加载地图中...</span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import { Loading } from '@element-plus/icons-vue'
  import type { UserInfo, LocationHistory } from '@/types'
  
  // 修复Leaflet默认图标路径问题
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
  })
  
  interface Props {
    userInfo?: UserInfo | null
    locationHistory?: LocationHistory | null
    loading?: boolean
  }
  
  const props = withDefaults(defineProps<Props>(), {
    loading: false
  })
  
  const mapContainer = ref<HTMLElement>()
  let map: L.Map | null = null
  let markers: L.Layer[] = []
  let pathLines: L.Polyline[] = []
  
  const loading = ref(false)
  
  // 初始化地图
  const initMap = () => {
    if (!mapContainer.value) return
  
    map = L.map(mapContainer.value).setView([39.9042, 116.4074], 10)
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)
  }
  
  // 清除地图上的标记和路径
  const clearMap = () => {
    markers.forEach(marker => map?.removeLayer(marker))
    pathLines.forEach(line => map?.removeLayer(line))
    markers = []
    pathLines = []
  }
  
  // 添加用户当前位置标记
  const addCurrentLocationMarker = (userInfo: UserInfo) => {
    if (!map) return
  
    const { latitude, longitude } = userInfo.currentLocation
    
    const marker = L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(`
        <div class="marker-popup">
          <h4>用户: ${userInfo.userId}</h4>
          <p>年龄: ${userInfo.age}</p>
          <p>性别: ${userInfo.gender === 'male' ? '男' : userInfo.gender === 'female' ? '女' : '其他'}</p>
          <p>区域: ${userInfo.currentLocation.region}</p>
          <p>更新时间: ${new Date(userInfo.lastUpdateTime).toLocaleString()}</p>
        </div>
      `)
  
    markers.push(marker)
    
    // 调整地图视图到用户位置
    map.setView([latitude, longitude], 12)
  }
  
  // 添加位置历史路径
  const addLocationHistory = (history: LocationHistory) => {
    if (!map || history.locations.length < 2) return
  
    const coordinates = history.locations.map(loc => [loc.latitude, loc.longitude])
    
    const pathLine = L.polyline(coordinates as [number, number][], {
      color: 'blue',
      weight: 3,
      opacity: 0.7
    }).addTo(map)
  
    pathLines.push(pathLine)
  
    // 为历史位置添加标记
    history.locations.forEach((location, index) => {
      const marker = L.circleMarker([location.latitude, location.longitude], {
        radius: 6,
        fillColor: index === 0 ? '#ff4444' : '#4444ff',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      })
        .addTo(map!)
        .bindPopup(`
          <div class="history-marker-popup">
            <h5>历史位置 ${index + 1}</h5>
            <p>区域: ${location.region}</p>
            <p>时间: ${new Date(location.timestamp).toLocaleString()}</p>
          </div>
        `)
  
      markers.push(marker)
    })
  }
  
  // 监听数据变化
  watch(
    () => [props.userInfo, props.locationHistory],
    async () => {
      if (!map) return
  
      clearMap()
  
      if (props.userInfo) {
        addCurrentLocationMarker(props.userInfo)
      }
  
      if (props.locationHistory) {
        addLocationHistory(props.locationHistory)
      }
    },
    { deep: true }
  )
  
  // 监听加载状态
  watch(
    () => props.loading,
    (newLoading) => {
      loading.value = newLoading
    }
  )
  
  onMounted(async () => {
    await nextTick()
    initMap()
  })
  
  onUnmounted(() => {
    if (map) {
      map.remove()
      map = null
    }
  })
  </script>
  
  <style scoped>
  .location-map {
    position: relative;
    width: 100%;
    height: 500px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  .map-container {
    width: 100%;
    height: 100%;
  }
  
  .map-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.9);
    padding: 16px;
    border-radius: 8px;
    z-index: 1000;
  }
  
  .map-loading span {
    color: #666;
    font-size: 14px;
  }
  
  :deep(.marker-popup) {
    min-width: 200px;
  }
  
  :deep(.marker-popup h4) {
    margin: 0 0 8px 0;
    color: #333;
  }
  
  :deep(.marker-popup p) {
    margin: 4px 0;
    color: #666;
  }
  
  :deep(.history-marker-popup) {
    min-width: 180px;
  }
  
  :deep(.history-marker-popup h5) {
    margin: 0 0 6px 0;
    color: #333;
  }
  
  :deep(.history-marker-popup p) {
    margin: 2px 0;
    color: #666;
    font-size: 12px;
  }
  </style>