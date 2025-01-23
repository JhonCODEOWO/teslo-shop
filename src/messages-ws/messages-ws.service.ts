import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/users.entity';
import { Repository } from 'typeorm';

interface connectedClients {
    //Define un objeto en donde la clave es string y los valores son de tipo Socket es decir una clase de Socket
    [id: string]: {
        socket: Socket,
        user: User
    }
}

@Injectable()
export class MessagesWsService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}
    //Los clientes se mantienen en memoria porque son datos volatiles, cada id cambia constantemente dependiendo de quien se conecta
    private connectedClients: connectedClients = { }

    //Método a ejecutar cuando un cliente se conecta
    async registerClient(client: Socket, userId: string){
        //Intentar obtener el usurio
        const user = await this.userRepository.findOneBy({id: userId})

        //Validar posibles problemas con el usuario y mandar un error
        if(!user) throw new Error('User not found');
        if(!user.isActive) throw new Error('User not active');

        //Añadir un nuevo elemento en donde id es string y su valor es un objeto con dos claves Socket y User
        this.connectedClients[client.id] = {
            socket: client,
            user: user
        };
    }

    //Método a ejecutar cuando un cliente se desctonecta
    removeClient(clientId: string){
        //Eliminar una clave del objeto que contiene claves de los clientes conectados
        delete this.connectedClients[clientId];
    }

    //Retorna cantidad de claves en el objeto connectedClients
    getConnectedClients(): string[]{
        //Retorna un arreglo de strings con las claves del objeto que recibe como parámetro
        return Object.keys(this.connectedClients);
    }

    //Retorna el nombre ligado a ese socket id del usuario
    getUserFullNameBySocket(socketId: string): string{
        return this.connectedClients[socketId].user.fullname;
    }
}
