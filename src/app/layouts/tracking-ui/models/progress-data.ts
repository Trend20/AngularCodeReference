export interface ProgressData {
    id: number;

    application_code: string;
    application_name: string;
    status?: string;
    lender_reference?: string;
    product_group: string;
    doc_type: string;
    created_date: string;
    currently_opened?: any;
    last_modified?: string;
}