import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json()) // For JSON body
// Optional, for form submissions: app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.originalUrl}`)
  next()
})

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).send(`Cannot ${req.method} ${req.url}`)
})

const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => console.log(` Server running on port ${PORT}`))
}

startServer()
