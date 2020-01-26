const util = require("util");
module.exports.findAllSolutions = findWords;

// My Boggle solver is case sensitive. So 'Add' is treated as a different word from 'add'.

class Node {
    constructor() {
        this.isValid = false;
        this.children = new Object();
    }
}

class Trie {
    constructor(dictionaryArray) {
        this.root = new Node();
        for(const word of dictionaryArray) {
            this.insert(word)
        }
    }
    insert(word) {
        let ptr = this.root;
        for(const char of word) {
            if(ptr.children.has(char)) {
                ptr = ptr.children.get(char);
            } else {
                let newNode = new Node();
                ptr.children.set(char, newNode);
                ptr = newNode;
            }
        }
        ptr.isValid = true;
    }
    printTrie() {
        console.log(util.inspect(this.root, {showHidden: false, depth: null}));
    }
}

function findWords(grid, dictionaryArray) {
    let result = new Set();
    let trie = new Trie(dictionaryArray);
    let visited = createBooleanMatrix(grid, false);
    for(const [x, array] of grid.entries()) {
        for(const [y, tile] of Array.from(array).entries()) {
            findWordsFrom(x, y, tile, grid, visited, trie.root, result);
        }
    }
    return Array.from(result);
}

function findWordsFrom(x, y, path, grid, visited, node, result) {
    let ptr = node;
    for(const char of grid[x][y]) {
        if(ptr.children.has(char)) {
            ptr = ptr.children.get(char);
        } else {
            return;
        }
    }
    visited[x][y] = true;
    if(ptr.isValid && path.length > 2) { result.add(path); }
    let validMoves = getValidMoves(x, y, grid, visited);
    for(const coordinate of validMoves) {
        let x = coordinate[0];
        let y = coordinate[1];
        let tile = grid[x][y];
        findWordsFrom(x, y, path + tile, grid, visited, ptr, result);
    }
    visited[x][y] = false;
}

function getValidMoves(x, y, grid, visited) {
    const possibleMoves = [
        [x-1, y],
        [x-1, y+1],
        [x, y+1],
        [x+1, y+1],
        [x+1, y],
        [x+1, y-1],
        [x, y-1],
        [x-1, y-1]
    ];
    let result = [];
    for(const possibleMove of possibleMoves) {
        const newX = possibleMove[0];
        const newY = possibleMove[1];
        if(newX >= 0 && newX < grid.length && newY >= 0 && newY < grid[newX].length && !visited[newX][newY]) {
            result.push([newX, newY]);
        }
    }
    return result;
}

function createBooleanMatrix(grid, boolean) {
    let result = [];
    for(const array of grid) {
        let subResult = [];
        for(const element of grid) {
            subResult.push(boolean);
        }
        result.push(subResult)
    }
    return result
}