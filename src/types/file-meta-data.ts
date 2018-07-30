import { PurchaseType } from './purchase-type';
import { BuyerType } from './buyer-type';
import { Attachment } from './attachment';
import { DataLocation } from './data-location';
import BigNumber from 'bignumber.js';
import { Eula } from './eula';

export interface FileMetaData {
  /**
   * Title of the file
   */
  title?: string;

  /**
   * Short description of the file - up to 256 characters
   */
  shortDescription?: string;

  /**
   * Full description of the file - no length limit
   */
  fullDescription?: string;

  /**
   *  Possible type of purchase
   */
  type?: PurchaseType;

  /**
   * Locations where data is collected
   */
  location?: DataLocation;

  /**
   * File categories
   */
  category?: string[];

  /**
   * Maximum numbers of downloads (-1 means unlimited downloads number)
   */
  maxNumberOfDownloads?: number;

  /**
   * Possible buyer types
   */
  buyerType?: BuyerType[];

  /**
   * Price for file in smallest token unit
   */
  price?: BigNumber;

  /**
   *  End User License Agreement
   */
  eula?: Eula;

  /**
   * File API documentation
   */
  apiDocumentation?: Attachment[],

  /**
   * Other file documentation
   */
  otherDocumentation?: Attachment[],

  /**
   * Sample not encrypted file
   */
  sampleFile?: Attachment[],

  /**
   * Use-case documentation
   */
  useCaseDocumentation?: Attachment[]
}
