//Interfaz que nos permite saber en todo momento que estructura debe de tener nuestros payloads, por lo que en donde se vaya a utilizar algún payload se debe declarar este como su tipo.

export interface JwtPayload{
    id: string;
    email: string;
    //TODO: Añadir todo lo que se desee almacenar en el payload.
}