// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Country } from "src/app/layouts/debs/models/country";

export const environment = {
  production: false,
  placesUrl: 'https://maps.googleapis.com/maps/api/place/autocomplete/json',
  placesApiKey: 'y=mx+c',
  searchApiAuthUrl: 'https://desearchdevapi.allianceitsc.com/oauth2/token',
  ocrSearchUrl: 'https://deb-dev-api.allianceitsc.com/api/v1/PersonalCard/UploadFile_OCR',
  searchApiUsername: 'rgathogo',
  searchApiPassword: 'UGFzc3dvcmQwIQ==',
  searchApiGrantType: 'password',
  searchApiAppName: 'De Search',
  abnLookupUrl: 'https://desearchdevapi.allianceitsc.com/api/v1/TextSearch_ABNLookup/DoSearch',
  coreLogicUrl: 'https://desearchdevapi.allianceitsc.com/api/v1/TextSearch_CoreLogic_Asia_RP/DoSearchForAPI',
  realEstateUrl: 'https://desearchdevapi.allianceitsc.com/api/v1/TextSearch_Google_RealEstate/DoSearch',
  postCodeCheckUrl: 'https://deb-dev-api.allianceitsc.com/api/v1/ConfigPostcode/GetDataPostcodeCheck',
  // baseUrl: 'https://debdev-backend.mezy.com.au/deb',
  baseUrl: 'http://localhost:8080/deb',
  privacyPolicyUrl: 'https://mezy.com.au/MortgageEzyPrivacyPolicy-20210322.pdf',
  refinanceCheckUrl: 'https://deb-dev-api.allianceitsc.com/api/v1/SMSF_Source_Funding/Refinance_Serviceability_Check',
  smsfCheckUrl: 'https://deb-dev-api.allianceitsc.com/api/v1/EzySMSFServicingCalculator/Calculate',
  firebase: {
    apiKey: "AIzaSyCtZJEVDinmU6PkjYMfJjX7EYP-zCJVG0c",
    authDomain: "deb-dev-project.firebaseapp.com",
    projectId: "deb-dev-project",
    storageBucket: "deb-dev-project.appspot.com",
    messagingSenderId: "382081831694",
    appId: "1:382081831694:web:2e4bd8e78b8098e0997d5f",
    measurementId: "G-SGEPT4G1L7"
  },
  patormondUsername: "Pormond",
  patormondPassword: "Password0!",
  verifyBrokerAccessToken: "52d5c4dd-2819-4950-9921-8e28edae4941",
  verifyBrokerUrl: 'https://mobileapps.mezy.com.au/ezybp/ServiceSoEzyBP.asmx/VerifyBroker',
  dmsBaseUrl: 'http://35.189.2.196/dms/api/v1'
};

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const states: Country[] = [
    {
        "code" : "New South Wales",
        "name" : "New South Wales"
    },
    {
        "code" : "Victoria",
        "name" : "Victoria"
    },
    {
        "code" : "Queensland",
        "name" : "Queensland"
    },
    {
        "code" : "Tasmania",
        "name" : "Tasmania"
    },
    {
      "code" : "Northern Australia",
      "name" : "Northern Territory"
    },
    {
        "code" : "Western Australia",
        "name" : "Western Australia"
    },
    {
        "code" : "South Australia",
        "name" : "South Australia"
    },
    {
      "code" : "Australian Capital",
      "name" : "Australian Capital Territory"
    }
  ];

