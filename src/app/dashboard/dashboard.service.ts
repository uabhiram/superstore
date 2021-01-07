import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class DashboardHttpService {
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(private http: HttpClient) {}
  getLoading(): Observable<boolean> {
    return this.loading$;
  }

  findAllOrders(): Observable<any> {
    return this.http.get('/api/orders', { responseType: 'json' });
  }
}
