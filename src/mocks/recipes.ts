import type { Recipe } from '../types/recipe';

export const mockRecipe: Recipe = {
  id: '1',
  title: 'Pollo a la cazuela con arroz',
  description:
    'Una receta reconfortante que transforma ingredientes simples en un plato familiar lleno de sabor.',
  experience: 'Comfort food que abraza el alma',
  ingredients: [
    '2 pechugas de pollo cortadas en cubos',
    '1 taza de arroz',
    '1 cebolla picada',
    '2 dientes de ajo',
    '1 zanahoria en rodajas',
    'Caldo de pollo',
    'Aceite de oliva',
    'Sal y pimienta',
    'Orégano al gusto',
  ],
  steps: [
    'Calentá el aceite en una olla grande a fuego medio. Agregá el pollo y doralo por todos lados, unos 5 minutos.',
    'Retirá el pollo y en la misma olla agregá la cebolla y el ajo. Cociná hasta que estén transparentes.',
    'Incorporá la zanahoria y el arroz. Revolvé para que el arroz se impregne con los jugos.',
    'Volvé a poner el pollo en la olla y agregá el caldo hasta cubrir. Condimentá con sal, pimienta y orégano.',
    'Tapá y cociná a fuego bajo por 20-25 minutos hasta que el arroz esté tierno y el pollo cocido.',
    'Dejá reposar 5 minutos antes de servir. ¡Listo!',
  ],
  prepTime: 10,
  cookTime: 30,
  difficulty: 'easy',
  servings: 4,
  gourmetTips: [
    {
      title: 'Dorado perfecto del pollo',
      description:
        'No muevas el pollo durante los primeros 3 minutos. Deja que se forme una costra dorada antes de voltear. Esto sella los jugos.',
      technique: 'Maillard Reaction',
    },
    {
      title: 'Caldo casero elevado',
      description:
        'Reemplazá el caldo común por un fondo de pollo reducido. Herví huesos de pollo con cebolla asada, apio y puerro por 4 horas.',
      technique: 'Fondo de cocina',
    },
    {
      title: 'Final con mantequilla',
      description:
        'Agregá una cucharada de mantequilla fría al final y revolvé suavemente. Da brillo y una sensación cremosa inesperada.',
      technique: 'Monté au beurre',
    },
    {
      title: 'Hierbas frescas',
      description:
        'Reemplazá el orégano seco por tomillo fresco y un toque de romero. Aromatiza sin competir con el sabor del pollo.',
      technique: 'Herbes de Provence',
    },
  ],
  variations: [
    {
      name: 'Arroz meloso estilo risotto',
      description:
        'El mismo pollo y arroz, pero cocinado lentamente con caldo caliente de a poco. Queda cremoso y envolvente.',
      extraIngredients: ['Vino blanco', 'Queso parmesano', 'Mantequilla'],
      twist: 'Técnica italiana',
    },
    {
      name: 'Pollo al curry con arroz',
      description:
        'Agregás curry en polvo y leche de coco al caldo. Transforma el plato en una experiencia aromática asiática.',
      extraIngredients: ['Curry en polvo', 'Leche de coco', 'Jengibre fresco'],
      twist: 'Fusión asiática',
    },
    {
      name: 'Cazuela de pollo española',
      description:
        'Agregás pimentón dulce, chorizo en rodajas y garbanzos. Un viaje directo a la cocina mediterránea.',
      extraIngredients: ['Pimentón dulce', 'Chorizo', 'Garbanzos'],
      twist: 'Mediterráneo',
    },
  ],
  winePairing:
    'Un Chardonnay sin roble de Casablanca Valley complementa la cremosidad del plato sin competir con las especias.',
  platingTip:
    'Serví en plato hondo, colocá el pollo encima del arroz en ángulo, y terminá con una gota de aceite de oliva aromatizado en el borde.',
};

