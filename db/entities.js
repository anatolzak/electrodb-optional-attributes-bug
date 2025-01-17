const { Entity } = require('electrodb');

module.exports = {
  User: new Entity({
    model: {
      entity: 'user',
      version: '1',
      service: 'app',
    },
    attributes: {
      id: { type: 'string', required: true, readOnly: true },
      name: { type: 'string' },
    },
    indexes: {
      byId: {
        pk: { field: 'pk', composite: ['id'] },
        sk: { field: 'sk', composite: [] },
      },
    },
  }),
};
