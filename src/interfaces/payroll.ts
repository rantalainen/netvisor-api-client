/*
 * RESOURCE
 * payrollperiodcollector.nv
 */

export interface PayrollPeriodCollector {
  date: {
    value: string;
    attr: { format: 'ansi' };
  };
  employeeIdentifier: {
    value: string;
    attr: { type: 'number' | 'personalidentificationnumber' };
  };
  payrollRatioLine: {
    amount: number;
    payrollRatio: {
      value: number;
      attr: { type: 'number' };
    };
    dimension?: {
      dimensionName: string;
      dimensionItem:
        | string
        | {
            value: string;
            attr: { fatherId: number };
          };
    }[];
  }[];
}

/*
 * RESOURCE
 * getemployees.nv
 */

export interface GetEmployeesParameters {
  includeEndedEmployments?: 1 | 0;
}

export interface GetEmployeesItem {
  employeeNumber?: number;
  netvisorKey: number;
  personalId: {
    value: string;
    attr: { type: string };
  };
  firstName: string;
  lastName: string;
  realName: string;
  employmentStatus: boolean;
  payrollService: boolean;
  resourceManagement: boolean;
}

/*
 * RESOURCE
 * getemployee.nv
 */

export interface GetEmployeeParameters {
  /** If given, do not give employeeNumber */
  netvisorKey?: number;
  /** If given, do not give netvisorKey */
  employeeNumber?: number;
  employmentPeriods?: 1 | 0;
  employeePayrollInformation?: 1 | 0;
  educationalInformation?: 1 | 0;
  additionalInformationFields?: 1 | 0;
  employeeSettlementPoints?: 1 | 0;
}

export interface GetEmployee {
  employeeBaseInformation: {
    netvisorKey: number;
    employeeNumber?: number;
    employeeIdentifier: {
      value: string;
      attr: { type: string };
    };
    foreignIdentifierType?: string;
    issuingCountry?: {
      value: string;
      attr: { type: 'ISO-3166' };
    };
    firstName: string;
    lastName: string;
    fullName: string;
    payrollService: boolean;
    resourceManagement: boolean;
    nationality: {
      value: string;
      attr: { type: 'ISO-3166' };
    };
    language: {
      value: string;
      attr: { type: 'ISO-3166' };
    };
    municipality?: string;
    gender: string;
    dateOfBirth: string;
    streetAddress: string;
    postNumber: string;
    city: string;
    country: {
      value: string;
      attr: { type: 'ISO-3166' };
    };
    phoneNumber?: string;
    email?: string;
    bankAccountNumber?: string;
    bankIdentificationCode?: string;
    activity: boolean;
  };
  employmentPeriods?: GetEmployeeEmploymentPeriod[];
  employeePayrollInformation?: GetEmployeePayrollInformation;
  employeeEducationalInformation?: {
    degree: GetEmployeeEducationalInformationDegree[];
  };
  employeeAdditionalInformationFields?: {
    additionalInformationField: GetEmployeeAdditionalInformationField[];
  };
  employeeSettlementPoints?: {
    employeeUnemploymentInsurance?: GetEmployeeSettlementPoint[];
    employeeAccidentInsurance?: GetEmployeeSettlementPoint[];
    employeeGroupLifeInsurance?: GetEmployeeSettlementPoint[];
    employeeUnionMembershipFee?: GetEmployeeSettlementPoint[];
    employeeOtherInsurance?: GetEmployeeSettlementPoint[];
    employeeWorkPensionInsurance?: GetEmployeeSettlementPoint[];
    employeeForeclosure?: GetEmployeeSettlementPoint[];
  };
}

