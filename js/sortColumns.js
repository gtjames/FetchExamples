//--------------------------------------------------------------------------
//		our sorting algorithms
//--------------------------------------------------------------------------
let lastSortCol = null;

//  find the sortable tables and add an event listener for all TH tags
let sortableTable = document.getElementsByClassName('sortable');
Array.from(sortableTable)
    .forEach(tbl => Array.from(tbl.getElementsByTagName('th'))
        .forEach(hdr => hdr.addEventListener('click', () => sortTable(hdr, hdr.cellIndex))));

let copyableTable = document.getElementsByClassName('copyable');
// Array.from(copyableTable)
//     .forEach(tbl => Array.from(tbl.getElementsByTagName('svg'))
//         .forEach(img => img.addEventListener('click', () => navigator.clipboard.writeText(tbl.innerText))));

Array.from(copyableTable)
    .forEach(tbl => Array.from(tbl.getElementsByClassName('bi-copy'))
        .forEach(img => img.addEventListener('click', () => copyEl(tbl))));

const copyEl = (elToBeCopied) => {
    let range, sel;
    
    range = document.createRange();
    sel = window.getSelection();
    // unselect any element in the page
    sel.removeAllRanges();
    
    range.selectNodeContents(elToBeCopied);
    sel.addRange(range);
    document.execCommand('copy');
    sel.removeAllRanges();
};

function sortTable(ele, column) {
    ele.className = (ele.className === "ZTOA" || ele.className.length === 0) ? "ATOZ" : "ZTOA";
    if (lastSortCol !== null && lastSortCol !== ele)
        lastSortCol.className = "";
    lastSortCol = ele;
    return sort_table_rows(ele, column, (ele.className === "ATOZ") ? 1 : -1)
}

let is_number_pattern = /^\d+(\.\d+)?$/;
/* Column 0 is the first column */
function sort_table_rows(ele, column_number, sortOrder) {

    function sort_by_chosen_column(a, b) {
        /* Fetch the text from the row, excluding spaces */
        a = stripNoise(a);
        b = stripNoise(b);

        /* Special handling for numbers */
        if (a.match(is_number_pattern) && b.match(is_number_pattern))
            return (parseFloat(a) - parseFloat(b)) * sortOrder;

        /* All the rest is alphabetical order */
        else if (a < b) return -1 * sortOrder;
        else if (a > b) return 1 * sortOrder;
        else return 0;
    }
    function stripNoise(a) {
        a = a.cells.item(column_number);
        a = (a.innerText || a.textContent);
        a = a.replace(/\$/g,'').replace(/%/g,'').replace(/^\s+/, "").replace(/\s+$/, "").replace(/,/g,'');
        return a;
    }

    let table = ele.parentNode.parentNode.parentNode;    //  tr -> thead -> table
    /*
     * To skip the header, ask for the tBodies.
     * You actually can have more than one tBody, hence the .length and the for loop
     */

    for (let i = 0; i < table.tBodies.length; i++) {
        let tbody = table.tBodies.item(i);
        /* Move into an array */
        let rows = Array.from(tbody.rows);

        /* Sort the array */
        rows = rows.sort(sort_by_chosen_column);

        /* Move back out */
        /* We are taking the original row and adding it to the bottom of the table.
        *  the DOM recognizes this object and moves it from the current location to the
        *  end of the table. A bit of legerdemain is going on but VERY efficient
        */
        while (rows.length > 0) {
            tbody.appendChild(rows.shift());
        }
    }
    return false;
}
