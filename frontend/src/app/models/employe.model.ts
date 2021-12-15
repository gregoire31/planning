export interface Employe {
  _id:string;
  nom: string;
  photo: string;
  profession: string;
  listeDesPrestations : Array<string>;
  pauseEntrePrestation: number;
  jourArret: Array<string>;
  jourTravaille: Array<string>
}
