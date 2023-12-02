import express from 'express';
import * as jugadorService from './jugadorService.js';
const router = express.Router();

//función que va a servir para ver si los valores que pones en los subelementos son válidos y si no son válidos se te comunicará
function confirmarValoresSub(escudos,clubes,temporadas){
    let numTemporadas=parseInt(temporadas); //esto transforma el  string temporadas(por estar en un mapa) en un número entero y si la cadena no se ha podido convertir en un número o se convirtiese en un decimal te devuelve Nan
    if(escudos=="" || clubes=="" || temporadas==""){  //si la cadena esta vacía
        return 1;
    }
    if(isNaN(numTemporadas) || !Number.isInteger(numTemporadas)){  //comprobamos si numTemporadas no se ha podido convertir en entero o si no es un entero
        return 2;
    }
    //Ahora comprobaremos lo de la imagen
    return 0; //caso de no haber habido ningún error

}
function confirmarValoresElem(foto, nombreApellidos, posiscion, dorsal, fechaNacimiento, nacionalidad, valorMercado, descripcion){
    const parts = fechaNacimiento.split('/'); // para obtener los 3 campos de una fecha
    // obtengo las partes
    const month = parseInt(parts[0]);
    const day = parseInt(parts[1]);
    const year = parseInt(parts[2]);

    const nacimiento = new Date(year, month -1, day); 

    let valorDorsal = parseInt(dorsal);
    let valorJugador = parseInt(valorMercado);

    if ( nombreApellidos == "" || posicion == "" || nacionalidad == "" || descripcion == ""){
        return 1;
    }
    else if (isNaN(valorDorsal)|| !Number.isInteger(valorDorsal) || valorDorsal < 0){
        return 2;
    }
    else if (isNaN(valorJugador) || !Number.isInteger(valorJugador) || valorJugador <0){
        return 3;
    }
    else if ( isNaN(nacimiento.getTime()) || nacimiento.getFullYear() !== year || month < 1 || month > 12 || day < 1 || day > 31){
        return 4;
    }
    //aqui comprobamos lo de la imagen, si fuese url(tenemos que hacerlas urls)

    return 0; //si no ha habido errores 
}
//método para mostrar la pagina principal
router.get('/', (req, res) => { 
    res.render('plantilla', { 
        jugadores: jugadorService.getJugadores()
    });
});

router.get('/ficha.html', (req,res) => {
    let id = parseInt(req.query.id)
    res.render('ficha',{
        jugador: jugadorService.getJugador(id),
        id:id
    });
});

router.post("nuevoSubElemento",(req,res) => {
    let nota="";
    let id = parseInt(req.body.id)
    //Añadimos nuevo subelemento(escudo,club y temporada)
    let warning = confirmarValoresSub(req.body.escudos,req.body.clubes,req.body,temporadas);
    if(warning==0){ //si no ha habido ningún error, se crea el nuevo subelemento
        nota="Subelemento añadido"
        id = parseInt(req.body.id)
        //Guardamos las características del nuevo subelemento
        let nuevoSubElem = { 
            escudos : req.body.escudos,
            clubes : req.body.clubes, 
            temporadas : req.body.temporadas
        }
        let jugador = jugadorService.getJugador(id);
        console.log(jugador);
        jugador.subElems[jugador.subElems.length] = nuevoSubElem;
    }
    else if (warning == 1){
        nota = "Complete los campos del formulario";
    }
    else if (warning == 2){
        nota = "El número de temporadas debe ser un número entero"
    }
    /*else if(warning == 3){
        nota = "La imagen debe ser válida"
    }*/
    res.render('mensajes', { //esto con render pasa las notas y el id a mensajes html
        id: id,
        nota: nota
    });

});
//para añadir nuevos jugadores
router.post('/jugador/new', (req, res) => {
 
    let jugador = {
        nombreApellidos: req.body.name, //es name, description,position ... por como esta en el formulario (en el id o name)
        descripcion: req.body.description,
        posición: req.body.position,
        dorsal: req.body.jerseyNumber,
        fechaNacimiento: req.body.birthday,
        nacionalidad: req.body.nationality,
        fotoPerfil: req.body.playerphoto,
        valorMercado: req.body.price
    };
    jugadorService.añadirJugador(jugador);
    res.render('saved_player');
});
router.get('/jugador/:id/borrar', (req, res) => {

    jugadorService.borrarJugador(req.params.id);

    res.render('deleted_player');
});