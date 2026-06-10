document.addEventListener('DOMContentLoaded', () => {
    let activeModel = 'A'; 
    let rows = 20;
    let cols = 40;
    let canvasMatrix = [];
    let activeBrush = '*'; 

    const gridContainer = document.getElementById('grid-canvas');
    const terminalOutput = document.getElementById('terminal-text');
    const modelSelector = document.getElementById('model-select');
    const shapeSelector = document.getElementById('shape-select');
    const parameterInputs = document.getElementById('parameter-inputs');
    const drawBtn = document.getElementById('btn-draw');
    const resetBtn = document.getElementById('btn-reset');
    const copyBtn = document.getElementById('btn-copy');
    const themeToggle = document.getElementById('theme-toggle');
    const promptTextarea = document.getElementById('prompt-text');

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeToggle.innerHTML = isDark ? '☀️' : '🌙';
    });

    const tabHeaders = document.querySelectorAll('.tab-header');
    const tabContents = document.querySelectorAll('.tab-content');
    tabHeaders.forEach(header => {
        header.addEventListener('click', () => {
            tabHeaders.forEach(h => h.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            header.classList.add('active');
            const targetTab = header.dataset.tab;
            document.getElementById(`tab-${targetTab}`).classList.add('active');
        });
    });

    copyBtn.addEventListener('click', () => {
        promptTextarea.select();
        document.execCommand('copy');
        copyBtn.innerHTML = '✓ Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = '📋 Copy Prompt';
        }, 2000);
    });

    function initializeMatrix() {
        canvasMatrix = [];
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
                row.push('_');
            }
            canvasMatrix.push(row);
        }
    }

    function plot(r, c, brush = '*') {
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
            canvasMatrix[r][c] = brush;
        }
    }

    function render() {
        let termStr = '';
        for (let i = 0; i < rows; i++) {
            termStr += canvasMatrix[i].join('') + '\n';
        }
        terminalOutput.textContent = termStr;

        gridContainer.innerHTML = '';
        gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                if (canvasMatrix[r][c] !== '_') {
                    cell.classList.add('active');
                }
                
                cell.addEventListener('mousedown', () => {
                    if (activeModel === 'A') {
                        plot(r, c, activeBrush);
                    } else {
                        if (canvasMatrix[r][c] === '_') {
                            plot(r, c, '*');
                        } else {
                            plot(r, c, '_');
                        }
                    }
                    render();
                });
                
                gridContainer.appendChild(cell);
            }
        }
    }

    function handleModelChange() {
        activeModel = modelSelector.value;
        if (activeModel === 'A') {
            rows = 20;
            cols = 40;
            document.getElementById('brush-control-group').style.display = 'flex';
        } else {
            rows = 30;
            cols = 60;
            document.getElementById('brush-control-group').style.display = 'none';
        }
        initializeMatrix();
        render();
        updateInputFields();
    }

    modelSelector.addEventListener('change', handleModelChange);

    function updateInputFields() {
        const shape = shapeSelector.value;
        let html = '';

        if (activeModel === 'A') {
            if (shape === 'line') {
                html = `
                    <div class="input-row">
                        <input type="number" id="y1" placeholder="Start Row (y1)" min="0" max="${rows-1}" value="2">
                        <input type="number" id="x1" placeholder="Start Col (x1)" min="0" max="${cols-1}" value="5">
                    </div>
                    <div class="input-row">
                        <input type="number" id="y2" placeholder="End Row (y2)" min="0" max="${rows-1}" value="15">
                        <input type="number" id="x2" placeholder="End Col (x2)" min="0" max="${cols-1}" value="35">
                    </div>
                `;
            } else if (shape === 'rectangle') {
                html = `
                    <div class="input-row">
                        <input type="number" id="y" placeholder="Top-Left Row (y)" min="0" max="${rows-1}" value="3">
                        <input type="number" id="x" placeholder="Top-Left Col (x)" min="0" max="${cols-1}" value="5">
                    </div>
                    <div class="input-row">
                        <input type="number" id="w" placeholder="Width" min="1" max="${cols}" value="25">
                        <input type="number" id="h" placeholder="Height" min="1" max="${rows}" value="10">
                    </div>
                `;
            } else if (shape === 'circle') {
                html = `
                    <div class="input-row">
                        <input type="number" id="cy" placeholder="Center Row (cy)" min="0" max="${rows-1}" value="10">
                        <input type="number" id="cx" placeholder="Center Col (cx)" min="0" max="${cols-1}" value="20">
                    </div>
                    <input type="number" id="r" placeholder="Radius" min="1" max="15" value="6">
                `;
            } else if (shape === 'triangle') {
                html = `
                    <div class="input-row">
                        <input type="number" id="y1" placeholder="Row 1 (y1)" min="0" max="${rows-1}" value="2">
                        <input type="number" id="x1" placeholder="Col 1 (x1)" min="0" max="${cols-1}" value="20">
                    </div>
                    <div class="input-row">
                        <input type="number" id="y2" placeholder="Row 2 (y2)" min="0" max="${rows-1}" value="17">
                        <input type="number" id="x2" placeholder="Col 2 (x2)" min="0" max="${cols-1}" value="5">
                    </div>
                    <div class="input-row">
                        <input type="number" id="y3" placeholder="Row 3 (y3)" min="0" max="${rows-1}" value="17">
                        <input type="number" id="x3" placeholder="Col 3 (x3)" min="0" max="${cols-1}" value="35">
                    </div>
                `;
            }
        } else {
            if (shape === 'line') {
                html = `
                    <div class="input-row">
                        <input type="number" id="x1" placeholder="Start Row (x1)" min="0" max="${rows-1}" value="5">
                        <input type="number" id="y1" placeholder="Start Col (y1)" min="0" max="${cols-1}" value="10">
                    </div>
                    <div class="input-row">
                        <input type="number" id="x2" placeholder="End Row (x2)" min="0" max="${rows-1}" value="25">
                        <input type="number" id="y2" placeholder="End Col (y2)" min="0" max="${cols-1}" value="50">
                    </div>
                `;
            } else if (shape === 'rectangle') {
                html = `
                    <div class="input-row">
                        <input type="number" id="x" placeholder="Start Row (x)" min="0" max="${rows-1}" value="5">
                        <input type="number" id="y" placeholder="Start Col (y)" min="0" max="${cols-1}" value="10">
                    </div>
                    <div class="input-row">
                        <input type="number" id="w" placeholder="Width" min="1" max="${cols}" value="30">
                        <input type="number" id="h" placeholder="Height" min="1" max="${rows}" value="15">
                    </div>
                `;
            } else if (shape === 'circle') {
                html = `
                    <div class="input-row">
                        <input type="number" id="xc" placeholder="Center Row (xc)" min="0" max="${rows-1}" value="15">
                        <input type="number" id="yc" placeholder="Center Col (yc)" min="0" max="${cols-1}" value="30">
                    </div>
                    <input type="number" id="r" placeholder="Radius" min="1" max="20" value="8">
                `;
            } else if (shape === 'triangle') {
                html = `
                    <div class="input-row">
                        <input type="number" id="x1" placeholder="Row 1 (x1)" min="0" max="${rows-1}" value="5">
                        <input type="number" id="y1" placeholder="Col 1 (y1)" min="0" max="${cols-1}" value="30">
                    </div>
                    <div class="input-row">
                        <input type="number" id="x2" placeholder="Row 2 (x2)" min="0" max="${rows-1}" value="25">
                        <input type="number" id="y2" placeholder="Col 2 (y2)" min="0" max="${cols-1}" value="10">
                    </div>
                    <div class="input-row">
                        <input type="number" id="x3" placeholder="Row 3 (x3)" min="0" max="${rows-1}" value="25">
                        <input type="number" id="y3" placeholder="Col 3 (y3)" min="0" max="${cols-1}" value="50">
                    </div>
                `;
            }
        }
        parameterInputs.innerHTML = html;
    }

    shapeSelector.addEventListener('change', updateInputFields);

    const brushSelector = document.getElementById('brush-select');
    if (brushSelector) {
        brushSelector.addEventListener('change', () => {
            activeBrush = brushSelector.value;
        });
    }
    
    function drawLineBresenham(x1, y1, x2, y2, brush = '*') {
        let dx = Math.abs(x2 - x1);
        let sx = x1 < x2 ? 1 : -1;
        let dy = -Math.abs(y2 - y1);
        let sy = y1 < y2 ? 1 : -1;
        let err = dx + dy;

        while (true) {
            plot(y1, x1, brush);
            if (x1 === x2 && y1 === y2) break;
            let e2 = 2 * err;
            if (e2 >= dy) {
                err += dy;
                x1 += sx;
            }
            if (e2 <= dx) {
                err += dx;
                y1 += sy;
            }
        }
    }

    function drawCircleMidpoint(cx, cy, radius, brush = '*') {
        let x = 0;
        let y = radius;
        let d = 3 - 2 * radius;

        while (y >= x) {
            plot(cy + y, cx + x, brush);
            plot(cy + y, cx - x, brush);
            plot(cy - y, cx + x, brush);
            plot(cy - y, cx - x, brush);
            plot(cy + x, cx + y, brush);
            plot(cy + x, cx - y, brush);
            plot(cy - x, cx + y, brush);
            plot(cy - x, cx - y, brush);

            x++;
            if (d > 0) {
                y--;
                d = d + 4 * (x - y) + 10;
            } else {
                d = d + 4 * x + 6;
            }
        }
    }

    function drawLineDDA(r1, c1, r2, c2) {
        let dr = Math.abs(r2 - r1);
        let dc = Math.abs(c2 - c1);
        let steps = dr > dc ? dr : dc;

        if (steps === 0) {
            plot(r1, c1, '*');
            return;
        }

        let rInc = (r2 - r1) / steps;
        let cInc = (c2 - c1) / steps;
        
        let r = r1;
        let c = c1;

        for (let i = 0; i <= steps; i++) {
            plot(Math.round(r), Math.round(c), '*');
            r += rInc;
            c += cInc;
        }
    }

    function drawCircleTrig(rc, cc, r) {
        for (let angle = 0; angle < 360; angle++) {
            let rad = angle * Math.PI / 180;
            let x = rc + r * Math.cos(rad);
            let y = cc + r * Math.sin(rad);
            plot(Math.round(x), Math.round(y), '*');
        }
    }

    drawBtn.addEventListener('click', () => {
        const shape = shapeSelector.value;
        
        if (activeModel === 'A') {
            const brush = activeBrush;
            if (shape === 'line') {
                const y1 = parseInt(document.getElementById('y1').value);
                const x1 = parseInt(document.getElementById('x1').value);
                const y2 = parseInt(document.getElementById('y2').value);
                const x2 = parseInt(document.getElementById('x2').value);
                drawLineBresenham(x1, y1, x2, y2, brush);
            } 
            else if (shape === 'rectangle') {
                const y = parseInt(document.getElementById('y').value);
                const x = parseInt(document.getElementById('x').value);
                const w = parseInt(document.getElementById('w').value);
                const h = parseInt(document.getElementById('h').value);
                
                drawLineBresenham(x, y, x + w - 1, y, brush);                  
                drawLineBresenham(x, y + h - 1, x + w - 1, y + h - 1, brush); 
                drawLineBresenham(x, y, x, y + h - 1, brush);                  
                drawLineBresenham(x + w - 1, y, x + w - 1, y + h - 1, brush); 
            } 
            else if (shape === 'circle') {
                const cy = parseInt(document.getElementById('cy').value);
                const cx = parseInt(document.getElementById('cx').value);
                const r = parseInt(document.getElementById('r').value);
                drawCircleMidpoint(cx, cy, r, brush);
            } 
            else if (shape === 'triangle') {
                const y1 = parseInt(document.getElementById('y1').value);
                const x1 = parseInt(document.getElementById('x1').value);
                const y2 = parseInt(document.getElementById('y2').value);
                const x2 = parseInt(document.getElementById('x2').value);
                const y3 = parseInt(document.getElementById('y3').value);
                const x3 = parseInt(document.getElementById('x3').value);
                
                drawLineBresenham(x1, y1, x2, y2, brush);
                drawLineBresenham(x2, y2, x3, y3, brush);
                drawLineBresenham(x3, y3, x1, y1, brush);
            }
        } 
        else {
            if (shape === 'line') {
                const x1 = parseInt(document.getElementById('x1').value);
                const y1 = parseInt(document.getElementById('y1').value);
                const x2 = parseInt(document.getElementById('x2').value);
                const y2 = parseInt(document.getElementById('y2').value);
                drawLineDDA(x1, y1, x2, y2);
            } 
            else if (shape === 'rectangle') {
                const x = parseInt(document.getElementById('x').value);
                const y = parseInt(document.getElementById('y').value);
                const w = parseInt(document.getElementById('w').value);
                const h = parseInt(document.getElementById('h').value);
                
                drawLineDDA(x, y, x, y + w);
                drawLineDDA(x, y, x + h, y);
                drawLineDDA(x + h, y, x + h, y + w);
                drawLineDDA(x, y + w, x + h, y + w);
            } 
            else if (shape === 'circle') {
                const xc = parseInt(document.getElementById('xc').value);
                const yc = parseInt(document.getElementById('yc').value);
                const r = parseInt(document.getElementById('r').value);
                drawCircleTrig(xc, yc, r);
            } 
            else if (shape === 'triangle') {
                const x1 = parseInt(document.getElementById('x1').value);
                const y1 = parseInt(document.getElementById('y1').value);
                const x2 = parseInt(document.getElementById('x2').value);
                const y2 = parseInt(document.getElementById('y2').value);
                const x3 = parseInt(document.getElementById('x3').value);
                const y3 = parseInt(document.getElementById('y3').value);
                
                drawLineDDA(x1, y1, x2, y2);
                drawLineDDA(x2, y2, x3, y3);
                drawLineDDA(x3, y3, x1, y1);
            }
        }
        
        render();
    });

    resetBtn.addEventListener('click', () => {
        initializeMatrix();
        render();
    });

    initializeMatrix();
    updateInputFields();
    render();
});
