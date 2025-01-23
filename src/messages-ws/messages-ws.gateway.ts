import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket } from 'socket.io';
import { Server } from 'http';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@WebSocketGateway({cors: true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() wss: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) 
  {}

  async handleConnection(client: Socket, ...args: any[]) {

    const token = client.handshake.headers.token as string;
    let payload: JwtPayload;
    
    //Obtener el payload del token y si no es válida negar la conexión
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    //Emitir a todos los usuarios un mensje
    //Sintaxis: Evento, Payload a enviar (Normalmente es un json)
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients()); //Envíar los id de los clientes conectados
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);

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

    console.log(payload);

    //Emitir un mensaje a todos los clientes conectados
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullNameBySocket(client.id),
      message: payload.message || 'No message'
    })
  }
}
