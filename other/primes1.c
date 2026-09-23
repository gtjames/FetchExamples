#include <stdbool.h>
#include <stddef.h>
#include <stdlib.h>

int *getPrimes(int max, size_t *primeCount) {
    *primeCount = 0;

    if (max < 2) {
        return NULL;
    }

    // false = not yet marked composite; true = composite
    bool *sieve = calloc((size_t)max + 1, sizeof *sieve);
    int *primes = malloc((size_t)max * sizeof *primes);

    if (sieve == NULL || primes == NULL) {
        free(sieve);
        free(primes);
        return NULL;
    }

    primes[(*primeCount)++] = 2;

    // Check odd numbers only.
    for (int i = 3; i <= max; i += 2) {
        if (!sieve[i]) {
            primes[(*primeCount)++] = i;

            // Mark odd multiples of i as composite.
            for (int j = 3 * i; j <= max; j += 2 * i) {
                sieve[j] = true;
            }
        }
    }

    free(sieve);
    return primes;
}

#include <stdio.h>
#include <stdlib.h>

int main(void) {
    size_t count;
    int *primes = getPrimes(50, &count);

    for (size_t i = 0; i < count; i++) {
        printf("%d ", primes[i]);
    }
    printf("\n");

    free(primes);
    return 0;
}