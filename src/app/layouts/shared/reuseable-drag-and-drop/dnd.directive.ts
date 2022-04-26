import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {

  @HostBinding('class.fileover') fileOver: boolean = false;

  @Output() fileDropped = new EventEmitter<any>();

  @HostListener('dragover', ['$event'])
  onDragOver(evt: any){
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
    console.log('Drag Over');
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event'])
  public onDragLeave(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();

    console.log('Drag Leave');
  }

  // Drop listener
  @HostListener('drop', ['$event'])
  public ondrop(evt: any){
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    const files = evt.dataTransfer.files;
    console.error(typeof(files) + '\n' + JSON.stringify(files));
    if (files.length > 0) {
      this.fileDropped.emit(files);
      console.log(`You dropped ${files.length} files.`);
    }
  }

  constructor() { }

}