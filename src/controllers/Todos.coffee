'use strict'
define ['can', 'models/Todo'], (can, Todo) ->

  Todos = can.Control

    # Initialize the Todos list
    init: ->

      self = @
      
      # Render the Todos
      @element.append can.view("../tmpl/todo", todos: @options.todos)
      # Clear the new todo field
      $("#new-todo").val("").focus()

      # Workaround:
      # Binding Todo 'created', because '{Todo} created' wont work
      Todo.bind 'created', (ev, todo) ->
        self.options.todos.push todo

    # Listen for when a new Todo has been entered
    "#new-todo keyup": (el, ev) ->
      if ev.keyCode is 13
        new Todo(
          text: el.val()
          complete: false
        ).save ->
          el.val ""

    # Handle a newly created Todo
    # "{Todo} created": (list, ev, item) ->
    #   @options.todos.push item
    
    # Listen for editing a Todo
    ".todo dblclick": (el, ev) ->
      el.data("todo").attr("editing", true).save ->
        el.children(".edit").focus()

    # Update a todo
    updateTodo: (el) ->
      el.closest(".todo").data("todo").attr(
        editing: false
        text: el.val()
      ).save()
    
    # Listen for an edited Todo
    ".todo .edit keyup": (el, ev) ->
      @updateTodo el  if ev.keyCode is 13

    ".todo .edit focusout": (el, ev) ->
      @updateTodo el

    
    # Listen for the toggled completion of a Todo
    ".todo .toggle click": (el, ev) ->
      el.closest(".todo").data("todo").attr("complete", el.is(":checked")).save()

    # Listen for a removed Todo
    ".todo .destroy click": (el) ->
      el.closest(".todo").data("todo").destroy()

    # Listen for toggle all completed Todos
    "#toggle-all click": (el, ev) ->
      toggle = el.prop("checked")
      can.each @options.todos, (todo) ->
        todo.attr("complete", toggle).save()

    # Listen for removing all completed Todos
    "#clear-completed click": ->
      for i in [@options.todos.length - 1..0] by -1
        todo = @options.todos[i]
        todo.destroy() if todo.attr('complete')