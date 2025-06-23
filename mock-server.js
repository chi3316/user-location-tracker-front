// mock-server.js
import express from 'express'

const app = express()
const port = 8080

// 返回固定的模拟数据
app.get('/api/v1/users/coordinates/:userId', (req, res) => {
  const { userId } = req.params
  res.json({
    userId,
    gender: '男',
    age: 28,
    region: '北京市朝阳区',
    latitude: 39.921239,
    longitude: 116.443087,
    lastUpdate: Date.now()
  })
})

app.listen(port, () => {
  console.log(`🚀 Mock server running at http://localhost:${port}`)
})

