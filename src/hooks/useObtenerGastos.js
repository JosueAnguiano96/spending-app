import { useState, useEffect } from 'react';
import {db} from './../firebase/firebaseConfig';
import {useAuth} from './../contextos/AuthContext';

const useObtenerGastos = () => {
    const {usuario} = useAuth();
    const [gastos, cambiarGastos] = useState([]);
    const [ultimoGasto, cambiarUltimoGasto] = useState(null);
    const [hayMasPorCargar, cambiarHayMasPorCargar] = useState(false);

    //funcion par llamar mas gastos
    const obtenerMasGastos = () => {
        db.collection('gastos')
        .where('uidUsuario', '==', usuario.uid)
        .orderBy('fecha', 'desc')
        .limit(10)
        .startAfter(ultimoGasto)
        .onSnapshot( (snapshot) => {
            if(snapshot.docs.length > 0){
                cambiarUltimoGasto(snapshot.docs[snapshot.docs.length -1]);

                cambiarGastos(gastos.concat(snapshot.docs.map( (gasto) => {
                    return {...gasto.data(), id: gasto.id}
                })))
            }else {
                cambiarHayMasPorCargar(false);
            }
        })
    }

    //esto es para que se ejecute sola 1 vez no cada vez que se cargue la pagina
    useEffect( () => {
        const unsuscribe = db.collection('gastos')
        .where('uidUsuario', '==', usuario.uid)
        .orderBy('fecha', 'desc')
        .limit(10)
        .onSnapshot( (snapshot) => {
            if(snapshot.docs.length > 0){
                cambiarUltimoGasto(snapshot.docs[snapshot.docs.length -1]);
                cambiarHayMasPorCargar(true);
            } else {
                cambiarHayMasPorCargar(false);
            }

            cambiarGastos(snapshot.docs.map( (gasto) => {
                return {...gasto.data(), id: gasto.id}
            }))
        });

        //return para salir de la base de datos cuando desmontamos el componente
        return unsuscribe;
    }, [usuario]);

    return [gastos, obtenerMasGastos, hayMasPorCargar];
}
 
export default useObtenerGastos;