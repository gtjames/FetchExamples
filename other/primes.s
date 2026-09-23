	.build_version macos, 26, 5	sdk_version 26, 5
	.section	__TEXT,__text,regular,pure_instructions
	.globl	_countPrimes                    ; -- Begin function countPrimes
	.p2align	2
_countPrimes:                           ; @countPrimes
	.cfi_startproc
; %bb.0:
	sub	sp, sp, #64
	stp	x29, x30, [sp, #48]             ; 16-byte Folded Spill
	add	x29, sp, #48
	.cfi_def_cfa w29, 16
	.cfi_offset w30, -8
	.cfi_offset w29, -16
	stur	w0, [x29, #-4]
	ldursw	x8, [x29, #-4]
	mov	x9, #1                          ; =0x1
	str	x9, [sp, #8]                    ; 8-byte Folded Spill
	add	x0, x8, #1
	mov	x1, #4                          ; =0x4
	bl	_calloc
	ldr	x8, [sp, #8]                    ; 8-byte Folded Reload
	stur	x0, [x29, #-16]
	str	x8, [sp, #24]
	ldur	x9, [x29, #-16]
	mov	w8, #1                          ; =0x1
	str	w8, [x9]
	mov	w8, #3                          ; =0x3
	str	w8, [sp, #20]
	b	LBB0_1
LBB0_1:                                 ; =>This Loop Header: Depth=1
                                        ;     Child Loop BB0_5 Depth 2
	ldr	w8, [sp, #20]
	ldur	w9, [x29, #-4]
	subs	w8, w8, w9
	b.gt	LBB0_12
	b	LBB0_2
LBB0_2:                                 ;   in Loop: Header=BB0_1 Depth=1
	ldur	x8, [x29, #-16]
	ldrsw	x9, [sp, #20]
	ldr	w8, [x8, x9, lsl #2]
	cbnz	w8, LBB0_10
	b	LBB0_3
LBB0_3:                                 ;   in Loop: Header=BB0_1 Depth=1
	ldur	x9, [x29, #-16]
	ldr	w8, [x9]
	add	w8, w8, #1
	str	w8, [x9]
	ldr	w8, [sp, #20]
	ldur	w9, [x29, #-4]
	ldr	w10, [sp, #20]
	sdiv	w9, w9, w10
	subs	w8, w8, w9
	b.gt	LBB0_9
	b	LBB0_4
LBB0_4:                                 ;   in Loop: Header=BB0_1 Depth=1
	ldr	w8, [sp, #20]
	ldr	w9, [sp, #20]
	mul	w8, w8, w9
	str	w8, [sp, #16]
	b	LBB0_5
LBB0_5:                                 ;   Parent Loop BB0_1 Depth=1
                                        ; =>  This Inner Loop Header: Depth=2
	ldr	w8, [sp, #16]
	ldur	w9, [x29, #-4]
	subs	w8, w8, w9
	b.gt	LBB0_8
	b	LBB0_6
LBB0_6:                                 ;   in Loop: Header=BB0_5 Depth=2
	ldur	x9, [x29, #-16]
	ldrsw	x10, [sp, #16]
	mov	w8, #1                          ; =0x1
	str	w8, [x9, x10, lsl #2]
	b	LBB0_7
LBB0_7:                                 ;   in Loop: Header=BB0_5 Depth=2
	ldr	w9, [sp, #20]
	mov	w8, #2                          ; =0x2
	mul	w9, w8, w9
	ldr	w8, [sp, #16]
	add	w8, w8, w9
	str	w8, [sp, #16]
	b	LBB0_5
LBB0_8:                                 ;   in Loop: Header=BB0_1 Depth=1
	b	LBB0_9
LBB0_9:                                 ;   in Loop: Header=BB0_1 Depth=1
	b	LBB0_10
LBB0_10:                                ;   in Loop: Header=BB0_1 Depth=1
	b	LBB0_11
LBB0_11:                                ;   in Loop: Header=BB0_1 Depth=1
	ldr	w8, [sp, #20]
	add	w8, w8, #2
	str	w8, [sp, #20]
	b	LBB0_1
LBB0_12:
	ldur	x0, [x29, #-16]
	ldp	x29, x30, [sp, #48]             ; 16-byte Folded Reload
	add	sp, sp, #64
	ret
	.cfi_endproc
                                        ; -- End function
	.globl	_main                           ; -- Begin function main
	.p2align	2
_main:                                  ; @main
	.cfi_startproc
; %bb.0:
	sub	sp, sp, #80
	stp	x29, x30, [sp, #64]             ; 16-byte Folded Spill
	add	x29, sp, #64
	.cfi_def_cfa w29, 16
	.cfi_offset w30, -8
	.cfi_offset w29, -16
	mov	w8, #0                          ; =0x0
	str	w8, [sp, #20]                   ; 4-byte Folded Spill
	stur	wzr, [x29, #-4]
	mov	w8, #57607                      ; =0xe107
	movk	w8, #1525, lsl #16
	stur	w8, [x29, #-8]
	bl	_clock
	stur	x0, [x29, #-16]
	ldur	w0, [x29, #-8]
	bl	_countPrimes
	stur	x0, [x29, #-24]
	bl	_clock
	str	x0, [sp, #32]
	ldr	x8, [sp, #32]
	ldur	x9, [x29, #-16]
	subs	x8, x8, x9
	ucvtf	d1, x8
	mov	x8, #70368744177664             ; =0x400000000000
	movk	x8, #16527, lsl #48
	fmov	d0, x8
	fmul	d0, d0, d1
	mov	x8, #145685290680320            ; =0x848000000000
	movk	x8, #16686, lsl #48
	fmov	d1, x8
	fdiv	d0, d0, d1
	str	d0, [sp, #24]
	ldur	w8, [x29, #-8]
	mov	x10, x8
	ldur	x8, [x29, #-24]
	ldr	w8, [x8]
                                        ; kill: def $x8 killed $w8
	mov	x9, sp
	str	x10, [x9]
	str	x8, [x9, #8]
	adrp	x0, l_.str@PAGE
	add	x0, x0, l_.str@PAGEOFF
	bl	_printf
	ldr	d0, [sp, #24]
	mov	x8, sp
	str	d0, [x8]
	adrp	x0, l_.str.1@PAGE
	add	x0, x0, l_.str.1@PAGEOFF
	bl	_printf
	ldr	w0, [sp, #20]                   ; 4-byte Folded Reload
	ldp	x29, x30, [sp, #64]             ; 16-byte Folded Reload
	add	sp, sp, #80
	ret
	.cfi_endproc
                                        ; -- End function
	.section	__TEXT,__cstring,cstring_literals
l_.str:                                 ; @.str
	.asciz	"Primes from 2 through %d: %d\n"

l_.str.1:                               ; @.str.1
	.asciz	"Calculation time: %.3f ms\n"

.subsections_via_symbols
