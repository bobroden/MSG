function buildCells(a, b) {
    document.querySelector('.cells-container').innerHTML = '';
    for(let i = 0; i < b; i++) {
        let div = document.createElement('div');
        div.setAttribute('class', 'stroke');
        for(let j = 0; j < a; j++) {
            let label = document.createElement('label');
            label.innerHTML = 'x' + '<sub>' + (j + 1) + '</sub>';
            label.setAttribute('class', 'cell-desc');
            let input = document.createElement('input');
            input.setAttribute('type', 'number');
            input.setAttribute('name', 'cell');
            input.setAttribute('class', 'cell');
            div.append(input);
            div.append(label);
        }
        let span = document.createElement('span');
        span.innerHTML = '=';
        let answer = document.createElement('input');
        answer.setAttribute('type', 'number');
        answer.setAttribute('name', 'cell');
        answer.setAttribute('class', 'answer');
        div.append(span);
        div.append(answer);
        document.querySelector('.cells-container').append(div);
    }
}

function check() {
    let a = +document.querySelector('.quantity').value.trim();
    let b = +document.querySelector('.equation').value.trim();
    if((a >= 2 && a <= 10) && (b >= 2 && b <= 10)) {
        document.querySelector('.help').classList.add('unvissible');
        buildCells(a, b);
    }
    else {
        document.querySelector('.help').classList.remove('unvissible');
    }
}

document.querySelector('.quantity').addEventListener('input', () => {
    check();
})

document.querySelector('.equation').addEventListener('input', () => {
    check();
})

function TransMatrix(A) {
    var m = A.length, n = A[0].length, AT = [];
    for (var i = 0; i < n; i++)
     { AT[ i ] = [];
       for (var j = 0; j < m; j++) AT[ i ][j] = A[j][ i ];
     }
    return AT;
}

function MultiplyMatrix(A,B) {
    var rowsA = A.length, colsA = A[0].length,
        rowsB = B.length, colsB = B[0].length,
        C = [];
    if (colsA != rowsB) return false;
    for (var i = 0; i < rowsA; i++) C[ i ] = [];
    for (var k = 0; k < colsB; k++)
     { for (var i = 0; i < rowsA; i++)
        { var t = 0;
          for (var j = 0; j < rowsB; j++) t += A[ i ][j]*B[j][k];
          C[ i ][k] = t;
        }
     }
    return C;
}

function Determinant(A) {
    var N = A.length, B = [], denom = 1, exchanges = 0;
    for (var i = 0; i < N; ++i)
     { B[ i ] = [];
       for (var j = 0; j < N; ++j) B[ i ][j] = A[ i ][j];
     }
    for (var i = 0; i < N-1; ++i)
     { var maxN = i, maxValue = Math.abs(B[ i ][ i ]);
       for (var j = i+1; j < N; ++j)
        { var value = Math.abs(B[j][ i ]);
          if (value > maxValue){ maxN = j; maxValue = value; }
        }
       if (maxN > i)
        { var temp = B[ i ]; B[ i ] = B[maxN]; B[maxN] = temp;
          ++exchanges;
        }
       else { if (maxValue == 0) return maxValue; }
       var value1 = B[ i ][ i ];
       for (var j = i+1; j < N; ++j)
        { var value2 = B[j][ i ];
          B[j][ i ] = 0;
          for (var k = i+1; k < N; ++k) B[j][k] = (B[j][k]*value1-B[ i ][k]*value2)/denom;
        }
       denom = value1;
     }
    if (exchanges%2) return -B[N-1][N-1];
    else return B[N-1][N-1];
}

function isEqual(A, B) {
    if(A.length !== B.length || A[0].length !== B[0].length)
        return false;
    else {
        for(let i = 0; i < A.length; i++) {
            for(let j = 0; j < A[i].length; j++) {
                if(A[i][j] !== B[i][j])
                    return false;
            }
        }
    }
    return true;
}

function isPositive(A) {
    let det = [];
    for(let i = 1; i < A.length; i++) {
        let c = [];
        for(let j = 0; j < i; j++) {
            c.push([]);
            for(let y = 0; y < i; y++) {
                c[j][y] = A[j][y];
            }
        }
        det.push(c);
    }
    det.push(A);
    for(let x = 0; x < det.length; x++) {
        if(Determinant(det[x]) <= 0)
            return false;
    }
    return true;
}

