var map = [];
const map_width = 10;
const map_height = 25;

var key_times = 0;
var bag_num = 0;
var bag = [];
bag_shuffle()

function bag_shuffle() {
    bag = [];
    for (var i = 0; i < 7; i++) {
        bag.push(i);
    }
    for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
    }
}

for (var i = 0; i < map_height; i++) { 
    var row = [];
    for (var j = 0; j < map_width; j++) { 
        row.push(0);
    }
    map.push(row);
}

var blocks = [[
[[0.5, -0.5], [1.5, -0.5], [-0.5, -0.5], [-1.5, -0.5]], 
[[0.5, -0.5], [0.5, 0.5], [-0.5, -0.5], [-0.5, 0.5]], 
[[0, 0], [1, 0], [-1, 0], [0,-1]], 
[[0, 0], [1, -1], [-1, 0], [0,-1]], 
[[0, 0], [1, 0], [-1, -1], [0,-1]], 
[[0, 0], [-1, 0], [-1, -1], [1,0]], 
[[0, 0], [1, 0], [1, -1], [-1,0]]
]];

var wallkick = [
[[],
[[0, 0],[-1, 0],[-1,+1],[0,-2],[-1,-2]],
[],
[[0, 0],[+1, 0],[+1,+1],[0,-2],[+1,-2]]],
[[[0, 0],[+1, 0],[+1,-1],[0,+2],[+1,+2]],
[],
[[0, 0],[+1, 0],[+1,-1],[0,+2],[+1,+2]],
[]],
[[],
[[0, 0],[-1, 0],[-1,+1],[0,-2],[-1,-2]],
[],
[[0, 0],[+1, 0],[+1,+1],[0,-2],[+1,-2]]],
[[[0, 0],[-1, 0],[-1,-1],[0,+2],[-1,+2]],
[],
[[0, 0],[-1, 0],[-1,-1],[0,+2],[-1,+2]],
[]]
]
// 0->R	[(0, 0),(-1, 0),(-1,+1),(0,-2),(-1,-2)]
// 0->L	[(0, 0),(+1, 0),(+1,+1),(0,-2),(+1,-2)]
// R->0	[(0, 0),(+1, 0),(+1,-1),(0,+2),(+1,+2)]
// R->2	[(0, 0),(+1, 0),(+1,-1),(0,+2),(+1,+2)]
// 2->R	[(0, 0),(-1, 0),(-1,+1),(0,-2),(-1,-2)]
// 2->L	[(0, 0),(+1, 0),(+1,+1),(0,-2),(+1,-2)]
// L->0	[(0, 0),(-1, 0),(-1,-1),(0,+2),(-1,+2)]
// L->2	[(0, 0),(-1, 0),(-1,-1),(0,+2),(-1,+2)]
var I_wallkick = [
[[],
[[0, 0],[-2, 0],[+1, 0],[-2,-1],[+1,+2]],
[],
[[0, 0],[-1, 0],[+2, 0],[-1,+2],[+2,-1]]],
[[[0, 0],[+2, 0],[-1, 0],[+2,+1],[-1,-2]],
[],
[[0, 0],[-1, 0],[+2, 0],[-1,+2],[+2,-1]],
[]],
[[],
[[0, 0],[+1, 0],[-2, 0],[+1,-2],[-2,+1]],
[],
[[0, 0],[+2, 0],[-1, 0],[+2,+1],[-1,-2]]],
[[[0, 0],[+1, 0],[-2, 0],[+1,-2],[-2,+1]],
[],
[[0, 0],[-2, 0],[+1, 0],[-2,-1],[+1,+2]],
[]]
]
// 0->R	[(0, 0),(-2, 0),(+1, 0),(-2,-1),(+1,+2)]
// 0->L	[(0, 0),(-1, 0),(+2, 0),(-1,+2),(+2,-1)]
// R->0	[(0, 0),(+2, 0),(-1, 0),(+2,+1),(-1,-2)]
// R->2	[(0, 0),(-1, 0),(+2, 0),(-1,+2),(+2,-1)]
// 2->R	[(0, 0),(+1, 0),(-2, 0),(+1,-2),(-2,+1)]
// 2->L	[(0, 0),(+2, 0),(-1, 0),(+2,+1),(-1,-2)]
// L->0	[(0, 0),(+1, 0),(-2, 0),(+1,-2),(-2,+1)]
// L->2	[(0, 0),(-2, 0),(+1, 0),(-2,-1),(+1,+2)]




