const formatearCantidad = (cantidad) => {
    return Intl.NumberFormat(
        'en-us', 
        {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }
    ).format(cantidad);
}

export default formatearCantidad;