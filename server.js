const express = require('express')
const cors = require("cors")
const app = express()
const path = require('path')

app.use(express.json())
app.use(cors())

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: 'eb1b5c1ec58c4c4d9ccd5d42a94b49fe',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

const students = ['Jimmy', 'Timothy', 'Jimothy']

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
    rollbar.log("Accessed HTML successfully");
})

app.get('/api/students', (req, res) => {
    rollbar.info("someone got the students to pull up")
    res.status(200).send(students)
   
})

app.post('/api/students', (req, res) => {
   let {name} = req.body

   const index = students.findIndex(student => {
       return student === name
   })

   try {
       if (index === -1 && name !== '') {
           students.push(name)
           rollbar.log("student added successfully", {author: "Zhaoyi", type: "manual entry"})
           res.status(200).send(students)
       } else if (name === ''){
           rollbar.error("no name provided");
           res.status(400).send('You must enter a name.')
       } else {
           rollbar.error("student already exists");
           res.status(400).send('That student already exists.')
       }
   } catch (err) {
       console.log(err)
   }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    students.splice(targetIndex, 1)
    rollbar.info("student was deleted");
    res.status(200).send(students)
})

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server listening on ${port}`))
