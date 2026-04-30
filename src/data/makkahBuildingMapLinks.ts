/**
 * Direct Google Maps location links for individual Makkah Hajj 2026 building numbers.
 *
 * Source: "HAJ-2026 ALL BUILDINGS LOCATION LIST – MAKKAH-AL-MUKARRAMAH"
 * compiled by Mohammed Salman (+91-91752 09903) from the official Haj Suvidha App data.
 *
 * Each entry maps an actual building number (101–1839) to its precise Google Maps pin.
 * Use this for room-level/building-level navigation. For broader zone navigation,
 * see hajjBuildingZones.ts.
 */

export interface MakkahBuildingMapLink {
  building: number;
  /** Some buildings (e.g. 170, 205, 229, 405) have a "(i)" updated variant. */
  variant?: "primary" | "alt";
  url: string;
}

export const makkahBuildingMapLinks: MakkahBuildingMapLink[] = [
  // 101–121
  { building: 101, url: "https://goo.gl/maps/RnVWXNsy9PgNnRd29" },
  { building: 102, url: "https://goo.gl/maps/ueggC4TatAr4P6G68" },
  { building: 103, url: "https://goo.gl/maps/7kgbR5R8c6wBFs3o6" },
  { building: 104, url: "https://goo.gl/maps/EFmZvenZdKzPU8g19" },
  { building: 105, url: "https://goo.gl/maps/fTThUwvEtPPMf6Es7" },
  { building: 106, url: "https://goo.gl/maps/WmzeRYGGVLY6UQB16" },
  { building: 107, url: "https://goo.gl/maps/iDTQj4rSXFSbeBsz6" },
  { building: 108, url: "https://goo.gl/maps/aAwuN6N1tCQFsBMe9" },
  { building: 109, url: "https://goo.gl/maps/QXKTUXEyx2yeZc3T9" },
  { building: 110, url: "https://goo.gl/maps/fn2JEgoSM2TzpSGKA" },
  { building: 111, url: "https://goo.gl/maps/vazLFSqUauGDkiAfA" },
  { building: 112, url: "https://goo.gl/maps/yeaTTwsvnr28munz9" },
  { building: 113, url: "https://goo.gl/maps/r76iH2vDNLtKcj846" },
  { building: 114, url: "https://goo.gl/maps/LipJ4yihwb8GSPfT7" },
  { building: 115, url: "https://goo.gl/maps/udmRsL2VniUrvQ9Z8" },
  { building: 116, url: "https://goo.gl/maps/L5YJVWp1yyMMPuJ48" },
  { building: 117, url: "https://goo.gl/maps/gvwvNFfk15cnETWU8" },
  { building: 118, url: "https://goo.gl/maps/KxXyTWxSKnGmKrFx8" },
  { building: 119, url: "https://goo.gl/maps/dpqLC9Bw3iSA31uu7" },
  { building: 120, url: "https://goo.gl/maps/j2rT617sGUhjNwim8" },
  { building: 121, url: "https://goo.gl/maps/uqxwfvrC3HUjA4MBA" },

  // 122–145
  { building: 122, url: "https://goo.gl/maps/QwX2DVrtN1iWXBPG7" },
  { building: 123, url: "https://goo.gl/maps/gm41jr6tJsUwYaKg8" },
  { building: 124, url: "https://goo.gl/maps/jrBVawv4BkciX3SG8" },
  { building: 125, url: "https://goo.gl/maps/iW5HMThsevpmeFzJ8" },
  { building: 126, url: "https://goo.gl/maps/bMLrvHiVeB6AoYsK7" },
  { building: 127, url: "https://goo.gl/maps/FhN6nDNWG3qrnn936" },
  { building: 128, url: "https://goo.gl/maps/CBTv7HEgWrN7P59z7" },
  { building: 129, url: "https://goo.gl/maps/3zgjZwJWwTirzVpS9" },
  { building: 130, url: "https://goo.gl/maps/dMSEKCqDTW1QKrdz6" },
  { building: 131, url: "https://goo.gl/maps/b1QP4jwuzEhQJWzn7" },
  { building: 132, url: "https://goo.gl/maps/5DpMcy8fL56wYmpcA" },
  { building: 133, url: "https://goo.gl/maps/LPeFom9vuMCbVfPFA" },
  { building: 134, url: "https://goo.gl/maps/AzwwpE8i76jZCrWi9" },
  { building: 135, url: "https://goo.gl/maps/STqCHbqCfpzxktux9" },
  { building: 136, url: "https://goo.gl/maps/MtzM3Ys1JLE3yFAs9" },
  { building: 137, url: "https://goo.gl/maps/pHTpvYivw5HWd7ei7" },
  { building: 138, url: "https://goo.gl/maps/pHTpvYivw5HWd7ei7" },
  { building: 139, url: "https://goo.gl/maps/wPwWHNKUc7xGbQUU6" },
  { building: 140, url: "https://goo.gl/maps/33BMbp7manQSg7vk7" },
  { building: 141, url: "https://goo.gl/maps/qJ4nonjm6Sa4eiJX8" },
  { building: 142, url: "https://goo.gl/maps/waMCCw3MEpbEYvT78" },
  { building: 143, url: "https://goo.gl/maps/wzeo4W6PtK5fR7xp9" },
  { building: 144, url: "https://goo.gl/maps/HHBcDpGmtF2LTt2X6" },
  { building: 145, url: "https://goo.gl/maps/eAu5jWHmrsueevoZ7" },

  // 146–169
  { building: 146, url: "https://goo.gl/maps/sWdVUrjmkfL8XBfz7" },
  { building: 147, url: "https://goo.gl/maps/5NKy4NDp1n1SvfNP6" },
  { building: 148, url: "https://goo.gl/maps/tJL3RXxJBxLXCEaE7" },
  { building: 149, url: "https://goo.gl/maps/d7TmzeaNF7Z3GdCx5" },
  { building: 150, url: "https://goo.gl/maps/FthS3HXVkutR3b1x8" },
  { building: 151, url: "https://goo.gl/maps/41oZJ6omzs8N1vPz8" },
  { building: 152, url: "https://goo.gl/maps/d4aXpoboYRudHgKY7" },
  { building: 153, url: "https://goo.gl/maps/itALtp69g7C511157" },
  { building: 154, url: "https://goo.gl/maps/DvZnnoBjGVks88x76" },
  { building: 155, url: "https://goo.gl/maps/9zbuw8JdzGHPNEeW9" },
  { building: 156, url: "https://goo.gl/maps/PZxX7Jc2f9josrca6" },
  { building: 157, url: "https://goo.gl/maps/waPtjzaKyWxpwMzG6" },
  { building: 158, url: "https://goo.gl/maps/M33eTzDVqSUex7Jn6" },
  { building: 159, url: "https://goo.gl/maps/8Tg6jQqsUjrucrJ4A" },
  { building: 160, url: "https://goo.gl/maps/c6N6LjBDB9odNtya9" },
  { building: 161, url: "https://goo.gl/maps/wim6Ypt5K2jcjP9p7" },
  { building: 162, url: "https://goo.gl/maps/4HKkwo53nrdEtb8P7" },
  { building: 163, url: "https://goo.gl/maps/sHcVsFP259VFwh2g8" },
  { building: 164, url: "https://goo.gl/maps/Uye1xPQwAqBrMXz18" },
  { building: 165, url: "https://goo.gl/maps/FUku7kocMSwzVm9bA" },
  { building: 166, url: "https://goo.gl/maps/C8a2h1tB3A9iRjCz6" },
  { building: 167, url: "https://goo.gl/maps/5kPnWzm2tai8Aa4p8" },
  { building: 168, url: "https://goo.gl/maps/EY3CHJpVhqRLLoY96" },
  { building: 169, url: "https://goo.gl/maps/Dbcwc5NDTUDUavbW6" },

  // 170–204 (170 has alt variant "70(i)")
  { building: 170, variant: "alt", url: "https://goo.gl/maps/UuK5r1GXSFT1Tamd6" },
  { building: 171, url: "https://goo.gl/maps/TXCv61EYC3bTwTcFA" },
  { building: 172, url: "https://goo.gl/maps/wR7qLgmy8eQeSTDN8" },
  { building: 173, url: "https://goo.gl/maps/QbAGtvpm2Mjfwbmr9" },
  { building: 174, url: "https://goo.gl/maps/DqoA6cq7ZzzEC6a9A" },
  { building: 175, url: "https://goo.gl/maps/SvQxY3sVtEUxgR347" },
  { building: 176, url: "https://goo.gl/maps/AjTFMYnAEGX5iX2n7" },
  { building: 177, url: "https://goo.gl/maps/6wXyo4j2as4HmJeA8" },
  { building: 178, url: "https://goo.gl/maps/VYYFEQeKdPXHsrz36" },
  { building: 179, url: "https://goo.gl/maps/MueDe5FqxEGR7nzX8" },
  { building: 180, url: "https://goo.gl/maps/ecbgsmQCowHq88wf8" },
  { building: 181, url: "https://goo.gl/maps/uMCBh1edWkurDEhc8" },
  { building: 182, url: "https://goo.gl/maps/Atebs1nMpk26mjhC9" },
  { building: 183, url: "https://goo.gl/maps/nmo7ANMVQ5xQzcZd8" },
  { building: 184, url: "https://goo.gl/maps/mzqVoRPRxL4mdwFM7" },
  { building: 185, url: "https://goo.gl/maps/6LG5RLoRH2xMWwUc8" },
  { building: 186, url: "https://goo.gl/maps/KxpRfPFdJUoHXnAv7" },
  { building: 187, url: "https://goo.gl/maps/XDtDsvS8jMqBSNWj6" },
  { building: 188, url: "https://goo.gl/maps/LjxMHwSALAeEzJz69" },
  { building: 189, url: "https://goo.gl/maps/j3QLPycGu8eDJbaw5" },
  { building: 201, url: "https://goo.gl/maps/D86HjyTDXMrFdgHD8" },
  { building: 202, url: "https://goo.gl/maps/KN4f2bmt7rYzV3yK9" },
  { building: 203, url: "https://goo.gl/maps/qsA1pRanbeW11VbQ9" },
  { building: 204, url: "https://goo.gl/maps/3Q9VwVygutJpHS9f6" },

  // 205–228 (205 has alt variant "93(i)")
  { building: 205, variant: "alt", url: "https://goo.gl/maps/rs9ghqQK8Prhhcmy8" },
  { building: 206, url: "https://goo.gl/maps/S7ute3thKGQW8zDE7" },
  { building: 207, url: "https://goo.gl/maps/VFkhSxTWqwmLjotv9" },
  { building: 208, url: "https://goo.gl/maps/acbCjQKR9ntJtvK16" },
  { building: 209, url: "https://goo.gl/maps/BWcfSd5unshLGtrRA" },
  { building: 210, url: "https://goo.gl/maps/Pd4h4XTv1TjZVzGC8" },
  { building: 211, url: "https://goo.gl/maps/q9Sd4d6kGM1bdYe56" },
  { building: 212, url: "https://goo.gl/maps/rFwfdStq4DLm92av9" },
  { building: 213, url: "https://goo.gl/maps/k8TxdtsR2G2kh9Wf8" },
  { building: 214, url: "https://goo.gl/maps/2iFPEqwSAgnSCcKh9" },
  { building: 215, url: "https://goo.gl/maps/APSqufZSKG1oAMmF6" },
  { building: 216, url: "https://goo.gl/maps/KWMK56TRV98ZScL4A" },
  { building: 217, url: "https://goo.gl/maps/HXk41eDK3paErbBU7" },
  { building: 218, url: "https://goo.gl/maps/Lqcgbu9FoZkToT1M6" },
  { building: 219, url: "https://goo.gl/maps/52bRM1UDZ53JCWjd8" },
  { building: 220, url: "https://goo.gl/maps/AUU56kPEP3YiWnRq6" },
  { building: 221, url: "https://goo.gl/maps/aov28aRV9F5x9MmM7" },
  { building: 222, url: "https://goo.gl/maps/x2gBy1KxEzdxNnjP9" },
  { building: 223, url: "https://goo.gl/maps/PN4hdqGYXMZQ9fv67" },
  { building: 224, url: "https://goo.gl/maps/X1wbvr1wqPxWbBpU8" },
  { building: 225, url: "https://goo.gl/maps/Q1xCZC6hrgmjrb9d6" },
  { building: 226, url: "https://goo.gl/maps/dPmCGNiYiufYhZUG9" },
  { building: 227, url: "https://goo.gl/maps/L3hNnqJhUkk3CMxX6" },
  { building: 228, url: "https://goo.gl/maps/YmNjbJMhDAz4BHDt7" },

  // 229–241 (229 has alt variant "116(i)")
  { building: 229, variant: "alt", url: "https://goo.gl/maps/ezMV4VJQ8wmtf7bi7" },
  { building: 230, url: "https://goo.gl/maps/FuTEW8tQHTk4RNjb7" },
  { building: 231, url: "https://goo.gl/maps/2AH9twHhNnvshmC67" },
  { building: 232, url: "https://goo.gl/maps/otiDngY2AmphMUoM8" },
  { building: 233, url: "https://goo.gl/maps/VK2it6X1SUDzjccP6" },
  { building: 234, url: "https://goo.gl/maps/9d3GX5sxoRhZWsdA7" },
  { building: 235, url: "https://goo.gl/maps/ukEc2Kp7xnMhH1yEA" },
  { building: 236, url: "https://goo.gl/maps/caNxFkeJv8JtYEaW9" },
  { building: 237, url: "https://goo.gl/maps/zEsX7B76RoHYsKKe6" },
  { building: 238, url: "https://goo.gl/maps/5vKszBMLEbLXX5JcA" },
  { building: 239, url: "https://goo.gl/maps/vwxC5LDZZ1U4AtSe6" },
  { building: 240, url: "https://goo.gl/maps/dnXngBqkUcZoFLtA9" },
  { building: 241, url: "https://goo.gl/maps/XaSTSNY2Bjg2L6Ft5" },

  // 301–307
  { building: 301, url: "https://goo.gl/maps/aHFppmbAd9iJnVeh8" },
  { building: 302, url: "https://goo.gl/maps/JQGkvxfUH6DU4cZm7" },
  { building: 303, url: "https://goo.gl/maps/7Gdf2pBJMevUKCrS6" },
  { building: 304, url: "https://goo.gl/maps/3s58SuTdoQqyQeZN8" },
  { building: 305, url: "https://goo.gl/maps/D2pGQ7VjupxyRcnM6" },
  { building: 306, url: "https://goo.gl/maps/nHDUbQv2GB45Qftn6" },
  { building: 307, url: "https://goo.gl/maps/oavddqrUM2Y2hWNg7" },

  // 401–416
  { building: 401, url: "https://goo.gl/maps/Rs6KBf2bUnvp7i9k7" },
  { building: 402, url: "https://goo.gl/maps/ewLDkdkMaQizqvfm9" },
  { building: 403, url: "https://goo.gl/maps/p3AVJKRcm41EYvUs8" },
  { building: 404, url: "https://goo.gl/maps/9PSjTHuCPuEMCc3G7" },
  { building: 405, url: "https://goo.gl/maps/L6ZW9crXHvfi8y328" },
  { building: 406, url: "https://goo.gl/maps/RXYkYKN7K3s31KB3A" },
  { building: 407, url: "https://goo.gl/maps/dGHFmctKYrGKtFqb6" },
  { building: 408, url: "https://goo.gl/maps/C6hoXL6nyy2fYcYB7" },
  { building: 409, url: "https://goo.gl/maps/U8NF5tbBfPnyDNPo8" },
  { building: 410, url: "https://goo.gl/maps/f4tgbiCghu8HnSKG8" },
  { building: 411, url: "https://goo.gl/maps/frT5mnVdmVSyVrHB9" },
  { building: 412, url: "https://goo.gl/maps/HnJR9mQVAPGAYNkF7" },
  { building: 413, url: "https://goo.gl/maps/mDnkCvmuTYGY9LcS9" },
  { building: 414, url: "https://goo.gl/maps/zCRSydZn1Fx4WZ5D8" },
  { building: 415, url: "https://goo.gl/maps/iFThVdPZ4JKY7JBR9" },
  { building: 416, url: "https://goo.gl/maps/VoxV94rUWiu4Pveo8" },

  // 501–502
  { building: 501, url: "https://goo.gl/maps/iWGu7RnT9vJALJUd8" },
  { building: 502, url: "https://goo.gl/maps/Xg74Jrjb88UvG377A" },

  // 601–602
  { building: 601, url: "https://goo.gl/maps/9WaLferfhJhxRZQp6" },
  { building: 602, url: "https://goo.gl/maps/ouvu6mGBSEKumwLy6" },

  // 701–702
  { building: 701, url: "https://goo.gl/maps/MnK5mCjLBZBWPEoB9" },
  { building: 702, url: "https://goo.gl/maps/kjnAm9XpiAaLtcZw5" },

  // 801–816
  { building: 801, url: "https://goo.gl/maps/N76yaJ8Sd56QMiVJ8" },
  { building: 802, url: "https://goo.gl/maps/18Xai83ReaTYH7ME8" },
  { building: 803, url: "https://goo.gl/maps/8WSBafG4U57Hzb9t5" },
  { building: 804, url: "https://goo.gl/maps/2ywkbc7fLYJNzd248" },
  { building: 805, url: "https://goo.gl/maps/A9YGRXzxXzoFSY9K9" },
  { building: 806, url: "https://goo.gl/maps/4bPWmR4262N9Mbkc7" },
  { building: 807, url: "https://goo.gl/maps/Y5yWJXXy8BfCokmp7" },
  { building: 808, url: "https://goo.gl/maps/NyXD1jhoJhP6q2D86" },
  { building: 809, url: "https://goo.gl/maps/HFYAABosng6N7tjEA" },
  { building: 810, url: "https://goo.gl/maps/rr5mQs569YYBmmCY8" },
  { building: 811, url: "https://goo.gl/maps/9VPor2Pe3dNSiVky7" },
  { building: 812, url: "https://goo.gl/maps/NjpwrBBy7as5yYF19" },
  { building: 813, url: "https://goo.gl/maps/jabDbrdc4BmDHSvZA" },
  { building: 814, url: "https://goo.gl/maps/q5XDi5b5p6NqRXgr8" },
  { building: 815, url: "https://goo.gl/maps/Sjm3YErQmNoYuGya6" },
  { building: 816, url: "https://goo.gl/maps/j5PbQR6fvAUSxZSNA" },

  // 901–905
  { building: 901, url: "https://goo.gl/maps/RyV7DNG85Nd4Rfrw6" },
  { building: 902, url: "https://goo.gl/maps/Vv5Z19w5TxWuJtSHA" },
  { building: 903, url: "https://goo.gl/maps/x4GogUoJZKUr34pB9" },
  { building: 904, url: "https://goo.gl/maps/bYNo2TJez138ca7t5" },
  { building: 905, url: "https://goo.gl/maps/M64Wfxj4Zp2ABB8h8" },

  // 1001–1024
  { building: 1001, url: "https://goo.gl/maps/t7LYznYp6PskrQd17" },
  { building: 1002, url: "https://goo.gl/maps/FtGtvmyi9fvY7W9bA" },
  { building: 1003, url: "https://goo.gl/maps/o6CE61qdRJLXGSZM9" },
  { building: 1004, url: "https://goo.gl/maps/kUaGNezLiNXGBmX47" },
  { building: 1005, url: "https://goo.gl/maps/T33pV9wsWueJeD1s7" },
  { building: 1006, url: "https://goo.gl/maps/kvWfbBmSAELhovTh6" },
  { building: 1007, url: "https://goo.gl/maps/F3LEcMaJ3AHqwWkC8" },
  { building: 1008, url: "https://goo.gl/maps/vHfkoxWYceegWbDRA" },
  { building: 1009, url: "https://goo.gl/maps/1N8bxdzmJjJX9zRU6" },
  { building: 1010, url: "https://goo.gl/maps/Nwa3FTrQvCCT4SYD7" },
  { building: 1011, url: "https://goo.gl/maps/xTDjSdbVLVXg1wuM7" },
  { building: 1012, url: "https://goo.gl/maps/TYMwdRtYZFk57jhLA" },
  { building: 1013, url: "https://goo.gl/maps/oTnq5fcgVagzKZxu9" },
  { building: 1014, url: "https://goo.gl/maps/tV32iyedopyog4Lj8" },
  { building: 1015, url: "https://goo.gl/maps/CQNxfs9fsrbJqzcU6" },
  { building: 1016, url: "https://goo.gl/maps/ES8vzucArvZFVfiw7" },
  { building: 1017, url: "https://goo.gl/maps/AFbvmFh7HrAxJmNJ8" },
  { building: 1018, url: "https://goo.gl/maps/HB3ctkWzvCBwU4vj9" },
  { building: 1019, url: "https://goo.gl/maps/ttkJwZMLpTrhdrDJA" },
  { building: 1020, url: "https://goo.gl/maps/aMriEenear89VLav9" },
  { building: 1021, url: "https://goo.gl/maps/nkcKEET1d2oUPBDo9" },
  { building: 1022, url: "https://goo.gl/maps/9LKMnUG82RZaHR5m7" },
  { building: 1023, url: "https://goo.gl/maps/MmgM3zGaxKXsFvyK9" },
  { building: 1024, url: "https://goo.gl/maps/Ff6h4JVRxdyjFQkt9" },

  // 1101–1118
  { building: 1101, url: "https://goo.gl/maps/3FVmTEszgshnbSoc9" },
  { building: 1102, url: "https://goo.gl/maps/2yTTJpHtqZH7Ket49" },
  { building: 1103, url: "https://goo.gl/maps/8aVW97gPerACAaCP9" },
  { building: 1104, url: "https://goo.gl/maps/EjfAwTGe7mYND6pJ9" },
  { building: 1105, url: "https://goo.gl/maps/QQeS3jujTva4USBR8" },
  { building: 1106, url: "https://goo.gl/maps/iGJYP2e64KtSfkaK9" },
  { building: 1107, url: "https://goo.gl/maps/iVAZmP9EeSpKHVmB6" },
  { building: 1108, url: "https://goo.gl/maps/rxsFg4bnXuryEJ1X7" },
  { building: 1109, url: "https://goo.gl/maps/EbVjdW6uaRZfGt9X9" },
  { building: 1110, url: "https://goo.gl/maps/epsBLrVSpvCQpuV48" },
  { building: 1111, url: "https://goo.gl/maps/dKuZxX6AxYjrRhmA7" },
  { building: 1112, url: "https://goo.gl/maps/SdJ3t3AoDaYPu8HYA" },
  { building: 1113, url: "https://goo.gl/maps/wTVPAAWpqij1NSsFA" },
  { building: 1114, url: "https://goo.gl/maps/yrBEVsNUbTuiPkcT9" },
  { building: 1115, url: "https://goo.gl/maps/PUgg1mAFNLtwXubp9" },
  { building: 1116, url: "https://goo.gl/maps/awVWoLgjvefuF3Q87" },
  { building: 1117, url: "https://goo.gl/maps/ZGceAPtmE46yRqZx9" },
  { building: 1118, url: "https://goo.gl/maps/VunU4ycPdCqoCS2bA" },

  // 1201–1203
  { building: 1201, url: "https://goo.gl/maps/K8UnPQNfcWSHGofx6" },
  { building: 1202, url: "https://goo.gl/maps/JrGCcDBCrbBQGreN7" },
  { building: 1203, url: "https://goo.gl/maps/5EfWyTZgAwE4GRXp8" },

  // 1301–1303
  { building: 1301, url: "https://goo.gl/maps/iSEShWAmByt13iz1A" },
  { building: 1302, url: "https://goo.gl/maps/rizLptJDDdPHgMCVA" },
  { building: 1303, url: "https://goo.gl/maps/BAXMJBgnZfJy3RDX8" },

  // 1401–1403
  { building: 1401, url: "https://goo.gl/maps/JXpCySo32zzVbhoZA" },
  { building: 1402, url: "https://goo.gl/maps/1w414SE71FERe6iZA" },
  { building: 1403, url: "https://goo.gl/maps/zjsCX2PNoJShhhRu6" },

  // 1501–1503
  { building: 1501, url: "https://goo.gl/maps/PPC7Drq9ySbdMMcS7" },
  { building: 1502, url: "https://goo.gl/maps/sX6GuZR8NiY8CpdL6" },
  { building: 1503, url: "https://goo.gl/maps/LN8bhJFC16d8owUf6" },

  // 1601–1604
  { building: 1601, url: "https://goo.gl/maps/WXpE8bpUKJfmZped9" },
  { building: 1602, url: "https://goo.gl/maps/oLFDLW29eXn9GZRK6" },
  { building: 1603, url: "https://goo.gl/maps/upjpT2q78fmxqdeR8" },
  { building: 1604, url: "https://goo.gl/maps/ra5mTDDS586ypxME6" },

  // 1701–1707
  { building: 1701, url: "https://goo.gl/maps/DUBQjgnyUrgoJHDm6" },
  { building: 1702, url: "https://goo.gl/maps/SnVnwHNEwWLAUUjZ9" },
  { building: 1703, url: "https://goo.gl/maps/fxBpkuJYEDf1BLZv8" },
  { building: 1704, url: "https://goo.gl/maps/AvMgyzvanfYaLjYB9" },
  { building: 1705, url: "https://goo.gl/maps/Gss4gi2y4ZstXA758" },
  { building: 1706, url: "https://goo.gl/maps/w6uz4MfbZLKWwkbz9" },
  { building: 1707, url: "https://goo.gl/maps/jFYTW7kUBseqsxsd7" },

  // 1801–1839
  { building: 1801, url: "https://goo.gl/maps/qrYbkfuZRSEW39Rt8" },
  { building: 1802, url: "https://goo.gl/maps/3zJNHmwgMyhwYBBQ6" },
  { building: 1803, url: "https://goo.gl/maps/mE5uvg5eUQfxUbRX9" },
  { building: 1804, url: "https://goo.gl/maps/gMv8kyKnApZ6rnXz7" },
  { building: 1805, url: "https://goo.gl/maps/Vrd3aELhw7xEA3uf6" },
  { building: 1806, url: "https://goo.gl/maps/jk21nAbpMyWLcEqQA" },
  { building: 1807, url: "https://goo.gl/maps/VkSRHHfgpXojPcPW8" },
  { building: 1808, url: "https://goo.gl/maps/ECd1eZhdwxAHXe8y5" },
  { building: 1809, url: "https://goo.gl/maps/gA7EQ4kYkmHmnph76" },
  { building: 1810, url: "https://goo.gl/maps/HmyuWJqySq9qxzMW6" },
  { building: 1811, url: "https://goo.gl/maps/zDqyw4Cg7AE6Zp8G9" },
  { building: 1812, url: "https://goo.gl/maps/yN6xk1Aaum3KvcAz9" },
  { building: 1813, url: "https://goo.gl/maps/XkwepPbibGk2iK1WA" },
  { building: 1814, url: "https://goo.gl/maps/3xQjfrB6jtVbTRr77" },
  { building: 1815, url: "https://goo.gl/maps/RNvF5HjqtbMZ3P8E6" },
  { building: 1816, url: "https://goo.gl/maps/7nUHgGXvvUGKM7AX9" },
  { building: 1817, url: "https://goo.gl/maps/rcyMA5jE7pgEBjQL8" },
  { building: 1818, url: "https://goo.gl/maps/CKb6BGoAvbpWLnqh9" },
  { building: 1819, url: "https://goo.gl/maps/LPcLP7u4pNoceoW1A" },
  { building: 1820, url: "https://goo.gl/maps/eVu45AyHK7ndopYz5" },
  { building: 1821, url: "https://goo.gl/maps/5Nrj1VBxMuXGodSw8" },
  { building: 1822, url: "https://goo.gl/maps/ABS91agt3hL5UHda7" },
  { building: 1823, url: "https://goo.gl/maps/fNoT9GaKWp84PySFA" },
  { building: 1824, url: "https://goo.gl/maps/ihpxeq8JVZTzVpE49" },
  { building: 1825, url: "https://goo.gl/maps/7sWerrTSqCVGfadd8" },
  { building: 1826, url: "https://goo.gl/maps/9qh727m2Shn3QyCB8" },
  { building: 1827, url: "https://goo.gl/maps/T226yPoyc6G36k8F9" },
  { building: 1828, url: "https://goo.gl/maps/cme1NrHaPFZQjWVS8" },
  { building: 1829, url: "https://goo.gl/maps/pnmc7EF69rLqy2CPA" },
  { building: 1830, url: "https://goo.gl/maps/W8H74JEAsgAmXC5E6" },
  { building: 1831, url: "https://goo.gl/maps/UbXAvGAL3YQMeomn6" },
  { building: 1832, url: "https://goo.gl/maps/QULfU73yM9fhxS5c8" },
  { building: 1833, url: "https://goo.gl/maps/RGjXCdeAXQCXxEhA8" },
  { building: 1834, url: "https://goo.gl/maps/nRfv5jC3dQYkYUue8" },
  { building: 1835, url: "https://goo.gl/maps/YDRpVTzeLkBsRJEN9" },
  { building: 1836, url: "https://goo.gl/maps/Xrr45D8JDC21ju7q6" },
  { building: 1837, url: "https://goo.gl/maps/eXKSKtjxK7orXKQ67" },
  { building: 1838, url: "https://goo.gl/maps/xbd9j5F6gQGgicEs6" },
  { building: 1839, url: "https://goo.gl/maps/s3rp6o7vEaZLbBQy7" },
];

