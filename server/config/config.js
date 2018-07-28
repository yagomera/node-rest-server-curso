// variables globales del sistema

process.env.PORT = process.env.PORT || 3000;


//entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//bbdd

let urlDB;

if (process.env.NODE_ENV === 'dev')
    urlDB = 'mongodb://localhost:27017/cafe';
else

    urlDB = 'mongodb://yagomera:fkm03fkdlq@ds257851.mlab.com:57851/cafe';


process.env.URLDB = urlDB;