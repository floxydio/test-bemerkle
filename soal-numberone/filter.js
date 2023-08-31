function printNumberPattern(rows, cols) {
    for (let i = 1; i <= rows; i++) {
        let row = '';
        for (let j = 1; j <= cols; j++) {
            row += (i * j) + ' ';
        }
        console.log(row);
    }
}

printNumberPattern(5, 5);