import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private _url = 'https://proj-manag-sys.herokuapp.com/boards/';
  constructor(private http: HttpClient) {}

  createColumn(id: string, title: object) {
    return this.http.post(this._url + id + '/columns', title);
  }

  getAllColumns(id: string) {
    return this.http.get(this._url + id + '/columns');
  }
}
