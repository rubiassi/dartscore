interface CheckoutInfo {
  isPossible: boolean;
  minimumDarts: number;
  possibleDoubleAttempt: boolean;
  checkoutRoute?: string;
}

class CheckoutValidator {
  // Alle mulige checkout kombinationer fra 170 og ned
  private static readonly CHECKOUTS: { [key: number]: { route: string; darts: number } } = {
    170: { route: "T20 T20 Bull", darts: 3 },
    167: { route: "T20 T19 Bull", darts: 3 },
    164: { route: "T20 T18 Bull", darts: 3 },
    161: { route: "T20 T17 Bull", darts: 3 },
    160: { route: "T20 T20 D20", darts: 3 },
    // ... flere checkout kombinationer tilføjes her
    100: { route: "T20 D20", darts: 2 },
    98: { route: "T20 D19", darts: 2 },
    97: { route: "T19 D20", darts: 2 },
    96: { route: "T20 D18", darts: 2 },
    95: { route: "T19 D19", darts: 2 },
    94: { route: "T18 D20", darts: 2 },
    93: { route: "T19 D18", darts: 2 },
    92: { route: "T20 D16", darts: 2 },
    91: { route: "T17 D20", darts: 2 },
    90: { route: "T20 D15", darts: 2 },
    89: { route: "T19 D16", darts: 2 },
    88: { route: "T20 D14", darts: 2 },
    87: { route: "T17 D18", darts: 2 },
    86: { route: "T18 D16", darts: 2 },
    85: { route: "T15 D20", darts: 2 },
    84: { route: "T20 D12", darts: 2 },
    83: { route: "T17 D16", darts: 2 },
    82: { route: "T14 D20", darts: 2 },
    81: { route: "T19 D12", darts: 2 },
    80: { route: "T20 D10", darts: 2 },
    79: { route: "T19 D11", darts: 2 },
    78: { route: "T18 D12", darts: 2 },
    77: { route: "T19 D10", darts: 2 },
    76: { route: "T20 D8", darts: 2 },
    75: { route: "T17 D12", darts: 2 },
    74: { route: "T14 D16", darts: 2 },
    73: { route: "T19 D8", darts: 2 },
    72: { route: "T16 D12", darts: 2 },
    71: { route: "T13 D16", darts: 2 },
    70: { route: "T18 D8", darts: 2 },
    69: { route: "T19 D6", darts: 2 },
    68: { route: "T20 D4", darts: 2 },
    67: { route: "T17 D8", darts: 2 },
    66: { route: "T10 D18", darts: 2 },
    65: { route: "T19 D4", darts: 2 },
    64: { route: "T16 D8", darts: 2 },
    63: { route: "T13 D12", darts: 2 },
    62: { route: "T10 D16", darts: 2 },
    61: { route: "T15 D8", darts: 2 },
    60: { route: "20 D20", darts: 2 },
    59: { route: "19 D20", darts: 2 },
    58: { route: "18 D20", darts: 2 },
    57: { route: "17 D20", darts: 2 },
    56: { route: "16 D20", darts: 2 },
    55: { route: "15 D20", darts: 2 },
    54: { route: "14 D20", darts: 2 },
    53: { route: "13 D20", darts: 2 },
    52: { route: "12 D20", darts: 2 },
    51: { route: "11 D20", darts: 2 },
    50: { route: "10 D20", darts: 2 },
    49: { route: "9 D20", darts: 2 },
    48: { route: "8 D20", darts: 2 },
    47: { route: "15 D16", darts: 2 },
    46: { route: "6 D20", darts: 2 },
    45: { route: "5 D20", darts: 2 },
    44: { route: "4 D20", darts: 2 },
    43: { route: "3 D20", darts: 2 },
    42: { route: "10 D16", darts: 2 },
    41: { route: "9 D16", darts: 2 },
    40: { route: "D20", darts: 1 },
    39: { route: "7 D16", darts: 2 },
    38: { route: "D19", darts: 1 },
    37: { route: "5 D16", darts: 2 },
    36: { route: "D18", darts: 1 },
    35: { route: "3 D16", darts: 2 },
    34: { route: "D17", darts: 1 },
    33: { route: "1 D16", darts: 2 },
    32: { route: "D16", darts: 1 },
    31: { route: "7 D12", darts: 2 },
    30: { route: "D15", darts: 1 },
    29: { route: "13 D8", darts: 2 },
    28: { route: "D14", darts: 1 },
    27: { route: "19 D4", darts: 2 },
    26: { route: "D13", darts: 1 },
    25: { route: "9 D8", darts: 2 },
    24: { route: "D12", darts: 1 },
    23: { route: "7 D8", darts: 2 },
    22: { route: "D11", darts: 1 },
    21: { route: "5 D8", darts: 2 },
    20: { route: "D10", darts: 1 },
    19: { route: "3 D8", darts: 2 },
    18: { route: "D9", darts: 1 },
    17: { route: "1 D8", darts: 2 },
    16: { route: "D8", darts: 1 },
    15: { route: "7 D4", darts: 2 },
    14: { route: "D7", darts: 1 },
    13: { route: "5 D4", darts: 2 },
    12: { route: "D6", darts: 1 },
    11: { route: "3 D4", darts: 2 },
    10: { route: "D5", darts: 1 },
    9: { route: "1 D4", darts: 2 },
    8: { route: "D4", darts: 1 },
    7: { route: "3 D2", darts: 2 },
    6: { route: "D3", darts: 1 },
    5: { route: "1 D2", darts: 2 },
    4: { route: "D2", darts: 1 },
    3: { route: "1 D1", darts: 2 },
    2: { route: "D1", darts: 1 }
  };

  // Tjekker om en score kunne give mulighed for et double-forsøg
  static checkPossibleDoubleAttempt(startScore: number, thrownScore: number): CheckoutInfo {
    const remainingScore = startScore - thrownScore;
    
    // Hvis den resterende score er over 170 eller under 2, ingen double mulighed
    if (remainingScore > 170 || remainingScore < 2) {
      return {
        isPossible: false,
        minimumDarts: 0,
        possibleDoubleAttempt: false
      };
    }

    // Tjek om den resterende score har en gyldig checkout route
    const checkout = this.CHECKOUTS[remainingScore];
    if (checkout) {
      return {
        isPossible: true,
        minimumDarts: checkout.darts,
        possibleDoubleAttempt: true,
        checkoutRoute: checkout.route
      };
    }

    return {
      isPossible: false,
      minimumDarts: 0,
      possibleDoubleAttempt: false
    };
  }

  // Validerer om en checkout score er mulig og returnerer minimum antal pile påkrævet
  static validateCheckout(startScore: number, thrownScore: number): CheckoutInfo {
    // Hvis scoren ikke er præcis 0, er det ikke en checkout
    if (startScore - thrownScore !== 0) {
      return {
        isPossible: false,
        minimumDarts: 0,
        possibleDoubleAttempt: false
      };
    }

    // Find checkout information for start scoren
    const checkout = this.CHECKOUTS[startScore];
    if (checkout) {
      return {
        isPossible: true,
        minimumDarts: checkout.darts,
        possibleDoubleAttempt: true,
        checkoutRoute: checkout.route
      };
    }

    // Hvis scoren ikke findes i CHECKOUTS, er det ikke en gyldig checkout
    return {
      isPossible: false,
      minimumDarts: 0,
      possibleDoubleAttempt: false
    };
  }
}

export default CheckoutValidator; 