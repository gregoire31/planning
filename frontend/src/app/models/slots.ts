export interface SlotBooking {
  employe_id:string,
  slotsBooked: number[],
  slotsUnbooked: number[],
  actualSlotFocus : number,
  numberOfSlot:number,
  slotToBook: number[],
  firstIndexSlotsBooked : number
}

