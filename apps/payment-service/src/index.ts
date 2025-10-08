import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/health', (c) => {
  return c.json({
        status : "ok",
        uptime : process.uptime(),
        timeStamp : Date.now()
    })
})


const start = async () => {

  try {
      serve({
    fetch: app.fetch,
    port: 8002
  }, (info : any) => {
    console.log(`Payment-Service running on Port ${info.port}`)
})
  } catch (error) {
    console.log(error);
    process.exit(1)
  }

}

start()


