import { OcrData } from './ocr-data';

export interface OcrResponse {
    Data: OcrData;
    ExtraData?: any;
    StartTime: any;
    EndTime: any;
    TotalMili: any;
    StatusCode: number;
    Msg: string;
    MsgShowInUI?: any;
}
