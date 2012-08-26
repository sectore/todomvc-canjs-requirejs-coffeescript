'use strict';

define("controllers/Todos", ['can', 'models/Todo'], function(can, Todo) {
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
