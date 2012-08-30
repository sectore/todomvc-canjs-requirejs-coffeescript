'use strict';

define(['can', 'models/Todo'], function(can, Todo) {
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
