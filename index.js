const express = require('express')
const uuid = require('uuid')
const port = 3003
const app = express()
app.use(express.json())

const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ ERROR: "Order Not Found" })
    }

    request.orderIndex = index
    request.orderId = id
    next()
}

const displayMethodUrl = (request, response, next) => {
    const method = request.method
    const url = request.path
    console.log("Method:", "[", method, "]", "-", "URL:", url)
    next()
}

app.post('/orders', (request, response) => {
    const { order, clientName, price, } = request.body
    const pedido = { id: uuid.v4(), order, clientName, price, status: "EM PREPARAÇÃO" }
    orders.push(pedido)
    return response.status(201).json(pedido)
})

app.get('/orders', (request, response) => {
    return response.json(orders)
})

app.put('/orders/:id', checkOrderId, displayMethodUrl, (request, response) => {
    const { order, clientName, price, } = request.body
    const index = request.orderIndex
    const id = request.orderId
    const updatedOrder = { id, order, clientName, price, status: "EM PREPARAÇÃO" }
    orders[index] = updatedOrder
    return response.json(updatedOrder)
})

app.delete('/orders/:id', checkOrderId, displayMethodUrl, (request, response) => {
    const index = request.orderIndex
    orders.splice(index, 1)
    return response.status(204).json()
})

app.get('/orders/:id', checkOrderId, displayMethodUrl, (request, response) => {
    const index = request.orderIndex
    const id = request.orderId
    const consultOrder = orders.find(order => order.id === id)
    return response.json(consultOrder)
    console.log(method, url)
})

app.patch('/orders/:id', checkOrderId, displayMethodUrl, (request, response) => {
    const index = request.orderIndex
    const { id, order, clientName, price } = orders[index]
    const changeOrderStatus = { id, order, clientName, price, status: "PRONTO" }
    orders[index] = changeOrderStatus
    return response.json(changeOrderStatus)

})

app.listen(port, () => {
    console.log(` 🚀 O Servidor está rodando na Porta ${port} 🚀 `)
})

