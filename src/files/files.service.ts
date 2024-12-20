import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  getStaticProductImage(filename: string){
    //Verificar que exista la imagen en los archivos
    const path = join(__dirname, '../../static/uploads', filename); //Une todos los strings y los convierte en una sola ruta (Esto no concatena los strings, genera una ruta basada en los url como parámetros)

    if ( !existsSync(path) ) throw new BadRequestException(`The file with name ${filename}`)

    return path;
  }
}
