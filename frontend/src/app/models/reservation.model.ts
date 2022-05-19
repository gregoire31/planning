interface daySlot  {
  _id:string
  hourSlot: number,
  isBooked: boolean,
  idUser? : string,
  idPrestation?: string,
  litteralHour?:string
}

export interface Reservation {
  iduser : string,
  idPrestation : string,
  day : string,
  daySlot: Array<daySlot>,
  _id: string
}

export interface dateBooking {
  day : string,
  slot : number
}
export interface ReservationSlotData {
  isBooked : boolean,
  idPrestation : string,
  idUser : string,
  idSlot : string,
  idReservation : string,
  dateSchema : string,
  day?: string,
  slot?: string,
  employeId? : string
}
