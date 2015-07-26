var myApp = angular.module('TodoWithCalendar', ['pickadate', 'ngResource']);

myApp.factory('global', ['$rootScope', function($rootScope){
  var share = {
    todos: [],
    todo: {},
    emitTodo : function(todo){
      $rootScope.$broadcast('updateTodo', todo);
    },
    showModal: function(todo){
      this.emitTodo(todo);
      $('#todos__edit-modal').openModal();
    }
  };
  return share;
}]);

myApp.factory('TodoModel', ['$resource', function($resource){
  return $resource('api.php', {}, {
    update: { method: 'PATCH' }
  });
}]);

myApp.controller('Todo', ['$scope', 'global', 'TodoModel', function($scope, global, TodoModel) {
  $scope.todos = global.todos;
  $scope.date = new Date();
  $scope.mode = 'all';
  $scope.todo = global.todo;

  var todos = TodoModel.query(function(){
    _.each(todos, function(todo){
      if(todo.due_date) todo.due_date = new Date(todo.due_date).getTime();
      if(todo.create_date) todo.create_date = new Date(todo.create_date).getTime();
      $scope.todos.push(todo);
    });
  });

  $scope.deleteCompleteTodo = function(){
    var removes = [];
    _.each($scope.todos, function(todo, index){
      if(todo.complete){
        removes.push(index);
        TodoModel.delete(todo);
      }
    });
    _.each(removes, function(index, i){
        $scope.todos.splice(index - i, 1);
    });
  };

  $scope.changeTodo = function(todo){
    TodoModel.update(todo);
  };

  $scope.submit = function() {
    if(!this.todoText) return;
    var title = this.todoText;
    var todo = {
      id: 0,
      title: title,
      create_date: new Date().getTime(),
      due_date: null,
      complete: false
    };
    todo = TodoModel.save(todo, function(){
      $scope.todos.push(todo);
      $scope.todoText = '';
    });
  };

  $scope.show = function(mode){
    this.mode = mode;
  };

  $scope.taskFilter = function(todo){
    switch($scope.mode){
      case 'complete':
        return todo.complete;
      case 'uncomplete':
        return !todo.complete;
      case 'all':
        return true;
      default:
        return true;
    }
  };

  $scope.showModal = function(todo){
    global.showModal(todo);
  };
}]);

myApp.controller('TodoModal', ['$scope', 'global', 'TodoModel', function($scope, global, TodoModel){
  $scope.todos = global.todos;
  $scope.todo = global.todo;
  $scope.originalTodo = null;
  $scope.due_date = new Date();
  $scope.$on('updateTodo', function(event, todo){
    $scope.originalTodo = todo;
    $scope.todo = angular.copy(todo);
  });
  $scope.submit = function(){
    if($scope.todo.due_date){
      var date = $scope.todo.due_date;
      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();
      $scope.todo.due_date = new Date(year, month, day, 0).getTime();
    }
    angular.extend($scope.originalTodo, $scope.todo);
    TodoModel.update($scope.todo);
  };

  $scope.delete = function(){
    TodoModel.delete($scope.originalTodo);
    var index = global.todos.indexOf($scope.originalTodo);
    if (index > -1) {
      global.todos.splice(index, 1);
    }
  };
}]);

myApp.controller('Calendar', ['$scope', 'global', function($scope, global){
  $scope.todos = global.todos;
  var today = new Date();
  var month =  today.getMonth();
  var year = today.getFullYear();
  var date = today.getDate();
  $scope.today =  new Date(year, month, date, 0);
  $scope.viewDate = new Date(year, month, date, 0);
  $scope.weeks = generateCalendar(year);
  $scope.$watch('todos', function(newVal){
    $scope.weeks = generateCalendar();
  }, true);

  function generateCalendar(){
    var weeks = [];
    var first = new Date(year, month, 1);
    var last = new Date(year, month + 1, 0);
    var date = first.getDate();
    var blank = first.getDay();
    var week = [];

    for(var i = 0; blank > i; i++){
      week.push({});
    }
    var lastDay = last.getDate();
    var specificDateTime;
    function taskFilter(todo){
      return todo.due_date && todo.due_date == specificDateTime.getTime();
    }
    for(i = 1; lastDay >= i; i++){
      if((i + blank - 1) % 7 === 0){
        weeks.push(week);
        week = [];
      }
      specificDateTime =  new Date(year, month, i, 0);
      var dayObj = {
        date: date++,
        tasks: [],
        full: specificDateTime
      };
      dayObj.tasks = _.filter($scope.todos, taskFilter);
      week.push(dayObj);
    }
    if(week.length > 0) weeks.push(week);
    return weeks;
  }

  $scope.next = function(){
    $scope.weeks = generateCalendar(month++);
    updateViewDate();
  };
  function updateViewDate(){
    $scope.viewDate = new Date(year, month, 1);
  }
  $scope.prev = function(){
    $scope.weeks = generateCalendar(month--);
    updateViewDate();
  };

  $scope.showModal = function(todo){
    global.showModal(todo);
  };
}]);

$(function(){
  $('.modal-trigger').leanModal();
});