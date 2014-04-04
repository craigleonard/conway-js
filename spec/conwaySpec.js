describe("Conway's Game Of Life", function(){

describe("grid", function() {
  var grid;

  beforeEach(function() {
    grid = Conway.grid(5, 5);
  });

  it("should initialise a grid of dead cells", function() {
    var isDead = function(cell) {
        return cell.isDead();
    }
    expect(grid.everyCell(isDead)).toBe(true);
  });
  
  it("should initialise a grid with correct number of cells", function() {
    var cellCount = 0;
    grid.eachCell(function(cell) {
        cellCount += 1;
    });
    expect(cellCount).toBe(25);
  });
  
  it("cellAt returns cell with correct index", function() {
    var cell = grid.cellAt(3, 4);
    
    expect(cell.x).toBe(3);
    expect(cell.y).toBe(4);
  });
});

describe("cell", function() {
  var grid;

  beforeEach(function() {
    grid = Conway.grid(5, 5);
  });
  
  it("flip modifies cell liveness", function() {
    var cell = grid.cellAt(1, 1);
    expect(cell.isDead()).toBe(true);
    
    cell.flip();
    expect(cell.isLive()).toBe(true);
    
    cell.flip();
    expect(cell.isDead()).toBe(true);
  });
  
  it("neighbours returns correct values for non-wrapping cell", function() {
    var neighbours = grid.cellAt(2, 2).neighbours();

    expect(neighbours.length).toBe(8);
    expect(neighbours).toContain(grid.cellAt(1, 1));
    expect(neighbours).toContain(grid.cellAt(2, 1));
    expect(neighbours).toContain(grid.cellAt(3, 1));
     
    expect(neighbours).toContain(grid.cellAt(1, 2));
    expect(neighbours).toContain(grid.cellAt(3, 2));
     
    expect(neighbours).toContain(grid.cellAt(1, 3));
    expect(neighbours).toContain(grid.cellAt(2, 3));
    expect(neighbours).toContain(grid.cellAt(3, 3));
  });
  
  it("neighbours returns correct values when wrapping over top edge", function() {
    var neighbours = grid.cellAt(2, 0).neighbours();

    expect(neighbours.length).toBe(8);
    expect(neighbours).toContain(grid.cellAt(1, 4));
    expect(neighbours).toContain(grid.cellAt(2, 4));
    expect(neighbours).toContain(grid.cellAt(3, 4));
     
    expect(neighbours).toContain(grid.cellAt(1, 0));
    expect(neighbours).toContain(grid.cellAt(3, 0));
     
    expect(neighbours).toContain(grid.cellAt(1, 1));
    expect(neighbours).toContain(grid.cellAt(2, 1));
    expect(neighbours).toContain(grid.cellAt(3, 1));
  });
  
  it("neighbours returns correct values when wrapping over bottom edge", function() {
    var neighbours = grid.cellAt(2, 4).neighbours();

    expect(neighbours.length).toBe(8);
    expect(neighbours).toContain(grid.cellAt(1, 3));
    expect(neighbours).toContain(grid.cellAt(2, 3));
    expect(neighbours).toContain(grid.cellAt(3, 3));
     
    expect(neighbours).toContain(grid.cellAt(1, 4));
    expect(neighbours).toContain(grid.cellAt(3, 4));
     
    expect(neighbours).toContain(grid.cellAt(1, 0));
    expect(neighbours).toContain(grid.cellAt(2, 0));
    expect(neighbours).toContain(grid.cellAt(3, 0));
  });
  
  it("neighbours returns correct values when wrapping over left edge", function() {
    var neighbours = grid.cellAt(0, 2).neighbours();

    expect(neighbours.length).toBe(8);
    expect(neighbours).toContain(grid.cellAt(4, 1));
    expect(neighbours).toContain(grid.cellAt(0, 1));
    expect(neighbours).toContain(grid.cellAt(1, 1));
     
    expect(neighbours).toContain(grid.cellAt(4, 2));
    expect(neighbours).toContain(grid.cellAt(1, 2));
     
    expect(neighbours).toContain(grid.cellAt(4, 3));
    expect(neighbours).toContain(grid.cellAt(0, 3));
    expect(neighbours).toContain(grid.cellAt(1, 3));
  });
  
  it("neighbours returns correct values when wrapping over right edge", function() {
    var neighbours = grid.cellAt(2, 4).neighbours();

    expect(neighbours.length).toBe(8);
    expect(neighbours).toContain(grid.cellAt(1, 3));
    expect(neighbours).toContain(grid.cellAt(2, 3));
    expect(neighbours).toContain(grid.cellAt(3, 3));
     
    expect(neighbours).toContain(grid.cellAt(1, 4));
    expect(neighbours).toContain(grid.cellAt(3, 4));
     
    expect(neighbours).toContain(grid.cellAt(1, 0));
    expect(neighbours).toContain(grid.cellAt(2, 0));
    expect(neighbours).toContain(grid.cellAt(3, 0));
  });
});
describe("game", function() {
  var game;
    
  beforeEach(function() {
    game = Conway.game(5, 5);
  });
  
  var getCell = function(x, y) {
    var cell = game.cellAt(x, y);
    
    cell.makeNeighboursLive = function(n) {
        neighbours = this.neighbours();
        for(var i = 0; i < n; i++) {
            neighbours[i].live();
        }
    }
    return cell;
  }
  
  it("live cell less than 2 live neighbours dies after a tick", function() {
    var cell = getCell(2,2);
    cell.live();
    cell.makeNeighboursLive(1);
    
    
    game.tick();
    
    expect(cell.isDead()).toBe(true);
  });
  
  it("live cell with 2 live neighbours lives on after a tick", function() {
    var cell = getCell(2,2);
    cell.live();
    cell.makeNeighboursLive(2);
    
    
    game.tick();
    
    expect(cell.isLive()).toBe(true);
  });
  
  it("live cell with 3 live neighbours lives on after a tick", function() {
    var cell = getCell(2,2);
    cell.live();
    cell.makeNeighboursLive(3);
    
    game.tick();
    
    expect(cell.isLive()).toBe(true);
  });
  
  it("live cell with more than 3 live neighbours dies after a tick", function() {
    var cell = getCell(2,2);
    cell.live();
    cell.makeNeighboursLive(4);
    
    game.tick();
    
    expect(cell.isDead()).toBe(true);
  });
  
  it("dead cell with less than 3 live neighbours remains dead after a tick", function() {
    var cell = getCell(2,2);
    cell.makeNeighboursLive(2);
    
    game.tick();
    
    expect(cell.isDead()).toBe(true);
  });
  
  it("dead cell exactly 3 live neighbours lives after a tick", function() {
    var cell = getCell(2,2);
    cell.makeNeighboursLive(3);
    
    game.tick();
    
    expect(cell.isLive()).toBe(true);
  });
  
  it("dead cell with more than 3 live neighbours remains dead after a tick", function() {
    var cell = getCell(2,2);
    cell.makeNeighboursLive(4);
    
    game.tick();
    
    expect(cell.isDead()).toBe(true);
  });
  
  it("for a row of 3 cells, the row flips from horizontal to vertical on a tick", function() {
    // sets a row to be live
    getCell(1,2).live();
    getCell(2,2).live();
    getCell(3,2).live();
    
    game.tick();
    
    // verify that this row of three has rotated around its centre to become a column of three
    expect(getCell(2,1).isLive()).toBe(true);
    expect(getCell(2,2).isLive()).toBe(true);
    expect(getCell(2,3).isLive()).toBe(true);
    
    // verify that the other members of the row are dead
    expect(getCell(1,2).isLive()).toBe(false);
    expect(getCell(3,2).isLive()).toBe(false);
  });
  
});
});

