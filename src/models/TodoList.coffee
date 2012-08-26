'use strict'
define "models/TodoList", ['can', 'models/Todo'], (can, Todo) ->
  Todo.List = can.Model.List

    completed: ->
      
      # Ensure this triggers on length change
      @attr "length"
      counter = 0
      @each (todo) ->
        counter += if todo.attr("complete") then 1 else 0

      counter

    remaining: ->
      @attr("length") - @completed()

    allComplete: ->
      @attr("length") is @completed()