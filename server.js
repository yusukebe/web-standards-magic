import app from './hono.js'

Deno.serve(app.fetch)
