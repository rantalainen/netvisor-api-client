/*
 * RESOURCE
 * salespaymentlist.nv
 */

export interface SalesPaymentListParameters {
  /** Rajaa haettavien suoritusten id arvon suuremmaksi kuin annettu arvo */
  aboveNetvisorKey?: number;
  /** Päivämäärärajauksen alku (2021-10-23) */
  beginDate?: string;
  /** Päivämäärärajauksen loppu (2021-10-24) */
  endDate?: string;
  /** Hakee suorituksen nimellä */
  searchByName?: string;
  /** Rajaa laskulinkityksen perusteella: 0 - suorituksella ei ole laskua linkitettynä, 1 - suorituksella pitää olla lasku linkitettynä */
  limitLinkedPayments?: 0 | 1;
  /** Rajaa suorituksen tyypin mukaan: 'onlycreditloss' - listaa pelkät luottotappiot, 'excludecreditloss' - listaa kaikki muut, paitsi ei luottotappioita */
  limitByType?: 'onlycreditloss' | 'excludecreditloss';
  /** Hakee myyntisuoritukset, joita on muutettu annetun päivämäärän jälkeen. Muodossa yyyy-MM-ddTHH:mm:ss */
  lastModifiedStart?: string;
  /** Hakee myyntisuoritukset, joita on muutettu ennen annettua päivämäärää. Muodossa yyyy-MM-ddTHH:mm:ss */
  lastModifiedEnd?: string;
  /** Hakee myyntilaskuun liittyvät suoritukset myyntilaskun NetvisorKey:n perusteella */
  invoiceNetvisorKey?: number;
  /** Hakee myyntilaskuun liittyvät suoritukset myyntilaskun laskunumeron perusteella */
  invoiceNumber?: number;
}

export interface SalesPaymentListItem {
  netvisorKey: number;
  name: string;
  date: string;
  sum: number;
  referenceNumber: string;
  foreignCurrencyAmount: number;
  invoiceNumber: number;
  paymentAccountName: string;
  voucherID: number;
  lastModifiedTimestamp: string;
  paymentAccountNumber: string;
  paymentSource: number;
  bankStatus: string;
  bankStatusErrorDescription?: {
    value: string;
    attr: { code?: string };
  };
}
