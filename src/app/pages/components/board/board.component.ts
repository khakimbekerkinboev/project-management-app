import jwtDecode from 'jwt-decode';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from '../../services/board.service';
import { MainService } from '../../services/main.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  boardId: any;
  users: any = [];
  columns: any = [];
  allTasks: any = [];
  currentColumn: any = {};
  currentTask: any = {};
  draggedTask: any = {};
  draggedColumn: any = [];

  constructor(
    private route: ActivatedRoute,
    private mainService: MainService,
    private boardService: BoardService
  ) {}
  ///////////////////////////// Drag-n-Drop Events //////////////////////
  dropColumn(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    moveItemInArray(this.allTasks, event.previousIndex, event.currentIndex);
    const droppedColumn = this.columns[event.currentIndex];
    const newOrderOfDroppedColumn = event.currentIndex + 1;
    this.updateColumnOrder(droppedColumn, newOrderOfDroppedColumn);
  }

  updateColumnOrder(droppedColumn: any, newOrderOfDroppedColumn: number) {
    const requestBody = {
      title: droppedColumn.title,
      order: newOrderOfDroppedColumn,
    };
    this.boardService
      .updateColumnOrder(this.boardId, droppedColumn.id, requestBody)
      .subscribe(() => {});
  }

  dropTask(event: CdkDragDrop<string[]>, column: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    const previousColumn = this.draggedColumn;
    const previousColumnTasks = this.reorderColumnTasks(
      previousColumn,
      event.previousContainer.data
    );

    const currentColumn = column;
    const currentColumnTasks = this.reorderColumnTasks(
      currentColumn,
      event.container.data
    );

    this.updateColumnTasks(previousColumn, previousColumnTasks);
    this.updateColumnTasks(previousColumn, currentColumnTasks);
  }

  setTaskDraggedItem(task: any, column: any) {
    this.draggedColumn = column;
    this.draggedTask = task;
  }

  reorderColumnTasks(column: any, tasks: any) {
    let result = [...tasks];

    result.forEach((obj, index) => {
      obj.order = index + 1;
      obj.columnId = column.id;
    });

    return result;
  }

  updateColumnTasks(column: any, columnTasks: any) {
    columnTasks.forEach((task: any) => {
      const requestBody = {
        title: task.title,
        order: task.order,
        description: task.description,
        userId: task.userId,
        boardId: task.boardId,
        columnId: task.columnId,
      };

      if (task === this.draggedTask) {
        this.boardService
          .updateColumnTasks(this.boardId, column.id, task.id, requestBody)
          .subscribe(() => {});
      } else {
        this.boardService
          .updateColumnTasks(this.boardId, task.columnId, task.id, requestBody)
          .subscribe(() => {});
      }
    });
  }

  //////////// Create, Get, Update, Delete Columns & Tasks //////////////
  setBoardTitle() {
    const boardTitle: any = document.querySelector('.board-title');
    this.mainService.getSpecificBoard(this.boardId).subscribe((res: any) => {
      boardTitle.innerText = res.title;
    });
  }

  getAllUsers() {
    this.boardService.getAllUsers().subscribe((res) => {
      if (res) {
        this.users = res;
      }
    });
  }

  filterUserTasks(event: any) {
    const columns: any = document.querySelectorAll('.column');
    const selectedUserId: any = event.target.value;
    if (selectedUserId === 'All') {
      this.allTasks.forEach((columnTasks: {}[], index: number) => {
        columnTasks.forEach((task: any) => {
          task.color = '#d3d3d3';
        });
      });
    } else {
      this.allTasks.forEach((columnTasks: {}[]) => {
        columnTasks.forEach((task: any) => {
          if (task.userId == selectedUserId) {
            task.color = '#7aeb7a';
          } else {
            task.color = '#d3d3d3';
          }
        });
      });
    }
  }

  getAllColumns() {
    this.boardService.getAllColumns(this.boardId).subscribe((res: any) => {
      if (res) {
        res.sort((a: any, b: any) => {
          return a.order - b.order;
        });

        this.columns = res;
        this.getAllTasks();
      }
    });
  }

  getAllTasks() {
    this.allTasks = [];
    for (let column of this.columns) {
      this.allTasks.push([]);
    }

    for (let column of this.columns) {
      this.boardService
        .getSingleColumnTasks(this.boardId, column.id)
        .subscribe((singleColumnTasks: any) => {
          if (singleColumnTasks && singleColumnTasks.length !== 0) {
            singleColumnTasks.sort((a: any, b: any) => {
              return a.order - b.order;
            });

            const columnIdOfTasks = singleColumnTasks[0].columnId;

            for (let singleColumn of this.columns) {
              if (singleColumn.id === columnIdOfTasks) {
                const index = this.columns.indexOf(singleColumn);
                this.allTasks[index] = singleColumnTasks;
              }
            }
          }
        });
    }
  }

  createColumn(columnTitle: object) {
    this.boardService
      .createColumn(this.boardId, columnTitle)
      .subscribe((res) => {
        if (res) {
          this.columns.push(res);
          this.allTasks.push([]);
          this.toggleColumnCreateWindow();
        }
      });
  }

  createTask(inputValues: object) {
    const token: any = localStorage.getItem('token');
    const decoded: any = jwtDecode(token);
    const userId = decoded.userId;
    const task = { ...inputValues, ...{ userId: userId } };

    this.boardService
      .createTask(this.boardId, this.currentColumn.id, task)
      .subscribe((res) => {
        const index = this.columns.indexOf(this.currentColumn);
        this.allTasks[index].push(res);
        this.closeTaskCreateWindow();
      });
  }

  updateTask(inputValues: any) {
    const token: any = localStorage.getItem('token');
    const decoded: any = jwtDecode(token);
    const userId = decoded.userId;

    const updateRequestBody = {
      title: inputValues.title,
      order: this.currentTask.order,
      description: inputValues.description,
      userId: userId,
      boardId: this.boardId,
      columnId: this.currentColumn.id,
    };

    this.boardService
      .updateTask(
        this.boardId,
        this.currentColumn.id,
        this.currentTask.id,
        updateRequestBody
      )
      .subscribe((res) => {
        if (res) {
          const columnIndex = this.columns.indexOf(this.currentColumn);
          const taskIndex = this.allTasks[columnIndex].indexOf(
            this.currentTask
          );
          this.allTasks[columnIndex].splice(taskIndex, 1, res);
          this.closeTaskUpdateWindow();
        }
      });
  }

  deleteColumn(column: any) {
    this.boardService.deleteColumn(this.boardId, column.id).subscribe((res) => {
      this.closeColumnDeleteWindow();
      const index = this.columns.indexOf(column);
      this.columns.splice(index, 1);
      this.allTasks.splice(index, 1);
    });
  }

  deleteTask(column: any, task: any) {
    this.boardService
      .deleteTask(this.boardId, column.id, task.id)
      .subscribe((res) => {
        this.closeTaskDeleteWindow();
        const columnIndex = this.columns.indexOf(column);
        const taskIndex = this.allTasks[columnIndex].indexOf(task);
        this.allTasks[columnIndex].splice(taskIndex, 1);
      });
  }

  updateColumnTitle(column: any, newTitle: string) {
    const newColumn = { title: newTitle, order: column.order };
    this.boardService
      .updateColumnTitle(this.boardId, column.id, newColumn)
      .subscribe((res) => {
        this.showColumnTitle(column);
        const index = this.columns.indexOf(column);
        this.columns.splice(index, 1, res);
      });
  }

  ///////////////////////////// Show & Hide ////////////////////////
  showColumnDelete(column: any) {
    const columnDelete = document.querySelector('.column-delete');
    columnDelete?.classList.remove('column-delete-hidden');

    const deleteTitle: any = columnDelete?.querySelector('h6');
    deleteTitle.innerHTML = `Are you sure you want to delete <strong>${column.title}</strong>?`;

    const deleteBtn = columnDelete?.querySelector('.delete-btn');
    deleteBtn?.addEventListener('click', () => {
      this.deleteColumn(column);
      deleteBtn?.replaceWith(deleteBtn.cloneNode(true));
    });

    const cancelBtn = columnDelete?.querySelector('.cancel-btn');
    cancelBtn?.addEventListener('click', () => {
      this.closeColumnDeleteWindow();
      cancelBtn?.replaceWith(cancelBtn.cloneNode(true));
    });
  }

  showTaskDelete(column: any, task: any) {
    const taskDelete = document.querySelector('.task-delete');
    taskDelete?.classList.remove('task-delete-hidden');

    const deleteTitle: any = taskDelete?.querySelector('h6');
    deleteTitle.innerHTML = `Are you sure you want to delete <strong>${task.title}</strong>?`;

    const deleteBtn = taskDelete?.querySelector('.delete-btn');
    deleteBtn?.addEventListener('click', () => {
      this.deleteTask(column, task);
      deleteBtn?.replaceWith(deleteBtn.cloneNode(true));
    });

    const cancelBtn = taskDelete?.querySelector('.cancel-btn');
    cancelBtn?.addEventListener('click', () => {
      this.closeTaskDeleteWindow();
      cancelBtn?.replaceWith(cancelBtn.cloneNode(true));
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

  showTaskCreateWindow(column: any) {
    const taskCreate = document.querySelector('.task-create');
    taskCreate?.classList.remove('task-create-hidden');

    this.currentColumn = column;
  }

  showTaskEditWindow($event: any, column: any, task: any) {
    if (
      $event.target.classList.contains('task') ||
      $event.target.parentNode.classList.contains('task')
    ) {
      const taskUpdate = document.querySelector('.task-update');
      taskUpdate?.classList.remove('task-update-hidden');

      const titleInput: any = taskUpdate?.querySelector('#title');
      titleInput.placeholder = task.title;

      const descriptionInput: any = taskUpdate?.querySelector('#description');
      descriptionInput.placeholder = task.description;

      this.currentColumn = column;
      this.currentTask = task;
    }
  }

  closeTaskCreateWindow() {
    const taskCreate = document.querySelector('.task-create');
    taskCreate?.classList.add('task-create-hidden');

    const createForm = taskCreate?.querySelector('form');
    createForm?.reset();
    this.currentColumn = {};
  }

  closeTaskUpdateWindow() {
    const taskUpdate = document.querySelector('.task-update');
    taskUpdate?.classList.add('task-update-hidden');

    const createForm = taskUpdate?.querySelector('form');
    createForm?.reset();
    this.currentColumn = {};
    this.currentTask = {};
  }

  hideColumnCreate($event: any) {
    if (
      $event.target.classList.contains('column-create') ||
      $event.target.classList.contains('fa-circle-xmark')
    ) {
      this.toggleColumnCreateWindow();
    }
  }

  hideTaskCreate($event: any) {
    if (
      $event.target.classList.contains('task-create') ||
      $event.target.classList.contains('fa-circle-xmark')
    ) {
      this.closeTaskCreateWindow();
    }
  }

  hideTaskUpdate($event: any) {
    if (
      $event.target.classList.contains('task-update') ||
      $event.target.classList.contains('fa-circle-xmark')
    ) {
      this.closeTaskUpdateWindow();
    }
  }

  hideColumnDelete($event: any) {
    if ($event.target.classList.contains('column-delete')) {
      this.closeColumnDeleteWindow();
    }
  }

  hideTaskDelete($event: any) {
    if ($event.target.classList.contains('task-delete')) {
      this.closeTaskDeleteWindow();
    }
  }

  closeColumnDeleteWindow() {
    const columnDelete = document.querySelector('.column-delete');
    columnDelete?.classList.add('column-delete-hidden');

    const deleteBtn = columnDelete?.querySelector('.delete-btn');
    deleteBtn?.replaceWith(deleteBtn.cloneNode(true));

    const cancelBtn = columnDelete?.querySelector('.cancel-btn');
    cancelBtn?.replaceWith(cancelBtn.cloneNode(true));
  }

  closeTaskDeleteWindow() {
    const taskDelete = document.querySelector('.task-delete');
    taskDelete?.classList.add('task-delete-hidden');

    const deleteBtn = taskDelete?.querySelector('.delete-btn');
    deleteBtn?.replaceWith(deleteBtn.cloneNode(true));

    const cancelBtn = taskDelete?.querySelector('.cancel-btn');
    cancelBtn?.replaceWith(cancelBtn.cloneNode(true));
  }

  showColumnTitleEdit(column: any) {
    const order = this.columns.indexOf(column);
    const clickedColumn = document.querySelectorAll('.column')[order];

    const columnTitle = clickedColumn.querySelector('.column-title');
    const columnTitleEdit = clickedColumn.querySelector('.column-title-edit');
    const columnTitleEditInput: any = columnTitleEdit?.querySelector('input');

    columnTitle?.classList.add('column-title-hidden');
    columnTitleEditInput.value = column.title;
    columnTitleEdit?.classList.remove('column-title-edit-hidden');
  }

  showColumnTitle(column: any) {
    const order = this.columns.indexOf(column);
    const clickedColumn = document.querySelectorAll('.column')[order];

    const columnTitle = clickedColumn.querySelector('.column-title');
    const columnTitleEdit = clickedColumn.querySelector('.column-title-edit');
    const columnTitleEditInput: any = columnTitleEdit?.querySelector('input');

    columnTitle?.classList.remove('column-title-hidden');
    columnTitleEditInput.value = '';
    columnTitleEdit?.classList.add('column-title-edit-hidden');
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.boardId = params.get('id');
    });

    this.setBoardTitle();
    this.getAllColumns();
    this.getAllUsers();
  }
}
