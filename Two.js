var coords = [];
var k = 0;

var plot = function(x, y, c) { // ”становить пиксель в т. (x, y) с прозрачностью c 
    if(isFinite(x) && isFinite(y)) {
        var color = {
            r: plot.color.r,
            g: plot.color.g,
            b: plot.color.b,
            a: plot.color.a * c
        };
 
        setPixel(x, y, color);
    }
};
 
function setPixel (x, y, c) { // функция установки пикселя в js
    c = c || 1;
    var p = canva.createImageData(1, 1);
    p.data[0] = c.r;
    p.data[1] = c.g;
    p.data[2] = c.b;
    p.data[3] = c.a;
    var data = canva.getImageData(x, y, 1, 1).data;
    if(data[3] <= p.data[3])
    canva.putImageData(p, x, y);
}
 
function drawSpline(color) {
    var num = 0;
    for(var i = 0; i < 2 * k; i += 2){
        if(i > 0) {
            var deltaX = coords[i / 2 + 1].X - coords[i / 2].X;
            var deltaY = coords[i / 2 + 1].Y - coords[i / 2].Y;
            num += Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        }
    }
    coords[0] = coords[1];
    coords[coords.length] = coords[coords.length - 1];
    plot.color = color;
    for (var i = 1; i <= coords.length - 3; i++)// в цикле по всем четвёркам точек
    {
        var a = [], b = [];
        arrs = {a:a, b:b};
        _SplineCoefficient(i, arrs, coords);// считаем коэффициенты q   `
        var points = {};// создаём массив промежуточных точек
        for(var j = 0; j < num; j++)
        {
           var t = j / num;// шаг интерполяции
            // передаём массиву точек значения по методу beta-spline
            points.X = (arrs.a[0] + t * (arrs.a[1] + t * (arrs.a[2] + t * arrs.a[3])));
            points.Y = (arrs.b[0] + t * (arrs.b[1] + t * (arrs.b[2] + t * arrs.b[3])));
            plot(points.X + 700, points.Y + 400,color.a / 255);
        }
    }
}

function _SplineCoefficient(i, arrs, coords) {    // в функции рассчитываются коэффициенты a0-a3, b0-b3
    arrs.a[3] = (-coords[i - 1].X + 3 * coords[i].X - 3 * coords[i + 1].X + coords[i + 2].X) / 6;   
    arrs.a[2] = (coords[i - 1].X - 2 * coords[i].X + coords[i + 1].X) / 2;   
    arrs.a[1] = (-coords[i - 1].X + coords[i + 1].X) / 2;   
    arrs.a[0] = (coords[i - 1].X + 4 * coords[i].X + coords[i + 1].X) / 6;  
    arrs.b[3] = (-coords[i - 1].Y + 3 * coords[i].Y - 3 * coords[i + 1].Y + coords[i + 2].Y) / 6;    
    arrs.b[2] = (coords[i - 1].Y - 2 * coords[i].Y + coords[i + 1].Y) / 2;   
    arrs.b[1] = (-coords[i - 1].Y + coords[i + 1].Y) / 2; 
    arrs.b[0] = (coords[i - 1].Y + 4 * coords[i].Y + coords[i + 1].Y) / 6;
}

var canva = document.getElementById("canvas").getContext('2d');
canva.translate(700, 400);
canva.beginPath();
canva.moveTo(0, -400);
canva.lineTo(0, 400);
canva.moveTo(-700, 0);
canva.lineTo(700, 0);
canva.stroke();
var mouseX, mouseY;
var Line, Points;

document.querySelector('.number').addEventListener('input', () => {
    let num = document.querySelector('.number').value;
    if(num <= 16 && num >= 4 && num % 1 === 0) {
        document.querySelector('.help').classList.add('vissible');
        document.querySelector('.points-container').innerHTML = '';
        for(let i = 0; i < num; i++) {
            let label1 = document.createElement('label');
            label1.innerHTML = 'X:';
            let Xinput = document.createElement('input');
            Xinput.setAttribute('type', 'number');
            Xinput.setAttribute('name', 'coords');
            Xinput.setAttribute('class', 'coords');
            let label2 = document.createElement('label');
            label2.innerHTML = 'Y:';
            let Yinput = document.createElement('input');
            Yinput.setAttribute('type', 'number');
            Yinput.setAttribute('name', 'coords');
            Yinput.setAttribute('class', 'coords');
            document.querySelector('.points-container').append(label1);
            document.querySelector('.points-container').append(Xinput);
            document.querySelector('.points-container').append(label2);
            document.querySelector('.points-container').append(Yinput);
        }
    }
    else {
        document.querySelector('.help').classList.remove('vissible');
    }
})

document.querySelector('.draw').addEventListener('click', () => {
    let red = true;
    let auto = document.querySelector('.auto').checked;
    for(let t = 0; t < document.querySelectorAll('.coords').length; t++) {
        if(document.querySelectorAll('.coords')[t].value.trim() == '' && !auto) {
            alert('Fill in all the coordinates, or select AutoFill!');
            red = false;
            break;
        }
        else if(document.querySelectorAll('.coords')[t].value.trim() == '' && auto && t % 2 === 0) {
            document.querySelectorAll('.coords')[t].value = Math.floor(Math.random() * (700 + 700)) - 700;
        }
        else if(document.querySelectorAll('.coords')[t].value.trim() == '' && auto && t % 2 === 1) {
            document.querySelectorAll('.coords')[t].value = Math.floor(Math.random() * (400 + 400)) - 400;
        }
    }
    if(red) {
        canva.clearRect(-700, -400, 1400, 800);
        canva.beginPath();
        canva.moveTo(0, -400);
        canva.lineTo(0, 400);
        canva.moveTo(-700, 0);
        canva.lineTo(700, 0);
        canva.stroke();
        coords = [];
        k = 0;
        for(var j = 0; j < document.querySelectorAll('.coords').length; j += 2) {
            k++;
            coords[k] = {X: +document.querySelectorAll('.coords')[j].value, Y: - +document.querySelectorAll('.coords')[j + 1].value};
        }
        if (k > 3) {
           drawSpline( {r:255, g:0, b:0, a:255}, coords[k-3].X, coords[k-3].Y, coords[k-2].X, coords[k-2].Y, coords[k-1].X, coords[k-1].Y, coords[k].X, coords[k].Y);
        }
        for (var i = 0; i < coords.length - 1; i++) {   
            canva.beginPath();
            canva.arc(coords[i + 1].X, coords[i + 1].Y, 2, 0, 2 * Math.PI);
            canva.stroke();
            canva.fillStyle = "green";
            canva.fill();
        }
    }
})