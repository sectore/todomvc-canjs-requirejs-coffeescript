'use strict';

define(['can'], function(can) {
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
