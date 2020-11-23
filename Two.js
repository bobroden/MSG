var coords = [];
var coordsX = [];
var coordsY =[];
var k = 0;
 
CanvasRenderingContext2D.prototype.curve = CanvasRenderingContext2D.prototype.curve || function(points, tension, numOfSeg, close) {

    // options or defaults
    tension = (typeof tension === 'number') ? tension : 0.5;
    numOfSeg = numOfSeg ? numOfSeg : 25;

    var pts,                                    // for cloning point array
        i = 1,
        l = points.length,
        rPos = 0,
        rLen = (l-2) * numOfSeg + 2 + (close ? 2 * numOfSeg: 0),
        res = new Float32Array(rLen),
        cache = new Float32Array((numOfSeg + 2) * 4),
        cachePtr = 4;

    pts = points.slice(0);

    if (close) {
        pts.unshift(points[l - 1]);             // insert end point as first point
        pts.unshift(points[l - 2]);
        pts.push(points[0], points[1]);         // first point as last point
    }
    else {
        pts.unshift(points[1]);                 // copy 1. point and insert at beginning
        pts.unshift(points[0]);
        pts.push(points[l - 2], points[l - 1]); // duplicate end-points
    }

    // cache inner-loop calculations as they are based on t alone
    cache[0] = 1;                               // 1,0,0,0

    for (; i < numOfSeg; i++) {

        var st = i / numOfSeg,
            st2 = st * st,
            st3 = st2 * st,
            st23 = st3 * 2,
            st32 = st2 * 3;

        cache[cachePtr++] = st23 - st32 + 1;    // c1
        cache[cachePtr++] = st32 - st23;        // c2
        cache[cachePtr++] = st3 - 2 * st2 + st; // c3
        cache[cachePtr++] = st3 - st2;          // c4
    }

    cache[++cachePtr] = 1;                      // 0,1,0,0

    // calc. points
    parse(pts, cache, l);

    if (close) {
        //l = points.length;
        pts = [];
        pts.push(points[l - 4], points[l - 3], points[l - 2], points[l - 1]); // second last and last
        pts.push(points[0], points[1], points[2], points[3]); // first and second
        parse(pts, cache, 4);
    }

    function parse(pts, cache, l) {

        for (var i = 2, t; i < l; i += 2) {

            var pt1 = pts[i],
                pt2 = pts[i+1],
                pt3 = pts[i+2],
                pt4 = pts[i+3],

                t1x = (pt3 - pts[i-2]) * tension,
                t1y = (pt4 - pts[i-1]) * tension,
                t2x = (pts[i+4] - pt1) * tension,
                t2y = (pts[i+5] - pt2) * tension;

            for (t = 0; t < numOfSeg; t++) {

                var c = t << 2, //t * 4;

                    c1 = cache[c],
                    c2 = cache[c+1],
                    c3 = cache[c+2],
                    c4 = cache[c+3];

                res[rPos++] = c1 * pt1 + c2 * pt3 + c3 * t1x + c4 * t2x;
                res[rPos++] = c1 * pt2 + c2 * pt4 + c3 * t1y + c4 * t2y;
            }
        }
    }

    // add last point
    l = close ? 0 : points.length - 2;
    res[rPos++] = points[l];
    res[rPos] = points[l+1];

    // add lines to path
    for(i = 0, l = res.length; i < l; i += 2)
        this.lineTo(res[i], res[i+1]);

    return res;
};

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

function ordering(arr1, arr2) {
    while(arr1.length !== 0) {
        var min = arr1[0];
        var ind = 0;
        for (var i = 0; i < arr1.length; i++) {
            if(min > arr1[i]) {
                min = arr1[i];
                ind = i;
            }
        }
        coords.push(arr1.splice(ind, 1));
        coords.push(arr2.splice(ind, 1));
    }
}

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
            k += 1;
            coordsX.push(+document.querySelectorAll('.coords')[j].value);
            coordsY.push(- +document.querySelectorAll('.coords')[j + 1].value);
        }
        ordering(coordsX, coordsY);
        if (k > 3) {
            canva.moveTo(coords[0], coords[1]);
            canva.curve(coords);
            canva.stroke();
        }
        for (var i = 0; i < coords.length; i += 2) {   
            canva.beginPath();
            canva.arc(coords[i], coords[i + 1], 2, 0, 2 * Math.PI);
            canva.stroke();
            canva.fillStyle = "green";
            canva.fill();
        }
    }
})