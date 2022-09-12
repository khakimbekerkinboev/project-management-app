import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  private _url = 'https://proj-manag-sys.herokuapp.com/boards';
  constructor(private http: HttpClient) {}

  get() {
    return this.http.get(this._url);
  }

  create(newBoard: object) {
    return this.http.post(this._url, newBoard);
  }

  update(board: any, newBoard: any) {
    return this.http.put(this._url + '/' + board.id, newBoard);
  }

  delete(board: any) {
    return this.http.delete(this._url + '/' + board.id);
  }
}
