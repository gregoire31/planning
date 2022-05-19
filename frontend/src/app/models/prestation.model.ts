export interface Prestation {
  nom: string;
  prix: number;
  personnelRequis: number;
  duree : number;
  _id: string;
  image?: string;
  cols?:number;
  rows?:number;
  acquis?:boolean
}
