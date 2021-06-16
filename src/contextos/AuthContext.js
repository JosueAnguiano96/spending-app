import React, { useContext, useEffect, useState } from 'react';
import {auth} from './../firebase/firebaseConfig';

//se crea el cotexto
const AuthContext = React.createContext();

//hook para acceder al contexto
const useAuth = () => {
    return useContext(AuthContext);
}

const AuthProvider = ({children}) => {
    const [usuario, cambiarUsuario] = useState();

    //creamos un estado para saber cuando termina de cargar la comprobacion de onAuthStateChanged
    const [cargando, cambiarCargando] = useState(true);

    //effect para ejecutar la comprobación una sola vez
    useEffect( () => {
        //comprobamos si hay un usuario
        const cancelarSuscripcion = auth.onAuthStateChanged( (usuario) => {
            cambiarUsuario(usuario);
            cambiarCargando(false);
        });

        return cancelarSuscripcion;

    }, []);

    return ( 
        <AuthContext.Provider value={{usuario:usuario}}>
            {/* solamente cargamos los elementos hijo cuando no este cargando el usuario,
            de esta forma nos aseguramos de no cargar el resto de la aplicacion hasta que el usuario haya sido establecida.
            
            Si no hacemosesto, al refrescar la pagina el componente children va a intentar cargar inmediatamente, entonces 
            va a intentar cargar antes de que se compruebe que exista el usuario*/}
            {!cargando && children}
        </AuthContext.Provider>
     );
}
 
export {AuthProvider, AuthContext, useAuth};