export interface GetEmployeeEmploymentPeriod {
  netvisorKey: number;
  companyStartDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  startDate: {
    value: string;
    attr: { format: 'ansi' };
  };
  probationEndDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  employmentMode?: {
    /** 1 = työsuhteinen, 2 = vuokratyöntekijä, 3 = ammatinharjoittaja tai muu vastaava, 4 = harjoittelija, 5 = talkootyö */
    value: number;
    attr: { type: 'netvisor' };
  };
  profession: string;
  comment?: string;
  endDate?: {
    value: string;
    attr: { format: 'ansi' };
  };
  endReason?: {
    /** 2 = Työntekijän vanhuuseläke, 4 = Työntekijän oma pyyntö, 5 = Työntekijästä johtuva syy, 6 = Työsuhteen määräaikaisuus, 11 = Yrityksen tuotannolliset ja taloudelliset syyt, 12 = Työsuhteen päättyminen yhteisestä sopimuksesta, 13 = Muu syy */
    value: number;
    attr: { type: 'netvisor' };
  };
  occupationClassification?: {
    /** TK10 code */
    value: string;
    attr: { type: 'isco' };
  };
  employmentContract?: {
    /** 1 = Toistaiseksi voimassa oleva, 2 = Määräaikainen */
    value: number;
    attr: { type: 'netvisor' };
  };
  employmentForm?: {
    /** 1 = Kokoaikainen, 2 = Osa-aikainen */
    value: number;
    attr: { type: 'netvisor' };
  };
  partTimePercent?: number;
  regularWorkingHours?: number;
  /** 0 = Muu peruste, 1 = Työsuhde tai virkasuhde */
  groundsForEmployment: number;
  kevaProfessionalClassCode?: string;
  kevaEmploymentRegistration?: {
    value: string;
    attr: { type: 'keva'; pensionprovidercode: string };
  };
  isPaymentTypeMonthlyWage: boolean;
  isPaymentTypeHourlyWage: boolean;
  isPaymentTypePieceWage: boolean;
  collectiveAgreement?: {
    value: number;
    attr: { pensionprovidercode: 'cbacode' };
  };
  stateEmploymentFund: boolean;
  carBenefitYear?: number;
  isAbroadCarBenefit: boolean;
  carEmissionValue?: number;
}

export interface GetEmployeePayrollInformation {
  payrollRuleGroup?: {
    netvisorKey: number;
    name: string;
  };
  taxNumber?: number;
  foreclosure: boolean;
  foreclosureMaintenancePersons?: number;
  noSocialSecurityPayment: boolean;
  accountingAccount: {
    netvisorKey: number;
    name: string;
    number: number;
  };
  hierarchy: {
    netvisorKey: number;
    name: string;
  };
  placeOfBusiness?: string;
  defaultDimensions?: {
    defaultDimension: {
      dimensionName: string;
      dimensionItem: string;
    }[];
  };
  payslipDeliveryMethod: {
    /** 1 = paikallinen tulostus, 2 = tulostuspalvelu, 3 = verkkopalkka */
    value: number;
    attr: { type: 'netvisor' };
  };
  isJointOwner: boolean;
  isAthlete: boolean;
  isPerformingArtist: boolean;
  /** 1 = Tyel, 2 = MYEL, 3 = YEL, 4 = Ei eläkevakuutettu */
  employeeInsuranceType?: number;
  isPersonWorkingOnARoadFerryOnALandIslands: boolean;
  isEntrepreneurWithOptionalYelOrMyel: boolean;
}

export interface GetEmployeeEducationalInformationDegree {
  name: string;
  school?: string;
  graduationYear?: number;
  isPrimaryDegree: boolean;
}

export interface GetEmployeeAdditionalInformationField {
  netvisorKey?: number;
  name: string;
  value?: {
    value: string;
    attr: { type: string };
  };
  group: {
    /** 1 = Perustiedot, 2 = Yhteystiedot, 3 = Koulutustiedot */
    value: number;
    attr: { type: 'netvisor' };
  };
}

export interface GetEmployeeSettlementPoint {
  netvisorKey: number;
  type: string;
  name: string;
}

/*
 * RESOURCE
 * employee.nv
 */

export interface EmployeeParameters {
  /** If editing employee, employeeIdentifier or foreignEmployeeIdentification.identifier must be given */
  method: 'add' | 'edit';
}

