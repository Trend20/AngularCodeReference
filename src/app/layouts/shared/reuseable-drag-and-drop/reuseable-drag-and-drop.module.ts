import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragAndDropComponent } from './drag-and-drop/drag-and-drop.component';
import { ProgressComponent } from './progress/progress.component';
import { DndDirective } from './dnd.directive';



@NgModule({
  declarations: [
    DragAndDropComponent,
    ProgressComponent,
    DndDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [DragAndDropComponent]
})
export class ReuseableDragAndDropModule { }
