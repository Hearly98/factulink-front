import { PurchaseDetailForm } from '../core/types';

describe('PurchaseDetailTableComponent - Lógica de Cálculo', () => {
  const IGV = 0.18;

  function calcularLinea(costoUnitario: number, cantidad: number, descuento: number) {
    // Precio unitario CON IGV
    const precioUnitario = costoUnitario * (1 + IGV);
    
    // Precio compra = (precio con IGV * cantidad) - descuento
    const precioCompra = (precioUnitario * cantidad) - descuento;
    
    // Separar base e IGV del precio compra
    const baseLinea = precioCompra / (1 + IGV);
    const igvLinea = precioCompra - baseLinea;

    return {
      precioUnitario: Math.round(precioUnitario * 100) / 100,
      precioCompra: Math.round(precioCompra * 100) / 100,
      baseLinea: Math.round(baseLinea * 100) / 100,
      igvLinea: Math.round(igvLinea * 100) / 100
    };
  }

  it('debe calcular correctamente con costo 20, cantidad 1, sin descuento', () => {
    const resultado = calcularLinea(20, 1, 0);

    console.log('Test 1: Costo 20, Cantidad 1, Descuento 0');
    console.log('Precio Unitario:', resultado.precioUnitario);
    console.log('Precio Compra:', resultado.precioCompra);
    console.log('Base:', resultado.baseLinea);
    console.log('IGV:', resultado.igvLinea);

    // Costo 20 sin IGV
    // Precio unitario con IGV: 20 * 1.18 = 23.6
    expect(resultado.precioUnitario).toBe(23.6);
    
    // Precio compra: 23.6 * 1 - 0 = 23.6
    expect(resultado.precioCompra).toBe(23.6);
    
    // Base: 23.6 / 1.18 = 20
    expect(resultado.baseLinea).toBe(20);
    
    // IGV: 23.6 - 20 = 3.6
    expect(resultado.igvLinea).toBe(3.6);
  });

  it('debe calcular correctamente con costo 20, cantidad 2, descuento 5', () => {
    const resultado = calcularLinea(20, 2, 5);

    console.log('Test 2: Costo 20, Cantidad 2, Descuento 5');
    console.log('Precio Unitario:', resultado.precioUnitario);
    console.log('Precio Compra:', resultado.precioCompra);
    console.log('Base:', resultado.baseLinea);
    console.log('IGV:', resultado.igvLinea);

    // Precio unitario con IGV: 20 * 1.18 = 23.6
    expect(resultado.precioUnitario).toBe(23.6);
    
    // Precio compra: (23.6 * 2) - 5 = 47.2 - 5 = 42.2
    expect(resultado.precioCompra).toBe(42.2);
    
    // Base: 42.2 / 1.18 = 35.76
    expect(resultado.baseLinea).toBe(35.76);
    
    // IGV: 42.2 - 35.76 = 6.44
    expect(resultado.igvLinea).toBe(6.44);
  });

  it('debe calcular correctamente con costo 100, cantidad 3, sin descuento', () => {
    const resultado = calcularLinea(100, 3, 0);

    console.log('Test 3: Costo 100, Cantidad 3, Descuento 0');
    console.log('Precio Unitario:', resultado.precioUnitario);
    console.log('Precio Compra:', resultado.precioCompra);
    console.log('Base:', resultado.baseLinea);
    console.log('IGV:', resultado.igvLinea);

    // Precio unitario con IGV: 100 * 1.18 = 118
    expect(resultado.precioUnitario).toBe(118);
    
    // Precio compra: 118 * 3 = 354
    expect(resultado.precioCompra).toBe(354);
    
    // Base: 354 / 1.18 = 300
    expect(resultado.baseLinea).toBe(300);
    
    // IGV: 354 - 300 = 54
    expect(resultado.igvLinea).toBe(54);
  });
});