function negativeMatrix(A) {
    let B = [];
    for(let i = 0; i < A.length; i++) {
        B.push([]);
        for(let j = 0; j < A[i].length; j++) {
            B[i][j] = -A[i][j];
        }
    }
    return B;
}

function SumMatrix(A,B)
{   
    var m = A.length, n = A[0].length, C = [];
    for (var i = 0; i < m; i++)
     { C[ i ] = [];
       for (var j = 0; j < n; j++) C[ i ][j] = A[ i ][j]+B[ i ][j];
     }
    return C;
}

function SubMatrix(A,B)
{   
    var m = A.length, n = A[0].length, C = [];
    for (var i = 0; i < m; i++)
     { C[ i ] = [];
       for (var j = 0; j < n; j++) C[ i ][j] = A[ i ][j]-B[ i ][j];
     }
    return C;
}

function multMatrixNumber(a,A)
{   
    var m = A.length, n = A[0].length, B = [];
    for (var i = 0; i < m; i++)
     { B[ i ] = [];
       for (var j = 0; j < n; j++) B[ i ][j] = a*A[ i ][j];
     }
    return B;
}

function multVectors(A, B) {
    let sum = 0;
    for(let i = 0; i < A.length; i++) {
        sum += A[i][0] * B[i][0];
    }
    return sum;
}

function Solve(A, B) {
    document.querySelector('.dec-x').innerHTML = '';
    let x =[], d = [], g = []; s = [];
    let nul = [];
    for(let i = 0; i < A.length; i++) 
        nul.push([0]);
    x.push(nul);
    d.push(nul);
    g.push(negativeMatrix(B));
    s.push(0);
    for(let k = 1; k < A.length + 1; k++) {
        g.push(SubMatrix(MultiplyMatrix(A, x[k - 1]), B));
        let v = MultiplyMatrix(TransMatrix(g[k]), g[k]);
        let b = MultiplyMatrix(TransMatrix(g[k - 1]), g[k - 1]);
        let del = v[0] / b[0];
        let u = multMatrixNumber(del, d[k - 1]);
        d.push(SumMatrix(negativeMatrix(g[k]), u));
        v = multVectors(d[k], g[k]);
        b = MultiplyMatrix(MultiplyMatrix(TransMatrix(d[k]), A), d[k]);
        s.push(-(v / b[0]));
        u = multMatrixNumber(s[k], d[k]);
        x.push(SumMatrix(x[k - 1], u));
    }
    let str = '';
    for(let j = 0; j < x[x.length - 1].length; j++) {
        if(isNaN(x[x.length - 1][j][0])) {
            if(isNaN(x[x.length - 2][j][0])) {
                str += 0 + '; ';
            }
            else
                str += x[x.length - 2][j][0].toFixed(2) + '; ';
        }
        else {
            str += x[x.length - 1][j][0].toFixed(2) + '; ';
        }
    }
    str = str.substring(0, str.length - 2);
    document.querySelector('.dec-x').innerHTML = str;
}

document.querySelector('.decision').addEventListener('click', () => {
    let A = [];
    let B = [];
    for(let i = 0; i < document.querySelectorAll('.stroke').length; i++) {
        A.push([]);
        if(document.querySelectorAll('.answer')[i].value.trim() === '')
            document.querySelectorAll('.answer')[i].value = 0;
        B.push([+document.querySelectorAll('.answer')[i].value]);
        for(let j = 0; j < document.querySelectorAll('.stroke')[i].querySelectorAll('.cell').length; j++) {
            if(document.querySelectorAll('.stroke')[i].querySelectorAll('.cell')[j].value.trim() === '')
                document.querySelectorAll('.stroke')[i].querySelectorAll('.cell')[j].value = 0;
            A[i].push(+document.querySelectorAll('.stroke')[i].querySelectorAll('.cell')[j].value);
        }
    }
    if(!isEqual(A, TransMatrix(A))) {
        B = MultiplyMatrix(TransMatrix(A), B);
        A = MultiplyMatrix(TransMatrix(A), A);
        buildCells(A[0].length, A.length);
        for(let x = 0; x < A.length; x++) {
            document.querySelectorAll('.answer')[x].value = B[x][0];
            for(let y = 0; y < A[x].length; y++) {
                document.querySelectorAll('.stroke')[x].querySelectorAll('.cell')[y].value = A[x][y];
            }
        }
    }
    if(isPositive(A)) {
        document.querySelector('.help-answer').classList.add('unvissible');
        Solve(A, B);
    }
    else {
        document.querySelector('.help-answer').classList.remove('unvissible');
    }
})