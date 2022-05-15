import { Massage } from './massage.model';

export interface EmployeAbsence {
  id: string,
  data : Array<Date>
}

export interface Employe {
  _id:string;
  nom: string;
  photo: any;
  profession: string;
  listeDesPrestations : Array<Prestation>;
  pauseEntrePrestation: number;
  jourTravaille: Array<string>;
  hasBeenUpdate?:boolean;
  absences : Array<Date>,
  image?: any
}

export interface Prestation extends  Massage {
  acquis:boolean
}

export interface data  {
  prestations:Array<Prestation>,
  jourArret: Array<string>;
  typeOfDataUpdated : string
}

enum JourTravaille {
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche'
}
