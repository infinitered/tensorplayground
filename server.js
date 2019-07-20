const app = require('./express/server')
const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Netlify app listening on port ${port}!`))