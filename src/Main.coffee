'use strict'
require.config
  # The shim config allows us to configure dependencies for
  # scripts that do not call define() to register a module
  shim:
    'can':
      exports: 'can'

  paths:
    jquery: 'libs/jquery-1.8.0.min',
    can: 'libs/can.jquery-1.0.7',
    json: 'libs/json2'

require([
  'jquery',
  'models/Todo',
  'models/TodoList',
  'controllers/Todos'
], ($, Todo, TodoList, Todos) ->
  $ () ->
    console.log 'jQuery version: ' + $().jquery


    Todo.findAll {}, (todos)->
      new Todos '#todoapp', todos: todos
)