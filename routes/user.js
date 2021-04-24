const { Router } = require('express')

const router = Router()

router.get('/api', (req, res) => {
    res.json({
        "msg": "get API"
    })
})


router.put('/api', (req, res) => {
    res.status(400).json({
        "msg": "put API"
    })
})


router.post('/api', (req, res) => {
    res.status(201).json({
        "msg": "post API"
    })
})


router.delete('/api', (req, res) => {
    res.json({
        "msg": "delete API"
    })
})


router.patch('/api', (req, res) => {
    res.json({
        "msg": "patch API"
    })
})



module.exports = router