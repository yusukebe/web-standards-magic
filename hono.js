import { Hono } from 'https://esm.sh/hono'
import { html } from 'https://esm.sh/hono/html'
import { getRuntimeKey } from 'https://esm.sh/hono/adapter'

const app = new Hono()

const runtime = getRuntimeKey() === 'deno' ? 'Server' : 'Browser'

app.get('/hono.js', async (c, next) => {
  const { serveStatic } = await import('https://esm.sh/hono/deno')
  return serveStatic({ path: './hono.js' })(c, next)
})

// For Server
app.get('*', async (c, next) => {
  if (runtime === 'Browser') return await next()
  return c.html(
    html`<html>
      <head>
        <script type="module">
          import app from './hono.js'
          const res = await app.request(location.href)
          document.getElementById('browser-result').innerText = await res.text()
        </script>
      </head>
      <body>
        <h1>Web-standards Magic!</h1>
        <div id="server-result">${runtime}: ${c.req.path}</div>
        <div id="browser-result"></div>
      </body>
    </html>`
  )
})

// For Browser
app.get('*', (c) => {
  return c.text(`${runtime}: ${c.req.path}`)
})

export default app
