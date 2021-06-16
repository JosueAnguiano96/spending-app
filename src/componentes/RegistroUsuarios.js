import React, {useState} from 'react';
import styled from 'styled-components';
import {Helmet} from 'react-helmet';
import {Header, Titulo, ContenedorHeader} from './../elementos/Header';
import Boton from './../elementos/Boton';
import {Formulario, Input, ContenedorBoton} from './../elementos/ElementosDeFormulario';
import {ReactComponent as SvgLogin} from './../imagenes/registro.svg';
import {auth} from './../firebase/firebaseConfig';
import {useHistory} from 'react-router-dom';
import Alerta from './../elementos/Alerta';

const Svg = styled(SvgLogin)`
    width: 100%;
    max-height: 6.25rem; /* 100 px */
    margin-bottom: 1.5rem; /* 20 px */
`


const RegistroUsuarios = () => {
    //constante del historial
    const history = useHistory();
    //estos 3 estados son para inicializar el usestate
    const [correo, establecerCorreo] = useState('');
    const [password, establecerPassword] = useState('');
    const [password2, establecerPassword2] = useState('');
    //el estado para la alerta
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    //este estado guarda los valores de que es lo que aparecerá en el mensaje
    const [alerta, cambiarAlerta] = useState({});

    //funcion que va a detectar el cambio en los inputs y dejará que pueda escribir en ellos
    const handleChange = (e) => {
        switch(e.target.name){
            case 'email':
                establecerCorreo(e.target.value);
                break;
            
            case 'password':
                establecerPassword(e.target.value);
                break;

            case 'password2':
                establecerPassword2(e.target.value);
                break;
            
            default:
                break;
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

        if(correo === '' || password === '' || password2 === ''){
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Por favor completa todos los campos para continuar'
            })
            return;
        }

        if(password !== password2){
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Error: las contraseñas no coinciden'
            })
            return;
        }

        try {
            await auth.createUserWithEmailAndPassword(correo, password)
            history.push('/');
        } catch (e){
            cambiarEstadoAlerta(true);

            let mensaje;
            switch(e.code){
                case 'auth/invalid-password':
                    mensaje = 'La contraseña tiene que ser de al menos 6 caracteres.'
                    break;
                case 'auth/email-already-in-use':
                    mensaje = 'Ya existe una cuenta con el correo electrónico proporcionado.'
                break;
                case 'auth/invalid-email':
                    mensaje = 'El correo electrónico no es válido.'
                break;
                case 'auth/weak-password':
                    mensaje = 'La contraseña debe tener al menos 6 caracteres.'
                break;
                default:
                    mensaje = 'Hubo un error al intentar crear la cuenta.'
                    console.log('error')
                break;
            }
            cambiarAlerta({tipo: 'error', mensaje: mensaje})

        }
    }

    return (
        <>
            <Helmet>
                <title>Crear cuenta</title>
            </Helmet>

            <Header>
                <ContenedorHeader>
                    <Titulo>Crear cuenta</Titulo>
                    <div>
                        <Boton to="iniciar-sesion">Iniciar sesión</Boton>
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
                <Input 
                    type="password"
                    name="password2"
                    placeholder="Confirmar contraseña"
                    value={password2}
                    onChange={handleChange}
                />
                <ContenedorBoton>
                    <Boton as="button" primario type="submit">Crear cuenta</Boton>
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
 
export default RegistroUsuarios