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

  //message-from-client
  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto){
    console.log(client.id, payload);
  }
}
