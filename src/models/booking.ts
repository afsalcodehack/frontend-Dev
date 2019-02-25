export interface Status {
  board: string;
  releaseStaff?: string;
  releaseTime?: Date;
  returnStaff?: string;
  returnTime?: Date;
  returnRemarks?: string;
}

export interface Item {
  date: string;
  type: string;
  quantity: number;
  timeslot: string;
  status: Status;
}

export interface Order {
  locationName: string;
  locationCity: string;
  contactName: string;
  contactNumber: string;
  emergencyName: string;
  emergencyNumber: string;
  passport: string;
  address: string;
  items: Item[];
}