for (let k = 0; k < 3; k++) {
    var rot_list2 = [];
    for (var i = 0; i < blocks[k].length; i++) { 
        var rot_list1 = [];
        for (var j = 0; j < blocks[k][i].length; j++) {  
            rot_list1.push([-blocks[k][i][j][1], blocks[k][i][j][0]]);  
        }
        rot_list2.push(rot_list1);
    }
    blocks.push(rot_list2)
}
var projection_pos = [];
var old_projection_pos = [];
var center_pos = [];
var block_num = bag[bag_num];
var rot = 0
var hold_num = -1;
var can_hold = 1






function down(end) {
    del()
    center_pos[1] += 1;
    if (coll() == 1) {
        if (end == 1 && key_times == 0) {
            center_pos[1] -= 1;
            projection();
            add();
            new_block()
        }
        else {
            center_pos[1] -= 1;
            projection();
            add()
        }
    }

    else {
        projection();
        add()
    }
}

function right() {
    del()
    center_pos[0] += 1;
    if (coll() == 1) {
        center_pos[0] -= 1;
    }
    projection();
    add()
}

function left() {
    del()
    center_pos[0] -= 1;
    if (coll() == 1) {
        center_pos[0] += 1;
    }
    projection();
    add()
}

function harddrop() {
    del()
    while (coll()==0) {
        center_pos[1] += 1;
    }
    center_pos[1] -= 1;
    projection();
    add()
    new_block()
}

function rotate(n) {
    del()
    rot += n
    rot = (rot+4)%4
    coll_rot(n)
    rot = (rot+4)%4
    projection();
    add()
}

function coll_rot(n) {
    ori_rot = (rot-n+4)%4;

    if (block_num == 0) {
        let block_pos = position(center_pos, block_num);
        
        for (let a = 0; a < I_wallkick[ori_rot][rot].length; a++) {
            collide = 0;

            for (let i = 0; i < block_pos.length; i++) {
                let x = block_pos[i][0]+I_wallkick[ori_rot][rot][a][0];
                let y = block_pos[i][1]-I_wallkick[ori_rot][rot][a][1];
                if (x >= 0 && x < map_width && y >= 0 && y < map_height) {
                    if (map[y][x] == 0 || map[y][x] == 8) {
                        continue
                    }
                    else {
                        collide = 1;
                    }
                }
                else {
                    collide = 1;
                }
            }


            if (collide == 0) {
                center_pos[0] += I_wallkick[ori_rot][rot][a][0]
                center_pos[1] -= I_wallkick[ori_rot][rot][a][1]
                return collide;
            }
        }
    }

    else {
        let block_pos = position(center_pos, block_num);
        
        for (let a = 0; a < wallkick[ori_rot][rot].length; a++) {
            collide = 0;

            for (let i = 0; i < block_pos.length; i++) {
                let x = block_pos[i][0]+wallkick[ori_rot][rot][a][0];
                let y = block_pos[i][1]-wallkick[ori_rot][rot][a][1];
                if (x >= 0 && x < map_width && y >= 0 && y < map_height) {
                    if (map[y][x] == 0 || map[y][x] == 8) {
                        continue
                    }
                    else {
                        collide = 1;
                    }
                }
                else {
                    collide = 1;
                }
            }
            console.log(collide)
            if (collide == 0) {
                center_pos[0] += wallkick[ori_rot][rot][a][0]
                center_pos[1] -= wallkick[ori_rot][rot][a][1]
                return collide;
            }
            
            
        }
    }
    
    rot = ori_rot
    return collide;
}

