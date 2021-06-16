import React, {useState} from 'react';
import styled from 'styled-components';
import {Helmet} from 'react-helmet';
import {Header, Titulo, ContenedorHeader} from './../elementos/Header';
import Boton from './../elementos/Boton';
import {Formulario, Input, ContenedorBoton} from './../elementos/ElementosDeFormulario';
import {ReactComponent as SvgLogin} from './../imagenes/login.svg';
import {useHistory} from 'react-router-dom';
import {auth} from './../firebase/firebaseConfig';
import Alerta from './../elementos/Alerta';

const Svg = styled(SvgLogin)`
    width: 100%;
    max-height: 8rem; /* 200 px */
    margin-bottom: 1.5rem; /* 20 px */
`

const InicioSesion = () => {
    //constante del historial
    const history = useHistory();
    //estos 3 estados son para inicializar el usestate
    const [correo, establecerCorreo] = useState('');
    const [password, establecerPassword] = useState('');
    //el estado para la alerta
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    //este estado guarda los valores de que es lo que aparecerá en el mensaje
    const [alerta, cambiarAlerta] = useState({});

    const handleChange = (e) => {
        if(e.target.name === 'email'){
            establecerCorreo(e.target.value);
        }else if(e.target.name === 'password'){
            establecerPassword(e.target.value);
        }
    }

    //esta constante o funcion es la que va a ejecutarse cuando le demos click al boton de submit en el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        //comprobacion del lado del cliente que el correo sea valido
        const expresionRegular = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
        if(!expresionRegular.test(correo)){
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Por favor ingresa un correo electronico valido'
            })
            return;
        }

        if(correo === '' || password === ''){
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Por favor completa todos los campos para continuar'
            })
            return;
        }

        try {
            await auth.signInWithEmailAndPassword(correo, password)
            history.push('/');
        } catch (e){
            cambiarEstadoAlerta(true);

            let mensaje;
            switch(e.code){
                case 'auth/wrong-password':
                    mensaje = 'la contraseña es incorrecta'
                    break;
                case 'auth/user-not-found':
                    mensaje = 'Usuario no encontrado'
                    break;
                default:
                    mensaje = 'Hubo un error al intentar crear la cuenta.'
                    break;
            }
            cambiarAlerta({tipo: 'error', mensaje: mensaje})

        }
    }

    return (
        <>
            <Helmet>
                <title>Iniciar sesión</title>
            </Helmet>

            <Header>
                <ContenedorHeader>
                    <Titulo>Iniciar sesión</Titulo>
                    <div>
                        <Boton to="crear-cuenta">Registrarse</Boton>
                    </div>
                </ContenedorHeader>
            </Header>
            <Formulario onSubmit={handleSubmit}>
                <Svg/>
                <Input 
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={correo}
                    onChange={handleChange}
                />
                <Input 
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={handleChange}
                />
                <ContenedorBoton>
                    <Boton as="button" primario type="submit">Iniciar sesión</Boton>
                </ContenedorBoton>
            </Formulario>

            <Alerta 
                tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </>
    );
}
 
export default InicioSesion