/*
Taso	Elementti	Muoto ja pituus	Ilmenty-
miä	Kuvaus
Esimerkki
Root	root	Aggregaatti 	1	 	 
1	employee	Aggregaatti 	1	 	 
2	employeebaseinformation	Aggregaatti 	1	 	 
3	foreignemployeeidentification	Aggregaatti	0..1	Ulkomainen palkansaaja	Jos elementti annetaan,
ei anneta employeeidentifier tietoa
4	identifier	Merkkijono	1	Tunnistustieto	23011970
Attr.	type	Merkkijono	1	Tunnistustiedon tyyppi, sallitut arvot:
taxidentificationnumber
foreignpersonalidentifier
other
foreignpersonalidentifier
4	issuingcountry	Merkkijono	1	Maa	AF
Attr.	type	Merkkijono	1	Maatiedon muoto	ISO-3166
4	gender	Merkkijono	1	Sukupuoli,
male
female	male
4	dateofbirth	Päivämäärä	1	Syntymäaika	1970-10-20
Attr.	format	Merkkijono	1	Päivämäärän muoto	ansi
3	employeeidentifier	Merkkijono	1	Palkansaajan suomalainen henkilötunnus	010277-xxxp
3	companyidentifier 	Merkkijono	0..1	Yrityksen y-tunnus,
Kun tuodaan yritys palkansaajaksi
0174564-5
3
companyname	Merkkijono	0..1	Yrityksen nimi	Testi Yritys
3	firstname	Merkkijono, maks. 50	1	Palkansaajan etunimi	Anna
3	lastname	Merkkijono, maks. 50	1	Palkansaajan sukunimi	Ammattilainen
3	phonenumber	Merkkijono, maks. 50	1	Palkansaajan puhelinnumero	050 123 456
3	email	Merkkijono, maks. 100	1	Palkansaajan sähköpostiosoite	anna.ammattilainen@yritys.fi
2	employeepayrollinformation	Aggregaatti	1	 	 
3	streetaddress	Merkkijono, maks. 255	1	Palkansaajan katuosoite	Keisarinnankatu 1
3	postnumber	Merkkijono, maks. 50	1	Palkansaajan postinumero	56120
3	city	Merkkijono, maks. 255	1	Palkansaajan postitoimipaikka	Lappeenranta
3	municipality	Merkkijono, maks. 255	0..1	Palkansaajan asuinpaikkakunta	Lappeenranta
3	country	Merkkijono, maks. 2	0..1	Palkansaajan kotimaan koodi, oletus fi	fi
3	nationality	Merkkijono, maks. 2	0..1	Palkansaajan kansalaisuus, oletus fi	se
3	language	Merkkijono, maks. 2	0..1	Palkansaajan käyttämä kieli, oletus fi	fi
3	employeenumber	Numeerinen, maks. 10	0..1	Palkansaajan yksilöllinen tunnistenumero	13
3	profession	Merkkijono, maks. 255	0..1	Palkansaajan ammattinimike	Testaaja
3	jobbegindate	Merkkijono, maks. 10	0..1	Palkansaajan työsuhteen alkamispäivä	2017-11-09
Attr.	format	Merkkijono	
Alkamispäivän muoto, aina ansi	ansi
3	payrollrulegroupname	Merkkijono, maks. 50	1	Palkansaajan palkkamallin nimi	Kuukausipalkkalaiset
3	bankaccountnumber	Merkkijono, maks. 34	0..1	Palkansaajan pankkitilinumero, IBAN-tilinumero. Jos tuot pelkästään pankkitilinumeron, lasketaan BIC-koodi tilinumeron perusteella 	FI71 7997 9580 0073 35
3	bankidentificationcode	Merkkijono. maks. 20	0..1	Pankin BIC-koodi	NDEAFIHH
3	accountingaccountnumber	Numeerinen	0..1	Palkansaajan velkatilinumero	1751
3	hierarchy	Merkkijono	0..1	Hierarkiataso	Oy Yritys Ab
Attr.	type	Merkkijono	1	Hierarkian linkitystyyppi
netvisor - Netvisorin tunniste
tai
customer - Jos yksilöidään nimellä,
täytyy olla uniikki
Lue yrityshierarkiasta
3	dimension	Aggregaatti	0..n	 	Oletuslaskentakohteet
4	dimensionname	Merkkijono	1	Laskentakohdeotsikon nimi.
Luodaan tarvittaessa	Kustannuspaikat
4	dimensionitem	Merkkijono	1	Laskentakohteen nimi.
Luodaan tarvittaessa	DevOps
Attr.	fatherid	Numeerinen	0..1	Laskentakohteen "vanhemman" (parent)
tunnus. ID:t voi noutaa tällä resurssilla
1
3	payslipdeliverymethod	Merkkijono	0..1	Palkkalaskelman toimitustapa	1 = paikallinen tulostus
2 = tulostuspalvelu
3 = verkkopalkka
Attr.	type	Merkkijono	1	Toimitustavan linkitystyyppi
Attribuutti type on aina netvisor,
eli Netvisorin tunniste
3	isjointowner	Numeerinen	0..1	Osakasasemassa maksajaan	1=kyllä
0=ei
3	isathlete	Numeerinen 	0..1	Urheilija	1=kyllä
0=ei
3	isperformingartist	Numeerinen	0..1	Esiintyvä taitelija	1=kyllä
0=ei
3	employeeinsurancetype	Numeerinen	0..1	Työeläkevakuutuksen tyyppi	1=Tyel
2=MYEL
3=YEL
4=Ei eläkevakuutettu
3	ispersonworkingonaroadferryonalandislands	Numeerinen	0..1	Ahvenanmaan maantielautalla työskentelevä henkilö	1=kyllä
0=ei
3	isentrepreneurwithoptionalyelormyel 	Numeerinen	0..1	Yrittäjä, ei YEL- tai MYEL-vakuuttamisvelvollisuutta	1=kyllä
0=ei
1 voidaan antaa vain, mikäli employeeinsurancetype=4
3	nosocialsecuritypayment 	Numeerinen	0..1	Ei työnantajan sairausvakuutusmaksun alainen	1=kyllä
0=ei
Oletuksena 0
3	activity	Numeerinen	0..1	Aktiivisuus	1=kyllä
0=ei
Oletuksena 1
3	foreclosure	Numeerinen	0..1	Ulosotto	1=kyllä
0=ei
Oletuksena 0
3	foreclosuremaitenancepersons	Numeerinen	0..1	Ulosotossa elatuksen varassa olevat henkilöt	Annettava, jos foreclosure = 1
3	taxnumber	Merkkijono	0..1	Palkansaajan veronumero	123456798912
3	placeofbusiness	Merkkijono	0..1	Toimipaikka tulorekisteriin (nimi)	Pääkonttori
2	employmentperiods	Aggregaatti	0..1	Työsuhteet	 
3	employmentperiod	Aggregaatti	1..n	Työsuhde	 
4	companystartdate	Päivämäärä	0..1	Yhtymään tulopäivä	2017-01-01
Attr.	format	Merkkijono	1	Päivämäärän muoto	ansi
4	startdate	Päivämäärä	1	Alkamispäivä	2017-01-01
Attr.	format	Merkkijono	1	Päivämäärän muoto	ansi
4	probationenddate	Päivämäärä	0..1	Koeajan päättymispäivä	2017-04-01
Attr.	format	Merkkijono	1	Päivämäärän muoto	ansi
4	employmentmode	Numeerinen	0..1	Työsuhteen tapa	1 = työsuhteinen
2 = vuokratyöntekijä
3 = ammatinharjoittaja tai muu vastaava
4 = harjoittelija
5 = talkootyö
Attr.	type	Merkkijono	1	Työsuhteen linkitystyyppi
Attribuutti type on aina netvisor,
eli Netvisorin tunniste
4	profession	Merkkijono, maks. 250
1	Ammattinimike	Testaaja
4	comment	Merkkijono, maks. 500	0..1	Kommentti	Uusi osaava tyyppi
4	enddate	Päivämäärä	0..1	Päättymispäivä	2017-12-31
Attr.	format	Merkkijono	1	Päivämäärän muoto	ansi
4	endreason	Numeerinen	0..1	Päättymisen syy	2=Työntekijän vanhuuseläke
4=Työntekijän oma pyyntö
5=Työntekijästä johtuva syy
6=Työsuhteen määräaikaisuus
11=Yrityksen tuotannolliset ja taloudelliset syyt
12=Työsuhteen päättyminen yhteisestä sopimuksesta
13=Muu syy
(Seuraavat poistuneet käytöstä:
1 = Normaali työsuhteen päättyminen
3 = Työntekijän kuolema
7 = Työsuhteen päättyminen koeaikana
8 = Työsuhteen purkaminen
9 = Yrityksen konkurssi
10 = Yrityksen omistajan vaihtuminen)
Attr.	type	Merkkijono	1	Päättymisen linkitystyyppi
Attribuutti type on aina netvisor,
eli Netvisorin tunniste
4	occupationclassification	Merkkijono	0..1	Ammattiluokka	Ammattiluokan TK10-koodi
Attr.	type	Merkkijono	1	Linkitystyyppi	Attribuutti type on aina isco
4	employmentcontract	Numeerinen	0..1	Työsuhteen voimassaolo	1 = Toistaiseksi voimassa oleva
2 = Määräaikainen
Huom: määräaikaiselle
työsuhteelle on
annettava päättymispäivä
Attr.	type	Merkkijono	1	Linkitystyyppi	Attribuutti type on aina netvisor,
eli Netvisorin tunniste
4	employmentform	Numeerinen	0..1	Työsuhteen tyyppi	1 = Kokoaikainen
2 = Osa-aikainen
3 = tietoa ei saatavilla
Attr.	type	Merkkijono	1	Linkitystyyppi	Attribuutti type on aina netvisor,
eli Netvisorin tunniste
4	parttimepercent	Numeerinen	0..1	Osa-aikaisuuden prosentti	Sallittu arvo, desimaaliluku väliltä 0-100
Huom: employmentform oltava 2,
jotta asetus huomioidaan
Pyöristys lähimpään kahteen desimaaliin 
4	regularworkinghours	Numeerinen	0..1	Säännöllinen työaika	Sallittu arvo, desimaaliluku väliltä 0-168
Pyöristys lähimpään kahteen desimaaliin
4	groundsforemployment	Numeerinen	 0..1	Työsuhteen peruste	0=Muu peruste
1=Työsuhde tai virkasuhde
4	kevaprofessionalclasscode	Numeerinen	 0..1	Keva Ammattiluokan koodi, max 20 merkkiä. 
KEVA tietoja voi antaa vain jos yrityksellä on valittu
palkanlaskennan asetuksista ”Yrityksen työeläkevakuuttaja on Keva”.	Kevan ammattiluokkien koodit:
Keva: Ammattinimikkeiden haku
 

4	kevaemploymentregistration	Numeerinen	 0..1	Keva Palvelusuhteen rekisteröinti, max 2 merkkiä. 	Kevan Palvelussuhteen rekisteröintikoodit:
Keva: Tulorekisterin koodisto
Attr.	type	Merkkijono	 1	aina keva	keva
Attr.	pensionprovidercode	Numeerinen	0..1	Työeläkelaitoksen yhtiötunnuksen koodi. Jos ei anneta, käytetään oletuksena
arvoa ”20”.
Määrää mitä arvoja hyväksytään kenttään
kevaemploymentregistration. 	Arvo löytyy KEVA:n koodistosta
Keva: Tulorekisterin koodisto
Virheellisellä arvolla listataan sallitut arvot.
4	ispaymenttypemonthlywage	Numeerinen	 0..1	Palkkauksen muoto: Kuukausipalkka	1=kyllä
0=ei
4	ispaymenttypehourlywage	Numeerinen	 0..1	Palkkauksen muoto: Tuntipalkka	1=kyllä
0=ei
4	ispaymenttypepiecewage	Numeerinen	0..1	Palkkauksen muoto: Urakka	1=kyllä
0=ei
4	collectiveagreement	Numeerinen	0..1	Työehtosopimus	Tulorekisterin työehtosopimuksen koodit:
Tulorekisteri: Koodistot
Attr.	type	Merkkijono	1	aina cbacode	cbacode
4	stateemploymentfund	Numeerinen	0..1	Valtion työllisyysmäärärahoilla työllistetty	1=kyllä
0=ei
4	carbenefityear	Numeerinen	0..1	Autoetuauton käyttöönottovuosi, max 4 merkkiä	 2012
4	isabroadcarbenefit	Numeerinen	0..1	Autoetu on saatu ulkomailla	1=kyllä
0=ei
4	caremissionsvalue	Numeerinen	0..1	Auton päästöarvo, kokonaisluku väliltä 0-100	85
2	employeesettings	Aggregaatti	0..1	Palkansaajan asetukset	 
3	payrollservice	Merkkijono	0..1	Palkanlaskentapalvelu	enabled tai disabled
3	resourcemanagement	Merkkijono	0..1	Resurssinhallinta	enabled tai disabled
2	employeesettlementpoints	Aggregaatti	0..1	Tilityspisteet	 
3	employeeworkpensioninsurance	Aggregaatti	0..1	Työeläkevakuutus	 
4	type	Merkkijono	0..1	Tilityspisteen käsittely	nohandling=Ei käsittelyä
automatichandling=
Automaattinen käsittely
under17yearsold=Alle 17-vuotias 
17to52yearsold=17-52 vuotias 
53to62yearsold=53-62 vuotias
63to67yearsold=63-67 vuotias
over68yearsold=yli 68-vuotias
4	name	Merkkijono	0..1	Vakuutuskohtainen tilityspiste määritys (*	TyEL
3	employeeunemploymentinsurance	Aggregaatti	0..1	Työttömyysvakuutus	 
4	type	Merkkijono	0..1	Tilityspisteen käsittely	nohandling=Ei käsittelyä
automatichandling=
Automaattinen käsittely
under17yearsold=Alle 17-vuotias
17to64yearsold=17-64 vuotias
over65yearsold=yli 65-vuotias
partowner=osaomistaja
4	name	Merkkijono	0..1	Vakuutuskohtainen tilityspiste määritys (*	Työttömyysvakuutus
3	employeeaccidentinsurance	Aggregaatti	0..1	Tapaturmavakuutus	 
4	type	Merkkijono	0..1	Tilityspisteen käsittely	nohandling tai attachedtosettlementpoint
4	name	Merkkijono	0..1	Vakuutuskohtainen tilityspiste määritys (*
Tapaturmavakuutus
3	employeegrouplifeinsurance	Aggregaatti	0..1	Ryhmähenkivakuutus	 
4	type	Merkkijono	0..1	Tilityspisteen käsittely	nohandling tai attachedtosettlementpoint
4	name	Merkkijono	0..1	Vakuutuskohtainen tilityspiste määritys (*	Ryhmähenkivakuutus
3	employeeotherinsurance	Aggregaatti	0..1	Muu vakuutus	 
4	type	Merkkijono	0..1	Tilityspisteen käsittely	nohandling tai attachedtosettlementpoint
4	name	Merkkijono	0..1	Vakuutuskohtainen tilityspiste määritys (*	Muu vakuutus
3	employeeunionmembershipfee	Aggregaatti	0..1	Ammattiliiton jäsenmaksu	 
4	type	Merkkijono	0..1	Tilityspisteen käsittely	nohandling tai attachedtosettlementpoint
4	name	Merkkijono	0..1	Vakuutuskohtainen tilityspiste määritys (*	Ammattiliiton jäsenmaksu
3	employeeforeclosure	Aggregaatti	0..1	Ulosmittaus	 
4	type	Merkkijono	0..1	Tilityspisteen käsittely	nohandling tai attachedtosettlementpoint
4	name	Merkkijono	0..1	Vakuutuskohtainen tilityspiste määritys (*	Ulosotto
2	employeeeducationalinformation	Aggregaatti	0..1	Palkansaajan koulutustiedot	
3	degree	Aggregaatti	0..n	Tutkinto	
4	name	Merkkijono	1	Tutkinnon nimi	Ylioppilas
4	school	Merkkijono	1	Koulun nimi	Lyseon lukio
4	graduationyear	Numeerinen	1	Valmistumisvuosi	2022
4	primarydegree	Numeerinen	1	Päätutkinto	1=kyllä
0=ei
2	employeeadditionalinformation	Aggregaatti	0..1	Palkansaajan lisätietokentät	
3	additionalinformationfield	Aggregaatti	0..n	Palkansaajan lisätietokenttä	
4	name	Merkkijono	1	Lisätietokentän nimi	Allergiat
4	value	Merkkijono	1	Lisätietokentän arvo	Kala
*/

