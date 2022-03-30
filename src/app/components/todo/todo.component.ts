import { ITask } from './../../model/task';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import {FormGroup,FormBuilder,Validators} from '@angular/forms'
import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  todoForm!:FormGroup;
  tasks:ITask[]=[];
  inProgress:ITask[]=[];
  done:ITask[]=[];
  updateItem!:any;
  isEditEnabled:boolean=false;
  constructor(private fb:FormBuilder) {
    this.tasks=JSON.parse(localStorage.getItem('toDoList')||'')
    this.inProgress =JSON.parse(localStorage.getItem('progressList')||'')
    this.done =JSON.parse(localStorage.getItem('doneList')||'')

   }

  public style: object = {};
  validate(event: ResizeEvent): boolean {
    const MIN_DIMENSIONS_PX: number = 50;
    if (
      event.rectangle.width &&
      event.rectangle.height &&
      (event.rectangle.width < MIN_DIMENSIONS_PX ||
        event.rectangle.height < MIN_DIMENSIONS_PX)
    ) {
      return false;
    }
    return true;
  }

  onResizeEnd(event: ResizeEvent): void {
    this.style = {
      position: 'fixed',
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`
    };
  }

  ngOnInit(): void {
    this.todoForm=this.fb.group({
      item:['',Validators.required]
    })
  }

  onEdit(item:ITask,i:number){
      this.todoForm.controls['item'].setValue(item.description);
      this.updateItem=i;
      this.isEditEnabled=true;
  }

  updateTask(){
    this.tasks[this.updateItem].description=this.todoForm.value.item;
    this.tasks[this.updateItem].done=false;
    this.todoForm.reset();
    this.updateItem=undefined;
    this.isEditEnabled=false;
  }
    addTask(){
      this.tasks.push({
        description:this.todoForm.value.item,
        done:false
      });

      this.todoForm.reset();
    }

    deleteTask(i:number){
      this.tasks.splice(i,1);
    }
    deleteInProgress(i:number){
      this.inProgress.splice(i,1);
    }
    deleteDoneTask(i:number){
      this.done.splice(i,1);
    }

  drop(event: CdkDragDrop<ITask[]>) {
    console.log(this.tasks,this.inProgress,this.done)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    localStorage.setItem('toDoList',JSON.stringify(this.tasks))
    localStorage.setItem('progressList',JSON.stringify(this.inProgress))
    localStorage.setItem('doneList',JSON.stringify(this.done))
}
}
