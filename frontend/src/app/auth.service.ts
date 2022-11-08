import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Album } from './app.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly tokenStorageKey = 'ama-token';
  private readonly tokenStorageExpKey = 'ama-exp';

  private _authToken: string | undefined = undefined;
  get authToken() {
    if (this._authToken) {
      return this._authToken;
    }

    const existingToken = localStorage.getItem(this.tokenStorageKey);
    const existingTokenExpDate = localStorage.getItem(this.tokenStorageExpKey) ?? "0";
    const remainingValidityMs = +existingTokenExpDate - Date.now();
    if (existingToken && remainingValidityMs > 0) {
      this._authToken = existingToken;
    }

    return this._authToken;
  }

  tryLogIn(username: string, password: string): Observable<LogInResult> {
    const basicAuthToken = btoa(username + ":" + password);
    const observable = this.http.get<Album[]>(environment.musicIndexLocation, { headers: { Authorization: "Basic " + basicAuthToken } })
      .pipe(
        tap(_ => {
          this._authToken = basicAuthToken;
          localStorage.setItem(this.tokenStorageKey, basicAuthToken);
          localStorage.setItem(this.tokenStorageExpKey, (Date.now() + 1000 * 60 * 60 * 24 * 365).toString());
        }
        ),
        map(_ => ({ success: true, invalidCredentials: false })),
        catchError<LogInResult, Observable<LogInResult>>(e => of({ success: false, invalidCredentials: e.status === 401 }))
      )
    return observable;
  }

  constructor(private http: HttpClient) { }
}

export interface LogInResult {
  success: boolean;
  invalidCredentials: boolean;
}
