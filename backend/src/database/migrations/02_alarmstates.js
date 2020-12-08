exports.up = function(knex){
    return knex.schema.createTable('alarmstates', function(table){
        table.string('id').primary();
        table.string('state').notNullable();
        table.string('user_id').notNullable();
        
        table.foreign('id').references('id').inTable('alarms');
        table.foreign('user_id').references('id').inTable('users');
    })
}

exports.down = function(knex){
    return knex.schema.dropTable('alarmstates')
}