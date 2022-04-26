export class UploadedFile {
    constructor(public file: any){}
    get fileName(): string{
        return this.file?.name;
    }
}
