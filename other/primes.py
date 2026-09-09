import time

def get_primes(maximum):
    sieve = [False] * (maximum + 1)
    primes = [2] if maximum >= 2 else []

    # Check odd numbers only.
    for i in range(3, maximum + 1, 2):
        if not sieve[i]:
            primes.append(i)

            # Mark odd multiples as composite.
            for j in range(3 * i, maximum + 1, 2 * i):
                sieve[j] = True

    return primes


maximum = 100_000_007

start = time.perf_counter()
primes = get_primes(maximum)
end = time.perf_counter()

print(f"Primes from 2 through {maximum}: {len(primes)}")
print(f"Calculation time: {(end - start) * 1000:.3f} ms")