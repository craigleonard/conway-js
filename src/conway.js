Array.prototype.each = function(callback) {
    for (var i = 0; i < this.length; i++) {
        callback.call(this, this[i]);
    }
    return this;
}

var Conway = {}

Conway.game = function(width, height) {
    
    var grid = Conway.grid(width, height);
    var game = {
        grid : grid,
        cellAt : function(x, y) {
            return grid.cellAt(x, y);
        }
    };
    
    game.tick = function() {
        cellsToFlip = []    
    
        grid.eachCell(function(cell) {
            var liveNeighbours = cell.countLiveNeighbours();
            if(cell.isLive()) {
                if(liveNeighbours < 2 || liveNeighbours > 3) {
                    cellsToFlip.push(cell);
                }
            } else {
                if(liveNeighbours === 3) {
                    cellsToFlip.push(cell);
                }
            }
        });
        
        cellsToFlip.each(function(cell) {
            cell.flip();
        });
    };
    
    return game;
}

Conway.grid = function(width, height) {
    
    var grid = {};
    var size = width * height;
    var cells = [];
    
    var cell = function(x, y) {
        var live = false;
        var cell = {
            x   : x,
            y   : y,
            
            isLive : function() {
                return live;
            },
            
            isDead : function() {
                return !live;
            },
            
            live : function() {
                live = true;
            },
            
            die : function() {
                live = false;
            },
            
            flip : function() {
                live = !live;    
            },
            
            neighbours : function() {
                var neighbours = [];

                var wrapY = function(y) {
                    if (y < 0) {
                        return height - 1;
                    } else if(y >= height) {
                        return 0;
                    }
                    return y;
                }

                var wrapX = function(x) {
                    if (x < 0) {
                        return width - 1;
                    } else if(x >= width) {
                        return 0;
                    }
                    return x;
                }

                for (var yc = y-1; yc <= y+1; yc++) {
                    var yWrapped = wrapY(yc);
                    for (var xc = x-1; xc <= x+1; xc++) {
                        var xWrapped = wrapX(xc);
                        if(yWrapped === y && xWrapped === x) {
                        } else {
                            neighbours.push(grid.cellAt(xWrapped, yWrapped));
                        }
                    }
                }
                
                return neighbours;
            },
            
            countLiveNeighbours : function() {
                return this.neighbours().filter(function(n) {
                    return n.isLive();
                }).length;
            },
            
            toString : function() {
                return "cell (" + x + ", " + y + ") status : " + live;
            }
        };
        return cell;
    }

    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            cells.push(cell(x, y));
        }
    }
    
    grid.cellAt = function(x, y) {
        return cells[y * width + x];
    }
    
    grid.eachCell = function(callback) {
        cells.each(callback);
        return this;
    }
    
    grid.everyCell = function(predicate) {
        return cells.every(predicate);
    }
    
    return grid;
}
