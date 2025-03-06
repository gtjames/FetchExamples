	.data
	.type	a, %object
	.size	a, 10
	.type	n, %object
	.size	n, 1

	// array a with 10 values
a:	.xword 79, 55, 94, 48, 19, 13, 45, 2, 3, 99
n:	.xword 10

	.text
	.global main
	.arch armv8-a+fp+simd
	.type main, %function
	.type find_smallest %function
	.type find_largest %function
	.type swap %function

	// void find_smallest(int *a, int i, int n, int index)
	// int *a =	X0, int i =	X1, int n =	X2, int index =	X3
	// smallest is	X9, j is	X10, a[j] is	X11
	// void find_smallest (int *a, int i, int n,  int smallest, int index) {
	//     smallest =a[i];
	// 	index = i;
	// 	for (j = i; j <n; j++) {
	// 		if (a[j] < smallest) {
	// 			smallest = a[j];
	// 			index = j;
	//         }
	//     }
	//     return index;
	// }

find_smallest:
    	// push	create your stack space and save registers
    	// pop	restore registers and reset the stack
    BR  	X30

	// void find_largest(int *a, int i, int n, int index)
	// int *a =	X0, int i =	X1, int n =	X2, int index =	X3
	// largest is	X9, j is	X10, a[j] is	X11
	//  void find_largest (int *a, int i, int n, int largest, int index) {
	//     largest = a[n];
	//     index = n;
	//     for (j = I; j <n; j++) {
	//         if (a[j] > largest) {
	//             largest = a[j];
	//             index = j;
	//         }
	//     }
	//     return index;
	// }

find_largest:
    	// push	create your stack space and save registers
    	// pop	restore registers and reset the stack
        BR  	X30
        BR  	X30

	// void swap(int *a, int i, int j)
	// int *a =	X0, int i =	X4, int j =	X5
	// addr of a[i] is	X9, a[i] is	X10, addr of a[j] is	X11, a[j] is	X12
swap:
    	                            // push	X9 -	X12 to stack
    SUB  	SP, 	SP,		#32
    STUR	X9, 	[SP,	#24]
    STUR	X10, 	[SP,	#16]
    STUR	X11, 	[SP,	#8]
    STUR	X12, 	[SP,	#0]

    LSL 	X9,		X4,		#3
    ADD 	X9,		X9,		X0 	    // get addr of a[i]
    LDUR	X10, 	[X9,	#0] 	// get value of a[i]

    LSL 	X11,	X5,		#3
    ADD 	X11,	X11,	X0 	    // get addr of a[j]
    LDUR	X12,	[X11,	#0] 	// get value of a[j]

    STUR	X12, 	[X9,	#0] 	// store value of a[i] into a[j]
    STUR	X10, 	[X11,	#0] 	// store value of a[j] into a[i]

                                	// pop	X9 -	X12 back
    LDUR	X12, 	[SP,	#0]
    LDUR	X11, 	[SP,	#8]
    LDUR	X10, 	[SP,	#16]
    LDUR	X9, 	[SP,	#24]
    ADD  	SP, 	SP,		#32
    BR  	X30

	// addr of a is	X9, n is	X10, i is	X11, index is	X12
main:
	ADRP	X9, 	a
	ADD 	X9,		X9, :lo12:a 	//get addr of a
	ADRP	X10, 	n
	ADD 	X10,	X10, :lo12:n 	//get addr of n
	LDUR	X10, 	[X10,	#0] 	// n = 10

	MOV 	X11,	XZR 	        // i = 0

loop:
    CMP 	X11,	X10 	// i < n?
    B.GE 	Exit 	        // goto Exit when i >= n

    MOV 	X0,	X9 	        // assign addr of a to parameter of func find_smallest
    MOV 	X1,	X11 	    // assign i to parameter of func find_smallest
    MOV 	X2,	X10 	    // assign n to parameter of func find_smallest
    BL   	find_smallest 	// call func find_smallest
    MOV 	X12,	X3 	    // assign result to index

    MOV 	X0,	X9 	    	// assign addr of a to parameter of func swap
    MOV 	X4,	X11  	    // assign i to parameter of func swap
    MOV 	X5,	X12 	    // assign index to parameter of func swap
    BL   	swap 	    	// call func swap

    MOV 	X0,	X9 		    //assign addr of a to parameter of func find_largest
    MOV 	X1,	X11 		//assign i to parameter of func find_largest
    MOV 	X2,	X10 		//assign n to parameter of func find_largest
    BL   	find_largest 	//call func find_largest
    MOV 	X12,	X3 		// assign result to index

    MOV 	X0,	X9 			// assign addr of a to parameter of func swap
    SUB 	X4,	X10,	#1 	// assign n-1 to parameter of func swap
    MOV 	X5,	X12 		// assign index to parameter of func swap
    BL   	swap 			//call func swap

    ADD 	X11,	X11,	#1 	// i++
    SUB 	X10,	X10,	#1 	// n--

    B    loop 	            //continue
Exit:
	NOP
