import { environment } from '../../../environments/environment';

export interface CompanyTMDB {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export class Company {
  id: number;
  logoPath: string;
  name: string;
  originCountry: string;

  constructor(companyTMDB?: CompanyTMDB, imageSize: string = '/w300') {
    if (companyTMDB != null) {
      this.id = companyTMDB.id;
      this.name = companyTMDB.name;
      this.originCountry = companyTMDB.origin_country;
      if (companyTMDB.logo_path != null) {
        this.logoPath = environment.IMAGE_LINK + imageSize + companyTMDB.logo_path;
      }
      else {
        this.logoPath = '';
      }
    }
  }
}
