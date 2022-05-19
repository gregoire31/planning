interface daySlot  {
  _id:string
  hourSlot: number,
  isBooked: boolean,
  idUser? : string,
  idMassage?: string,
  litteralHour?:string
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
export interface ReservationSlotData {
  isBooked : boolean,
  idMassage : string,
  idUser : string,
  idSlot : string,
  idModel : string,
  dateSchema : string,
  day?: string,
  slot?: string,
  employeId? : string
}
