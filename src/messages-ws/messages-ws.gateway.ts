import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket } from 'socket.io';
import { Server } from 'http';
import { NewMessageDto } from './dtos/new-message.dto';

@WebSocketGateway({cors: true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() wss: Server;
  constructor(private readonly messagesWsService: MessagesWsService) 
  {}

  handleConnection(client: Socket, ...args: any[]) {

    const token = client.handshake.headers.token as string;
    console.log(token);

    this.messagesWsService.registerClient(client);

    console.log(`Clients connected: ${this.messagesWsService.getConnectedClients()}`);

    //Emitir a todos los usuarios un mensje
    //Sintaxis: Evento, Payload a enviar (Normalmente es un json)
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients()); //Envíar los id de los clientes conectados
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);

    console.log(`Clients connected: ${this.messagesWsService.getConnectedClients()}`);

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients()); //Envíar los id de los clientes conectados
  }

  //Recibir mensaje del cliente
  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto){
    //Tratar mensaje del cliente

    //Envíar mensaje solamente al cliente.
    // client.emit('message-from-server', {
    //   fullName: 'Soy Yo!',
    //   message: payload.message || 'no message'
    // })

    //Emitir a todos los clientes menos al cliente inicial.
    // client.broadcast.emit('message-from-server', {
    //   fullname: 'Soy yo',
    //   message: payload.message || 'No message'
    // })

    //Emitir un mensaje a todos los clientes conectados
    this.wss.emit('message-from-server', {
      fullName: 'Yo mismo xd',
      message: payload.message || 'No message'
    })
  }
}
