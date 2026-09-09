#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int *countPrimes(int max) {
    int *sieve = calloc((size_t)max + 1, sizeof *sieve);

    size_t count = 1;  // Count 2, the only even prime.
    sieve[0] = 1;

    for (int i = 3; i <= max; i += 2) {
        if (!sieve[i]) {
            sieve[0]++;

            // Mark odd multiples of this prime as composite.
            // Start at i*i because smaller multiples were handled earlier.
            if (i <= max / i) {
                for (int j = i * i; j <= max; j += 2 * i) {
                    sieve[j] = true;
                }
            }
        }
    }

    return sieve;
}

int main(void) {
    int max = 100000007;

    clock_t start = clock();
    int *sieve = countPrimes(max);
    clock_t end = clock();

    double milliseconds =
        1000.0 * (double)(end - start) / CLOCKS_PER_SEC;

    printf("Primes from 2 through %d: %d\n", max, sieve[0]);
    printf("Calculation time: %.3f ms\n", milliseconds);

    return 0;
}