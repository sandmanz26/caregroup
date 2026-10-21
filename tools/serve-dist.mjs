// Pratinjau lokal dist/ dengan aturan rewrite yang sama seperti vercel.json.
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
const root = path.resolve('dist'), port = Number(process.env.PORT) || 9900
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' }
http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0])
  let file = path.join(root, url)
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    file = path.join(root, url.startsWith('/lofi') ? 'lofi/index.html' : 'index.html')
  }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' })
  fs.createReadStream(file).pipe(res)
}).listen(port, () => console.log(`dist → http://localhost:${port}`))
