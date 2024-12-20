import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, ParseFilePipe, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFiler.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

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

    //El file en este apartado ya contiene información sobre el archivo con los datos a donde se va a mover y de donde viene.
    if(!file) throw new BadRequestException('Make sure to upload a image');

    const secureURL = `${file.filename}`;

    return secureURL;
  }
}
