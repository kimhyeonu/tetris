var map = [];
const map_width = 10;
const map_height = 23;

var key_times = 0;
var bag_num = 0;
var bag = [];
var upcomingblocks = [];


var linesCleared = 0;
var time = 0;
var running = true


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

function upcoming_gen() {
    bag_shuffle()
    for (let i = 0; i < bag.length; i++) {
        upcomingblocks.push(bag[i])
        
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
[0, 0],
[[0, 0],[+1, 0],[+1,+1],[0,-2],[+1,-2]]],
[[[0, 0],[+1, 0],[+1,-1],[0,+2],[+1,+2]],
[],
[[0, 0],[+1, 0],[+1,-1],[0,+2],[+1,+2]],
[0, 0]],
[[0, 0],
[[0, 0],[-1, 0],[-1,+1],[0,-2],[-1,-2]],
[],
[[0, 0],[+1, 0],[+1,+1],[0,-2],[+1,-2]]],
[[[0, 0],[-1, 0],[-1,-1],[0,+2],[-1,+2]],
[0, 0],
[[0, 0],[-1, 0],[-1,-1],[0,+2],[-1,+2]],
[]]
]
var I_wallkick = [
[[],
[[0, 0],[-2, 0],[+1, 0],[-2,-1],[+1,+2]],
[0, 0],
[[0, 0],[-1, 0],[+2, 0],[-1,+2],[+2,-1]]],
[[[0, 0],[+2, 0],[-1, 0],[+2,+1],[-1,-2]],
[],
[[0, 0],[-1, 0],[+2, 0],[-1,+2],[+2,-1]],
[0, 0]],
[[0, 0],
[[0, 0],[+1, 0],[-2, 0],[+1,-2],[-2,+1]],
[],
[[0, 0],[+2, 0],[-1, 0],[+2,+1],[-1,-2]]],
[[[0, 0],[+1, 0],[-2, 0],[+1,-2],[-2,+1]],
[0, 0],
[[0, 0],[-2, 0],[+1, 0],[-2,-1],[+1,+2]],
[]]
]




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
    var holdBlockImage = document.getElementById('holdBlockImage');

    if (hold_num !== -1) {
        holdBlockImage.style.backgroundImage = `url('./t${hold_num}.png')`;
    } else {
        holdBlockImage.style.backgroundImage = '';
    }
}



function hold() {
    if (can_hold == 1) {
        del();
        if (hold_num == -1) {
            hold_num = block_num;
            if (upcomingblocks.length == 6) {
                upcoming_gen()
            }
            block_num = upcomingblocks[0];
            upcomingblocks.shift()
            if (block_num==0 || block_num==1) {
                center_pos = [5.5, 3.5];
            } else {
                center_pos = [5, 3];
            }
            rot = 0;
            projection();
            if (coll()==1) {
                running = false
            }
            add();
            updateUpcomingBlocks();
        } else {
            [hold_num, block_num] = [block_num, hold_num];
            if (block_num==0 || block_num==1) {
                center_pos = [5.5, 2.5];
            } else {
                center_pos = [5, 2];
            }
            rot = 0;
            projection();
            if (coll()==1) {
                running = false
            }
            add();
        }
        can_hold = 0;
        updateHoldBlock();  
    }
}

updateHoldBlock();

function new_block() {
    clear()
    if (upcomingblocks.length == 6) {
        upcoming_gen()
    }
    block_num = upcomingblocks[0];
    upcomingblocks.shift()
    if (block_num==0 || block_num==1) {
        center_pos = [5.5, 3.5];
    }
    else {
        center_pos = [5, 3]
    }
    rot = 0;
    can_hold = 1;
    projection();
    if (coll()==1) {
        add()
        updateUpcomingBlocks();
        running = false
    }
    else {
       add()
       updateUpcomingBlocks();
    }

    
}

function clear() {
    for (let i = 0; i < map.length; i++) {
        if (map[i].includes(0)) {
            continue;
        } else {
            linesCleared++; // 지운 줄 수를 증가
            for (let j = 0; j < map[i].length; j++) {
                map[i][j] = 0;
            }
            map.sort((a, b) => {
                if (a.every(num => num === 0)) return -1;
                if (b.every(num => num === 0)) return 1;
                return 0;
            });
        }
    }
    updateLinesCleared(); // 지운 줄 수 업데이트
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

    if (running){

        if (!activeKeys[event.key]) {
            activeKeys[event.key] = true;
            key_times += 1;
    
            handleKey(event.key);
            intervals[event.key] = setTimeout(() => {
                intervals[event.key] = setInterval(() => {
                    handleKey(event.key);
                }, 20);
            }, 200);
        }
    }
});

document.addEventListener('keyup', function(event) {
    if (running){
        if (activeKeys[event.key]) {
            clearTimeout(intervals[event.key]); 
            clearInterval(intervals[event.key]); 
            delete activeKeys[event.key];
            delete intervals[event.key];
        }
    }
});

function handleKey(key) {
    if (running){
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
}


function autodown() {
    setInterval(function() {
        if (running) {
            down(1);
            key_times = 0;
        }
        else return;
    }, 1000);
}

function updateUpcomingBlocks() {
    var upcomingBlockImages = document.getElementsByClassName('upcomingBlockImage');

    for (var i = 0; i < upcomingBlockImages.length; i++) {
        if (i < upcomingblocks.length) {
            upcomingBlockImages[i].style.backgroundImage = `url('./t${upcomingblocks[i]}.png')`;
        } else {
            upcomingBlockImages[i].style.backgroundImage = '';
        }
    }
}


function updateTime() {
    var timeElement = document.getElementById('timeDisplay');
    if (!timeElement) return; // 요소가 없으면 함수 종료

    timeElement.innerText = `Time: ${Math.floor(time/600)}m ${Math.floor((time%600)/10)}.${time%10}s`;
}

function updateLinesCleared() {
    var linesElement = document.getElementById('linesDisplay');
    if (!linesElement) return; 
    
    linesElement.innerText = `Lines Cleared: ${linesCleared}`;
}

function updateLoop() {
    if (running) {
    updateTime(); // 시간 및 줄 수 업데이트
    updateLinesCleared();
    updateMap();  // 기존 맵 업데이트
    requestAnimationFrame(updateLoop);
    }
}

function starttime() {
    setInterval(function() {
        time++;
        if (time>1200) {
            running = false;
        }
    }, 100);
    

}

updateLoop();

upcoming_gen()

new_block();

updateUpcomingBlocks();

requestAnimationFrame(updateLoop); 

add(center_pos, block_num);

updateMap();

autodown();

starttime();