function updateHoldBlock() {
    var holdContainer = document.getElementById('holdContainer');
    var htmlContent = '<table border="1" cellpadding="5" cellspacing="0">';

    if (hold_num !== -1) {
        var holdBlock = blocks[0][hold_num];
        for (var i = 0; i < 4; i++) {
            htmlContent += '<tr>';
            for (var j = 0; j < 4; j++) {
                var cellClass = 'num0';
                if (holdBlock.some(pos => pos[0] + 1 === j && pos[1] + 1 === i)) {
                    cellClass = 'num' + (hold_num + 1); 
                }
                htmlContent += `<td class="${cellClass}"></td>`;
            }
            htmlContent += '</tr>';
        }
    } else {
        for (var i = 0; i < 4; i++) {
            htmlContent += '<tr>';
            for (var j = 0; j < 4; j++) {
                htmlContent += '<td class="num0"></td>';
            }
            htmlContent += '</tr>';
        }
    }

    htmlContent += '</table>';
    holdContainer.innerHTML = htmlContent;
}

function hold() {
    if (can_hold == 1) {
        del();
        if (hold_num == -1) {
            hold_num = block_num;
            bag_num+=1;
            if (bag_num == 7) {
                bag_num = 0;
                bag_shuffle();
            }
            block_num = bag[bag_num];
            if (block_num==0 || block_num==1) {
                center_pos = [5.5, 4.5];
            } else {
                center_pos = [5, 4];
            }
            rot = 0;
            projection();
            add();
        } else {
            [hold_num, block_num] = [block_num, hold_num];
            if (block_num==0 || block_num==1) {
                center_pos = [5.5, 4.5];
            } else {
                center_pos = [5, 4];
            }
            rot = 0;
            projection();
            add();
        }
        can_hold = 0;
        updateHoldBlock();  
    }
}

updateHoldBlock();

function new_block() {
    clear()
    bag_num+=1
    if (bag_num == 7) {
        bag_num = 0;
        bag_shuffle()
    }
    block_num = bag[bag_num];
    if (block_num==0 || block_num==1) {
        center_pos = [5.5, 4.5];
    }
    else {
        center_pos = [5, 4]
    }
    rot = 0;
    can_hold = 1;
    projection();
    add()
}

function clear() {
    for (let i = 0; i < map.length; i++) {
        if (map[i].includes(0)) {
            continue
        }
        else {
            for (let j = 0; j < map[i].length; j++) {
                map[i][j] = 0;
            }
            map.sort((a, b)=>{
                if (a.every(num => num === 0)) return -1;
                if (b.every(num => num === 0)) return 1;
                return 0;
            })
        }
    }
}

function projection() {
    del_pro()
    projection_pos = [...center_pos];
    while (coll(projection_pos)==0) {
        projection_pos[1] += 1;
    }
    projection_pos[1] -= 1;

    let block_pos = position(projection_pos, block_num);
    for (let i = 0; i < block_pos.length; i++) {
        let x = block_pos[i][0];
        let y = block_pos[i][1];
        map[y][x] = 8;
    }
    old_projection_pos = [...projection_pos];
}

function del_pro() {
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {
            if (map[i][j] === 8) {
                map[i][j] = 0;
            }
        }
    }
}

function position(cen, block_num) {
    var block_pos = [];
    for (let i = 0; i < 4; i++) {
        let pos = cen.map((num, idx) => num + blocks[rot][block_num][i][idx]);
        console.log(pos)
        block_pos.push(pos);
    }
    return block_pos;
}

