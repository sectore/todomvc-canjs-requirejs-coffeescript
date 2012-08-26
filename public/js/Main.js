'use strict';

require.config({
  shim: {
    'can': {
      exports: 'can'
    }
  },
  paths: {
    jquery: 'libs/jquery-1.8.0.min',
    can: 'libs/can.jquery-1.0.7',
    json: 'libs/json2'
  }
});

require(['jquery', 'models/Todo', 'models/TodoList', 'controllers/Todos'], function($, Todo, TodoList, Todos) {
  return $(function() {
    console.log('jQuery version: ' + $().jquery);
    return Todo.findAll({}, function(todos) {
      return new Todos('#todoapp', {
        todos: todos
      });
    });
  });
});