/** Special community Rubaths included in the same source list. */
export interface MakkahRubath {
  key: string;
  name: string;
  nameHi: string;
  nameUr: string;
  nameAr: string;
  url: string;
}

export const makkahRubaths: MakkahRubath[] = [
  {
    key: "tonk-rajasthan",
    name: "Tonk (Rajasthan) Rubath",
    nameHi: "टोंक (राजस्थान) रुबाथ",
    nameUr: "ٹونک (راجستھان) رباط",
    nameAr: "رباط تونك (راجستان)",
    url: "https://maps.app.goo.gl/aQkkFhmUvmVzwUVS9",
  },
  {
    key: "bhopal-mp",
    name: "Bhopal (M.P.) Rubath",
    nameHi: "भोपाल (एम.पी.) रुबाथ",
    nameUr: "بھوپال (ایم۔پی۔) رباط",
    nameAr: "رباط بوبال (مادهيا براديش)",
    url: "https://goo.gl/maps/JT2RQmHTZ2pWCkgX6",
  },
  {
    key: "bohra",
    name: "Bohra Rubath",
    nameHi: "बोहरा रुबाथ",
    nameUr: "بوہرہ رباط",
    nameAr: "رباط البهرة",
    url: "https://maps.app.goo.gl/iAozugSPZYWqmHTCA",
  },
  {
    key: "hyderabad-nizam",
    name: "Hyderabad Nizam Rubath",
    nameHi: "हैदराबाद निज़ाम रुबाथ",
    nameUr: "حیدرآباد نظام رباط",
    nameAr: "رباط نظام حيدر آباد",
    url: "https://goo.gl/maps/VzTAVKRswou53d317",
  },
];

/** Look up an exact Google Maps location for a given Makkah building number. */
export function findMakkahBuildingMapLink(
  buildingNumber: number,
): MakkahBuildingMapLink | null {
  return (
    makkahBuildingMapLinks.find((b) => b.building === buildingNumber) ?? null
  );
}
