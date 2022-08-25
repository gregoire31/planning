export interface User {
  adresse: string;
  date: Date;
  email: string;
  nom : string;
  numeroTelephone: string;
  password: string;
  prenom: string;
  _id :string;
  prestationSelected?: string;
  reservationList? : string[]
}

export interface ReservationUser {
  idUser : string;
  idReservation: string
}

export interface ReservationUser {
  idUser : string;
  idReservation: string
}
