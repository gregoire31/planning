
export interface EmployeAbsence {
  id: string,
  data : Array<Date>
}

export interface Employe {
  _id:string;
  nom: string;
  photo: string;
  profession: string;
  listeDesPrestations : Array<Prestation>;
  pauseEntrePrestation: number;
  jourTravaille: Array<string>;
  hasBeenUpdate?:boolean;
  absences : Array<Date>
}

export interface Prestation  {
  id:string,
  nom:string,
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
