


define('models/Todo',['can'], function(can) {
  var Todo;
  return Todo = can.Model({
    localStore: function(cb) {
      var data, name, res;
      name = 'todomvc-canjs-jquery-requirejs';
      data = JSON.parse(window.localStorage[name] || (window.localStorage[name] = '[]'));
      res = cb.call(this, data);
      if (res !== false) {
        can.each(data, function(todo) {
          return delete todo.editing;
        });
        return window.localStorage[name] = JSON.stringify(data);
      }
    },
    findAll: function(params) {
      var def;
      def = new can.Deferred();
      this.localStore(function(todos) {
        var instances, self;
        instances = [];
        self = this;
        can.each(todos, function(todo) {
          return instances.push(new self(todo));
        });
        return def.resolve({
          data: instances
        });
      });
      return def;
    },
    destroy: function(id) {
      var def;
      def = new can.Deferred();
      this.localStore(function(todos) {
        var todo, _i, _len;
        for (_i = 0, _len = todos.length; _i < _len; _i++) {
          todo = todos[_i];
          if (todo.id === id) {
            todos.splice(_i, 1);
            break;
          }
        }
        return def.resolve({});
      });
      return def;
    },
    create: function(attrs) {
      var def, self;
      def = new can.Deferred();
      self = this;
      this.localStore(function(todos) {
        attrs.id = attrs.id || parseInt(100000 * Math.random(), 10);
        return todos.push(attrs);
      });
      def.resolve({
        id: attrs.id
      });
      return def;
    },
    update: function(id, attrs) {
      var def;
      def = new can.Deferred();
      this.localStore(function(todos) {
        var todo, _i, _len;
        for (_i = 0, _len = todos.length; _i < _len; _i++) {
          todo = todos[_i];
          if (todo.id === id) {
            break;
          }
        }
        return can.extend(todo, attrs);
      });
      def.resolve({});
      return def;
    }
  }, {});
});



define('models/TodoList',['can', 'models/Todo'], function(can, Todo) {
  return Todo.List = can.Model.List({
    completed: function() {
      var counter;
      this.attr("length");
      counter = 0;
      this.each(function(todo) {
        return counter += todo.attr("complete") ? 1 : 0;
      });
      return counter;
    },
    remaining: function() {
      return this.attr("length") - this.completed();
    },
    allComplete: function() {
      return this.attr("length") === this.completed();
    }
  });
});



define('controllers/Todos',['can', 'models/Todo'], function(can, Todo) {
  var Todos;
  return Todos = can.Control({
    init: function() {
      var self;
      self = this;
      this.element.append(can.view("../tmpl/todo", {
        todos: this.options.todos
      }));
      $("#new-todo").val("").focus();
      return Todo.bind('created', function(ev, todo) {
        return self.options.todos.push(todo);
      });
    },
    "#new-todo keyup": function(el, ev) {
      if (ev.keyCode === 13) {
        return new Todo({
          text: el.val(),
          complete: false
        }).save(function() {
          return el.val("");
        });
      }
    },
    ".todo dblclick": function(el, ev) {
      return el.data("todo").attr("editing", true).save(function() {
        return el.children(".edit").focus();
      });
    },
    updateTodo: function(el) {
      return el.closest(".todo").data("todo").attr({
        editing: false,
        text: el.val()
      }).save();
    },
    ".todo .edit keyup": function(el, ev) {
      if (ev.keyCode === 13) {
        return this.updateTodo(el);
      }
    },
    ".todo .edit focusout": function(el, ev) {
      return this.updateTodo(el);
    },
    ".todo .toggle click": function(el, ev) {
      return el.closest(".todo").data("todo").attr("complete", el.is(":checked")).save();
    },
    ".todo .destroy click": function(el) {
      return el.closest(".todo").data("todo").destroy();
    },
    "#toggle-all click": function(el, ev) {
      var toggle;
      toggle = el.prop("checked");
      return can.each(this.options.todos, function(todo) {
        return todo.attr("complete", toggle).save();
      });
    },
    "#clear-completed click": function() {
      var i, todo, _i, _ref, _results;
      _results = [];
      for (i = _i = _ref = this.options.todos.length - 1; _i >= 0; i = _i += -1) {
        todo = this.options.todos[i];
        if (todo.attr('complete')) {
          _results.push(todo.destroy());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  });
});



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

define("Main", function(){});