export const countries: Country[] = [
  {
    "name": "Australia",
    "code": "AU"
  },
  {
      "name": "Afghanistan",
      "code": "AF"
  },
  {
      "name": "Åland Islands",
      "code": "AX"
  },
  {
      "name": "Albania",
      "code": "AL"
  },
  {
      "name": "Algeria",
      "code": "DZ"
  },
  {
      "name": "American Samoa",
      "code": "AS"
  },
  {
      "name": "Andorra",
      "code": "AD"
  },
  {
      "name": "Angola",
      "code": "AO"
  },
  {
      "name": "Anguilla",
      "code": "AI"
  },
  {
      "name": "Antarctica",
      "code": "AQ"
  },
  {
      "name": "Antigua and Barbuda",
      "code": "AG"
  },
  {
      "name": "Argentina",
      "code": "AR"
  },
  {
      "name": "Armenia",
      "code": "AM"
  },
  {
      "name": "Aruba",
      "code": "AW"
  },
  {
      "name": "Austria",
      "code": "AT"
  },
  {
      "name": "Azerbaijan",
      "code": "AZ"
  },
  {
      "name": "Bahamas",
      "code": "BS"
  },
  {
      "name": "Bahrain",
      "code": "BH"
  },
  {
      "name": "Bangladesh",
      "code": "BD"
  },
  {
      "name": "Barbados",
      "code": "BB"
  },
  {
      "name": "Belarus",
      "code": "BY"
  },
  {
      "name": "Belgium",
      "code": "BE"
  },
  {
      "name": "Belize",
      "code": "BZ"
  },
  {
      "name": "Benin",
      "code": "BJ"
  },
  {
      "name": "Bermuda",
      "code": "BM"
  },
  {
      "name": "Bhutan",
      "code": "BT"
  },
  {
      "name": "Bolivia",
      "code": "BO"
  },
  {
      "name": "Bosnia and Herzegovina",
      "code": "BA"
  },
  {
      "name": "Botswana",
      "code": "BW"
  },
  {
      "name": "Bouvet Island",
      "code": "BV"
  },
  {
      "name": "Brazil",
      "code": "BR"
  },
  {
      "name": "British Indian Ocean Territory",
      "code": "IO"
  },
  {
      "name": "Brunei Darussalam",
      "code": "BN"
  },
  {
      "name": "Bulgaria",
      "code": "BG"
  },
  {
      "name": "Burkina Faso",
      "code": "BF"
  },
  {
      "name": "Burundi",
      "code": "BI"
  },
  {
      "name": "Cambodia",
      "code": "KH"
  },
  {
      "name": "Cameroon",
      "code": "CM"
  },
  {
      "name": "Canada",
      "code": "CA"
  },
  {
      "name": "Cape Verde",
      "code": "CV"
  },
  {
      "name": "Cayman Islands",
      "code": "KY"
  },
  {
      "name": "Central African Republic",
      "code": "CF"
  },
  {
      "name": "Chad",
      "code": "TD"
  },
  {
      "name": "Chile",
      "code": "CL"
  },
  {
      "name": "China",
      "code": "CN"
  },
  {
      "name": "Christmas Island",
      "code": "CX"
  },
  {
      "name": "Cocos (Keeling) Islands",
      "code": "CC"
  },
  {
      "name": "Colombia",
      "code": "CO"
  },
  {
      "name": "Comoros",
      "code": "KM"
  },
  {
      "name": "Congo",
      "code": "CG"
  },
  {
      "name": "Congo, Democratic Republic",
      "code": "CD"
  },
  {
      "name": "Cook Islands",
      "code": "CK"
  },
  {
      "name": "Costa Rica",
      "code": "CR"
  },
  {
      "name": "Cote D\"Ivoire",
      "code": "CI"
  },
  {
      "name": "Croatia",
      "code": "HR"
  },
  {
      "name": "Cuba",
      "code": "CU"
  },
  {
      "name": "Cyprus",
      "code": "CY"
  },
  {
      "name": "Czech Republic",
      "code": "CZ"
  },
  {
      "name": "Denmark",
      "code": "DK"
  },
  {
      "name": "Djibouti",
      "code": "DJ"
  },
  {
      "name": "Dominica",
      "code": "DM"
  },
  {
      "name": "Dominican Republic",
      "code": "DO"
  },
  {
      "name": "Ecuador",
      "code": "EC"
  },
  {
      "name": "Egypt",
      "code": "EG"
  },
  {
      "name": "El Salvador",
      "code": "SV"
  },
  {
      "name": "Equatorial Guinea",
      "code": "GQ"
  },
  {
      "name": "Eritrea",
      "code": "ER"
  },
  {
      "name": "Estonia",
      "code": "EE"
  },
  {
      "name": "Ethiopia",
      "code": "ET"
  },
  {
      "name": "Falkland Islands (Malvinas)",
      "code": "FK"
  },
  {
      "name": "Faroe Islands",
      "code": "FO"
  },
  {
      "name": "Fiji",
      "code": "FJ"
  },
  {
      "name": "Finland",
      "code": "FI"
  },
  {
      "name": "France",
      "code": "FR"
  },
  {
      "name": "French Guiana",
      "code": "GF"
  },
  {
      "name": "French Polynesia",
      "code": "PF"
  },
  {
      "name": "French Southern Territories",
      "code": "TF"
  },
  {
      "name": "Gabon",
      "code": "GA"
  },
  {
      "name": "Gambia",
      "code": "GM"
  },
  {
      "name": "Georgia",
      "code": "GE"
  },
  {
      "name": "Germany",
      "code": "DE"
  },
  {
      "name": "Ghana",
      "code": "GH"
  },
  {
      "name": "Gibraltar",
      "code": "GI"
  },
  {
      "name": "Greece",
      "code": "GR"
  },
  {
      "name": "Greenland",
      "code": "GL"
  },
  {
      "name": "Grenada",
      "code": "GD"
  },
  {
      "name": "Guadeloupe",
      "code": "GP"
  },
  {
      "name": "Guam",
      "code": "GU"
  },
  {
      "name": "Guatemala",
      "code": "GT"
  },
  {
      "name": "Guernsey",
      "code": "GG"
  },
  {
      "name": "Guinea",
      "code": "GN"
  },
  {
      "name": "Guinea-Bissau",
      "code": "GW"
  },
  {
      "name": "Guyana",
      "code": "GY"
  },
  {
      "name": "Haiti",
      "code": "HT"
  },
  {
      "name": "Heard Island and Mcdonald Islands",
      "code": "HM"
  },
  {
      "name": "Holy See (Vatican City State)",
      "code": "VA"
  },
  {
      "name": "Honduras",
      "code": "HN"
  },
  {
      "name": "Hong Kong",
      "code": "HK"
  },
  {
      "name": "Hungary",
      "code": "HU"
  },
  {
      "name": "Iceland",
      "code": "IS"
  },
  {
      "name": "India",
      "code": "IN"
  },
  {
      "name": "Indonesia",
      "code": "ID"
  },
  {
      "name": "Iran",
      "code": "IR"
  },
  {
      "name": "Iraq",
      "code": "IQ"
  },
  {
      "name": "Ireland",
      "code": "IE"
  },
  {
      "name": "Isle of Man",
      "code": "IM"
  },
  {
      "name": "Israel",
      "code": "IL"
  },
  {
      "name": "Italy",
      "code": "IT"
  },
  {
      "name": "Jamaica",
      "code": "JM"
  },
  {
      "name": "Japan",
      "code": "JP"
  },
  {
      "name": "Jersey",
      "code": "JE"
  },
  {
      "name": "Jordan",
      "code": "JO"
  },
  {
      "name": "Kazakhstan",
      "code": "KZ"
  },
  {
      "name": "Kenya",
      "code": "KE"
  },
  {
      "name": "Kiribati",
      "code": "KI"
  },
  {
      "name": "Korea (North)",
      "code": "KP"
  },
  {
      "name": "Korea (South)",
      "code": "KR"
  },
  {
      "name": "Kosovo",
      "code": "XK"
  },
  {
      "name": "Kuwait",
      "code": "KW"
  },
  {
      "name": "Kyrgyzstan",
      "code": "KG"
  },
  {
      "name": "Laos",
      "code": "LA"
  },
  {
      "name": "Latvia",
      "code": "LV"
  },
  {
      "name": "Lebanon",
      "code": "LB"
  },
  {
      "name": "Lesotho",
      "code": "LS"
  },
  {
      "name": "Liberia",
      "code": "LR"
  },
  {
      "name": "Libyan Arab Jamahiriya",
      "code": "LY"
  },
  {
      "name": "Liechtenstein",
      "code": "LI"
  },
  {
      "name": "Lithuania",
      "code": "LT"
  },
  {
      "name": "Luxembourg",
      "code": "LU"
  },
  {
      "name": "Macao",
      "code": "MO"
  },
  {
      "name": "Macedonia",
      "code": "MK"
  },
  {
      "name": "Madagascar",
      "code": "MG"
  },
  {
      "name": "Malawi",
      "code": "MW"
  },
  {
      "name": "Malaysia",
      "code": "MY"
  },
  {
      "name": "Maldives",
      "code": "MV"
  },
  {
      "name": "Mali",
      "code": "ML"
  },
  {
      "name": "Malta",
      "code": "MT"
  },
  {
      "name": "Marshall Islands",
      "code": "MH"
  },
  {
      "name": "Martinique",
      "code": "MQ"
  },
  {
      "name": "Mauritania",
      "code": "MR"
  },
  {
      "name": "Mauritius",
      "code": "MU"
  },
  {
      "name": "Mayotte",
      "code": "YT"
  },
  {
      "name": "Mexico",
      "code": "MX"
  },
  {
      "name": "Micronesia",
      "code": "FM"
  },
  {
      "name": "Moldova",
      "code": "MD"
  },
  {
      "name": "Monaco",
      "code": "MC"
  },
  {
      "name": "Mongolia",
      "code": "MN"
  },
  {
      "name": "Montserrat",
      "code": "MS"
  },
  {
      "name": "Morocco",
      "code": "MA"
  },
  {
      "name": "Mozambique",
      "code": "MZ"
  },
  {
      "name": "Myanmar",
      "code": "MM"
  },
  {
      "name": "Namibia",
      "code": "NA"
  },
  {
      "name": "Nauru",
      "code": "NR"
  },
  {
      "name": "Nepal",
      "code": "NP"
  },
  {
      "name": "Netherlands",
      "code": "NL"
  },
  {
      "name": "Netherlands Antilles",
      "code": "AN"
  },
  {
      "name": "New Caledonia",
      "code": "NC"
  },
  {
      "name": "New Zealand",
      "code": "NZ"
  },
  {
      "name": "Nicaragua",
      "code": "NI"
  },
  {
      "name": "Niger",
      "code": "NE"
  },
  {
      "name": "Nigeria",
      "code": "NG"
  },
  {
      "name": "Niue",
      "code": "NU"
  },
  {
      "name": "Norfolk Island",
      "code": "NF"
  },
  {
      "name": "Northern Mariana Islands",
      "code": "MP"
  },
  {
      "name": "Norway",
      "code": "NO"
  },
  {
      "name": "Oman",
      "code": "OM"
  },
  {
      "name": "Pakistan",
      "code": "PK"
  },
  {
      "name": "Palau",
      "code": "PW"
  },
  {
      "name": "Palestinian Territory, Occupied",
      "code": "PS"
  },
  {
      "name": "Panama",
      "code": "PA"
  },
  {
      "name": "Papua New Guinea",
      "code": "PG"
  },
  {
      "name": "Paraguay",
      "code": "PY"
  },
  {
      "name": "Peru",
      "code": "PE"
  },
  {
      "name": "Philippines",
      "code": "PH"
  },
  {
      "name": "Pitcairn",
      "code": "PN"
  },
  {
      "name": "Poland",
      "code": "PL"
  },
  {
      "name": "Portugal",
      "code": "PT"
  },
  {
      "name": "Puerto Rico",
      "code": "PR"
  },
  {
      "name": "Qatar",
      "code": "QA"
  },
  {
      "name": "Reunion",
      "code": "RE"
  },
  {
      "name": "Romania",
      "code": "RO"
  },
  {
      "name": "Russian Federation",
      "code": "RU"
  },
  {
      "name": "Rwanda",
      "code": "RW"
  },
  {
      "name": "Saint Helena",
      "code": "SH"
  },
  {
      "name": "Saint Kitts and Nevis",
      "code": "KN"
  },
  {
      "name": "Saint Lucia",
      "code": "LC"
  },
  {
      "name": "Saint Pierre and Miquelon",
      "code": "PM"
  },
  {
      "name": "Saint Vincent and the Grenadines",
      "code": "VC"
  },
  {
      "name": "Samoa",
      "code": "WS"
  },
  {
      "name": "San Marino",
      "code": "SM"
  },
  {
      "name": "Sao Tome and Principe",
      "code": "ST"
  },
  {
      "name": "Saudi Arabia",
      "code": "SA"
  },
  {
      "name": "Senegal",
      "code": "SN"
  },
  {
      "name": "Serbia",
      "code": "RS"
  },
  {
      "name": "Montenegro",
      "code": "ME"
  },
  {
      "name": "Seychelles",
      "code": "SC"
  },
  {
      "name": "Sierra Leone",
      "code": "SL"
  },
  {
      "name": "Singapore",
      "code": "SG"
  },
  {
      "name": "Slovakia",
      "code": "SK"
  },
  {
      "name": "Slovenia",
      "code": "SI"
  },
  {
      "name": "Solomon Islands",
      "code": "SB"
  },
  {
      "name": "Somalia",
      "code": "SO"
  },
  {
      "name": "South Africa",
      "code": "ZA"
  },
  {
      "name": "South Georgia and the South Sandwich Islands",
      "code": "GS"
  },
  {
      "name": "Spain",
      "code": "ES"
  },
  {
      "name": "Sri Lanka",
      "code": "LK"
  },
  {
      "name": "Sudan",
      "code": "SD"
  },
  {
      "name": "Suriname",
      "code": "SR"
  },
  {
      "name": "Svalbard and Jan Mayen",
      "code": "SJ"
  },
  {
      "name": "Swaziland",
      "code": "SZ"
  },
  {
      "name": "Sweden",
      "code": "SE"
  },
  {
      "name": "Switzerland",
      "code": "CH"
  },
  {
      "name": "Syrian Arab Republic",
      "code": "SY"
  },
  {
      "name": "Taiwan, Province of China",
      "code": "TW"
  },
  {
      "name": "Tajikistan",
      "code": "TJ"
  },
  {
      "name": "Tanzania",
      "code": "TZ"
  },
  {
      "name": "Thailand",
      "code": "TH"
  },
  {
      "name": "Timor-Leste",
      "code": "TL"
  },
  {
      "name": "Togo",
      "code": "TG"
  },
  {
      "name": "Tokelau",
      "code": "TK"
  },
  {
      "name": "Tonga",
      "code": "TO"
  },
  {
      "name": "Trinidad and Tobago",
      "code": "TT"
  },
  {
      "name": "Tunisia",
      "code": "TN"
  },
  {
      "name": "Turkey",
      "code": "TR"
  },
  {
      "name": "Turkmenistan",
      "code": "TM"
  },
  {
      "name": "Turks and Caicos Islands",
      "code": "TC"
  },
  {
      "name": "Tuvalu",
      "code": "TV"
  },
  {
      "name": "Uganda",
      "code": "UG"
  },
  {
      "name": "Ukraine",
      "code": "UA"
  },
  {
      "name": "United Arab Emirates",
      "code": "AE"
  },
  {
      "name": "British",
      "code": "GB"
  },
  {
      "name": "United States",
      "code": "US"
  },
  {
      "name": "United States Minor Outlying Islands",
      "code": "UM"
  },
  {
      "name": "Uruguay",
      "code": "UY"
  },
  {
      "name": "Uzbekistan",
      "code": "UZ"
  },
  {
      "name": "Vanuatu",
      "code": "VU"
  },
  {
      "name": "Venezuela",
      "code": "VE"
  },
  {
      "name": "Viet Nam",
      "code": "VN"
  },
  {
      "name": "Virgin Islands, British",
      "code": "VG"
  },
  {
      "name": "Virgin Islands, U.S.",
      "code": "VI"
  },
  {
      "name": "Wallis and Futuna",
      "code": "WF"
  },
  {
      "name": "Western Sahara",
      "code": "EH"
  },
  {
      "name": "Yemen",
      "code": "YE"
  },
  {
      "name": "Zambia",
      "code": "ZM"
  },
  {
      "name": "Zimbabwe",
      "code": "ZW"
  }
];

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
export const SERVICEABILITY = 'serviceability';
export const PERSONAL_DETAIL = 'personal-detail';
export const ASSET_LIABILITY = 'asset-liability';
export const ADDITIONAL_PERSONAL_INFORMATION = 'additional-personal-information'
export const ADDITIONAL_ASSET_LIABILITY = 'additional-asset-liability'
export const VALUATION = 'valuation';
export const BUSINESS_PARTNER_DETAILS = 'business-partner';
export const BROKER_DECLARATION = 'broker-declaration'
