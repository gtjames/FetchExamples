let myArray= [-44, 12, -17, 29, 2, -79, 55, 94];
let size = 7;
sort (myArray, size)						// call sort
console.log(myArray);
function sort(array, size) {        //  X0, X1
    //	Outer loop
    for (let i = 1; i < size; i++) {
        //	Inner loop
        let j = i - 1;
        while (j >= 0) {
            if (array[j] <= array[j + 1])
                break;
            swap(array, j)        //  X0, X1
            j--;
        }
    }
}

function swap(array, k) {
    let temp9 = array[k]	//	reg X9 (temp) = v[k]
    let temp11 = array[k+1]	//	reg X11 = v[k + 1]
//	refers to next element of v
    array[k] = temp11;	//	v[k] = reg X11
    array[k+1] = temp9; //	v[k+1] = reg X9 (temp)
}

