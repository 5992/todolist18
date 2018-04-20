class Task{
  id: string;
  name: string;
  status: boolean;
  constructor(taskname: string){
    this.id = new Date().getTime().toString(); //create new date object
    this.name = taskname;
    this.status = false;
  }
}

class TaskManager{
tasks : Array<Task>;
constructor( array: Array<Task>){
this.tasks = array;
}
add( task: Task ){
this.tasks.push(task);
this.sort( this.tasks );
}
    changeStatus( id:String, callback ):void{
    this.tasks.forEach((task:Task) => {
        if(task.id == id){
            console.log( task.id );
            if(task.status == false ){
                task.status = true;
            }
            else{
                task.status = false;
            }
        }
    });
    callback();
    }
    delete( id:string, callback){
        let index_to_remove:number = undefined;
        this.tasks.forEach((item:Task, index:number)=>{
           if(item.id == id){
               index_to_remove = index;
           }
        });
        //delete the item with specifield index
        if(index_to_remove !== undefined){
            this.tasks.splice(index_to_remove, 1);
        }
        this.sort( this.tasks );
        callback();
    }
    sort( tasks: Array<Task>){
      tasks.sort((task1, task2) => {
        if ( task1.status == true && task2.status == false){
          return 1;
        }
        if ( task1.status == false && task2.status == true){
          return -1;
        }
        if ( task1.status == task2.status ){
          return 0;
        }
      });
    }
}

class ListView{
    list:HTMLElement;
    constructor( listid:string ){
        this.list = document.getElementById( listid );
    }
    render( items:Array<Task> ){
        items.forEach((task) => {
            let id = task.id;
            let name = task.name;
            let status = task.status;
            let template = `<li id="${id}" data-status="${status}">
                            <div class="task-container">
                                <div class="task-name">${name}</div>
                            <div class="task-buttons">
                                <button type="button" data-function="status">&#x2714;</button>
                                <button type="button" data-function-"delete">&times;</button>
            </div>
            </div>
            <li>`;
            let fragment = document.createRange().createContextualFragment( template );
            this.list.appendChild(fragment);
        });
    }
    clear(){
        this.list.innerHTML ='';
    }
}

class DataStorage{
  storage;
  constructor(){
      this.storage = window.localStorage;
  }
  store( array:Array <Task>, callback ){
      let data = JSON.stringify( array);
      let storestatus = this.storage.setItem('taskdata', data);
      if(storestatus){
          callback(true);
      }
      else{
          callback(false);
      }
  }
  read(callback){
      let data = this.storage.getItem('taskdata');
      let array = JSON.parse(data);
      callback(array);
  }
}

//initialise
var taskarray:Array<any> = [];
var taskstorage = new DataStorage();
var taskmanager = new TaskManager(taskarray);
var listview = new ListView('task-list');

window.addEventListener('load', () => {
   let taskdata = taskstorage.read((data) => {
    if(data.length > 0){
        data.forEach((item) => {
           taskarray.push(item);
        });
        listview.clear();
        listview.render(taskarray);
    }
   });
    //taskdata.forEach((item) => {taskarray.push(item);});
    //listview.render(taskarray);
});


//reference to form
const taskform = (<HTMLFormElement> document.getElementById('task-form'));
taskform.addEventListener('submit',( event: Event) => {
  event.preventDefault();
const input = document.getElementById('task-input');
  let taskname = (<HTMLInputElement>input).value;
    taskform.reset();
 // console.log(taskname);
    let task = new Task( taskname );
    taskmanager.add( task );
    listview.clear();
    taskstorage.store(taskarray, (result) => {
      if(result){
        taskform.reset();
        listview.clear();
        listview.render(taskarray);
      }
      else{
          //error to do with storage
      }
    });
  listview.render(taskarray);
});

function getParentId(elm:Node){
  while(elm.parentNode){
    elm = elm.parentNode;
    let id:string = (<HTMLElement> elm).getAttribute('id');
    if(id){
        return id;
    }
  }
  return null;
}

const listelement:HTMLElement = document.getElementById('task-list');
listelement.addEventListener('click',(event:Event) => {
  let target:HTMLElement = <HTMLElement> event.target;
  let id = getParentId( <Node> event.target);
    console.log(id);
  if(target.getAttribute('data-function') == 'status'){
      if(id){
          taskmanager.changeStatus(id, () => {
              taskstorage.store(taskarray, () =>{
              listview.clear();
              listview.render(taskarray);
              });
              //listview.clear();
             // listview.render(taskarray);
          });
      }
  }
  if(target.getAttribute('data-function') == 'delete'){
      if(id){
          taskmanager.delete(id,() => {
            taskstorage.store(taskarray,()=>{
              listview.clear();
              listview.render( taskarray );
            });
          });
      }
  }
});