function del(cen=center_pos) {
    let block_pos = position(cen, block_num);
    for (let i = 0; i < block_pos.length; i++) {
        let x = block_pos[i][0];
        let y = block_pos[i][1];
        if (x >= 0 && x < map_width && y >= 0 && y < map_height) {
            map[y][x] = 0;
        }
    }
}

function add(cen=center_pos, block_n = block_num) {
    let block_pos = position(cen, block_n);
    for (let i = 0; i < block_pos.length; i++) {
        let x = block_pos[i][0];
        let y = block_pos[i][1];
        map[y][x] = block_num+1;
    }
}

function coll(cen=center_pos) {
    collide = 0;
    let block_pos = position(cen, block_num);
    for (let i = 0; i < block_pos.length; i++) {
        let x = block_pos[i][0];
        let y = block_pos[i][1];
        console.log(x, y)
        if (x >= 0 && x < map_width && y >= 0 && y < map_height) {
            if (map[y][x] == 0 || map[y][x] == 8) {
                continue
            }
            else {
                collide = 1;
            }
        }
        else {
            collide = 1;
        }
    }
    return collide;
}

function updateMap() {

    var mapContainer = document.getElementById('mapContainer');
    var htmlContent = '<table border="1" cellpadding="5" cellspacing="0">';
    
    for (var i = 0; i < map.length; i++) {
        htmlContent += '<tr>';
        for (var j = 0; j < map[i].length; j++) {
            var className = 'num' + map[i][j];
            htmlContent += `<td class="${className}"></td>`;
        }
        htmlContent += '</tr>';
    }

    htmlContent += '</table>';
    mapContainer.innerHTML = htmlContent;
}

let activeKeys = {};
let intervals = {};

document.addEventListener('keydown', function(event) {
    if (!activeKeys[event.key]) {
        activeKeys[event.key] = true;
        key_times += 1;

        handleKey(event.key);
        intervals[event.key] = setTimeout(() => {
            intervals[event.key] = setInterval(() => {
                handleKey(event.key);
            }, 30);
        }, 400);
    }
});

document.addEventListener('keyup', function(event) {
    if (activeKeys[event.key]) {
        clearTimeout(intervals[event.key]); 
        clearInterval(intervals[event.key]); 
        delete activeKeys[event.key];
        delete intervals[event.key];
    }
});

function handleKey(key) {
    switch (key) {
        case 'ArrowDown':
            down();
            break;
        case 'ArrowRight':
            right();
            break;
        case 'ArrowLeft':
            left();
            break;
        case 'ArrowUp':
        case 'x':
            rotate(1);
            break;
        case 'z':
            rotate(3);
            break;
        case 'a':
            rotate(2);
            break;
        case 'c':
            hold();
            break;
        case ' ':
            harddrop();
            break;
    }
}


function autodown() {
    setInterval(function() {
        down(1);
        key_times = 0;
    }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    const upcomingBlocks = [
        [
            [1, 1, 0, 0],
            [1, 1, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 2, 2, 0],
            [2, 2, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [3, 3, 3, 0],
            [0, 3, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [4, 4, 4, 4],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [5, 5, 0, 0],
            [0, 5, 5, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    ];

    // Update upcoming blocks display
    const upcomingBlocksContainer = document.getElementById('upcomingBlocksContainer');
    const blockPreviews = upcomingBlocksContainer.getElementsByClassName('block-preview');

    for (let i = 0; i < upcomingBlocks.length; i++) {
        const block = upcomingBlocks[i];
        const table = blockPreviews[i].querySelector('table');

        // Clear previous table content
        table.innerHTML = '';

        for (let row = 0; row < block.length; row++) {
            const tr = document.createElement('tr');
            for (let col = 0; col < block[row].length; col++) {
                const td = document.createElement('td');
                td.className = `num${block[row][col]}`;
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
    }
});

function updateLoop() {
    updateMap();
    requestAnimationFrame(updateLoop);
}

new_block();

requestAnimationFrame(updateLoop); 

add(center_pos, block_num);

updateMap();

autodown();