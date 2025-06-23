<template>
    <div class="user-query-form">
      <el-card class="query-card">
        <template #header>
          <div class="card-header">
            <h3>用户位置查询</h3>
          </div>
        </template>
        
        <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
          <el-form-item label="用户ID" prop="userId">
            <el-input
              v-model="form.userId"
              placeholder="请输入用户ID"
              clearable
              @keyup.enter="handleQuery"
            >
              <template #append>
                <el-button @click="handleQuery" :loading="loading" type="primary">
                  查询
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          
          <el-form-item>
            <el-button @click="handleQuery" :loading="loading" type="primary" size="large">
              查询用户信息
            </el-button>
            <el-button @click="handleClear" size="large">
              清空
            </el-button>
          </el-form-item>
        </el-form>
  
        <!-- 示例用户ID -->
        <div class="example-users">
          <p class="example-title">示例用户ID:</p>
          <div class="example-list">
            <el-tag
              v-for="userId in exampleUserIds"
              :key="userId"
              @click="selectExampleUser(userId)"
              class="example-tag"
              type="info"
              effect="plain"
            >
              {{ userId }}
            </el-tag>
          </div>
        </div>
      </el-card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  
  interface Props {
    loading?: boolean
  }
  
  const props = withDefaults(defineProps<Props>(), {
    loading: false
  })
  
  const emit = defineEmits<{
    query: [userId: string]
    clear: []
  }>()
  
  const formRef = ref<FormInstance>()
  const form = reactive({
    userId: ''
  })
  
  const exampleUserIds = ['user001', 'user002', 'user003']
  
  const rules: FormRules = {
    userId: [
      { required: true, message: '请输入用户ID', trigger: 'blur' },
      { min: 3, max: 200, message: '用户ID长度在 3 到 200 个字符', trigger: 'blur' }
    ]
  }
  
  const handleQuery = async () => {
    if (!formRef.value) return
    
    try {
      await formRef.value.validate()
      emit('query', form.userId)
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }
  
  const handleClear = () => {
    form.userId = ''
    formRef.value?.clearValidate()
    emit('clear')
  }
  
  const selectExampleUser = (userId: string) => {
    form.userId = userId
  }
  </script>
  
  <style scoped>
  .user-query-form {
    margin-bottom: 24px;
  }
  
  .query-card {
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
    font-size: 18px;
    font-weight: 600;
  }
  
  .example-users {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
  }
  
  .example-title {
    margin: 0 0 8px 0;
    color: #666;
    font-size: 14px;
  }
  
  .example-list {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  
  .example-tag {
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .example-tag:hover {
    background-color: #409eff;
    color: white;
    border-color: #409eff;
  }
  </style>