export interface INewVoucher {
  calculationmode: string;
  voucherdate: { '@': { format: string }; '#': string };
  description?: string;
  voucherclass: string;
  voucherline: IVoucherLine[];
}

export interface IVoucherLine {
  linesum: { '@': { type: string }; '#': string };
  description?: string;
  accountnumber: string;
  vatpercent: { '@': { vatcode: string }; '#': number | string };
  dimension?: IDimension[];
}

interface IDimension {
  dimensionname: string;
  dimensionitem: string;
}
