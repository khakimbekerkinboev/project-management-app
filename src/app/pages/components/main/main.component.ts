import { Component, OnInit } from '@angular/core';
import { BoardsService } from '../../services/boards.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  boards: any = [];
  currentBoard: any = {};

  constructor(private boardService: BoardsService) {
    this.boardService.get().subscribe((res) => {
      this.boards = res;
    });
  }

  createBoard(newBoard: object) {
    this.boardService.create(newBoard).subscribe((res) => {
      if (res) {
        this.boards.push(newBoard);
      }
    });

    this.closeProjectCreateWindow();
  }

  deleteBoard(board: object) {
    this.boardService.delete(board).subscribe((res) => {
      const index = this.boards.indexOf(board);
      this.boards.splice(index, 1);
    });
  }

  updateBoard(newBoard: Object) {
    this.boardService.update(this.currentBoard, newBoard).subscribe((res) => {
      if (res) {
        const index = this.boards.indexOf(this.currentBoard);
        this.boards.splice(index, 1, res);
        this.currentBoard = {};
      }
    });

    this.closeProjectUpdateWindow();
  }

  /////////////// Open & Close Windows ///////////////////////
  showProjectCreate() {
    const projectCreate = document.querySelector('.project-create');
    projectCreate?.classList.remove('project-create-hidden');
  }

  showProjectUpdate(board: any) {
    const projectUpdate = document.querySelector('.project-update');
    projectUpdate?.classList.remove('project-update-hidden');

    this.currentBoard = board;

    const formTitle: any = projectUpdate?.querySelector('h2');
    formTitle.innerText = board?.title;

    const titleInput: any = projectUpdate?.querySelector('#title');
    titleInput.placeholder = board?.title;

    const descriptionInput: any = projectUpdate?.querySelector('#description');
    descriptionInput.placeholder = board?.description;
  }

  closeProjectCreateWindow() {
    const projectCreate = document.querySelector('.project-create');
    projectCreate?.classList.add('project-create-hidden');
    const createForm = projectCreate?.querySelector('form');
    createForm?.reset();
  }

  closeProjectUpdateWindow() {
    const projectUpdate = document.querySelector('.project-update');
    projectUpdate?.classList.add('project-update-hidden');
    const updateForm = projectUpdate?.querySelector('form');
    updateForm?.reset();
  }

  hideProjectCreate($event: any) {
    if (
      $event.target.classList.contains('project-create') ||
      $event.target.classList.contains('fa-circle-xmark')
    ) {
      this.closeProjectCreateWindow();
    }
  }

  hideProjectUpdate($event: any) {
    if (
      $event.target.classList.contains('project-update') ||
      $event.target.classList.contains('fa-circle-xmark')
    ) {
      this.closeProjectUpdateWindow();
    }
  }

  ngOnInit(): void {}
}