export interface Employee {
  employeeBaseInformation: {
    foreignEmployeeIdentification?: {
      identifier: {
        val: string;
        attr: { type: 'taxidentificationnumber' | 'foreignpersonalidentifier' | 'other' };
      };
      issuingCountry: {
        val: string;
        attr: { type: 'ISO-3166' };
      };
      gender: 'male' | 'female';
      dateOfBirth: {
        val: string;
        attr: { format: 'ansi' };
      };
    };
    employeeIdentifier?: string;
    companyIdentifier?: string;
    companyName?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
  };
  employeePayrollInformation: {
    streetAddress: string;
    postNumber: string;
    city: string;
    municipality?: string;
    country: string;
    nationality: string;
    language: string;
    employeeNumber?: number;
    profession?: string;
    jobBeginDate?: {
      val: string;
      attr: { format: 'ansi' };
    };
    payrollRuleGroupName: string;
    bankAccountNumber?: string;
    bankIdentificationCode?: string;
    accountingAccountNumber?: number;
    hierarchy?: {
      val: string;
      attr: { type: 'netvisor' | 'customer' };
    };
    dimension?: {
      dimensionName: string;
      dimensionItem:
        | {
            val: string;
            attr: { fatherid: number };
          }
        | string;
    }[];
    payslipDeliveryMethod?: {
      /** 1 = paikallinen tulostus, 2 = tulostuspalvelu, 3 = verkkopalkka */
      val: 1 | 2 | 3;
      attr: { type: 'netvisor' };
    };
    isJointOwner?: 1 | 0;
    isAthlete?: 1 | 0;
    isPerformingArtist?: 1 | 0;
    /** 1 = Tyel, 2 = MYEL, 3 = YEL, 4 = Ei eläkevakuutettu */
    employeeInsuranceType?: 1 | 2 | 3 | 4;
    isPersonWorkingOnARoadFerryOnAlandIslands?: 1 | 0;
    /** If set to true, employeeInsuranceType must be 4 */
    isEntrepreneurWithOptionalYelOrMyel?: 1 | 0;
    noSocialSecurityPayment?: 1 | 0;
    activity?: 1 | 0;
    foreclosure?: 1 | 0;
    foreclosureMaintenancePersons?: number;
    taxNumber?: string;
    placeOfBusiness?: string;
  };
  employmentPeriods?: {
    employmentPeriod: {
      companyStartDate?: {
        val: string;
        attr: { format: 'ansi' };
      };
      startDate: {
        val: string;
        attr: { format: 'ansi' };
      };
      probationEndDate?: {
        val: string;
        attr: { format: 'ansi' };
      };
      employmentMode?: {
        /** 1 = työsuhteinen, 2 = vuokratyöntekijä, 3 = ammatinharjoittaja tai muu vastaava, 4 = harjoittelija, 5 = talkootyö */
        val: 1 | 2 | 3 | 4 | 5;
        attr: { type: 'netvisor' };
      };
      profession: string;
      comment?: string;
      endDate?: {
        val: string;
        attr: { format: 'ansi' };
      };
      endReason?: {
        /** 2 = Työntekijän vanhuuseläke, 4 = Työntekijän oma pyyntö, 5 = Työntekijästä johtuva syy, 6 = Työsuhteen määräaikaisuus,
         * 11 = Yrityksen tuotannolliset ja taloudelliset syyt, 12 = Työsuhteen päättyminen yhteisestä sopimuksesta, 13 = Muu syy */
        val: 2 | 4 | 5 | 6 | 11 | 12 | 13;
        attr: { type: 'netvisor' };
      };
      occupationClassification?: {
        val: string;
        attr: { type: 'isco' };
      };
      employmentContract?: {
        /** 1 = Toistaiseksi voimassa oleva, 2 = Määräaikainen */
        val: 1 | 2;
        attr: { type: 'netvisor' };
      };
      employmentForm?: {
        /** 1 = Kokoaikainen, 2 = Osa-aikainen, 3 = tietoa ei saatavilla */
        val: 1 | 2 | 3;
        attr: { type: 'netvisor' };
      };
      /** Decimal between 0 and 100. If given, employmentForm must be 2 */
      partTimePercent?: number;
      /** Decimal between 0 and 168 */
      regularWorkingHours?: number;
      /** 0 = Muu peruste, 1 = Työsuhde tai virkasuhde */
      groundsForEmployment?: 0 | 1;
      kevaProfessionalClassCode?: string;
      kevaEmploymentRegistration?: {
        val: string;
        attr: { type: 'keva'; pensionProviderCode?: number };
      };
      isPaymentTypeMonthlyWage?: 1 | 0;
      isPaymentTypeHourlyWage?: 1 | 0;
      isPaymentTypePieceWage?: 1 | 0;
      collectiveAgreement?: {
        val: string;
        attr: { type: 'cbacode' };
      };
      stateEmploymentFund?: 1 | 0;
      carBenefitYear?: number;
      isAbroadCarBenefit?: 1 | 0;
      /** Integer between 0 and 100 */
      carEmissionsValue?: number;
    }[];
  };
  employeeSettings?: {
    payrollService?: 'enabled' | 'disabled';
    resourceManagement?: 'enabled' | 'disabled';
  };
  employeeSettlementPoints?: {
    employeeWorkPensionInsurance?: {
      type:
        | 'nohandling'
        | 'automatichandling'
        | 'under17yearsold'
        | '17to52yearsold'
        | '53to62yearsold'
        | '63to67yearsold'
        | 'over68yearsold';
      name: string;
    }[];
    employeeUnemploymentInsurance?: {
      type: 'nohandling' | 'automatichandling' | 'under17yearsold' | '17to64yearsold' | 'over65yearsold' | 'partowner';
      name: string;
    }[];
    employeeAccidentInsurance?: {
      type: 'nohandling' | 'attachedtosettlementpoint';
      name: string;
    }[];
    employeeGroupLifeInsurance?: {
      type: 'nohandling' | 'attachedtosettlementpoint';
      name: string;
    }[];
    employeeOtherInsurance?: {
      type: 'nohandling' | 'attachedtosettlementpoint';
      name: string;
    }[];
    employeeUnionMembershipFee?: {
      type: 'nohandling' | 'attachedtosettlementpoint';
      name: string;
    }[];
    employeeForeclosure?: {
      type: 'nohandling' | 'attachedtosettlementpoint';
      name: string;
    }[];
  };
  employeeEducationalInformation?: {
    degree?: {
      name: string;
      school: string;
      graduationYear: number;
      primaryDegree: 1 | 0;
    }[];
  };
  employeeAdditionalInformation?: {
    additionalInformationField?: {
      name: string;
      value: string;
    }[];
  };
}

