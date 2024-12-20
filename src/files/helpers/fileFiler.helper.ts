
export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function)=>{

    //Si no hay nada recibido...
    if ( !file ) return callback(new Error('File is empty'), false)

    //Obtener tipo de archivo
    const fileExtension = file.mimetype.split('/')[1];

    const validExtensions = ['jpg', 'jpeg', 'png', 'gif']

    if(validExtensions.includes(fileExtension)){
        return callback(null, true);
    }
    
    callback(null, false);
}