export const variationMocks: Record<string, Recipe> = {
  'Arroz meloso estilo risotto': {
    ...mockRecipe,
    id: '2',
    title: 'Risotto de pollo y setas',
    description:
      'Cremosidad italiana con el mismo pollo y arroz. Técnica de tostado y incorporación gradual de caldo.',
    experience: 'Un abrazo italiano en cada cuchara',
    prepTime: 5,
    cookTime: 45,
    difficulty: 'medium',
    ingredients: [
      ...mockRecipe.ingredients,
      '1/2 taza de vino blanco seco',
      '50g queso parmesano rallado',
      '30g mantequilla fría',
    ],
    steps: [
      'Calentá el caldo en una olla aparte y mantenelo a fuego lento.',
      'En olla grande, tostá el arroz con aceite por 2 minutos hasta que esté translúcido.',
      'Agregá el vino blanco y revolvé hasta evaporar.',
      'Incorporá el caldo caliente de a cucharones, revolviendo constantemente.',
      'A los 15 minutos agregá el pollo dorado en cubos.',
      'Cuando el arroz esté al dente, retirá del fuego y agregá la mantequilla y el parmesano.',
      'Dejá reposar 2 minutos tapado antes de servir.',
    ],
    gourmetTips: [
      {
        title: 'Tostado del arroz',
        description:
          'El tostado inicial (tostatura) crea una capa que retiene el almidón. No lo saltees.',
        technique: 'Tostatura',
      },
      {
        title: 'Mantecatura',
        description: 'La mantequilla fría al final (mantecatura) da la cremosidad característica.',
        technique: 'Mantecatura',
      },
      {
        title: 'Caldo siempre caliente',
        description:
          'Si agregás caldo frío, el arroz absorbe líquido sin liberar almidón. Mantenelo humeando.',
        technique: 'Temperatura constante',
      },
    ],
    winePairing: 'Un Pinot Grigio de Alto Adige corta la cremosidad con su acidez brillante.',
    platingTip:
      'Serví en plato hondo, espolvoreá parmesano recién rallado y un hilo de aceite de trufa blanca.',
  },
  'Pollo al curry con arroz': {
    ...mockRecipe,
    id: '3',
    title: 'Pollo al curry rojo con leche de coco',
    description:
      'Fusión asiática que transforma los mismos ingredientes en una explosión aromática.',
    experience: 'Un viaje a Bangkok sin salir de casa',
    prepTime: 10,
    cookTime: 35,
    difficulty: 'medium',
    ingredients: [
      ...mockRecipe.ingredients,
      '2 cucharadas de curry rojo en pasta',
      '400ml leche de coco',
      'Jengibre fresco rallado',
      'Hojas de albahaca tailandesa',
    ],
    steps: [
      'Dorá el pollo en aceite y reservá.',
      'En la misma olla, sofreí el curry rojo con un poco de leche de coco por 2 minutos.',
      'Agregá la cebolla, el ajo y el jengibre. Cociná 3 minutos.',
      'Incorporá el pollo, el resto de la leche de coco y el caldo.',
      'Herví a fuego lento por 20 minutos.',
      'Agregá el arroz y cociná 15 minutos más.',
      'Finalizá con albahaca fresca y serví.',
    ],
    gourmetTips: [
      {
        title: 'Curry casero',
        description:
          'El curry en pasta de lata es bueno, pero el curry rojo hecho en mortero con chiles secos, ajo, galanga y limoncillo es otro nivel.',
        technique: 'Curry paste from scratch',
      },
      {
        title: 'Leche de coco de primera',
        description:
          'Usá leche de coco sin estabilizantes (se separa en agua y crema). La crema flota y se puede freír antes.',
        technique: 'Coconut cream separation',
      },
    ],
    winePairing: 'Un Riesling semi-seco de Mosela balancea el picante con su dulzor residual.',
    platingTip:
      'Serví en bowl profundo, coroná con albahaca fresca, un gajo de lima y un chorrito de leche de coco.',
  },
  'Cazuela de pollo española': {
    ...mockRecipe,
    id: '4',
    title: 'Cazuela de pollo a la riojana',
    description:
      'Pimentón, chorizo y garbanzos transforman el mismo pollo en un guiso mediterráneo profundo.',
    experience: 'Una tarde en la Rioja',
    prepTime: 15,
    cookTime: 90,
    difficulty: 'easy',
    ingredients: [
      ...mockRecipe.ingredients,
      '2 cucharadas de pimentón dulce',
      '150g chorizo en rodajas',
      '1 lata de garbanzos escurridos',
      '1 hoja de laurel',
    ],
    steps: [
      'Dorá el pollo y reservá.',
      'En la misma olla, freí el chorizo hasta soltar su grasa.',
      'Agregá la cebolla y el ajo. Cuando estén transparentes, agregá el pimentón (cuidado, se quema fácil).',
      'Incorporá rápido el pollo, la zanahoria, el laurel y el caldo.',
      'Cociná a fuego lento por 45 minutos.',
      'Agregá el arroz y los garbanzos. Cociná 25 minutos más.',
      'Dejá reposar 10 minutos antes de servir.',
    ],
    gourmetTips: [
      {
        title: 'Pimentón con cuidado',
        description:
          'El pimentón se quema en segundos. Agregalo siempre con líquido cerca y revolvé inmediatamente.',
        technique: 'Sofrito con pimentón',
      },
      {
        title: 'Reposo obligatorio',
        description:
          'Los guisos españoles mejoran con el reposo. Si podés, preparalo un día antes.',
        technique: 'Reposo overnight',
      },
      {
        title: 'Chorizo de calidad',
        description: 'Un chorizo ibérico de bellota cambia todo el plato. Su grasa es el secreto.',
        technique: 'Grasa de chorizo',
      },
    ],
    winePairing:
      'Un Tempranillo joven de La Rioja, con su frutado y taninos suaves, es el compañero perfecto.',
    platingTip:
      'Serví en cazuela de barro si tenés, con un chorrito de aceite de oliva virgen extra por encima.',
  },
};
