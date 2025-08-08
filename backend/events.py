from flask_socketio import SocketIO

# As funções abaixo recebem o socketio como argumento para evitar import circular


def emitir_pedido_novo(socketio: SocketIO, pedido):
    socketio.emit("pedido_novo", pedido)


def emitir_pedido_atualizado(socketio: SocketIO, pedido):
    socketio.emit("pedido_atualizado", pedido)


def emitir_pagamento_recebido(socketio: SocketIO, pagamento):
    socketio.emit("pagamento_recebido", pagamento)


def emitir_mesa_status(socketio: SocketIO, mesa):
    socketio.emit("mesa_status", mesa)
