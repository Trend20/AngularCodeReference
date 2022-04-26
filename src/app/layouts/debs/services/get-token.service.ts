import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GetTokenService {
  constructor() {}


  /**
   * TODO: Update function to fetch tokens
   * @returns Access token
   *
   */
  getAccessToken() {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMDcyNSIsImp0aSI6ImIzYTI2MTEyLWRhNTUtNGFmZC1hZDg1LTI1NzJjNmI5YjliYyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJyZ2F0aG9nbyIsImV6eV91c2VyX2lkIjoiMjA3MjUiLCJyb2xlIjoidXNlciIsImV4cCI6MTY1ODU1NzQ4MSwiaXNzIjoiNTgwNGUzZDEtMjZlMC00Y2FjLWJmYzgtMDIzYjUzNzgyNGFiIiwiYXVkIjoiZjZlZjQ1ZGMtZDkyNC00MmMwLWFkNzAtMmNkMjA4Nzk4NjliIn0.vFVSij34JmRnmpDx_UqXYq8GIZm57BvnctdqHR1Gp0U';
  }
}
