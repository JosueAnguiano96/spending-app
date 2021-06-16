import React from 'react';
import {Helmet} from 'react-helmet';
import {Header, Titulo, ContenedorHeader, ContenedorBotones} from './elementos/Header';
import Boton from './elementos/Boton';
import BotonCerrarSesion from './elementos/BotonCerrarSesion';
import FormularioGasto from './componentes/FormularioGasto';
import BarraTotalGastado from './componentes/BarraTotalGastado';

const App = () => {
  return (
    <>
      <Helmet>
        <title>Agregar Gasto</title>
      </Helmet>
      <Header>
        <ContenedorHeader>
          <Titulo>Agregar gasto</Titulo>
          <ContenedorBotones>
            <Boton to="/categoria">Categorías</Boton>
            <Boton to="/lista-gastos">Lista de gastos</Boton>
            <BotonCerrarSesion/>
          </ContenedorBotones>
        </ContenedorHeader>
      </Header>

      <FormularioGasto />
      <BarraTotalGastado />
    </>
  );
}
 
export default App;