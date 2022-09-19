import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  boards: any = [];
  currentBoard: any = {};
  tasks: any = [];
  foundTasks: any = [];

  constructor(private mainService: MainService, private router: Router) {}

  /////////////// Search Tasks ///////////////////////
  searchTask($event: any) {
    const value = $event.target.value;
    const taskSearchWindow = document.querySelector('.task-search');
    const noResult = document.querySelector('.no-result');

    this.foundTasks = this.tasks.filter((task: any) => {
      return (
        task.order.toString().includes(value) ||
        task.title.includes(value) ||
        task.description.includes(value)
      );
    });

    if (taskSearchWindow?.classList.contains('task-search-hidden')) {
      taskSearchWindow?.classList.remove('task-search-hidden');
    }

    if (value === '') {
      this.hideTaskSearchWindow();
    }

    if (this.foundTasks.length === 0) {
      noResult?.classList.remove('no-result-hidden');
    } else {
      noResult?.classList.add('no-result-hidden');
    }
  }

  setAllTasks() {
    this.boards.forEach((board: any) => {
      this.mainService
        .getSpecificBoard(board.id)
        .subscribe((singleBoard: any) => {
          singleBoard.columns.forEach((singleColumn: any) => {
            singleColumn.tasks.forEach((singleTask: any) => {
              const task = {
                ...singleTask,
                columnTitle: singleColumn.title,
                boardTitle: singleBoard.title,
                board: singleBoard,
              };
              this.tasks.push(task);
            });
          });
        });
    });
  }

  hideTaskSearchWindow() {
    const searchInput: any = document.querySelector('#search');
    const taskSearchWindow = document.querySelector('.task-search');
    taskSearchWindow?.classList.add('task-search-hidden');
    searchInput.value = '';
    this.foundTasks = [];
  }

  viewTask(task: any) {
    this.navigateToBoard(task.board);
  }

  /////////////// Create, Update, Delete Boards ///////////////////////
  createBoard(newBoard: object) {
    this.mainService.create(newBoard).subscribe((res) => {
      if (res) {
        this.boards.push(res);
      }
    });

    this.closeProjectCreateWindow();
  }

  deleteBoard() {
    this.mainService.delete(this.currentBoard).subscribe((res) => {
      const index = this.boards.indexOf(this.currentBoard);

      if (index > -1) {
        this.boards.splice(index, 1);
      }

      this.currentBoard = {};
    });

    this.closeProjectDeleteWindow();
  }

  updateBoard(newBoard: Object) {
    this.mainService.update(this.currentBoard, newBoard).subscribe((res) => {
      if (res) {
        const index = this.boards.indexOf(this.currentBoard);
        this.boards.splice(index, 1, res);
        this.currentBoard = {};
      }
    });

    this.closeProjectUpdateWindow();
  }

  navigateToBoard(board: any) {
    this.router.navigate(['/boards', board.id]);
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

    const titleInput: any = projectUpdate?.querySelector('#title');
    titleInput.placeholder = board?.title;

    const descriptionInput: any = projectUpdate?.querySelector('#description');
    descriptionInput.placeholder = board?.description;
  }

  showProjectDelete(board: any) {
    const projectDelete = document.querySelector('.project-delete');
    projectDelete?.classList.remove('project-delete-hidden');

    this.currentBoard = board;

    const deleteTitle: any = projectDelete?.querySelector('h6');
    deleteTitle.innerHTML = `Are you sure you want to delete <strong>${board.title}</strong>?`;

    const deleteBtn = projectDelete?.querySelector('.delete-btn');
    deleteBtn?.addEventListener('click', () => {
      this.deleteBoard();
      deleteBtn?.replaceWith(deleteBtn.cloneNode(true));
    });

    const cancelBtn = projectDelete?.querySelector('.cancel-btn');
    cancelBtn?.addEventListener('click', () => {
      this.closeProjectDeleteWindow();
      cancelBtn?.replaceWith(cancelBtn.cloneNode(true));
    });
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

  closeProjectDeleteWindow() {
    const projectDelete = document.querySelector('.project-delete');
    projectDelete?.classList.add('project-delete-hidden');

    const deleteBtn = projectDelete?.querySelector('.delete-btn');
    deleteBtn?.replaceWith(deleteBtn.cloneNode(true));

    const cancelBtn = projectDelete?.querySelector('.cancel-btn');
    cancelBtn?.replaceWith(cancelBtn.cloneNode(true));
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

  hideProjectDelete($event: any) {
    if ($event.target.classList.contains('project-delete')) {
      this.closeProjectDeleteWindow();
    }
  }

  ngOnInit(): void {
    this.mainService.getBoards().subscribe((res) => {
      this.boards = res;
      this.setAllTasks();
    });
  }
}
