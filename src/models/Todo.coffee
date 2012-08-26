'use strict'
define "models/Todo", ['can'], (can) ->
  Todo = can.Model

    localStore: (cb)->
      name = 'todomvc-canjs-jquery-requirejs'
      data = JSON.parse(window.localStorage[name] || (window.localStorage[name] = '[]'))
      res = cb.call @, data

      if res isnt false
        can.each data, (todo)->
          delete todo.editing

        window.localStorage[name] = JSON.stringify(data)

    findAll: (params) ->
      def = new can.Deferred()
      @localStore (todos) ->
        instances = []
        self = @
        can.each todos, (todo) ->
          instances.push new self(todo)

        def.resolve data: instances

      def

    destroy: (id) ->
      def = new can.Deferred()
      @localStore (todos) ->
        for todo in todos
          if todo.id is id
            todos.splice _i, 1
            break

        def.resolve {}

      def

    create: (attrs) ->
      def = new can.Deferred()
      self = @
      @localStore (todos) ->
        attrs.id = attrs.id or parseInt(100000 * Math.random(), 10)
        todos.push attrs

      def.resolve id: attrs.id

      def

    update: (id, attrs) ->
      def = new can.Deferred()
      
      @localStore (todos) ->
        for todo in todos
          if todo.id is id
            break
        can.extend todo, attrs

      def.resolve {}
      def

    ,{}

