/**
 * Contains all data from all items, recipes, schematics, generators, resources, miners and buildings in the game.
 */
interface Dictionary {
  recipes: {
    [key: string]: Recipe
  };
  items: {
    [key: string]: Item
  };
  schematics: {
    [key: string]: Schematic
  },
  generators: {
    [key: string]: Generator
  },
  resources: {
    [key: string]: Resource
  },
  miners: {
    [key: string]: Miner
  },
  buildings: {
    [key: string]: Building
  }
}

/**
 * Contains all the building's sizes
 *
 * @example
 * ```json
 * {
 *    "Name": "Build_AssemblerMk1_C",
 *    "Dimensions": [
 *      500,
 *      750,
 *      400
 *    ]
 *  },
 * ```
 */
type BuildingSizes = BuildingSize[];

interface BuildingSize {
  Name: string;
  /**
   *
   */
  Dimensions: number[]
}

interface Recipe {
  slug: string,
  name: string,
  className: string,
  alternate: boolean,
  time: number,
  manualTimeMultiplier: number,
  ingredients: Product[],
  forBuilding: boolean,
  inMachine: boolean,
  inHand: boolean,
  inWorkshop: boolean,
  products: Product[],
  producedIn: string[],
  isVariablePower: boolean,
}

interface Product {
  item: string,
  amount: number
}

type Rgba = { r: number, g: number, b: number, a: number }

interface Item {
  slug: string,
  className: string,
  name: string,
  sinkPoints: number,
  description: string,
  stackSize: number,
  energyValue: number,
  radioactivityDecay: number,
  liquid: boolean,
  fluidColor: Rgba
}

interface Schematic {
  className: string,
  name: string,
  tier: number,
  cost: Product[],
  unlock: Unlock,
  requiredSchematics: string[],
  type: string,
  time: number,
  alternate: boolean,
  mam: boolean,
}

interface Unlock {
  inventorySlots: number,
  recipes: string[],
  scannerResources: string[],
  giveItems: Product[],
}

/**
 * The electrical generators
 */
interface Generator {
  className: string,
  fuel: string[],
  fuels: Fuel[],
  powerProduction: number,
  powerProductionExponent: number,
  waterToPowerRatio: number
}

interface Fuel {
  item: string,
  supplementalItem: string | null,
  byproduct: string | null,
  byproductAmount: number | null
}

interface Resource {
  item: string,
  pingColor: Rgba,
  speed: number
}

interface Miner {
  className: string,
  allowedResources: string[],
  itemsPerCycle: number,
  extractCycleTime: number,
  allowLiquids: boolean,
  allowSolids: boolean,
}

interface Building {
  slug: string,
  name: string,
  description: string,
  categories: string[],
  buildMenuPriority: number,
  className: string,
  metadata: BuildingMetadata | {},
  size: Size
}

interface BuildingMetadata {
  powerConsumption: number | undefined,
  powerConsumptionExponent: number | undefined,
  manufacturingSpeed: number | undefined,
  beltSpeed: number | undefined,
  firstPieceCostMultiplier: number | undefined,
  lengthPerCost: number | undefined,
  maxLength: number | undefined,
}

interface Size {
  width: number,
  length: number,
  height: number
}