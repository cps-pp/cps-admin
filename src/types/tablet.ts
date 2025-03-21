export type ITablet = {
  _id: string;
  device_name: string;
  IMEI_number: string;
  created_at: string;
  default_password: string;
  model_name: string;
  serial_number: string;
  status: string;
  review: string;
  updated_at: string;
};

export type ILoans = {
  _id: string;
  tablet: {
    _id: string;
    device_name: string;
    model_name: string;
    status: string;
  };
  name: string;
  detail: string;
  mobile_number: string;
  date_return: string;
  date_due: string;
  verification_doc_img: string;
  created_at: string;
  updated_at: string;
};

export type IPagination = { limit?: number; page?: number; search?: string };
