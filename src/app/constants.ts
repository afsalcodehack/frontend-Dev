export module theme {
  export const availableThemes = [
    'picllary-theme',
  ];
}
export module event {
  export const minPrice = 1.5;
}
export module title {
  export const separator = '-';
}
export module auth {
  export const roles = [
    'photographer',
    'customer',
  ];
  export const roleNames = {
    photographer: 'Photographer',
    customer: 'Customer',
  };
}
export module locale {
  export const dateFormat = 'MM/DD/YYYY';
  export const timePickerFormat = 'hh:mm A';
  export const ISO8601Format = 'YYYY-MM-DD';
  export const flatpickrDateFormat = 'm/d/Y';
}
