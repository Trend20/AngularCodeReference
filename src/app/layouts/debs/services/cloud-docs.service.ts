import { Injectable } from '@angular/core';
import {
  uploadBytes,
  ref,
  Storage,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { GenerateDoc } from '../models/generate-doc-model';
import { HttpUtilService } from '../utils/http-util.service';

@Injectable({
  providedIn: 'root',
})
export class CloudDocsService {
  constructor(
    private storage: Storage,
    private httpUtilService: HttpUtilService
  ) {}

  async uploadFile(path: string, file: File) {
    let loc = ref(this.storage, path);

    const res = await uploadBytes(loc, file);
    const url = await getDownloadURL(res.ref);

    return Promise.resolve({ url: url, updated: res.metadata.updated });
  }

  async deleteFile(path: string) {
    let loc = ref(this.storage, path);
    await deleteObject(loc);
  }

  /**
   * function to integrate with formal/conditional
   */
  generateFileOnApproval(
    approvalType: string,
    data: GenerateDoc
  ): Observable<any> {
    if (approvalType === 'conditional') {
      return this.httpUtilService.makeHttpRequest(
        'POST',
        `${environment.dmsBaseUrl}/conditionalApproval`,{body: data, headers: {Authorization: 'Basic YWRtaW46cGFzc3dvcmQ='}}
      );
    } else {
      return this.httpUtilService.makeHttpRequest(
        'POST',
        `${environment.dmsBaseUrl}/formalApproval`,{body: data, headers: {Authorization: 'Basic YWRtaW46cGFzc3dvcmQ='}}
      );
    }
  }
}
