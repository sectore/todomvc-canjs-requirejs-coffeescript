'use strict';

require.config({
  paths: {
    jquery: ['http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min', 'libs/jquery-1.8.0.min'],
    json: ['http://cdnjs.cloudflare.com/ajax/libs/json2/20110223/json2', 'libs/json2'],
    can: ['http://canjs.us/release/1.0.7/can.jquery', 'libs/can.jquery-1.0.7']
  },
  waitSeconds: 15
});

require(['jquery', 'json', 'can', 'models/Todo', 'models/TodoList', 'controllers/Todos'], function($, can, json, Todo, TodoList, Todos) {
  return $(function() {
    return Todo.findAll({}, function(todos) {
      return new Todos('#todoapp', {
        todos: todos
      });
    });
  });
});
