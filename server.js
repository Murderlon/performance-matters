const path = require('path')
const express = require('express')
const nunjucks = require('nunjucks')
const compression = require('compression')
const routeStatic = require('./lib/route-static')
const redirectIndices = require('./lib/redirect-indices')

const app = express()
const baseDir = 'build'
const port = process.env.PORT || 3004

app.use(compression())

app.set('etag', false)
app.use((req, res, next) => {
	res.removeHeader('X-Powered-By')
	next()
})

// static routes
app.use(routeStatic)
app.use('/static', express.static(path.join(__dirname, baseDir), {etag: false, lastModified: false}))

// dynamic pages
app.use(redirectIndices)
nunjucks.configure(baseDir, {
	autoescape: true,
	express: app,
	watch: true
})

app.get('*', (req, res) => {
	res.render(path.join('./', req.url, 'index.html'), {})
})

app.listen(port, function (err) {
	return err ? console.error(err) : console.log(`app running on http://localhost:${port}`)
})
