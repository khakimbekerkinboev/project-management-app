import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from '../../services/board.service';
import { BoardsService } from '../../services/boards.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  boardId: any;
  columns: any = [];

  constructor(
    private route: ActivatedRoute,
    private boardsService: BoardsService,
    private boardService: BoardService
  ) {}

  setBoardTitle() {
    const boardTitle: any = document.querySelector('.board-title');
    this.boardsService.getSpecificBoard(this.boardId).subscribe((res: any) => {
      boardTitle.innerText = res.title;
    });
  }

  getAllColumns() {
    this.boardService.getAllColumns(this.boardId).subscribe((res) => {
      if (res) {
        this.columns = res;
      }
    });
  }

  createColumn(columnTitle: object) {
    this.boardService
      .createColumn(this.boardId, columnTitle)
      .subscribe((res) => {
        if (res) {
          this.columns.push(res);
          this.toggleColumnCreateWindow();
        }
      });
  }

  toggleColumnCreateWindow() {
    const columnCreate = document.querySelector('.column-create');
    columnCreate?.classList.toggle('column-create-hidden');

    if (!columnCreate?.classList.contains('column-create-hidden')) {
      const createForm = columnCreate?.querySelector('form');
      createForm?.reset();
    }
  }

  hideColumnCreate($event: any) {
    if (
      $event.target.classList.contains('column-create') ||
      $event.target.classList.contains('fa-circle-xmark')
    ) {
      this.toggleColumnCreateWindow();
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.boardId = params.get('id');
    });

    this.setBoardTitle();
    this.getAllColumns();
  }
}
