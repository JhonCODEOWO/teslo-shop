import { WebSocketGateway } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({cors: true})
export class MessagesWsGateway {
  constructor(private readonly messagesWsService: MessagesWsService) {}

  
}