/*
 * RESOURCE
 * getpayrollpaycheckbatchlist.nv
 */

export interface GetPayrollPaycheckBatchListParameters {
  /** YYYY-MM-DD */
  startDate: string;
  /** YYYY-MM-DD */
  endDate?: string;
}

export interface GetPayrollPaycheckBatchListItem {
  netvisorKey: number;
  paymentDate: {
    value: string;
    attr: { format: 'ansi' };
  };
  payrollRuleGroupPeriod: {
    netvisorKey: number;
    startDate: {
      value: string;
      attr: { format: 'ansi' };
    };
    endDate: {
      value: string;
      attr: { format: 'ansi' };
    };
  };
  payrollRuleGroup: {
    netvisorKey: number;
    name: string;
  };
  employee: {
    name: string;
    employeeNumber?: number;
    netvisorKey: number;
  };
  /** 1 = Avoin, 2 = Kuitattu/Hyväksytty, 3 = Maksettu  */
  status: number;
  statusDescription: string;
}

/*
 * RESOURCE
 * getpayrollpaycheckbatch.nv
 */

export interface GetPayrollPaycheckBatchParameters {
  netvisorKey: number;
}

export interface GetPayrollPaycheckBatch {
  paymentDate: {
    value: string;
    attr: { format: 'ansi' };
  };
  payrollRuleGroupPeriod: {
    netvisorKey: number;
    startDate: {
      value: string;
      attr: { format: 'ansi' };
    };
    endDate: {
      value: string;
      attr: { format: 'ansi' };
    };
  };
  payrollRuleGroup: {
    netvisorKey: number;
    name: string;
  };
  employee: {
    netvisorKey: number;
    name: string;
    employeeNumber?: number;
  };
  /** 1 = Avoin, 2 = Kuitattu/Hyväksytty, 3 = Maksettu  */
  status: number;
  voucher?: {
    netvisorKey: number;
    class: string;
    number: number;
    date: {
      value: string;
      attr: { format: 'ansi' };
    };
  };
  allocationCurves?: {
    allocationCurve: GetPayrollPaycheckBatchAllocationCurve[];
  };
  freeTextBeforeLines?: string;
  freeTextAfterLines?: string;
  holidayRecords: {
    availableHolidays: number;
    newAccrualOfHolidays: number;
  };
  payrollPaycheckBatchLines: {
    payrollPaycheckBatchLine: GetPayrollPaycheckBatchPayrollLine[];
  };
}

