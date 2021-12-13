interface daySlot  {
  hourSlot: number,
  isBooked: boolean,
  idUser? : string,
  idMassage?: string
}

export interface Reservation {
  iduser : string,
  idMassage : string,
  day : string,
  daySlot: Array<daySlot>,
  _id: string
}

export interface dateBooking {
  day : string,
  slot : number
}
export interface ReservationData {
  document : Reservation
  dateSchema: string,
  date?:string,
  slot?:number
}
