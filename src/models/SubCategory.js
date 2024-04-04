const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CategoryMenu


// Define schema for column item
const ColumnItemSchema = new Schema({
    id: Number,
    path: String,
    label: String,
    columnItemItems: [{
        id: Number,
        path: String,
        label: String
    }]
});

// Define schema for column
const ColumnSchema = new Schema({
    id: Number,
    columnItems: [ColumnItemSchema]
});

// Define schema for category menu
try {
    CategoryMenu = mongoose.model('CategoryMenu');
} catch (error) {
    const CategoryMenuSchema = new Schema({
        id: Number,
        path: String,
        label: String,
        columns: [ColumnSchema]
    });
    CategoryMenu = mongoose.model('CategoryMenu', CategoryMenuSchema);
}


module.exports = CategoryMenu;
