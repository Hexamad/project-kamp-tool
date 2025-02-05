export interface Material {
  id: string;
  name: string;
  costPerUnit: number; // Cost per 12" x 12" x 1mm in INR
  description: string;
}

export interface Layer {
  id: string;
  materialId: string;
  thickness: number; // in mm
}

export interface MattressConfig {
  length: number; // in inches
  width: number; // in inches
  totalHeight: number; // in mm
  layers: Layer[];
  timestamp: number;
}

export const MATERIALS: Material[] = [
  

  {
    id: 'ROTTO',
    name: 'ROTTO FABRIC WITH QUILTING',
    costPerUnit: 20.95,
    description: 'Responsive and durable natural latex'
  },


  {
    id: 'satin',
    name: 'SATIN FABRIC WITH QUILTING',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },




  {
    id: 'cotkook',
    name: 'COTLOOK FABRIC WITH QUILTING',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },





  {
    id: 'stretchable',
    name: 'STRETCHABLE FABRIC WITH QUILTING',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },



  {
    id: 'COTTONFABRIC',
    name: 'COTTON FABRIC WITH QUILTING',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },





  {
    id: 'KNITTEDFABRIC',
    name: 'KNITTED FABRIC WITH QUILTING',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },



  {
    id: 'REXIN',
    name: 'REXIN',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },



  {
    id: 'FABRIC',
    name: 'FABRIC',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },



  {
    id: 'LowDensity ',
    name: 'LOW DENSITY PU FOAM',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },



  {
    id: 'HDPU',
    name: 'HD PU Foam',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },



  {
    id: 'SUPERSOFT',
    name: 'SUPER SOFT FOAM',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },

  {
    id: 'MEMORYFOAM',
    name: 'MEMORY FOAM SHEETS',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },

  {
    id: 'GELMEMORY',
    name: 'GEL MEMORY FOAM SHEETS',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },



  {
    id: 'latexSHEET',
    name: 'LATEX SHEET',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },



  {
    id: 'latex7',
    name: 'LATEX 7 ZONE SHEETS',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },



  {
    id: 'COIRSHEET',
    name: 'COIR SHEET',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },



  {
    id: 'REBONDEDSHEETS',
    name: 'REBONDED SHEETS',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },



  {
    id: 'HRFoam',
    name: 'HR Foam',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },


  {
    id: 'FIRERTARDANT',
    name: 'FIRE RETARDANT',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },

  {
    id: 'EPE',
    name: 'EPE',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },

  {
    id: 'FELT',
    name: 'FELT',
    costPerUnit: 20.55,
    description: 'Responsive and durable natural latex'
  },


  {
    id: 'BONNEL',
    name: 'BONNEL',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },




  {
    id: 'POCKET',
    name: 'POCKET',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },



  


  








  
  
  




];