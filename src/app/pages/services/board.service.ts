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

  createTask(boardId: string, columnId: string, task: object) {
    return this.http.post(
      this._url + boardId + '/columns/' + columnId + '/tasks',
      task
    );
  }

  updateTask(boardId: string, columnId: string, taskId: string, body: object) {
    return this.http.put(
      this._url + boardId + '/columns/' + columnId + '/tasks/' + taskId,
      body
    );
  }

  updateColumnTasks(
    boardId: string,
    columnId: string,
    taskId: string,
    requestBody: object
  ) {
    return this.http.put(
      this._url + boardId + '/columns/' + columnId + '/tasks/' + taskId,
      requestBody
    );
  }

  deleteColumn(boardId: string, columnId: string) {
    return this.http.delete(this._url + boardId + '/columns/' + columnId);
  }

  deleteTask(boardId: string, columnId: string, taskId: string) {
    return this.http.delete(
      this._url + boardId + '/columns/' + columnId + '/tasks/' + taskId
    );
  }

  updateColumnTitle(boardId: string, columnId: string, newColumn: object) {
    return this.http.put(
      this._url + boardId + '/columns/' + columnId,
      newColumn
    );
  }

  updateColumnOrder(boardId: string, columnId: string, requestBody: object) {
    return this.http.put(
      this._url + boardId + '/columns/' + columnId,
      requestBody
    );
  }

  getAllColumns(id: string) {
    return this.http.get(this._url + id + '/columns');
  }

  getSingleColumnTasks(boardId: string, columnId: string) {
    return this.http.get(
      this._url + boardId + '/columns/' + columnId + '/tasks'
    );
  }
}
