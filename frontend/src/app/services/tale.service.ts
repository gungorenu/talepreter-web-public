import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaleService {
  constructor(private http: HttpClient) {}

  getTales() {
    return this.http.get<any[]>(environment.apiEndpoint + '/tales').pipe(
      map((res: any) => res.data),
      catchError(this.handleErrorObservable)
    );
  }

  getVersions(taleId: string) {
    return this.http.get<any[]>(environment.apiEndpoint + `/tale/${taleId}/versions`).pipe(
      map((res: any) => res.data),
      catchError(this.handleErrorObservable)
    );
  }

  private handleErrorObservable(error: HttpErrorResponse) {
    console.error('API.Error: ' + error.message);
    return throwError(() => error);
  }
}
