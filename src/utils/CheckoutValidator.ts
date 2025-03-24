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
    158: { route: "T20 T20 D19", darts: 3 },
    157: { route: "T20 T19 D20", darts: 3 },
    156: { route: "T20 T20 D18", darts: 3 },
    155: { route: "T20 T19 D19", darts: 3 },
    154: { route: "T20 T18 D20", darts: 3 },
    153: { route: "T20 T19 D18", darts: 3 },
    152: { route: "T20 T20 D16", darts: 3 },
    151: { route: "T20 T17 D20", darts: 3 },
    150: { route: "T20 T18 D18", darts: 3 },
    149: { route: "T20 T19 D16", darts: 3 },
    148: { route: "T20 T20 D14", darts: 3 },
    147: { route: "T20 T17 D18", darts: 3 },
    146: { route: "T20 T18 D16", darts: 3 },
    145: { route: "T20 T15 D20", darts: 3 },
    144: { route: "T20 T20 D12", darts: 3 },
    143: { route: "T20 T17 D16", darts: 3 },
    142: { route: "T20 T14 D20", darts: 3 },
    141: { route: "T20 T19 D12", darts: 3 },
    140: { route: "T20 T20 D10", darts: 3 },
    139: { route: "T20 T19 D11", darts: 3 },
    138: { route: "T20 T18 D12", darts: 3 },
    137: { route: "T20 T19 D10", darts: 3 },
    136: { route: "T20 T20 D8", darts: 3 },
    135: { route: "T20 T17 D12", darts: 3 },
    134: { route: "T20 T14 D16", darts: 3 },
    133: { route: "T20 T19 D8", darts: 3 },
    132: { route: "T20 T16 D12", darts: 3 },
    131: { route: "T20 T13 D16", darts: 3 },
    130: { route: "T20 T18 D8", darts: 3 },
    129: { route: "T19 T16 D12", darts: 3 },
    128: { route: "T18 T14 D16", darts: 3 },
    127: { route: "T20 T17 D8", darts: 3 },
    126: { route: "T19 T19 D6", darts: 3 },
    125: { route: "T20 T11 D16", darts: 3 },
    124: { route: "T20 T16 D8", darts: 3 },
    123: { route: "T19 T16 D9", darts: 3 },
    122: { route: "T18 T20 D4", darts: 3 },
    121: { route: "T20 T11 D14", darts: 3 },
    120: { route: "T20 20 D20", darts: 3 },
    119: { route: "T19 T12 D13", darts: 3 },
    118: { route: "T20 18 D20", darts: 3 },
    117: { route: "T20 17 D20", darts: 3 },
    116: { route: "T20 16 D20", darts: 3 },
    115: { route: "T20 15 D20", darts: 3 },
    114: { route: "T20 14 D20", darts: 3 },
    113: { route: "T20 13 D20", darts: 3 },
    112: { route: "T20 12 D20", darts: 3 },
    111: { route: "T20 11 D20", darts: 3 },
    110: { route: "T20 Bull", darts: 2 },
    109: { route: "T19 Bull", darts: 2 },
    108: { route: "T20 8 D20", darts: 3 },
    107: { route: "T19 Bull", darts: 2 },
    106: { route: "T20 6 D20", darts: 3 },
    105: { route: "T20 5 D20", darts: 3 },
    104: { route: "T18 Bull", darts: 2 },
    103: { route: "T19 6 D20", darts: 3 },
    102: { route: "T20 2 D20", darts: 3 },
    101: { route: "T17 Bull", darts: 2 },
    100: { route: "T20 D20", darts: 2 },
    98: { route: "T20 D19", darts: 2 },
    97: { route: "T19 D20", darts: 2 },
    96: { route: "T20 D18", darts: 2 },
    95: { route: "T19 D19", darts: 2 },
    94: { route: "T18 D20", darts: 2 },
    93: { route: "T19 D18", darts: 2 },
    92: { route: "T20 D16", darts: 2 },
    91: { route: "T20 D15", darts: 2 },
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

    // Tjek om den resterende score er en mulig double (2-40 med lige tal, eller 50)
    const isDoubleScore = (remainingScore <= 40 && remainingScore % 2 === 0) || remainingScore === 50;

    // Tjek om den resterende score har en gyldig checkout route
    const checkout = this.CHECKOUTS[remainingScore];

    // Hvis scoren er under 40, skal vi tjekke om den er lige/ulige
    if (remainingScore <= 40) {
      return {
        isPossible: true,
        minimumDarts: remainingScore % 2 === 0 ? 1 : 2,
        possibleDoubleAttempt: true,
        checkoutRoute: checkout?.route
      };
    }

    // For scores over 40, tjek om det er en gyldig checkout route
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

  // Henter checkout ruten for en given score
  static getCheckoutRoute(score: number): string {
    return this.CHECKOUTS[score]?.route || 'No direct checkout';
  }
}

export default CheckoutValidator; 