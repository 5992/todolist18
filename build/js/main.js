(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var DataStorage = /** @class */ (function () {
    function DataStorage() {
        this.storage = window.localStorage;
    }
    DataStorage.prototype.store = function (array, callback) {
        var data = JSON.stringify(array);
        var storestatus = this.storage.setItem('taskdata', data); //successful
        if (storestatus) {
            callback(true);
        }
        else {
            callback(false);
        }
    };
    DataStorage.prototype.read = function (callback) {
        var data = this.storage.getItem('taskdata');
        var array = JSON.parse(data);
        callback(array);
    };
    return DataStorage;
}());
exports.DataStorage = DataStorage;
},{}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
/*
export class ListView{
  list: HTMLElement;
  constructor( listid: string ){
    this.list = document.getElementById('task-list');
  }
  clear(){
    this.list.innerHTML = '';
  }
  render( items:Array<Task> ){
    //clear the view
    //render array using template
    items.forEach( (task) => {
    let id= task.id;
    let name = task.name;
    let status = task.status.toString();
    let item = template.populate(id,name,status);
    // convert our string to HTML Node
    let fragment = document.createRange().createContextualFragment(item);
    this.list.appendChild( fragment );
    });
  }
}*/
var ListView = /** @class */ (function () {
    function ListView(listid) {
        this.list = document.getElementById(listid);
    }
    ListView.prototype.render = function (items) {
        var _this = this;
        items.forEach(function (task) {
            var id = task.id;
            var name = task.name;
            var status = task.status.toString();
            var template = "<li id=\"" + id + "\" data-status=\"" + status + "\">\n                            <div class=\"task-container\">\n                                <div class=\"task-name\">" + name + "</div>\n                            <div class=\"task-buttons\">\n                                <button type=\"button\" data-function=\"status\">&#x2714;</button>\n                                <button type=\"button\" data-function=\"delete\">&times;</button>\n            </div>\n            </div>\n            <li>";
            var fragment = document.createRange().createContextualFragment(template);
            _this.list.appendChild(fragment);
        });
    };
    ListView.prototype.clear = function () {
        this.list.innerHTML = '';
    };
    return ListView;
}());
exports.ListView = ListView;
},{}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var listview_1 = require("../ts/listview");
var task_1 = require("../ts/task");
var taskmanager_1 = require("../ts/taskmanager");
var datastorage_1 = require("../ts/datastorage");
//initialise
var taskarray = [];
var taskstorage = new datastorage_1.DataStorage();
var taskmanager = new taskmanager_1.TaskManager(taskarray);
var listview = new listview_1.ListView('task-list');
window.addEventListener('load', function () {
    var taskdata = taskstorage.read(function (data) {
        if (data.length > 0) {
            data.forEach(function (item) {
                taskarray.push(item);
            });
            listview.clear();
            listview.render(taskarray);
        }
    });
});
//reference to form
var taskform = document.getElementById('task-form');
taskform.addEventListener('submit', function (event) {
    event.preventDefault();
    var input = document.getElementById('task-input');
    var taskname = input.value;
    taskform.reset();
    // console.log(taskname);
    var task = new task_1.Task(taskname);
    taskmanager.add(task);
    listview.clear();
    taskstorage.store(taskarray, function (result) {
        if (result) {
            taskform.reset();
            listview.clear();
            listview.render(taskarray);
        }
        else {
            //error to do with storage
        }
    });
    listview.render(taskarray);
});
//click button, event call this function to find id of button if have
function getParentId(elm) {
    //loop element to find the id using while
    while (elm.parentNode) {
        elm = elm.parentNode;
        var id = elm.getAttribute('id');
        if (id) {
            return id;
        }
    }
    return null;
}
var listelement = document.getElementById('task-list');
listelement.addEventListener('click', function (event) {
    var target = event.target;
    //find a way to get li element cause button inside <li>
    var id = getParentId(event.target);
    //console.log( id );
    //we have 2 button = check which one we clicked
    if (target.getAttribute('data-function') == 'status') { //status button get clicked
        if (id) {
            taskmanager.changeStatus(id, function () {
                taskstorage.store(taskarray, function () {
                    listview.clear();
                    listview.render(taskarray);
                });
            });
        }
    }
    if (target.getAttribute('data-function') == 'delete') {
        if (id) {
            taskmanager["delete"](id, function () {
                taskstorage.store(taskarray, function () {
                    listview.clear();
                    listview.render(taskarray);
                });
            });
        }
    }
});
},{"../ts/datastorage":1,"../ts/listview":2,"../ts/task":4,"../ts/taskmanager":5}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Task = /** @class */ (function () {
    function Task(taskname) {
        this.id = new Date().getTime().toString();
        this.name = taskname;
        this.status = false;
    }
    return Task;
}());
exports.Task = Task;
},{}],5:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var TaskManager = /** @class */ (function () {
    function TaskManager(array) {
        this.tasks = array;
    }
    TaskManager.prototype.add = function (task) {
        this.tasks.push(task);
        this.sort(this.tasks);
    };
    TaskManager.prototype.changeStatus = function (id, callback) {
        this.tasks.forEach(function (task) {
            if (task.id == id) {
                console.log(task.id);
                if (task.status == false) {
                    task.status = true;
                }
                else {
                    task.status = false;
                }
            }
        });
        this.sort(this.tasks);
        callback();
    };
    TaskManager.prototype["delete"] = function (id, callback) {
        var index_to_remove = undefined;
        this.tasks.forEach(function (item, index) {
            if (item.id == id) {
                index_to_remove = index;
            }
        });
        //delete item with specified index
        if (index_to_remove !== undefined) {
            this.tasks.splice(index_to_remove, 1);
        }
        callback();
    };
    TaskManager.prototype.sort = function (tasks) {
        tasks.sort(function (task1, task2) {
            if (task1.status == true && task2.status == false) {
                return 1;
            }
            if (task1.status == false && task2.status == true) {
                return -1;
            }
            if (task1.status == task2.status) {
                return 0;
            }
        });
    };
    return TaskManager;
}());
exports.TaskManager = TaskManager;
},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0cy9kYXRhc3RvcmFnZS50cyIsInRzL2xpc3R2aWV3LnRzIiwidHMvbWFpbi1tb2R1bGUudHMiLCJ0cy90YXNrLnRzIiwidHMvdGFza21hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0VBO0lBRUU7UUFDSSxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7SUFDdkMsQ0FBQztJQUNELDJCQUFLLEdBQUwsVUFBTyxLQUFrQixFQUFFLFFBQVE7UUFDakMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBRSxLQUFLLENBQUMsQ0FBQztRQUNsQyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZO1FBQ3RFLElBQUssV0FBVyxFQUFFO1lBQ2pCLFFBQVEsQ0FBRSxJQUFJLENBQUUsQ0FBQztTQUNqQjthQUNJO1lBQ0gsUUFBUSxDQUFFLEtBQUssQ0FBRSxDQUFDO1NBQ25CO0lBQ0gsQ0FBQztJQUNELDBCQUFJLEdBQUosVUFBTSxRQUFRO1FBQ1YsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBRSxJQUFJLENBQUUsQ0FBQztRQUMvQixRQUFRLENBQUUsS0FBSyxDQUFFLENBQUM7SUFDdEIsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FwQkEsQUFvQkMsSUFBQTtBQXBCWSxrQ0FBVzs7OztBQ0R4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNCRztBQUVIO0lBRUksa0JBQWEsTUFBYTtRQUN0QixJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUUsTUFBTSxDQUFFLENBQUM7SUFDbEQsQ0FB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QUFDO0lBQ0gsa0JBQUM7QUFBRCxDQW5EQSxBQW1EQyxJQUFBO0FBbkRZLGtDQUFXIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHsgVGFzayB9IGZyb20gJy4uL3RzL3Rhc2snO1xyXG5cclxuZXhwb3J0IGNsYXNzIERhdGFTdG9yYWdle1xyXG4gIHN0b3JhZ2U7XHJcbiAgY29uc3RydWN0b3IoKXtcclxuICAgICAgdGhpcy5zdG9yYWdlID0gd2luZG93LmxvY2FsU3RvcmFnZTtcclxuICB9XHJcbiAgc3RvcmUoIGFycmF5OkFycmF5IDxUYXNrPiwgY2FsbGJhY2sgKXtcclxuICAgIGxldCBkYXRhID0gSlNPTi5zdHJpbmdpZnkoIGFycmF5KTtcclxuICAgIGxldCBzdG9yZXN0YXR1cyA9IHRoaXMuc3RvcmFnZS5zZXRJdGVtKCd0YXNrZGF0YScsIGRhdGEpOyAvL3N1Y2Nlc3NmdWxcclxuICAgIGlmICggc3RvcmVzdGF0dXMgKXtcclxuICAgICBjYWxsYmFjayggdHJ1ZSApO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGNhbGxiYWNrKCBmYWxzZSApO1xyXG4gICAgfVxyXG4gIH1cclxuICByZWFkKCBjYWxsYmFjayApe1xyXG4gICAgICBsZXQgZGF0YSA9IHRoaXMuc3RvcmFnZS5nZXRJdGVtKCd0YXNrZGF0YScpO1xyXG4gICAgICBsZXQgYXJyYXkgPSBKU09OLnBhcnNlKCBkYXRhICk7XHJcbiAgICAgIGNhbGxiYWNrKCBhcnJheSApO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBUYXNrIH0gZnJvbSAnLi4vdHMvdGFzayc7XHJcbi8qXHJcbmV4cG9ydCBjbGFzcyBMaXN0Vmlld3tcclxuICBsaXN0OiBIVE1MRWxlbWVudDtcclxuICBjb25zdHJ1Y3RvciggbGlzdGlkOiBzdHJpbmcgKXtcclxuICAgIHRoaXMubGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWxpc3QnKTtcclxuICB9XHJcbiAgY2xlYXIoKXtcclxuICAgIHRoaXMubGlzdC5pbm5lckhUTUwgPSAnJztcclxuICB9XHJcbiAgcmVuZGVyKCBpdGVtczpBcnJheTxUYXNrPiApe1xyXG4gICAgLy9jbGVhciB0aGUgdmlld1xyXG4gICAgLy9yZW5kZXIgYXJyYXkgdXNpbmcgdGVtcGxhdGVcclxuICAgIGl0ZW1zLmZvckVhY2goICh0YXNrKSA9PiB7XHJcbiAgICBsZXQgaWQ9IHRhc2suaWQ7XHJcbiAgICBsZXQgbmFtZSA9IHRhc2submFtZTtcclxuICAgIGxldCBzdGF0dXMgPSB0YXNrLnN0YXR1cy50b1N0cmluZygpO1xyXG4gICAgbGV0IGl0ZW0gPSB0ZW1wbGF0ZS5wb3B1bGF0ZShpZCxuYW1lLHN0YXR1cyk7XHJcbiAgICAvLyBjb252ZXJ0IG91ciBzdHJpbmcgdG8gSFRNTCBOb2RlXHJcbiAgICBsZXQgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChpdGVtKTtcclxuICAgIHRoaXMubGlzdC5hcHBlbmRDaGlsZCggZnJhZ21lbnQgKTtcclxuICAgIH0pO1xyXG4gIH1cclxufSovXHJcblxyXG5leHBvcnQgY2xhc3MgTGlzdFZpZXd7XHJcbiAgICBsaXN0OkhUTUxFbGVtZW50O1xyXG4gICAgY29uc3RydWN0b3IoIGxpc3RpZDpzdHJpbmcgKXtcclxuICAgICAgICB0aGlzLmxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggbGlzdGlkICk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoIGl0ZW1zOkFycmF5PFRhc2s+ICl7XHJcbiAgICAgICAgaXRlbXMuZm9yRWFjaCgodGFzaykgPT4ge1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0YXNrLmlkO1xyXG4gICAgICAgICAgICBsZXQgbmFtZSA9IHRhc2submFtZTtcclxuICAgICAgICAgICAgbGV0IHN0YXR1cyA9IHRhc2suc3RhdHVzLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSA9IGA8bGkgaWQ9XCIke2lkfVwiIGRhdGEtc3RhdHVzPVwiJHtzdGF0dXN9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFzay1jb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGFzay1uYW1lXCI+JHtuYW1lfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhc2stYnV0dG9uc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtZnVuY3Rpb249XCJzdGF0dXNcIj4mI3gyNzE0OzwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtZnVuY3Rpb249XCJkZWxldGVcIj4mdGltZXM7PC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGxpPmA7XHJcbiAgICAgICAgICAgIGxldCBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KCB0ZW1wbGF0ZSApO1xyXG4gICAgICAgICAgICB0aGlzLmxpc3QuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgY2xlYXIoKXtcclxuICAgICAgICB0aGlzLmxpc3QuaW5uZXJIVE1MID0nJztcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBMaXN0VmlldyB9IGZyb20gJy4uL3RzL2xpc3R2aWV3JztcclxuaW1wb3J0IHsgVGFzayB9IGZyb20gJy4uL3RzL3Rhc2snO1xyXG5pbXBvcnQgeyBUYXNrTWFuYWdlciB9IGZyb20gJy4uL3RzL3Rhc2ttYW5hZ2VyJztcclxuaW1wb3J0IHsgRGF0YVN0b3JhZ2UgfSBmcm9tICcuLi90cy9kYXRhc3RvcmFnZSc7XHJcblxyXG4vL2luaXRpYWxpc2VcclxudmFyIHRhc2thcnJheTpBcnJheTxhbnk+ID0gW107XHJcbnZhciB0YXNrc3RvcmFnZSA9IG5ldyBEYXRhU3RvcmFnZSgpO1xyXG52YXIgdGFza21hbmFnZXIgPSBuZXcgVGFza01hbmFnZXIodGFza2FycmF5KTtcclxudmFyIGxpc3R2aWV3ID0gbmV3IExpc3RWaWV3KCd0YXNrLWxpc3QnKTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICBsZXQgdGFza2RhdGEgPSB0YXNrc3RvcmFnZS5yZWFkKCAoZGF0YSkgPT4ge1xyXG4gICAgIGlmIChkYXRhLmxlbmd0aCA+IDApe1xyXG4gICAgICAgZGF0YS5mb3JFYWNoKCAoaXRlbSkgPT4ge1xyXG4gICAgICAgICB0YXNrYXJyYXkucHVzaChpdGVtKTtcclxuICAgICAgIH0pO1xyXG4gICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcclxuICAgICAgIGxpc3R2aWV3LnJlbmRlciggdGFza2FycmF5ICk7XHJcbiAgICAgfVxyXG4gICB9KTtcclxufSk7XHJcblxyXG4vL3JlZmVyZW5jZSB0byBmb3JtXHJcbmNvbnN0IHRhc2tmb3JtID0gKDxIVE1MRm9ybUVsZW1lbnQ+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWZvcm0nKSk7XHJcbnRhc2tmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsKCBldmVudDogRXZlbnQpID0+IHtcclxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5jb25zdCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0YXNrLWlucHV0Jyk7XHJcbiAgbGV0IHRhc2tuYW1lID0gKDxIVE1MSW5wdXRFbGVtZW50PmlucHV0KS52YWx1ZTtcclxuICAgIHRhc2tmb3JtLnJlc2V0KCk7XHJcbiAvLyBjb25zb2xlLmxvZyh0YXNrbmFtZSk7XHJcbiAgICBsZXQgdGFzayA9IG5ldyBUYXNrKCB0YXNrbmFtZSApO1xyXG4gICAgdGFza21hbmFnZXIuYWRkKCB0YXNrICk7XHJcbiAgICBsaXN0dmlldy5jbGVhcigpO1xyXG4gICAgdGFza3N0b3JhZ2Uuc3RvcmUodGFza2FycmF5LCAocmVzdWx0KSA9PiB7XHJcbiAgICAgIGlmKHJlc3VsdCl7XHJcbiAgICAgICAgdGFza2Zvcm0ucmVzZXQoKTtcclxuICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xyXG4gICAgICAgIGxpc3R2aWV3LnJlbmRlcih0YXNrYXJyYXkpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2V7XHJcbiAgICAgICAgICAvL2Vycm9yIHRvIGRvIHdpdGggc3RvcmFnZVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICBsaXN0dmlldy5yZW5kZXIodGFza2FycmF5KTtcclxufSk7XHJcblxyXG4vL2NsaWNrIGJ1dHRvbiwgZXZlbnQgY2FsbCB0aGlzIGZ1bmN0aW9uIHRvIGZpbmQgaWQgb2YgYnV0dG9uIGlmIGhhdmVcclxuZnVuY3Rpb24gZ2V0UGFyZW50SWQoZWxtOk5vZGUpe1xyXG4gIC8vbG9vcCBlbGVtZW50IHRvIGZpbmQgdGhlIGlkIHVzaW5nIHdoaWxlXHJcbiAgd2hpbGUoZWxtLnBhcmVudE5vZGUpe1xyXG4gICAgZWxtID0gZWxtLnBhcmVudE5vZGU7XHJcbiAgICBsZXQgaWQ6c3RyaW5nID0gKDxIVE1MRWxlbWVudD4gZWxtKS5nZXRBdHRyaWJ1dGUoJ2lkJyk7XHJcbiAgICBpZiggaWQgKXtcclxuICAgICAgcmV0dXJuIGlkO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuY29uc3QgbGlzdGVsZW1lbnQ6SFRNTEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGFzay1saXN0Jyk7XHJcbmxpc3RlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCBldmVudDogRXZlbnQpID0+IHtcclxuICBsZXQgdGFyZ2V0OkhUTUxFbGVtZW50ID0gPEhUTUxFbGVtZW50PiBldmVudC50YXJnZXQ7XHJcbiAgLy9maW5kIGEgd2F5IHRvIGdldCBsaSBlbGVtZW50IGNhdXNlIGJ1dHRvbiBpbnNpZGUgPGxpPlxyXG4gIGxldCBpZCA9IGdldFBhcmVudElkKCA8Tm9kZT4gZXZlbnQudGFyZ2V0KTtcclxuICAvL2NvbnNvbGUubG9nKCBpZCApO1xyXG4gIC8vd2UgaGF2ZSAyIGJ1dHRvbiA9IGNoZWNrIHdoaWNoIG9uZSB3ZSBjbGlja2VkXHJcbiAgaWYgKCB0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWZ1bmN0aW9uJykgPT0gJ3N0YXR1cycpey8vc3RhdHVzIGJ1dHRvbiBnZXQgY2xpY2tlZFxyXG4gICAgaWYoIGlkICl7XHJcbiAgICAgIHRhc2ttYW5hZ2VyLmNoYW5nZVN0YXR1cyggaWQsICgpID0+IHsvL2NhbGxiYWNrIHRlbGwgdGhlIHN5c3RlbSBjaGFuZ2Ugc3RhdHVzIHdoZW4gc3RhdHVzIGNoYW5nZWRcclxuICAgICAgICB0YXNrc3RvcmFnZS5zdG9yZSggdGFza2FycmF5LCAoKSA9PiB7XHJcbiAgICAgICAgICBsaXN0dmlldy5jbGVhcigpO1xyXG4gICAgICAgICAgbGlzdHZpZXcucmVuZGVyKCB0YXNrYXJyYXkgKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSApO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAodGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1mdW5jdGlvbicpID09ICdkZWxldGUnKXtcclxuICAgIGlmKCBpZCApe1xyXG4gICAgICB0YXNrbWFuYWdlci5kZWxldGUoIGlkLCAoKSA9PiB7XHJcbiAgICAgICAgdGFza3N0b3JhZ2Uuc3RvcmUodGFza2FycmF5LCAoKT0+e1xyXG4gICAgICAgICAgbGlzdHZpZXcuY2xlYXIoKTtcclxuICAgICAgICAgIGxpc3R2aWV3LnJlbmRlciggdGFza2FycmF5ICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxufSk7XHJcbiIsImV4cG9ydCBjbGFzcyBUYXNre1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgbmFtZTogc3RyaW5nO1xyXG4gIHN0YXR1czogYm9vbGVhbjtcclxuICBjb25zdHJ1Y3Rvcih0YXNrbmFtZTogc3RyaW5nKXtcclxuICAgIHRoaXMuaWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKS50b1N0cmluZygpO1xyXG4gICAgdGhpcy5uYW1lID0gdGFza25hbWU7XHJcbiAgICB0aGlzLnN0YXR1cyA9IGZhbHNlO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBUYXNrIH0gZnJvbSAnLi4vdHMvdGFzayc7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFRhc2tNYW5hZ2VyIHtcclxuICB0YXNrczogQXJyYXk8VGFzaz47XHJcblxyXG4gIGNvbnN0cnVjdG9yKCBhcnJheTogQXJyYXk8VGFzaz4pe1xyXG4gICAgdGhpcy50YXNrcyA9IGFycmF5O1xyXG4gIH1cclxuICBhZGQoIHRhc2s6IFRhc2sgKXtcclxuICAgIHRoaXMudGFza3MucHVzaCh0YXNrKTtcclxuICAgIHRoaXMuc29ydCggdGhpcy50YXNrcyApO1xyXG4gIH1cclxuICBjaGFuZ2VTdGF0dXMoIGlkOlN0cmluZywgY2FsbGJhY2sgKTp2b2lke1xyXG4gIHRoaXMudGFza3MuZm9yRWFjaCgodGFzazpUYXNrKSA9PiB7XHJcbiAgICAgIGlmKHRhc2suaWQgPT0gaWQpe1xyXG4gICAgICAgICAgY29uc29sZS5sb2coIHRhc2suaWQgKTtcclxuICAgICAgICAgIGlmKHRhc2suc3RhdHVzID09IGZhbHNlICl7XHJcbiAgICAgICAgICAgICAgdGFzay5zdGF0dXMgPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICB0YXNrLnN0YXR1cyA9IGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgfSk7XHJcbiAgdGhpcy5zb3J0KCB0aGlzLnRhc2tzICk7XHJcbiAgY2FsbGJhY2soKTtcclxuICB9XHJcbiAgZGVsZXRlKCBpZDpzdHJpbmcsIGNhbGxiYWNrICl7XHJcbiAgICBsZXQgaW5kZXhfdG9fcmVtb3ZlOiBudW1iZXIgPSB1bmRlZmluZWQ7XHJcbiAgICB0aGlzLnRhc2tzLmZvckVhY2goIChpdGVtOiBUYXNrLCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLmlkID09IGlkICl7XHJcbiAgICAgICAgaW5kZXhfdG9fcmVtb3ZlID0gaW5kZXg7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgLy9kZWxldGUgaXRlbSB3aXRoIHNwZWNpZmllZCBpbmRleFxyXG4gICAgaWYgKCBpbmRleF90b19yZW1vdmUgIT09IHVuZGVmaW5lZCApe1xyXG4gICAgICB0aGlzLnRhc2tzLnNwbGljZSAoaW5kZXhfdG9fcmVtb3ZlLCAxKTtcclxuICAgIH1cclxuICAgIGNhbGxiYWNrKCk7XHJcbiAgfVxyXG4gIHNvcnQoIHRhc2tzOiBBcnJheTxUYXNrPil7XHJcbiAgICB0YXNrcy5zb3J0KCh0YXNrMSwgdGFzazIpID0+IHtcclxuICAgICAgaWYgKCB0YXNrMS5zdGF0dXMgPT0gdHJ1ZSAmJiB0YXNrMi5zdGF0dXMgPT0gZmFsc2Upe1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICggdGFzazEuc3RhdHVzID09IGZhbHNlICYmIHRhc2syLnN0YXR1cyA9PSB0cnVlKXtcclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCB0YXNrMS5zdGF0dXMgPT0gdGFzazIuc3RhdHVzICl7XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG59XHJcbiJdfQ==
