import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, ParseFilePipe, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFiler.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get('product/:filename')
  findProductImage(@Res() res: Response, @Param('filename') filename: string){

    //Obtener ruta del archivo
    const path = this.filesService.getStaticProductImage(filename);

    res.sendFile( path ); //Devolver la imagen como respuesta
  }

  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    //limits: {fileSize: 1000} limites de subida
    storage: diskStorage({
      destination: './static/uploads', //Indicar en que ruta del filesystem se guarda
      filename:  fileNamer //Utilizar función para devolver un nombre
    })
  })) //Interceptar la llave file en la petición.
  uploadProductImage(@UploadedFile() file: Express.Multer.File){ //Asignar tipado del archivo que esperamos recibir

    //El file en este apartado ya contiene información sobre el archivo con los datos del archivo subido
    if(!file) throw new BadRequestException('Make sure to upload a image');

    //Generar url usando la variable de entorno y además añadiendo el nombre del archivo que ya se ha subido al servidor.
    const secureURL = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return secureURL;
  }
}
