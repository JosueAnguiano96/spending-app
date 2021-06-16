import React, {useState, useEffect} from 'react';
import {ContenedorFiltros, Formulario, Input, InputGrande, ContenedorBoton} from './../elementos/ElementosDeFormulario'
import Boton from './../elementos/Boton'
import {ReactComponent as IconoPlus} from './../imagenes/plus.svg'
import SelectCategorias from './SelectCategorias';
import DatePicker from './DatePicker';
import getUnixTime from 'date-fns/getUnixTime';
import fromUnixTime from 'date-fns/fromUnixTime';
import agregarGasto from './../firebase/agregarGasto';
import {useAuth} from './../contextos/AuthContext';
import Alerta from './../elementos/Alerta';
import {useHistory} from 'react-router-dom';
import editarGasto from './../firebase/editarGasto';

const FormularioGasto = ({gasto}) => {
    const [inputDescripcion, cambiarInputDescripcion] = useState('');
    const [inputCantidad, cambiarInputCantidad] = useState('');
    const [categoria, cambiarCategoria] = useState('hogar');
    const [fecha, cambiarFecha] = useState(new Date());
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});

    const {usuario} = useAuth();
    const history = useHistory();

    useEffect(() => {
        //comprobamos si ya hay algun gasto
        //de ser asi establecemos todo el estate con los vlores del gasto
        if(gasto){
            //comprobamos que el gasto sea del usuario actual
            //para esto comprobamos el uid guardado en el gasto y el uid del usuario
            if(gasto.data().uidUsuario === usuario.uid){
                cambiarCategoria(gasto.data().categoria);
                cambiarFecha(fromUnixTime(gasto.data().fecha));
                cambiarInputDescripcion(gasto.data().descripcion);
                cambiarInputCantidad(gasto.data().cantidad);
            }else {
                history.push('/lista-gastos')
            }

        }
    }, [gasto, usuario, history]);

    const handleChange = (e) => {
        if(e.target.name === 'descripcion'){
            cambiarInputDescripcion(e.target.value);
        } else if(e.target.name === 'cantidad'){
            cambiarInputCantidad(e.target.value.replace(/[^0-9.]/g,''));
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        //para añadirle los .00 a los numeros
        let cantidad = parseFloat(inputCantidad).toFixed(2);

        //comprobamos que haya una descripcion y valor
        if(inputDescripcion !== '' && inputCantidad !== ''){
            if(cantidad){
                if(gasto){
                    editarGasto({
                        id: gasto.id,
                        categoria: categoria,
                        descripcion: inputDescripcion,
                        cantidad: cantidad,
                        fecha: getUnixTime(fecha) 
                    }).then(() => {
                        history.push('/lista-gastos')
                    }).catch((e) => {
                        console.log(e);
                    })
                } else {
                    agregarGasto({
                        categoria: categoria,
                        descripcion: inputDescripcion,
                        cantidad: cantidad,
                        fecha: getUnixTime(fecha),
                        uidUsuario: usuario.uid
                    })
                    .then( () => {
                        cambiarCategoria('hogar')
                        cambiarInputDescripcion('')
                        cambiarInputCantidad('')
                        cambiarFecha(new Date())
    
                        cambiarEstadoAlerta(true)
                        cambiarAlerta({tipo:'exito', mensaje: 'El gasto fue agregado correctamente.'})
                    }).catch( (e) => {
                        cambiarEstadoAlerta(true)
                        cambiarAlerta({tipo: 'error', mensaje: 'Hubo un problema al intentar tu gasto' + e})
                    })
                }
                
            }else {
                cambiarEstadoAlerta(true);
                cambiarAlerta({tipo: 'error', mensaje: 'El valor que ingresaste es incorrecto.'})
            }

        }else {
            cambiarEstadoAlerta(true);
            cambiarAlerta({tipo: 'error', mensaje: 'Por favor rellena todos los campos.'})
        }

    }

    return (
        <Formulario onSubmit={handleSubmit}>
            <ContenedorFiltros>
                <SelectCategorias 
                    categoria={categoria}
                    cambiarCategoria={cambiarCategoria}
                />
                <DatePicker fecha={fecha} cambiarFecha={cambiarFecha}/>
            </ContenedorFiltros>

            <div>
                <Input 
                    type="text"
                    name="descripcion"
                    id="descripcion"
                    placeholder="Descripción"
                    value={inputDescripcion}
                    onChange={handleChange}
                />
                <InputGrande 
                    type="text"
                    name="cantidad"
                    id="cantidad"
                    placeholder="$0.00"
                    value={inputCantidad}
                    onChange={handleChange}
                />
            </div>
            <ContenedorBoton>
                <Boton as="button" primario conIcono>
                    {gasto ? 'Editar Gasto' : 'Agregar Gasto'} <IconoPlus />
                </Boton>
            </ContenedorBoton>

            <Alerta 
                tipo={alerta.tipo} 
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta} 
            />

        </Formulario>
    );
}
 
export default FormularioGasto;
