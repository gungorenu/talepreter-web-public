import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  constructor(private http: HttpClient) {}

  getWorld(taleId: string, versionId: string) {
    return this.http.get<any[]>(environment.apiEndpoint + `/version/${taleId}/${versionId}/world`).pipe(
      map((res: any) => res.data),
      catchError(this.handleErrorObservable)
    );
  }

  getSettlements(taleId: string, versionId: string) {
    return this.http.get<any[]>(environment.apiEndpoint + `/version/${taleId}/${versionId}/settlements`).pipe(
      map((res: any) => res.data),
      catchError(this.handleErrorObservable)
    );
  }

  searchPersons(
    taleId: string,
    versionId: string,
    searchPattern: string,
    searchInContent: boolean,
    skipDead: boolean,
    skipDummies: boolean,
    searchInChapter: number,
    currentChapter: number
  ) {
    return this.http
      .post<any[]>(environment.apiEndpoint + `/version/${taleId}/${versionId}/persons`, {
        searchPattern,
        searchInContent,
        skipDead,
        skipDummies,
        searchInChapter,
        currentChapter,
      })
      .pipe(
        map((res: any) => res.data),
        catchError(this.handleErrorObservable)
      );
  }

  getDummies(taleId: string, versionId: string, searchPattern: string, searchInContent: boolean, currentChapter: number) {
    return this.http
      .post<any[]>(environment.apiEndpoint + `/version/${taleId}/${versionId}/dummies`, {
        searchPattern,
        searchInContent,
        currentChapter,
      })
      .pipe(
        map((res: any) => res.data),
        catchError(this.handleErrorObservable)
      );
  }

  getDeathbed(taleId: string, versionId: string, today: number) {
    return this.http
      .post<any[]>(environment.apiEndpoint + `/version/${taleId}/${versionId}/deathbed`, {
        today,
      })
      .pipe(
        map((res: any) => res.data),
        catchError(this.handleErrorObservable)
      );
  }

  getGroupSummary(taleId: string, versionId: string, focusedGroup: string) {
    return this.http
      .post<any[]>(environment.apiEndpoint + `/version/${taleId}/${versionId}/summary`, {
        groupName: focusedGroup,
      })
      .pipe(
        map((res: any) => res.data),
        catchError(this.handleErrorObservable)
      );
  }

  getChapters(taleId: string, versionId: string) {
    return this.http.get<any[]>(environment.apiEndpoint + `/version/${taleId}/${versionId}/chapters`).pipe(
      map((res: any) => res.data),
      catchError(this.handleErrorObservable)
    );
  }

  getTimeline(taleId: string, versionId: string) {
    return this.http.get<any[]>(environment.apiEndpoint + `/version/${taleId}/${versionId}/timeline`).pipe(
      map((res: any) => res.data),
      catchError(this.handleErrorObservable)
    );
  }

  getCaches(taleId: string, versionId: string) {
    return this.http.get<any[]>(environment.apiEndpoint + `/version/${taleId}/${versionId}/caches`).pipe(
      map((res: any) => res.data),
      catchError(this.handleErrorObservable)
    );
  }

  getActors(taleId: string, versionId: string) {
    return this.http.get<any[]>(environment.apiEndpoint + `/version/${taleId}/${versionId}/actors`).pipe(
      map((res: any) => res.data),
      catchError(this.handleErrorObservable)
    );
  }

  getActorDetails(taleId: string, versionId: string, actorId: string) {
    return this.http
      .post<any[]>(environment.apiEndpoint + `/version/${taleId}/${versionId}/actorDetails`, {
        actorId,
      })
      .pipe(
        map((res: any) => res.data),
        catchError(this.handleErrorObservable)
      );
  }

  getGroupActorDetails(taleId: string, versionId: string, groupName: string) {
    return this.http
      .post<any[]>(environment.apiEndpoint + `/version/${taleId}/${versionId}/groupActorDetails`, {
        groupName,
      })
      .pipe(
        map((res: any) => res.data),
        catchError(this.handleErrorObservable)
      );
  }

  private handleErrorObservable(error: HttpErrorResponse) {
    console.error('API.Error: ' + error.message);
    return throwError(() => error);
  }
}
