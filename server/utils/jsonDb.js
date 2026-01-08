const fs = require('fs');
const path = require('path');

class JsonConfigs {
    constructor(fileName) {
        this.filePath = path.join(__dirname, '../data', fileName);
    }

    _read() {
        if (!fs.existsSync(this.filePath)) {
            return [];
        }
        const data = fs.readFileSync(this.filePath, 'utf-8');
        return data ? JSON.parse(data) : [];
    }

    _write(data) {
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
    }

    getAll() {
        return this._read();
    }

    getById(id) {
        const items = this._read();
        return items.find(item => item.id === id);
    }

    create(item) {
        const items = this._read();
        items.push(item);
        this._write(items);
        return item;
    }

    update(id, updates) {
        const items = this._read();
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...updates };
            this._write(items);
            return items[index];
        }
        return null;
    }

    delete(id) {
        const items = this._read();
        const filtered = items.filter(item => item.id !== id);
        this._write(filtered);
        return filtered.length !== items.length;
    }

    findBy(predicate) {
        const items = this._read();
        return items.find(predicate);
    }

    filterBy(predicate) {
        const items = this._read();
        return items.filter(predicate);
    }
}

module.exports = JsonConfigs;