export interface GetPayrollPaycheckBatchAllocationCurve {
  percent: number;
  dimensions: {
    dimension: {
      dimensionName: {
        value: string;
        attr: { netvisorKey: number };
      };
      dimensionItem: {
        value: string;
        attr: { netvisorKey: number };
      };
    }[];
  };
}

export interface GetPayrollPaycheckBatchPayrollLine {
  payrollRatio: {
    netvisorKey: number;
    number?: number;
    name: string;
    isVisible: boolean;
    costObjectSource: string;
  };
  units?: number;
  unitAmount?: number;
  lineSum: number;
  earningPeriods?: {
    earningPeriod: {
      startDate: {
        value: string;
        attr: { format: 'ansi' };
      };
      endDate: {
        value: string;
        attr: { format: 'ansi' };
      };
    }[];
  };
  incomeType?: {
    netvisorKey: number;
    number: number;
    name: string;
  };
  accountingData: {
    debetAccountNetvisorKey?: number;
    debetAccountNumber?: number;
    debetAccountName?: string;
    kreditAccountNetvisorKey?: number;
    kreditAccountNumber?: number;
    kreditAccountName?: string;
  };
  dimensions?: {
    dimension: {
      percent: number;
      dimensionName: {
        value: string;
        attr: { netvisorKey: number };
      };
      dimensionItem: {
        value: string;
        attr: { netvisorKey: number };
      };
    }[];
  };
  lineDescription: string;
}
