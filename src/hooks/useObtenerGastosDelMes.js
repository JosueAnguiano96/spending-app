import { useState, useEffect } from 'react';
import {db} from './../firebase/firebaseConfig';
import {startOfMonth, endOfMonth, getUnixTime} from 'date-fns';
import {useAuth} from './../contextos/AuthContext';

const useObtenerGastosDelMes = () => {
    const [gastos, establecerGastos] = useState([]);
    const {usuario} = useAuth();

    useEffect(() => {
        const inicioMes = getUnixTime(startOfMonth(new Date()));
        const finMes = getUnixTime(endOfMonth(new Date()));

        if(usuario){
            const unsuscribe = db.collection('gastos')
            .orderBy('fecha', 'desc')
            .where('fecha', '>=', inicioMes)
            .where('fecha', '<=', finMes)
            .where('uidUsuario','==', usuario.uid)
            .onSnapshot((snapshot) => {
                establecerGastos(snapshot.docs.map( (documento) => {
                    return {...documento.data(), id: documento.id}
                }))
            })
            //useeffect tiene que retornar una funcion que se va a ejecutar cuando se desmonte el componente.
            //en este caso queremos que ejecute el unsuscribe a la conexion de firestore
            return unsuscribe;
        }

    }, [usuario]);

    return gastos;
}
 
export default useObtenerGastosDelMes;