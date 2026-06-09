const modelHistoryBase = [
    {
        "brand": "DACIA",
        "model": "DACIA SPRING",
        "start": 18672,
        "history": {
            "JAN": 68,
            "FEB": 86,
            "MAR": 61,
            "APR": 56
        }
    },
    {
        "brand": "TESLA",
        "model": "TESLA MODEL 3",
        "start": 6230,
        "history": {
            "JAN": 176,
            "FEB": 152,
            "MAR": 146,
            "APR": 165
        }
    },
    {
        "brand": "TESLA",
        "model": "TESLA MODEL Y",
        "start": 3971,
        "history": {
            "JAN": 171,
            "FEB": 160,
            "MAR": 107,
            "APR": 114
        }
    },
    {
        "brand": "HYUNDAI",
        "model": "HYUNDAI KONA",
        "start": 2730,
        "history": {
            "JAN": 38,
            "FEB": 44,
            "MAR": 47,
            "APR": 57
        }
    },
    {
        "brand": "RENAULT",
        "model": "RENAULT ZOE",
        "start": 2259,
        "history": {
            "JAN": 19,
            "FEB": 11,
            "MAR": 28,
            "APR": 27
        }
    },
    {
        "brand": "VOLKSWAGEN",
        "model": "VOLKSWAGEN UP",
        "start": 1717,
        "history": {
            "JAN": 0,
            "FEB": 1,
            "MAR": 1,
            "APR": 2
        }
    },
    {
        "brand": "VOLKSWAGEN",
        "model": "VOLKSWAGEN ID.3",
        "start": 1584,
        "history": {
            "JAN": 18,
            "FEB": 14,
            "MAR": 12,
            "APR": 14
        }
    },
    {
        "brand": "RENAULT",
        "model": "RENAULT MEGANE E-TECH",
        "start": 1476,
        "history": {
            "JAN": 6,
            "FEB": 17,
            "MAR": 6,
            "APR": 6
        }
    },
    {
        "brand": "VOLKSWAGEN",
        "model": "VOLKSWAGEN ID.4",
        "start": 1124,
        "history": {
            "JAN": 38,
            "FEB": 31,
            "MAR": 35,
            "APR": 24
        }
    },
    {
        "brand": "NISSAN",
        "model": "NISSAN LEAF",
        "start": 1092,
        "history": {
            "JAN": 12,
            "FEB": 15,
            "MAR": 8,
            "APR": 18
        }
    },
    {
        "brand": "BMW",
        "model": "BMW I3",
        "start": 915,
        "history": {
            "JAN": 3,
            "FEB": 2,
            "MAR": 2,
            "APR": 2
        }
    },
    {
        "brand": "MERCEDES - BENZ",
        "model": "MERCEDES - BENZ EQA",
        "start": 691,
        "history": {
            "JAN": 14,
            "FEB": 21,
            "MAR": 8,
            "APR": 11
        }
    },
    {
        "brand": "RENAULT",
        "model": "RENAULT KANGOO VAN E-TECH",
        "start": 656,
        "history": {
            "JAN": 14,
            "FEB": 3,
            "MAR": 7,
            "APR": 3
        }
    },
    {
        "brand": "SKODA",
        "model": "SKODA ENYAQ",
        "start": 635,
        "history": {
            "JAN": 3,
            "FEB": 8,
            "MAR": 14,
            "APR": 11
        }
    },
    {
        "brand": "VOLKSWAGEN",
        "model": "VOLKSWAGEN GOLF",
        "start": 583,
        "history": {
            "JAN": 2,
            "FEB": 5,
            "MAR": 0,
            "APR": 10
        }
    },
    {
        "brand": "TESLA",
        "model": "TESLA MODEL S",
        "start": 579,
        "history": {
            "JAN": 17,
            "FEB": 10,
            "MAR": 24,
            "APR": 13
        }
    },
    {
        "brand": "FIAT",
        "model": "FIAT 500",
        "start": 531,
        "history": {
            "JAN": 10,
            "FEB": 7,
            "MAR": 3,
            "APR": 8
        }
    },
    {
        "brand": "SMART",
        "model": "SMART EQ FORTWO",
        "start": 511,
        "history": {
            "JAN": 5,
            "FEB": 3,
            "MAR": 2,
            "APR": 4
        }
    },
    {
        "brand": "MERCEDES - BENZ",
        "model": "MERCEDES - BENZ EQE",
        "start": 507,
        "history": {
            "JAN": 1,
            "FEB": 8,
            "MAR": 8,
            "APR": 14
        }
    },
    {
        "brand": "FORD",
        "model": "FORD PUMA",
        "start": 502,
        "history": {
            "JAN": 60,
            "FEB": 57,
            "MAR": 63,
            "APR": 38
        }
    },
    {
        "brand": "HYUNDAI",
        "model": "HYUNDAI IONIQ 5",
        "start": 493,
        "history": {
            "JAN": 7,
            "FEB": 13,
            "MAR": 10,
            "APR": 5
        }
    },
    {
        "brand": "BMW",
        "model": "BMW I4",
        "start": 483,
        "history": {
            "JAN": 13,
            "FEB": 10,
            "MAR": 16,
            "APR": 13
        }
    },
    {
        "brand": "MINI",
        "model": "MINI COOPER SE",
        "start": 473,
        "history": {
            "JAN": 0,
            "FEB": 3,
            "MAR": 7,
            "APR": 3
        }
    },
    {
        "brand": "PEUGEOT",
        "model": "PEUGEOT 208",
        "start": 446,
        "history": {
            "JAN": 12,
            "FEB": 5,
            "MAR": 4,
            "APR": 8
        }
    },
    {
        "brand": "AUDI",
        "model": "AUDI E-TRON (SUV)",
        "start": 439,
        "history": {
            "JAN": 16,
            "FEB": 14,
            "MAR": 15,
            "APR": 23
        }
    },
    {
        "brand": "FORD",
        "model": "FORD MUSTANG MACH-E",
        "start": 432,
        "history": {
            "JAN": 6,
            "FEB": 10,
            "MAR": 10,
            "APR": 9
        }
    },
    {
        "brand": "FORD",
        "model": "FORD TRANSIT",
        "start": 416,
        "history": {
            "JAN": 6,
            "FEB": 14,
            "MAR": 13,
            "APR": 22
        }
    },
    {
        "brand": "BMW",
        "model": "BMW IX",
        "start": 397,
        "history": {
            "JAN": 5,
            "FEB": 6,
            "MAR": 2,
            "APR": 11
        }
    },
    {
        "brand": "HYUNDAI",
        "model": "HYUNDAI INSTER",
        "start": 391,
        "history": {
            "JAN": 27,
            "FEB": 26,
            "MAR": 11,
            "APR": 12
        }
    },
    {
        "brand": "SMART",
        "model": "SMART EQ FORFOUR",
        "start": 384,
        "history": {
            "JAN": 4,
            "FEB": 1,
            "MAR": 2,
            "APR": 2
        }
    },
    {
        "brand": "FORD",
        "model": "FORD EXPLORER",
        "start": 377,
        "history": {
            "JAN": 33,
            "FEB": 26,
            "MAR": 31,
            "APR": 19
        }
    },
    {
        "brand": "VOLVO",
        "model": "VOLVO EX30",
        "start": 373,
        "history": {
            "JAN": 22,
            "FEB": 18,
            "MAR": 19,
            "APR": 7
        }
    },
    {
        "brand": "TESLA",
        "model": "TESLA MODEL X",
        "start": 365,
        "history": {
            "JAN": 5,
            "FEB": 6,
            "MAR": 8,
            "APR": 5
        }
    },
    {
        "brand": "PEUGEOT",
        "model": "PEUGEOT 2008",
        "start": 362,
        "history": {
            "JAN": 18,
            "FEB": 12,
            "MAR": 11,
            "APR": 6
        }
    },
    {
        "brand": "RENAULT",
        "model": "RENAULT RENAULT 5 E-TECH",
        "start": 349,
        "history": {
            "JAN": 36,
            "FEB": 28,
            "MAR": 24,
            "APR": 22
        }
    },
    {
        "brand": "SKODA",
        "model": "SKODA CITIGO",
        "start": 330,
        "history": {
            "JAN": 0,
            "FEB": 0,
            "MAR": 0,
            "APR": 1
        }
    },
    {
        "brand": "MERCEDES - BENZ",
        "model": "MERCEDES - BENZ EQS",
        "start": 324,
        "history": {
            "JAN": 4,
            "FEB": 2,
            "MAR": 3,
            "APR": 3
        }
    },
    {
        "brand": "MAZDA",
        "model": "MAZDA MX-30",
        "start": 306,
        "history": {
            "JAN": 4,
            "FEB": 3,
            "MAR": 5,
            "APR": 3
        }
    },
    {
        "brand": "MG",
        "model": "MG MG4",
        "start": 302,
        "history": {
            "JAN": 45,
            "FEB": 54,
            "MAR": 17,
            "APR": 20
        }
    },
    {
        "brand": "LEAPMOTOR",
        "model": "LEAPMOTOR T03",
        "start": 299,
        "history": {
            "JAN": 39,
            "FEB": 26,
            "MAR": 10,
            "APR": 5
        }
    },
    {
        "brand": "MERCEDES - BENZ",
        "model": "MERCEDES - BENZ EQB",
        "start": 297,
        "history": {
            "JAN": 2,
            "FEB": 2,
            "MAR": 1,
            "APR": 1
        }
    },
    {
        "brand": "PORSCHE",
        "model": "PORSCHE TAYCAN",
        "start": 294,
        "history": {
            "JAN": 2,
            "FEB": 7,
            "MAR": 4,
            "APR": 7
        }
    },
    {
        "brand": "TOYOTA",
        "model": "TOYOTA BZ4X",
        "start": 294,
        "history": {
            "JAN": 4,
            "FEB": 4,
            "MAR": 2,
            "APR": 4
        }
    },
    {
        "brand": "MERCEDES - BENZ",
        "model": "MERCEDES - BENZ EQC",
        "start": 287,
        "history": {
            "JAN": 6,
            "FEB": 5,
            "MAR": 4,
            "APR": 4
        }
    },
    {
        "brand": "MERCEDES - BENZ",
        "model": "MERCEDES - BENZ EVITO",
        "start": 252,
        "history": {
            "JAN": 3,
            "FEB": 6,
            "MAR": 3,
            "APR": 7
        }
    },
    {
        "brand": "BMW",
        "model": "BMW IX1",
        "start": 246,
        "history": {
            "JAN": 8,
            "FEB": 9,
            "MAR": 7,
            "APR": 10
        }
    },
    {
        "brand": "FORD",
        "model": "FORD CAPRI",
        "start": 243,
        "history": {
            "JAN": 11,
            "FEB": 11,
            "MAR": 13,
            "APR": 7
        }
    },
    {
        "brand": "OPEL",
        "model": "OPEL CORSA",
        "start": 241,
        "history": {
            "JAN": 3,
            "FEB": 5,
            "MAR": 1,
            "APR": 3
        }
    },
    {
        "brand": "KIA",
        "model": "KIA NIRO",
        "start": 232,
        "history": {
            "JAN": 3,
            "FEB": 9,
            "MAR": 10,
            "APR": 17
        }
    },
    {
        "brand": "HYUNDAI",
        "model": "HYUNDAI IONIQ",
        "start": 223,
        "history": {
            "JAN": 3,
            "FEB": 4,
            "MAR": 1,
            "APR": 5
        }
    },
    {
        "brand": "BYD",
        "model": "BYD DOLPHIN SURF",
        "start": 220,
        "history": {
            "JAN": 112,
            "FEB": 100,
            "MAR": 57,
            "APR": 57
        }
    },
    {
        "brand": "VOLVO",
        "model": "VOLVO EX40",
        "start": 217,
        "history": {
            "JAN": 2,
            "FEB": 4,
            "MAR": 4,
            "APR": 8
        }
    },
    {
        "brand": "BMW",
        "model": "BMW IX3",
        "start": 214,
        "history": {
            "JAN": 6,
            "FEB": 3,
            "MAR": 5,
            "APR": 3
        }
    },
    {
        "brand": "VOLKSWAGEN",
        "model": "VOLKSWAGEN ID.5",
        "start": 209,
        "history": {
            "JAN": 1,
            "FEB": 2,
            "MAR": 2,
            "APR": 3
        }
    },
    {
        "brand": "AUDI",
        "model": "AUDI Q4 E-TRON",
        "start": 202,
        "history": {
            "JAN": 6,
            "FEB": 7,
            "MAR": 5,
            "APR": 7
        }
    },
    {
        "brand": "MG",
        "model": "MG ZS",
        "start": 199,
        "history": {
            "JAN": 12,
            "FEB": 12,
            "MAR": 14,
            "APR": 16
        }
    },
    {
        "brand": "JAGUAR",
        "model": "JAGUAR I-PACE",
        "start": 186,
        "history": {
            "JAN": 2,
            "FEB": 0,
            "MAR": 3,
            "APR": 1
        }
    },
    {
        "brand": "MAXUS",
        "model": "MAXUS MAXUS E-DELIVER 3",
        "start": 178,
        "history": {
            "JAN": 1,
            "FEB": 13,
            "MAR": 1,
            "APR": 8
        }
    },
    {
        "brand": "HYUNDAI",
        "model": "HYUNDAI IONIQ 6",
        "start": 167,
        "history": {
            "JAN": 4,
            "FEB": 3,
            "MAR": 4,
            "APR": 5
        }
    },
    {
        "brand": "CITROEN",
        "model": "CITROEN E-C4",
        "start": 163,
        "history": {
            "JAN": 1,
            "FEB": 1,
            "MAR": 0,
            "APR": 0
        }
    },
    {
        "brand": "KIA",
        "model": "KIA EV6",
        "start": 151,
        "history": {
            "JAN": 1,
            "FEB": 3,
            "MAR": 3,
            "APR": 2
        }
    },
    {
        "brand": "RENAULT",
        "model": "RENAULT SCENIC E-TECH",
        "start": 143,
        "history": {
            "JAN": 2,
            "FEB": 2,
            "MAR": 2,
            "APR": 6
        }
    },
    {
        "brand": "TOYOTA",
        "model": "TOYOTA PROACE CITY",
        "start": 133,
        "history": {
            "JAN": 0,
            "FEB": 0,
            "MAR": 0,
            "APR": 1
        }
    },
    {
        "brand": "OPEL",
        "model": "OPEL MOKKA",
        "start": 127,
        "history": {
            "JAN": 4,
            "FEB": 1,
            "MAR": 1,
            "APR": 17
        }
    },
    {
        "brand": "NISSAN",
        "model": "NISSAN E-NV200",
        "start": 121,
        "history": {
            "JAN": 0,
            "FEB": 1,
            "MAR": 4,
            "APR": 6
        }
    },
    {
        "brand": "KIA",
        "model": "KIA SOUL",
        "start": 114,
        "history": {
            "JAN": 0,
            "FEB": 0,
            "MAR": 3,
            "APR": 4
        }
    },
    {
        "brand": "BYD",
        "model": "BYD SEALION 7",
        "start": 111,
        "history": {
            "JAN": 23,
            "FEB": 32,
            "MAR": 54,
            "APR": 70
        }
    },
    {
        "brand": "BMW",
        "model": "BMW I7",
        "start": 100,
        "history": {
            "JAN": 3,
            "FEB": 2,
            "MAR": 1,
            "APR": 2
        }
    },
    {
        "brand": "NISSAN",
        "model": "NISSAN ARIYA",
        "start": 92,
        "history": {
            "JAN": 0,
            "FEB": 0,
            "MAR": 0,
            "APR": 0
        }
    },
    {
        "brand": "VOLVO",
        "model": "VOLVO EC40",
        "start": 92,
        "history": {
            "JAN": 1,
            "FEB": 2,
            "MAR": 1,
            "APR": 1
        }
    },
    {
        "brand": "SKODA",
        "model": "SKODA ELROQ",
        "start": 55,
        "history": {
            "JAN": 4,
            "FEB": 12,
            "MAR": 5,
            "APR": 5
        }
    },
    {
        "brand": "CITROEN",
        "model": "CITROEN E-C3",
        "start": 58,
        "history": {
            "JAN": 2,
            "FEB": 4,
            "MAR": 1,
            "APR": 1
        }
    },
    {
        "brand": "RENAULT",
        "model": "RENAULT 4 E-TECH",
        "start": 41,
        "history": {
            "JAN": 2,
            "FEB": 7,
            "MAR": 4,
            "APR": 6
        }
    },
    {
        "brand": "KIA",
        "model": "KIA EV3",
        "start": 53,
        "history": {
            "JAN": 7,
            "FEB": 8,
            "MAR": 1,
            "APR": 3
        }
    },
    {
        "brand": "AUDI",
        "model": "AUDI Q6 E-TRON",
        "start": 39,
        "history": {
            "JAN": 3,
            "FEB": 1,
            "MAR": 0,
            "APR": 2
        }
    },
    {
        "brand": "VOLKSWAGEN",
        "model": "VOLKSWAGEN ID.7",
        "start": 90,
        "history": {
            "JAN": 3,
            "FEB": 6,
            "MAR": 4,
            "APR": 1
        }
    },
    {
        "brand": "BYD",
        "model": "BYD ATTO 2",
        "start": 51,
        "history": {
            "JAN": 25,
            "FEB": 24,
            "MAR": 29,
            "APR": 26
        }
    },
    {
        "brand": "BYD",
        "model": "BYD SEAL",
        "start": 55,
        "history": {
            "JAN": 8,
            "FEB": 10,
            "MAR": 16,
            "APR": 11
        }
    },
    {
        "brand": "BYD",
        "model": "BYD SEAL U",
        "start": 25,
        "history": {
            "JAN": 2,
            "FEB": 2,
            "MAR": 5,
            "APR": 11
        }
    },
    {
        "brand": "BMW",
        "model": "BMW IX3 Neue Klasse",
        "start": 0,
        "history": {
            "JAN": 3,
            "FEB": 3,
            "MAR": 2,
            "APR": 14
        }
    },
    {
        "brand": "Alte Modele",
        "model": "Alte Modele",
        "start": 0,
        "history": {
            "JAN": 0,
            "FEB": 0,
            "MAR": 0,
            "APR": 0
        }
    }
];

// Normalizare marca
function normalizeazaMarca(marca) {
    if (!marca) return "";
    let m = marca.toString().toUpperCase().trim().replace(/,/g, ".").replace(/-/g, " ").replace(/\s+/g, " ");
    if (m.includes("MERCEDES")) return "MERCEDES BENZ";
    if (m.includes("VW") || m.includes("VOLKSWAGEN")) return "VOLKSWAGEN";
    if (m.includes("BMW")) return "BMW";
    if (m.includes("TESLA")) return "TESLA";
    return m;
}

// Aplica reguli specifice
function aplicaReguliSpecifice(marca, model) {
    const m = marca;
    if (!model) return "";
    let mod = model.toString().toUpperCase().trim().replace(/,/g, ".").replace(/-/g, " ").replace(/\s+/g, " ");
    
    // 1. AUDI
    if (m === "AUDI") {
        if (mod.includes("Q4")) return "AUDI Q4 E-TRON";
        if (mod.includes("Q6")) return "AUDI Q6 E-TRON";
        if (mod.includes("E TRON") || mod.includes("ETRON")) {
            if (!mod.includes("GT") && !mod.includes("Q8") && !mod.includes("A6")) {
                return "AUDI E-TRON (SUV)";
            }
        }
    }
    
    // 2. BMW iX3 Neue Klasse
    if (m === "BMW" && mod.includes("IX3 50 XDRIVE")) {
        return "BMW IX3 NEUE KLASSE";
    }
    
    // 3. MERCEDES
    if (m === "MERCEDES BENZ") {
        if (mod.includes("EQE")) return "MERCEDES BENZ EQE";
        if (mod.includes("EQA")) return "MERCEDES BENZ EQA";
        if (mod.includes("EQB")) return "MERCEDES BENZ EQB";
        if (mod.includes("EQS")) return "MERCEDES BENZ EQS";
        if (mod.includes("EQC")) return "MERCEDES BENZ EQC";
        if (mod.includes("EVITO")) return "MERCEDES BENZ EVITO";
        if (mod.includes("ESPRINTER")) return "MERCEDES BENZ ESPRINTER";
    }
    
    // 4. VW
    if (m === "VOLKSWAGEN") {
        if (mod.includes("ID 4") || mod.includes("ID.4")) return "VOLKSWAGEN ID.4";
        if (mod.includes("ID 3") || mod.includes("ID.3")) return "VOLKSWAGEN ID.3";
        if (mod.includes("ID 5") || mod.includes("ID.5")) return "VOLKSWAGEN ID.5";
        if (mod.includes("ID 7") || mod.includes("ID.7")) return "VOLKSWAGEN ID.7";
        if (mod.includes("UP")) return "VOLKSWAGEN UP";
    }
    
    // 5. MG4
    if (m === "MG" && mod.includes("MG4")) return "MG MG4";
    
    // 6. Maxus
    if (m === "MAXUS") {
        if (mod.includes("DELIVER 3")) return "MAXUS MAXUS E-DELIVER 3";
        if (mod.includes("DELIVER 9")) return "MAXUS MAXUS EDELIVER 9";
    }
    
    // 7. Renault
    if (m === "RENAULT") {
        if (mod.includes("RENAULT 5") || mod === "5" || mod.includes("5 E TECH")) return "RENAULT RENAULT 5 E-TECH";
        if (mod.includes("RENAULT 4") || mod === "4" || mod.includes("4 E TECH")) return "RENAULT RENAULT 4 E-TECH";
    }
    
    // 8. Toyota
    if (m === "TOYOTA") {
        if (mod.includes("PROACE CITY")) return "TOYOTA PROACE CITY";
        if (mod.includes("BZ4X") || mod.includes("BZ 4X")) return "TOYOTA BZ4X";
    }
    
    // 9. KIA
    if (m === "KIA" && (mod.includes("EV6") || mod.includes("EV 6"))) return "KIA EV6";
    
    // 10. VOLVO
    if (m === "VOLVO") {
        if (mod.includes("XC40") || mod.includes("EX40")) return "VOLVO EX40";
        if (mod.includes("C40") || mod.includes("EC40")) return "VOLVO EC40";
    }
    
    // 11. HYUNDAI
    if (m === "HYUNDAI") {
        if (mod.includes("IONIQ 5") || mod.includes("IONIQ5")) return "HYUNDAI IONIQ 5";
        if (mod.includes("IONIQ 6") || mod.includes("IONIQ6")) return "HYUNDAI IONIQ 6";
        if (mod.includes("IONIQ")) return "HYUNDAI IONIQ";
    }
    
    // 12. TESLA
    if (m === "TESLA") {
        if (mod.includes("MODEL 3") || mod.includes("MODEL3")) return "TESLA MODEL 3";
        if (mod.includes("MODEL Y") || mod.includes("MODELY")) return "TESLA MODEL Y";
        if (mod.includes("MODEL S") || mod.includes("MODELS")) return "TESLA MODEL S";
        if (mod.includes("MODEL X") || mod.includes("MODELX")) return "TESLA MODEL X";
    }
    
    return mod;
}

// Calculeaza cumulat YTD si Parc
function computeYtdAndParcData(selectedMonthNume, currentRawInmatriculari) {
    const data = JSON.parse(JSON.stringify(modelHistoryBase));
    
    data.forEach(item => {
        item.current_monthly = 0;
    });
    
    const grupateBrute = {};
    currentRawInmatriculari.forEach(item => {
        const marcaNorm = normalizeazaMarca(item.marca);
        const modelNorm = aplicaReguliSpecifice(marcaNorm, item.model);
        const key = marcaNorm + "|" + modelNorm;
        grupateBrute[key] = (grupateBrute[key] || 0) + item.volum;
    });
    
    let alteModeleVolum = 0;
    
    for (const key in grupateBrute) {
        const parts = key.split('|');
        const marcaBrut = parts[0];
        const modelBrut = parts[1];
        const volum = grupateBrute[key];
        let identificat = false;
        
        const fullBrutName = marcaBrut + " " + modelBrut;
        const wordsBrut = fullBrutName.split(" ");
        
        for (let i = 0; i < data.length - 1; i++) {
            const itemExcel = data[i];
            const mExcelNorm = normalizeazaMarca(itemExcel.brand);
            const modExcelNorm = itemExcel.model.toString().toUpperCase().trim().replace(/,/g, ".").replace(/-/g, " ").replace(/\s+/g, " ");
            
            if (mExcelNorm === marcaBrut) {
                const wordsExcel = modExcelNorm.split(" ");
                let isSubset = true;
                for (let k = 0; k < wordsExcel.length; k++) {
                    if (wordsExcel[k] && !wordsBrut.includes(wordsExcel[k])) {
                        isSubset = false;
                        break;
                    }
                }
                
                if (isSubset) {
                    itemExcel.current_monthly += volum;
                    identificat = true;
                    break;
                }
            }
        }
        
        if (!identificat) {
            alteModeleVolum += volum;
        }
    }
    
    const alteModeleItem = data[data.length - 1];
    alteModeleItem.current_monthly = alteModeleVolum;
    
    const monthsOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const currentMonthIdx = Math.max(0, monthsOrder.indexOf((selectedMonthNume || "").toUpperCase().trim()));
    
    let totalMonthlySum = 0;
    let totalYtdSum = 0;
    let totalParcSum = 0;
    
    data.forEach(item => {
        item.history[selectedMonthNume] = item.current_monthly;
        
        let ytdSum = 0;
        for (let i = 0; i <= currentMonthIdx; i++) {
            ytdSum += (item.history[monthsOrder[i]] || 0);
        }
        
        item.ytd = ytdSum;
        item.parc = item.start + ytdSum;
        
        totalMonthlySum += item.current_monthly;
        totalYtdSum += item.ytd;
        totalParcSum += item.parc;
    });
    
    return {
        models: data,
        totals: {
            monthly: totalMonthlySum,
            ytd: totalYtdSum,
            parc: totalParcSum
        }
    };
}
// Starea aplicației
const state = {
    sheetsUrl: localStorage.getItem('ev_radar_sheets_url') || '',
    files: {
        auto: null,
        marfuri: null,
        radieri: null
    },
    data: {
        luna: '',      // YYYYMM (ex: "202605")
        lunaNume: '',  // ex: "MAY"
        totalAutoReg: 0,
        totalUtilReg: 0,
        totalRadieri: 0,
        totalUsedEv: 0,
        totalFirme: 0,
        totalPf: 0,
        inmatriculariModele: [], // Array de {marca, model, volum}
        radieriModele: []
    }
};

// Maparea lunilor numerice la numele utilizate în centralizator (Registrations 2026)
const luniNumeMap = {
    '01': 'JAN', '02': 'FEB', '03': 'MAR', '04': 'APR', '05': 'MAY', '06': 'JUN',
    '07': 'JUL', '08': 'AUG', '09': 'SEP', '10': 'OCT', '11': 'NOV', '12': 'DEC'
};

// Initializare interfata
document.addEventListener('DOMContentLoaded', () => {
    initUI();
    setupAdminAuth();
    setupPublicMonthSelect();
    setupConfig();
    setupDropZones();
    setupProcessBtn();
    setupSendBtn();
    setupClearBtn();
    setupAutoDgpciBtn();
    setupLocalProcessBtn();
    setupBlogReportTabs();
    setupCopyAndDownloadBtns();
});

function initUI() {
    if (state.sheetsUrl) {
        document.getElementById('sheets-url').value = state.sheetsUrl;
        showConfigStatus("URL configurat din memoria locală.", "success");
    }
    
    // Auto-load last processed month from cache
    const lastMonthCode = localStorage.getItem('ev_radar_ro_last_month_code');
    if (lastMonthCode) {
        const cached = localStorage.getItem('ev_radar_ro_data_' + lastMonthCode);
        if (cached) {
            try {
                state.data = JSON.parse(cached);
                renderDashboard();
                
                // Set values in selects
                const autoSelect = document.getElementById('auto-month-select');
                if (autoSelect) {
                    for (let opt of autoSelect.options) {
                        if (opt.value.startsWith(lastMonthCode + '|')) {
                            autoSelect.value = opt.value;
                            break;
                        }
                    }
                }
                const localSelect = document.getElementById('local-month-select');
                if (localSelect) {
                    for (let opt of localSelect.options) {
                        if (opt.value.startsWith(lastMonthCode + '|')) {
                            localSelect.value = opt.value;
                            break;
                        }
                    }
                }
                const publicSelect = document.getElementById('public-month-select');
                if (publicSelect) {
                    for (let opt of publicSelect.options) {
                        const cleanCode = lastMonthCode.replace('-', '');
                        if (opt.value.startsWith(lastMonthCode + '|') || opt.value.startsWith(cleanCode + '|')) {
                            publicSelect.value = opt.value;
                            break;
                        }
                    }
                }
            } catch (e) {
                console.error("Eroare la incarcarea cache-ului initial:", e);
            }
        }
    }
}

function setupAdminAuth() {
    const adminToggleBtn = document.getElementById('admin-toggle-btn');
    if (!adminToggleBtn) return;

    // Citire stare admin salvata din sessionStorage
    const isAdmin = sessionStorage.getItem('ev_radar_admin') === 'true';
    if (isAdmin) {
        document.body.classList.add('is-admin');
        adminToggleBtn.innerHTML = '🔓 Admin Mode';
        adminToggleBtn.style.background = 'var(--success-color)';
        adminToggleBtn.style.color = '#ffffff';
    } else {
        document.body.classList.remove('is-admin');
        adminToggleBtn.innerHTML = '🔒 Admin';
        adminToggleBtn.style.background = '';
        adminToggleBtn.style.color = '';
    }

    adminToggleBtn.addEventListener('click', () => {
        const currentlyAdmin = document.body.classList.contains('is-admin');
        if (currentlyAdmin) {
            // Logout
            document.body.classList.remove('is-admin');
            sessionStorage.removeItem('ev_radar_admin');
            adminToggleBtn.innerHTML = '🔒 Admin';
            adminToggleBtn.style.background = '';
            adminToggleBtn.style.color = '';
        } else {
            // Prompt parola
            const password = prompt('Introdu parola de administrator pentru a accesa configurările:');
            if (password === 'radar2026') {
                document.body.classList.add('is-admin');
                sessionStorage.setItem('ev_radar_admin', 'true');
                adminToggleBtn.innerHTML = '🔓 Admin Mode';
                adminToggleBtn.style.background = 'var(--success-color)';
                adminToggleBtn.style.color = '#ffffff';
            } else if (password !== null) {
                alert('Parolă incorectă!');
            }
        }
    });
}

function setupPublicMonthSelect() {
    const select = document.getElementById('public-month-select');
    if (!select) return;

    // Asculta schimbarile de luna pentru utilizatorii publici
    select.addEventListener('change', async () => {
        const val = select.value;
        if (!val) return;
        
        const [lunaCode, lunaNume] = val.split('|');
        const lunaHyphen = lunaCode.includes('-') ? lunaCode : `${lunaCode.substring(0, 4)}-${lunaCode.substring(4)}`;
        const lunaNoHyphen = lunaCode.replace('-', '');
        
        // 1. Incercare: Citire fisier JSON de pe server cu cache busting
        try {
            const response = await fetch(`rapoarte/dashboard_${lunaHyphen}.json?t=${Date.now()}`);
            if (response.ok) {
                const result = await response.json();
                state.data = result;
                localStorage.setItem('ev_radar_ro_data_' + lunaNoHyphen, JSON.stringify(result));
                localStorage.setItem('ev_radar_ro_data_' + lunaHyphen, JSON.stringify(result));
                renderDashboard();
                return;
            } else {
                const response2 = await fetch(`rapoarte/dashboard_${lunaNoHyphen}.json?t=${Date.now()}`);
                if (response2.ok) {
                    const result2 = await response2.json();
                    state.data = result2;
                    localStorage.setItem('ev_radar_ro_data_' + lunaNoHyphen, JSON.stringify(result2));
                    localStorage.setItem('ev_radar_ro_data_' + lunaHyphen, JSON.stringify(result2));
                    renderDashboard();
                    return;
                }
            }
        } catch (err) {
            console.warn("Eroare la citirea online a raportului static, incerc cache-ul local...", err);
        }
        
        // 2. Fallback: Citire din localStorage (cache local)
        let cached = localStorage.getItem('ev_radar_ro_data_' + lunaNoHyphen) || 
                     localStorage.getItem('ev_radar_ro_data_' + lunaHyphen) || 
                     localStorage.getItem('ev_radar_ro_data_' + lunaNume);
                     
        if (cached) {
            try {
                state.data = JSON.parse(cached);
                renderDashboard();
            } catch (e) {
                console.error("Eroare la parsarea cache-ului local:", e);
                alert(`Nu s-au putut încărca datele pentru luna ${lunaNume}.`);
            }
        } else {
            alert(`Nu există date procesate pentru luna ${lunaNume}.`);
        }
    });

    // Trigger initial change event to load the default selected month if no cached data exists
    if (!localStorage.getItem('ev_radar_ro_last_month_code')) {
        select.dispatchEvent(new Event('change'));
    }
}

function setupConfig() {
    const saveBtn = document.getElementById('save-config-btn');
    const input = document.getElementById('sheets-url');
    
    saveBtn.addEventListener('click', () => {
        const val = input.value.trim();
        if (val) {
            state.sheetsUrl = val;
            localStorage.setItem('ev_radar_sheets_url', val);
            showConfigStatus("URL salvat cu succes!", "success");
        } else {
            showConfigStatus("Te rugăm să introduci un URL valid.", "error");
        }
    });
}

function showConfigStatus(msg, type) {
    const el = document.getElementById('config-status');
    el.innerText = msg;
    el.className = `status-msg ${type}`;
}

// Configurare drag and drop si selectare manuala fisier
function setupDropZones() {
    const types = ['auto', 'marfuri', 'radieri'];
    
    types.forEach(type => {
        const zone = document.getElementById(`drop-zone-${type}`);
        const input = document.getElementById(`file-${type}`);
        
        // Oprim propagarea pentru a evita bucla infinita de click-uri
        input.addEventListener('click', (e) => e.stopPropagation());
        
        // Click pe zona de drag deschide selectorul
        zone.addEventListener('click', () => input.click());
        
        input.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileSelect(e.target.files[0], type);
            }
        });
        
        // Drag events
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('dragover');
        });
        
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('dragover');
        });
        
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                handleFileSelect(e.dataTransfer.files[0], type);
            }
        });
    });
}

function handleFileSelect(file, type) {
    state.files[type] = file;
    
    const statusEl = document.getElementById(`status-${type}`);
    const cardEl = document.getElementById(`drop-zone-${type}`);
    
    statusEl.innerText = file.name;
    cardEl.classList.add('loaded');
    
    detectMonth();
    checkFilesReady();
}

// Detecteaza automat luna din numele fisierului (ex: "202605_Autoturisme.xlsx" -> "2026-05" / "MAY")
function detectMonth() {
    let filename = '';
    for (const key in state.files) {
        if (state.files[key]) {
            filename = state.files[key].name;
            break;
        }
    }
    
    if (!filename) return;
    
    // Căutăm 6 cifre consecutive (YYYYMM) oriunde în denumirea fișierului
    const match = filename.match(/(202\d)(0[1-9]|1[0-2])/);
    if (match) {
        const an = match[1];
        const lunaNum = match[2];
        state.data.luna = `${an}-${lunaNum}`;
        state.data.lunaNume = luniNumeMap[lunaNum];
        
        // Sincronizăm dropdown-ul manual cu luna detectată
        const select = document.getElementById('manual-month-select');
        const valToFind = `${state.data.luna}|${state.data.lunaNume}`;
        
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value === valToFind) {
                select.selectedIndex = i;
                break;
            }
        }
        
        document.getElementById('detected-month').innerText = `${state.data.luna} (${state.data.lunaNume})`;
    }
}

function checkFilesReady() {
    const count = Object.values(state.files).filter(x => x !== null).length;
    const control = document.getElementById('process-control');
    const summary = document.getElementById('files-summary');
    
    if (count > 0) {
        control.style.display = 'block';
        summary.innerText = `Fișiere pregătite: ${count} din 3. Selectează luna de analizat dacă este cazul, apoi apasă pe Procesează.`;
    } else {
        control.style.display = 'none';
    }
}

// Logica de parsare si procesare a fisierelor Excel in browser
function setupProcessBtn() {
    const btn = document.getElementById('process-btn');
    btn.addEventListener('click', () => {
        const select = document.getElementById('manual-month-select');
        const [luna, lunaNume] = select.value.split('|');
        state.data.luna = luna;
        state.data.lunaNume = lunaNume;
        
        showLoader("Se analizează fișierele Excel...");
        
        setTimeout(async () => {
            try {
                console.log("Starting processAllFiles...");
                await processAllFiles();
                console.log("Processing finished successfully. State data:", state.data);
                hideLoader();
                renderDashboard();
            } catch (err) {
                hideLoader();
                console.error("Detailed error in processing:", err);
                alert("Eroare la procesarea fișierelor: " + err.message + "\n\nVerifică consola browserului (F12 -> Console) pentru detalii tehnice.");
            }
        }, 100);
    });
}

async function processAllFiles() {
    state.data.totalAutoReg = 0;
    state.data.totalUtilReg = 0;
    state.data.totalRadieri = 0;
    state.data.inmatriculariModele = [];
    state.data.radieriModele = [];
    
    const modelRegs = {};
    const modelRads = {};
    
    let totalNewAllFuels = 0;
    let totalNewEv = 0;
    
    state.data.totalFirme = 0;
    state.data.totalPf = 0;
    
    // 1. Parsare Autoturisme
    if (state.files.auto) {
        const data = await readExcelRows(state.files.auto, "Lista_Detaliata");
        data.forEach(row => {
            const motiv = (row[25] || '').toString().trim().toUpperCase();
            // Index 11: Combustibil, Index 29: Volum, Index 1: Marca, Index 5: Model
            if (row[11] && row[11].toString().trim().toUpperCase() === "ELECTRIC") {
                const vol = parseInt(row[29] || 0);
                state.data.totalAutoReg += vol;
                
                const key = `${row[1] || ''} | ${row[5] || ''}`;
                modelRegs[key] = (modelRegs[key] || 0) + vol;
                
                const detinator = (row[20] || '').toString().trim().toUpperCase();
                if (detinator === "COMPANIE") {
                    state.data.totalFirme += vol;
                } else if (detinator === "PERSOANA FIZICA") {
                    state.data.totalPf += vol;
                }
                
                if (motiv.includes("NOU")) {
                    totalNewEv += vol;
                }
            }
            if (motiv.includes("NOU")) {
                const vol = parseInt(row[29] || 0);
                totalNewAllFuels += vol;
            }
        });
    }
    
    // 2. Parsare Utilitare
    if (state.files.marfuri) {
        const data = await readExcelRows(state.files.marfuri, "Lista_Detaliata");
        data.forEach(row => {
            // Categorie Comunitara (Index 28) == "N1", Combustibil == "ELECTRIC"
            if (row[28] && row[28].toString().trim().toUpperCase() === "N1") {
                const motiv = (row[25] || '').toString().trim().toUpperCase();
                if (row[11] && row[11].toString().trim().toUpperCase() === "ELECTRIC") {
                    const vol = parseInt(row[29] || 0);
                    state.data.totalUtilReg += vol;
                    
                    const key = `${row[1] || ''} | ${row[5] || ''}`;
                    modelRegs[key] = (modelRegs[key] || 0) + vol;
                    
                    const detinator = (row[20] || '').toString().trim().toUpperCase();
                    if (detinator === "COMPANIE") {
                        state.data.totalFirme += vol;
                    } else if (detinator === "PERSOANA FIZICA") {
                        state.data.totalPf += vol;
                    }
                    
                    if (motiv.includes("NOU")) {
                        totalNewEv += vol;
                    }
                }
                if (motiv.includes("NOU")) {
                    const vol = parseInt(row[29] || 0);
                    totalNewAllFuels += vol;
                }
            }
        });
    }
    
    // 3. Parsare Radieri
    if (state.files.radieri) {
        const data = await readExcelRows(state.files.radieri, "Radieri");
        data.forEach(row => {
            // Index 12: Combustibil, Index 6: Categorie Nationala, Index 25: Volum
            if (row[12] && row[12].toString().trim().toUpperCase() === "ELECTRIC") {
                const cat = (row[6] || '').toString().trim().toUpperCase();
                if (cat === "AUTOTURISM" || cat === "AUTOUTILITARA") {
                    const vol = parseInt(row[25] || 0);
                    state.data.totalRadieri += vol;
                    
                    const key = `${row[1] || ''} | ${row[5] || ''}`;
                    modelRads[key] = (modelRads[key] || 0) + vol;
                }
            }
        });
    }
    
    // Transformare in liste si sortare descrescatoare
    for (const key in modelRegs) {
        const parts = key.split(" | ");
        state.data.inmatriculariModele.push({
            marca: parts[0].trim(),
            model: parts[1].trim(),
            volum: modelRegs[key]
        });
    }
    state.data.inmatriculariModele.sort((a,b) => b.volum - a.volum);
    
    for (const key in modelRads) {
        const parts = key.split(" | ");
        state.data.radieriModele.push({
            marca: parts[0].trim(),
            model: parts[1].trim(),
            volum: modelRads[key]
        });
    }
    state.data.radieriModele.sort((a,b) => b.volum - a.volum);
    
    // Calcule avansate
    const totalEV = state.data.totalAutoReg + state.data.totalUtilReg;
    state.data.totalUsedEv = totalEV - totalNewEv;
    state.data.evShare = totalNewAllFuels > 0 ? (totalNewEv / totalNewAllFuels) : 0;
    state.data.usedShare = totalEV > 0 ? (state.data.totalUsedEv / totalEV) : 0;
    
    const val2025Map = {
        'JAN': 1639, 'FEB': 1069, 'MAR': 628, 'APR': 612, 'MAY': 863, 'JUN': 807,
        'JUL': 976, 'AUG': 1335, 'SEP': 1158, 'OCT': 1562, 'NOV': 1552, 'DEC': 1880
    };
    const val_2025 = val2025Map[state.data.lunaNume] || 863;
    state.data.yoyGrowth = ((totalEV - val_2025) / val_2025) * 100;
}

// Citeste un fisier Excel si returneaza randurile ca array 2D
function readExcelRows(file, sheetName) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                
                const sheet = workbook.Sheets[sheetName];
                if (!sheet) {
                    throw new Error(`Sheet-ul '${sheetName}' nu exista in fisierul ${file.name}.`);
                }
                
                // DGPCI genereaza Excel-uri cu metadate de dimensiune gresite (raporteaza doar 8 randuri).
                // Fortam SheetJS sa caute toate cheile de celule existente pentru a determina dimensiunea reala.
                let maxRow = 0;
                let maxCol = 0;
                
                // Parcurgem toate celulele populate din sheet
                Object.keys(sheet).forEach(key => {
                    if (key[0] === '!') return; // Ignoram metadatele
                    const cellRef = XLSX.utils.decode_cell(key);
                    if (cellRef.r > maxRow) maxRow = cellRef.r;
                    if (cellRef.c > maxCol) maxCol = cellRef.c;
                });
                
                // Actualizam range-ul foii de calcul la cel real determinat
                sheet['!ref'] = XLSX.utils.encode_range({
                    s: { r: 0, c: 0 },
                    e: { r: maxRow, c: maxCol }
                });
                
                // Folosim defval: "" pentru a garanta ca toate coloanele raman pe aceleasi pozitii
                const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
                console.log(`Parsed sheet '${sheetName}' with real row count: ${rows.length}`);
                resolve(rows.slice(7)); // Skip first 7 header rows
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = () => reject(new Error("Citirea fisierului a esuat."));
        reader.readAsArrayBuffer(file);
    });
}

function renderDashboard() {
    const totalEV = state.data.totalAutoReg + state.data.totalUtilReg;
    const netGrowth = totalEV - state.data.totalRadieri;
    
    // Salvam datele pentru a le accesa din comparatie.html si pentru caching
    localStorage.setItem('ev_radar_ro_data_' + state.data.lunaNume, JSON.stringify(state.data));
    if (state.data.luna) {
        localStorage.setItem('ev_radar_ro_data_' + state.data.luna, JSON.stringify(state.data));
        localStorage.setItem('ev_radar_ro_last_month_code', state.data.luna);
    }
    
    document.getElementById('val-auto-reg').innerText = state.data.totalAutoReg;
    document.getElementById('val-util-reg').innerText = state.data.totalUtilReg;
    document.getElementById('val-total-rad').innerText = state.data.totalRadieri;
    document.getElementById('val-net-growth').innerText = netGrowth;
    
    // Calculeaza parcul auto national total estimat
    const base2025 = 63986;
    const history2026 = {
        'JAN': 1410 - 85,
        'FEB': 1370 - 92,
        'MAR': 1206 - 186,
        'APR': 1306 - 49,
        'MAY': 1505 - 103,
        'JUN': 0, 'JUL': 0, 'AUG': 0, 'SEP': 0, 'OCT': 0, 'NOV': 0, 'DEC': 0
    };
    
    // Suprascriem luna selectată cu datele procesate curent
    history2026[state.data.lunaNume] = netGrowth;
    
    // Insumam istoricul pana la luna curenta
    const monthsOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    let totalFleet = base2025;
    for (const m of monthsOrder) {
        totalFleet += history2026[m];
        if (m === state.data.lunaNume) break;
    }
    
    document.getElementById('val-national-fleet').innerText = totalFleet.toLocaleString('ro-RO');
    document.getElementById('fleet-month-name').innerText = state.data.lunaNume + " 2026";
    document.getElementById('divider-month-name').innerText = state.data.lunaNume + " 2026";
    
    // Dashboard advanced stats
    document.getElementById('val-ev-share').innerText = `${(state.data.evShare * 100).toFixed(2)}%`;
    document.getElementById('val-used-share').innerText = `${(state.data.usedShare * 100).toFixed(2)}%`;
    
    const sign = state.data.yoyGrowth >= 0 ? '+' : '';
    document.getElementById('lbl-yoy-growth').innerText = `Evoluție YoY vs ${state.data.lunaNume} 2025`;
    const yoyValEl = document.getElementById('val-yoy-growth');
    yoyValEl.innerText = `${sign}${state.data.yoyGrowth.toFixed(2)}%`;
    if (state.data.yoyGrowth >= 0) {
        yoyValEl.className = 'stat-value success-value';
    } else {
        yoyValEl.className = 'stat-value warning-value';
    }

    // Company / Individual stats
    const firmePct = totalEV > 0 ? (state.data.totalFirme / totalEV) * 100 : 0;
    const pfPct = totalEV > 0 ? (state.data.totalPf / totalEV) * 100 : 0;
    document.getElementById('val-firme-pct').innerText = `${firmePct.toFixed(2)}%`;
    document.getElementById('val-firme-qty').innerText = (state.data.totalFirme || 0).toLocaleString('ro-RO');
    document.getElementById('val-pf-pct').innerText = `${pfPct.toFixed(2)}%`;
    document.getElementById('val-pf-qty').innerText = (state.data.totalPf || 0).toLocaleString('ro-RO');
    
    // Top Marci (Branduri)
    const brandVolums = {};
    state.data.inmatriculariModele.forEach(item => {
        const brand = item.marca || 'Necunoscută';
        brandVolums[brand] = (brandVolums[brand] || 0) + item.volum;
    });
    const topBrands = Object.keys(brandVolums).map(brand => ({
        marca: brand,
        volum: brandVolums[brand]
    })).sort((a, b) => b.volum - a.volum).slice(0, 10);

    const brandTbody = document.getElementById('top-brands-tbody');
    if (brandTbody) {
        brandTbody.innerHTML = '';
        topBrands.forEach((item, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td style="text-align: center; font-weight: 700; color: var(--text-muted);">${idx + 1}</td><td>${item.marca}</td><td><strong>${item.volum}</strong></td>`;
            brandTbody.appendChild(tr);
        });
    }

    // Top inmatriculari
    const regTbody = document.getElementById('top-models-tbody');
    regTbody.innerHTML = '';
    state.data.inmatriculariModele.slice(0, 20).forEach((item, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td style="text-align: center; font-weight: 700; color: var(--text-muted);">${idx + 1}</td><td>${item.marca}</td><td>${item.model}</td><td><strong>${item.volum}</strong></td>`;
        regTbody.appendChild(tr);
    });
    
    // Top radieri
    const radTbody = document.getElementById('top-rad-tbody');
    radTbody.innerHTML = '';
    state.data.radieriModele.slice(0, 20).forEach((item, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td style="text-align: center; font-weight: 700; color: var(--text-muted);">${idx + 1}</td><td>${item.marca}</td><td>${item.model}</td><td><strong>${item.volum}</strong></td>`;
        radTbody.appendChild(tr);
    });
    
    // Render blog report texts
    generateBlogReportTexts();
    
    // Render historical comparison charts
    renderHistoricalCharts();
    
    document.getElementById('results-dashboard').style.display = 'block';
    // Scroll lin catre dashboard
    document.getElementById('results-dashboard').scrollIntoView({ behavior: 'smooth' });
}

// Generează textele și codurile HTML pentru secțiunea de blog

function generateBlogReportTexts() {
    const totalEV = state.data.totalAutoReg + state.data.totalUtilReg;
    const totalUsedEv = state.data.totalUsedEv !== undefined ? state.data.totalUsedEv : Math.round(totalEV * (state.data.usedShare || 0));
    const totalNewEv = totalEV - totalUsedEv;
    const usedPct = (state.data.usedShare * 100).toFixed(2);
    const growthSign = state.data.yoyGrowth >= 0 ? '+' : '';
    
    const monthTranslations = {
        'JAN': 'Ianuarie', 'FEB': 'Februarie', 'MAR': 'Martie',
        'APR': 'Aprilie', 'MAY': 'Mai', 'JUN': 'Iunie',
        'JUL': 'Iulie', 'AUG': 'August', 'SEP': 'Septembrie',
        'OCT': 'Octombrie', 'NOV': 'Noiembrie', 'DEC': 'Decembrie'
    };
    const monthRo = monthTranslations[state.data.lunaNume.toUpperCase()] || state.data.lunaNume;
    
    const formatModelName = (brand, model) => {
        const b = (brand || "").trim();
        const m = (model || "").trim();
        if (m.toUpperCase().startsWith(b.toUpperCase())) {
            return m;
        }
        return `${b} ${m}`;
    };
    
    // 1. Sumar text
    const summaryHtml = `
        <p>În luna <strong>${monthRo}</strong> 2026, au fost înmatriculate un total de <strong>${totalEV}</strong> vehicule electrice (M1 + N1), înregistrând o evoluție de <strong>${growthSign}${state.data.yoyGrowth.toFixed(2)}%</strong> comparativ cu aceeași lună a anului trecut.</p>
        <p class="has-pale-cyan-blue-background-color has-background">Din totalul înmatriculărilor de EV-uri, <strong>${totalUsedEv} unități (${usedPct}%)</strong> sunt reprezentate de vehicule second-hand (rulate), restul de ${totalNewEv} unități fiind vehicule noi.</p>
        <p>Vehiculele electrice noi au reprezentat <strong>${(state.data.evShare * 100).toFixed(2)}%</strong> din totalul autovehiculelor noi înmatriculate în luna <strong>${monthRo}</strong>.</p>
    `;
    document.getElementById('blog-summary-text').innerHTML = summaryHtml;
    
    // 2. Calculăm datele pentru YTD și Parc
    const results = computeYtdAndParcData(state.data.lunaNume, state.data.inmatriculariModele);
    const modelsData = results.models;
    const totals = results.totals;
    
    // Excludem 'Alte Modele' din topuri
    const specificData = modelsData.filter(d => d.brand !== "Alte Modele");
    
    // Top 20 monthly
    const top20Monthly = [...specificData].sort((a, b) => (b.current_monthly || 0) - (a.current_monthly || 0)).slice(0, 20);
    
    // Top 20 YTD
    const top20Ytd = [...specificData].sort((a, b) => b.ytd - a.ytd).slice(0, 20);
    
    // Top 20 Parc
    const top20Parc = [...specificData].sort((a, b) => b.parc - a.parc).slice(0, 20);
    
    // Top 50 YTD
    const top50Ytd = [...specificData].sort((a, b) => b.ytd - a.ytd).slice(0, 50);
    
    // Top 50 Parc
    const top50Parc = [...specificData].sort((a, b) => b.parc - a.parc).slice(0, 50);
    
    // 1. Înmatriculări Lunare EV (2025 vs. 2026)
    const regs2025 = {
        'JAN': 1639, 'FEB': 1069, 'MAR': 628, 'APR': 612, 'MAY': 863, 'JUN': 807,
        'JUL': 976, 'AUG': 1335, 'SEP': 1158, 'OCT': 1562, 'NOV': 1552, 'DEC': 1880
    };
    
    const regs2026 = {
        'JAN': 1410, 'FEB': 1370, 'MAR': 1206, 'APR': 1306, 'MAY': 1505,
        'JUN': null, 'JUL': null, 'AUG': null, 'SEP': null, 'OCT': null, 'NOV': null, 'DEC': null
    };
    
    const currentLunaNume = state.data.lunaNume;
    const currentRegs = state.data.totalAutoReg + state.data.totalUtilReg;
    if (regs2026.hasOwnProperty(currentLunaNume)) {
        regs2026[currentLunaNume] = currentRegs;
    }
    
    const monthsOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const currentIdx = monthsOrder.indexOf(currentLunaNume);
    if (currentIdx !== -1) {
        for (let i = currentIdx + 1; i < monthsOrder.length; i++) {
            regs2026[monthsOrder[i]] = null;
        }
    }

    let maxVal = 0;
    monthsOrder.forEach(m => {
        if (regs2025[m] > maxVal) maxVal = regs2025[m];
        if (regs2026[m] !== null && regs2026[m] > maxVal) maxVal = regs2026[m];
    });
    const scaleMax = maxVal * 1.15;

    let monthlyBarsHtml = '';
    monthsOrder.forEach(m => {
        const val25 = regs2025[m];
        const val26 = regs2026[m];
        
        const h25 = ((val25 / scaleMax) * 100).toFixed(1);
        const h26 = val26 !== null ? ((val26 / scaleMax) * 100).toFixed(1) : 0;
        
        let badgeHTML = '';
        if (val26 !== null && val26 > 0) {
            const pct = ((val26 - val25) / val25 * 100).toFixed(1);
            const sign = pct >= 0 ? '+' : '';
            const badgeClass = pct >= 0 ? 'positive' : 'negative';
            badgeHTML = `<span class="ev-growth-badge ${badgeClass}">${sign}${pct}%</span>`;
        }
        
        const monthLabel = {
            'JAN': 'IAN', 'FEB': 'FEB', 'MAR': 'MAR', 'APR': 'APR', 'MAY': 'MAI', 'JUN': 'IUN',
            'JUL': 'IUL', 'AUG': 'AUG', 'SEP': 'SEP', 'OCT': 'OCT', 'NOV': 'NOV', 'DEC': 'DEC'
        }[m] || m;

        monthlyBarsHtml += `    <div class="ev-v-col">
      <div class="ev-v-badge-wrap">
        ${badgeHTML}
      </div>
      <div class="ev-v-bars-wrapper">
        <div class="ev-v-bar-2025" style="height: ${h25}%;">
          <span class="ev-v-bar-val">${val25}</span>
        </div>
        ${val26 !== null ? `
        <div class="ev-v-bar-2026" style="height: ${h26}%;">
          <span class="ev-v-bar-val active-year">${val26}</span>
        </div>` : ''}
      </div>
      <div class="ev-v-label">${monthLabel}</div>
    </div>\n`;
    });

    let codeHtmlMonthly = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<div class="ev-vertical-chart-container">
  <style>
    .ev-vertical-chart-container {
      font-family: 'Montserrat', sans-serif;
      background: #FAFAFA;
      padding: 35px 25px;
      max-width: 800px;
      margin: 20px auto;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      border: 1px solid #eaeaea;
    }
    .ev-title-area {
      margin-bottom: 25px;
    }
    .ev-chart-main-title {
      color: #004b87;
      font-weight: 900;
      font-size: 24px;
      margin: 0 0 5px 0;
    }
    .ev-chart-sub-title {
      color: #666;
      font-size: 14px;
      margin: 0;
      font-weight: 600;
    }
    .ev-legend {
      display: flex;
      gap: 15px;
      margin-bottom: 25px;
      font-size: 12px;
      font-weight: 700;
    }
    .ev-legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #555;
    }
    .ev-legend-color {
      width: 14px;
      height: 14px;
      border-radius: 3px;
    }
    .ev-v-chart {
      display: flex;
      height: 260px;
      align-items: flex-end;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 10px;
      gap: 4px;
    }
    .ev-v-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      justify-content: flex-end;
      position: relative;
      border-right: 1px dashed rgba(226, 232, 240, 0.8);
    }
    .ev-v-col:last-child {
      border-right: none;
    }
    .ev-v-badge-wrap {
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 6px;
    }
    .ev-growth-badge {
      font-size: 10px;
      font-weight: 800;
      padding: 2px 5px;
      border-radius: 4px;
      line-height: 1;
      white-space: nowrap;
    }
    .ev-growth-badge.positive {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }
    .ev-growth-badge.negative {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }
    .ev-v-bars-wrapper {
      display: flex;
      align-items: flex-end;
      gap: 4px;
      height: calc(100% - 28px);
      justify-content: center;
      width: 100%;
      padding: 0 2px;
    }
    .ev-v-bar-2025 {
      width: 16px;
      background: #4299e1;
      border-radius: 4px 4px 0 0;
      position: relative;
      min-height: 2px;
    }
    .ev-v-bar-2026 {
      width: 16px;
      background: #004b87;
      border-radius: 4px 4px 0 0;
      position: relative;
      min-height: 2px;
    }
    .ev-v-bar-val {
      font-size: 9px;
      font-weight: 800;
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 4px;
      white-space: nowrap;
      color: #2b6cb0;
    }
    .ev-v-bar-val.active-year {
      color: #004b87;
    }
    .ev-v-label {
      font-size: 11px;
      font-weight: 800;
      margin-top: 8px;
      color: #1e293b;
    }
    @media (max-width: 600px) {
      .ev-v-bar-val {
        display: none;
      }
      .ev-vertical-chart-container {
        padding: 20px 10px;
      }
      .ev-v-bars-wrapper {
        gap: 2px;
      }
      .ev-v-bar-2025, .ev-v-bar-2026 {
        width: 10px;
      }
      .ev-v-label {
        font-size: 9px;
      }
    }
  </style>
  <div class="ev-title-area">
    <div class="ev-chart-main-title">Înmatriculări lunare EV (2025 vs. 2026)</div>
    <div class="ev-chart-sub-title">Evoluție înmatriculări mașini electrice în România</div>
  </div>
  <div class="ev-legend">
    <div class="ev-legend-item">
      <div class="ev-legend-color" style="background: #004b87;"></div>
      <span>2026</span>
    </div>
    <div class="ev-legend-item">
      <div class="ev-legend-color" style="background: #4299e1;"></div>
      <span>2025</span>
    </div>
  </div>
  <div class="ev-v-chart">
${monthlyBarsHtml}  </div>
</div>`;

    // 2. Top 20 Lună Procesată (cu număr curent)
    let codeHtmlTop20 = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<div class="ev-chart-container">
  <style>
    .ev-chart-container { 
      font-family: 'Montserrat', sans-serif; 
      background: #FAFAFA; 
      padding: 35px 25px; 
      max-width: 800px; 
      margin: 20px auto; 
      border-radius: 12px; 
      box-shadow: 0 4px 15px rgba(0,0,0,0.05); 
      border: 1px solid #eaeaea;
    }
    .ev-chart-title { 
      color: #004b87; 
      font-weight: 900; 
      font-size: 26px; 
      margin-bottom: 5px; 
    }
    .ev-chart-subtitle { 
      color: #666; 
      font-size: 14px; 
      margin-bottom: 30px; 
      font-weight: 600; 
    }
    .ev-bar-row { 
      display: flex; 
      align-items: center; 
      margin-bottom: 12px; 
    }
    .ev-label { 
      width: 200px; 
      text-align: right; 
      padding-right: 15px; 
      font-weight: 700; 
      font-size: 13px; 
      color: #333; 
    }
    .ev-bar-wrapper { 
      flex-grow: 1; 
      display: flex; 
      align-items: center; 
    }
    .ev-bar { 
      background: #4A90E2; 
      height: 24px; 
      border-radius: 0 4px 4px 0; 
      min-width: 2px; 
    }
    .ev-bar.top-3 { background: #004b87; }
    .ev-value { 
      margin-left: 10px; 
      font-weight: 900; 
      font-size: 14px; 
      color: #333; 
    }
    @media (max-width: 500px) {
      .ev-label { width: 130px; font-size: 11px; padding-right: 10px; }
      .ev-value { font-size: 12px; }
    }
  </style>
  <div class="ev-chart-title">Top 20 ${monthRo}</div>
  <div class="ev-chart-subtitle">Înmatriculări mașini electrice România (2026)</div>\n`;

    const maxMonthlyVal = top20Monthly.length > 0 ? top20Monthly[0].current_monthly : 1;
    top20Monthly.forEach((item, idx) => {
        const widthPct = (item.current_monthly / maxMonthlyVal * 100).toFixed(1);
        const barClass = idx < 3 ? "top-3" : "";
        codeHtmlTop20 += `  <div class="ev-bar-row"><div class="ev-label">${idx + 1}. ${formatModelName(item.brand, item.model)}</div><div class="ev-bar-wrapper"><div class="ev-bar ${barClass}" style="width: ${widthPct}%;"></div><span class="ev-value">${item.current_monthly}</span></div></div>\n`;
    });
    codeHtmlTop20 += `</div>`;

    // 3. Evoluție Parc Auto EV (înmatriculări anuale brute)
    const annualData = [
        { year: 2011, qty: 7 },
        { year: 2012, qty: 5 },
        { year: 2013, qty: 50 },
        { year: 2014, qty: 16 },
        { year: 2015, qty: 32 },
        { year: 2016, qty: 104 },
        { year: 2017, qty: 247 },
        { year: 2018, qty: 710 },
        { year: 2019, qty: 1747 },
        { year: 2020, qty: 3134 },
        { year: 2021, qty: 6831 },
        { year: 2022, qty: 12466 },
        { year: 2023, qty: 16852 },
        { year: 2024, qty: 12677 },
        { year: 2025, qty: 12756 }
    ];

    const base2025 = 63986;
    const history2026 = {
        'JAN': 1410 - 85,
        'FEB': 1370 - 92,
        'MAR': 1206 - 186,
        'APR': 1306 - 49,
        'MAY': 1505 - 103,
        'JUN': 0, 'JUL': 0, 'AUG': 0, 'SEP': 0, 'OCT': 0, 'NOV': 0, 'DEC': 0
    };
    
    const netGrowth = (state.data.totalAutoReg + state.data.totalUtilReg) - state.data.totalRadieri;
    history2026[currentLunaNume] = netGrowth;
    
    let totalFleet = base2025;
    for (const m of monthsOrder) {
        totalFleet += history2026[m];
        if (m === currentLunaNume) break;
    }
    
    const finalAnnualData = [...annualData, { year: 2026, qty: totalFleet - base2025, active: true }];
    const maxQty = Math.max(...finalAnnualData.map(d => d.qty));
    const scaleMaxQty = maxQty * 1.15;

    let annualBarsHtml = '';
    finalAnnualData.forEach(d => {
        const heightPct = ((d.qty / scaleMaxQty) * 100).toFixed(1);
        const is2026Class = d.active ? 'highlight' : '';
        const valueColorClass = d.active ? 'active-year' : '';
        annualBarsHtml += `    <div class="ev-v-col">
      <div class="ev-v-bars-wrapper" style="height: calc(100% - 25px);">
        <div class="ev-v-bar-annual ${is2026Class}" style="height: ${heightPct}%;">
          <span class="ev-v-bar-val ${valueColorClass}">${d.qty.toLocaleString('ro-RO')}</span>
        </div>
      </div>
      <div class="ev-v-label" style="font-size: 10px;">${d.year}${d.active ? '*' : ''}</div>
    </div>\n`;
    });

    let codeHtmlAnnual = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<div class="ev-vertical-chart-container">
  <style>
    .ev-vertical-chart-container {
      font-family: 'Montserrat', sans-serif;
      background: #FAFAFA;
      padding: 35px 25px;
      max-width: 800px;
      margin: 20px auto;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      border: 1px solid #eaeaea;
    }
    .ev-header-flex {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 25px;
    }
    .ev-title-area {
      flex-grow: 1;
    }
    .ev-chart-main-title {
      color: #004b87;
      font-weight: 900;
      font-size: 24px;
      margin: 0 0 5px 0;
    }
    .ev-chart-sub-title {
      color: #666;
      font-size: 14px;
      margin: 0;
      font-weight: 600;
    }
    .ev-summary-box {
      background: #eef5fc;
      border-left: 4px solid #004b87;
      padding: 10px 15px;
      border-radius: 4px;
      text-align: right;
    }
    .ev-summary-label {
      font-size: 10px;
      font-weight: 800;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .ev-summary-value {
      font-size: 22px;
      font-weight: 900;
      color: #004b87;
      margin-top: 2px;
    }
    .ev-v-chart {
      display: flex;
      height: 260px;
      align-items: flex-end;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 10px;
      gap: 2px;
    }
    .ev-v-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      justify-content: flex-end;
      position: relative;
      border-right: 1px dashed rgba(226, 232, 240, 0.8);
    }
    .ev-v-col:last-child {
      border-right: none;
    }
    .ev-v-bars-wrapper {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      width: 100%;
    }
    .ev-v-bar-annual {
      width: 22px;
      background: #4299e1;
      border-radius: 4px 4px 0 0;
      position: relative;
      min-height: 2px;
    }
    .ev-v-bar-annual.highlight {
      background: #004b87 !important;
    }
    .ev-v-bar-val {
      font-size: 9px;
      font-weight: 800;
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 4px;
      white-space: nowrap;
      color: #2b6cb0;
    }
    .ev-v-bar-val.active-year {
      color: #004b87;
    }
    .ev-v-label {
      font-size: 11px;
      font-weight: 800;
      margin-top: 8px;
      color: #1e293b;
    }
    .ev-caption {
      font-size: 11px;
      color: #888;
      font-style: italic;
      margin-top: 15px;
    }
    @media (max-width: 768px) {
      .ev-v-bar-val {
        display: none;
      }
      .ev-vertical-chart-container {
        padding: 20px 10px;
      }
      .ev-v-bar-annual {
        width: 10px;
      }
      .ev-v-label {
        font-size: 8px;
      }
      .ev-header-flex {
        flex-direction: column;
        gap: 15px;
      }
      .ev-summary-box {
        text-align: left;
        align-self: flex-start;
      }
    }
  </style>
  <div class="ev-header-flex">
    <div class="ev-title-area">
      <div class="ev-chart-main-title">Evoluție Parc Auto EV</div>
      <div class="ev-chart-sub-title">Istoric înmatriculări România (2011 – 2026)</div>
    </div>
    <div class="ev-summary-box">
      <div class="ev-summary-label">TOTAL PARC AUTO (${monthRo.slice(0, 3)} '26)</div>
      <div class="ev-summary-value">${totalFleet.toLocaleString('ro-RO')}</div>
    </div>
  </div>
  <div class="ev-v-chart">
${annualBarsHtml}  </div>
  <div class="ev-caption">* Datele aferente anului 2026 sunt în curs de actualizare (ianuarie – ${monthRo.toLowerCase()}).</div>
</div>`;

    // 4. Top 50 - 2026 (table)
    let codeHtmlTableYtd = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<div class="ev-table-wrapper">
  <style>
    .ev-table-wrapper {
      font-family: 'Montserrat', sans-serif;
      max-width: 850px;
      margin: 25px auto;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      overflow: hidden;
      border: 1px solid #eaeaea;
    }
    .ev-table-header {
      padding: 20px 25px;
      background: #FAFAFA;
      border-bottom: 3px solid #004b87;
    }
    .ev-table-title {
      color: #004b87;
      font-weight: 800;
      font-size: 22px;
      margin-bottom: 5px;
      text-transform: uppercase;
      margin-top: 0;
    }
    .ev-table-subtitle {
      color: #666;
      font-size: 13px;
      font-weight: 600;
      margin: 0;
    }
    .ev-table-container {
      width: 100%;
      overflow-x: auto;
    }
    .ev-data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 14px;
    }
    .ev-data-table th {
      background-color: #f4f7fa;
      color: #004b87;
      font-weight: 800;
      padding: 14px 20px;
      border-bottom: 2px solid #dde4eb;
      white-space: nowrap;
      text-transform: uppercase;
      font-size: 12px;
    }
    .ev-data-table td {
      padding: 12px 20px;
      border-bottom: 1px solid #f0f0f0;
      color: #333;
    }
    .ev-data-table tr:nth-child(even) {
      background-color: #fcfcfc;
    }
    .ev-data-table tr:hover {
      background-color: #f0f6fc;
    }
    .col-rank { width: 50px; font-weight: 700; color: #888; text-align: center; }
    .col-model { font-weight: 600; }
    .col-val { font-weight: 700; color: #004b87; }
    .col-pct { color: #555; font-weight: 600; }
    @media (max-width: 500px) {
      .ev-data-table td, .ev-data-table th { padding: 10px 12px; font-size: 12px; }
      .col-rank { padding-left: 10px; padding-right: 10px; }
    }
  </style>
  <div class="ev-table-header">
    <h3 class="ev-table-title">TOP 50 - 2026</h3>
    <p class="ev-table-subtitle">Înmatriculări cumulate (Ianuarie - ${monthRo})</p>
  </div>
  <div class="ev-table-container">
    <table class="ev-data-table">
      <thead>
        <tr>
          <th class="col-rank">#</th>
          <th class="col-model">Model</th>
          <th class="col-val">2026</th>
          <th class="col-pct">% 2026</th>
        </tr>
      </thead>
      <tbody>\n`;
      
    top50Ytd.forEach((item, idx) => {
        const sharePct = totals.ytd > 0 ? (item.ytd / totals.ytd * 100).toFixed(2) : '0.00';
        codeHtmlTableYtd += `        <tr><td class="col-rank">${idx+1}</td><td class="col-model">${formatModelName(item.brand, item.model)}</td><td class="col-val">${item.ytd}</td><td class="col-pct">${sharePct}%</td></tr>\n`;
    });
    codeHtmlTableYtd += `      </tbody>
    </table>
  </div>
</div>`;

    // 5. Top 50 Parc Auto General
    let codeHtmlTableParc = `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<div class="ev-table-wrapper">
  <style>
    .ev-table-wrapper {
      font-family: 'Montserrat', sans-serif;
      max-width: 850px;
      margin: 25px auto;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      overflow: hidden;
      border: 1px solid #eaeaea;
    }
    .ev-table-header {
      padding: 20px 25px;
      background: #FAFAFA;
      border-bottom: 3px solid #004b87;
    }
    .ev-table-title {
      color: #004b87;
      font-weight: 800;
      font-size: 22px;
      margin-bottom: 5px;
      text-transform: uppercase;
      margin-top: 0;
    }
    .ev-table-subtitle {
      color: #666;
      font-size: 13px;
      font-weight: 600;
      margin: 0;
    }
    .ev-table-container {
      width: 100%;
      overflow-x: auto;
    }
    .ev-data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 14px;
    }
    .ev-data-table th {
      background-color: #f4f7fa;
      color: #004b87;
      font-weight: 800;
      padding: 14px 20px;
      border-bottom: 2px solid #dde4eb;
      white-space: nowrap;
      text-transform: uppercase;
      font-size: 12px;
    }
    .ev-data-table td {
      padding: 12px 20px;
      border-bottom: 1px solid #f0f0f0;
      color: #333;
    }
    .ev-data-table tr:nth-child(even) {
      background-color: #fcfcfc;
    }
    .ev-data-table tr:hover {
      background-color: #f0f6fc;
    }
    .col-rank { width: 50px; font-weight: 700; color: #888; text-align: center; }
    .col-model { font-weight: 600; }
    .col-val { font-weight: 700; color: #004b87; }
    .col-pct { color: #555; font-weight: 600; }
    @media (max-width: 500px) {
      .ev-data-table td, .ev-data-table th { padding: 10px 12px; font-size: 12px; }
      .col-rank { padding-left: 10px; padding-right: 10px; }
    }
  </style>
  <div class="ev-table-header">
    <h3 class="ev-table-title">TOP 50 - PARC AUTO GENERAL</h3>
    <p class="ev-table-subtitle">Clasament cumulat istoric România (Până în ${monthRo} 2026)</p>
  </div>
  <div class="ev-table-container">
    <table class="ev-data-table">
      <thead>
        <tr>
          <th class="col-rank">#</th>
          <th class="col-model">Model</th>
          <th class="col-val">Total Unități</th>
          <th class="col-pct">% Parc Auto</th>
        </tr>
      </thead>
      <tbody>\n`;
      
    top50Parc.forEach((item, idx) => {
        const sharePct = totals.parc > 0 ? (item.parc / totals.parc * 100).toFixed(2) : '0.00';
        const formattedVal = item.parc.toLocaleString('ro-RO');
        codeHtmlTableParc += `        <tr><td class="col-rank">${idx+1}</td><td class="col-model">${formatModelName(item.brand, item.model)}</td><td class="col-val">${formattedVal}</td><td class="col-pct">${sharePct}%</td></tr>\n`;
    });
    codeHtmlTableParc += `      </tbody>
    </table>
  </div>
</div>`;

    document.getElementById('textarea-chart-monthly').value = codeHtmlMonthly;
    document.getElementById('textarea-chart-top20').value = codeHtmlTop20;
    document.getElementById('textarea-chart-annual').value = codeHtmlAnnual;
    document.getElementById('textarea-table-ytd').value = codeHtmlTableYtd;
    document.getElementById('textarea-table-parc').value = codeHtmlTableParc;
    
    drawBlogCoverCanvas();
}

function getCarSilhouetteSVG(brand, model) {
    const b = (brand || "").toUpperCase();
    const m = (model || "").toUpperCase();
    
    let carClass = "Sedan";
    
    if (m.includes("TRANSIT") || m.includes("KANGOO") || m.includes("EVITO") || m.includes("ESPRINTER") || m.includes("PROACE") || m.includes("BERLINGO") || m.includes("DOBLO") || m.includes("SCUDO") || m.includes("VIVARO") || m.includes("CRAFTER") || m.includes("TRANSPORTER") || m.includes("JUMPY") || m.includes("DELIVER")) {
        carClass = "Van";
    }
    else if (m.includes("KONA") || m.includes("SEALION") || m.includes("PUMA") || m.includes("EXPLORER") || m.includes("ID.4") || m.includes("ID 4") || m.includes("ID.5") || m.includes("ID 5") || m.includes("E-TRON") || m.includes("ETRON") || m.includes("EX30") || m.includes("EX40") || m.includes("XC40") || m.includes("EC40") || m.includes("C40") || m.includes("ENYAQ") || m.includes("ELROQ") || m.includes("EQA") || m.includes("EQB") || m.includes("EQC") || m.includes("EQE") || m.includes("EQS") || m.includes("IX") || m.includes("IX1") || m.includes("IX2") || m.includes("IX3") || m.includes("INSTER") || m.includes("ZS") || m.includes("MACAN") || m.includes("AVENGER") || m.includes("TORRES") || m.includes("Y") || m.includes("BZ4X") || m.includes("MOKKA") || m.includes("SOUL") || m.includes("LYRIQ") || m.includes("GRANDLAND") || m.includes("FRONTERA") || m.includes("EX90") || m.includes("7X") || m.includes("JAECOO5")) {
        if ((m.includes("EQE") || m.includes("EQS")) && !m.includes("SUV")) {
            carClass = "Sedan";
        } else {
            carClass = "SUV";
        }
    }
    else if (m.includes("SPRING") || m.includes("ZOE") || m.includes("ID.3") || m.includes("ID 3") || m.includes("5 E-TECH") || m.includes("5 E TECH") || m.includes("4 E-TECH") || m.includes("4 E TECH") || m.includes("208") || m.includes("500") || m.includes("FORTWO") || m.includes("FORFOUR") || m.includes("COOPER") || m.includes("T03") || m.includes("DOLPHIN") || m.includes("ATTO") || m.includes("ACEMAN") || m.includes("TWINGO") || m.includes("C-ZERO") || m.includes("MIEV") || m.includes("UP")) {
        carClass = "Hatchback";
    }
    
    if (carClass === "Van") {
        return `<svg class="car-silhouette Van" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="2" ry="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>`;
    } else {
        return `<svg class="car-silhouette Sedan" viewBox="0 0 24 24"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" /></svg>`;
    }
}

function setupBlogReportTabs() {
    const tabSummary = document.getElementById('tab-summary');
    const tabTakeaways = document.getElementById('tab-takeaways');
    const tabHtml = document.getElementById('tab-html');
    const tabCover = document.getElementById('tab-cover');
    
    const summaryContent = document.getElementById('summary-content');
    const takeawaysContent = document.getElementById('takeaways-content');
    const htmlContentArea = document.getElementById('html-content-area');
    const coverContentArea = document.getElementById('cover-content-area');
    const downloadCoverBtn = document.getElementById('download-cover-btn');
    
    const updateTabVisibility = (activeTab) => {
        [tabSummary, tabTakeaways, tabHtml, tabCover].forEach(tab => {
            if (tab) tab.classList.remove('active');
        });
        [summaryContent, takeawaysContent, htmlContentArea, coverContentArea].forEach(content => {
            if (content) content.style.display = 'none';
        });
        
        if (activeTab === 'summary') {
            tabSummary.classList.add('active');
            summaryContent.style.display = 'block';
        } else if (activeTab === 'takeaways') {
            tabTakeaways.classList.add('active');
            takeawaysContent.style.display = 'block';
            initAiTakeawaysTab();
        } else if (activeTab === 'html') {
            tabHtml.classList.add('active');
            htmlContentArea.style.display = 'block';
        } else if (activeTab === 'cover') {
            tabCover.classList.add('active');
            coverContentArea.style.display = 'block';
            drawBlogCoverCanvas();
        }
    };
    
    if (tabSummary) tabSummary.addEventListener('click', () => updateTabVisibility('summary'));
    if (tabTakeaways) tabTakeaways.addEventListener('click', () => updateTabVisibility('takeaways'));
    if (tabHtml) tabHtml.addEventListener('click', () => updateTabVisibility('html'));
    if (tabCover) tabCover.addEventListener('click', () => updateTabVisibility('cover'));
}

function initAiTakeawaysTab() {
    const apiKeyInput = document.getElementById('ai-api-key-input');
    const saveBtn = document.getElementById('save-api-key-btn');
    const genArea = document.getElementById('ai-generation-area');
    const genBtn = document.getElementById('generate-takeaways-btn');
    const resultsArea = document.getElementById('ai-results-area');
    const outputBox = document.getElementById('takeaways-output-box');
    const copyTakeawaysBtn = document.getElementById('copy-takeaways-btn');
    
    const savedKey = localStorage.getItem('gemini_api_key') || '';
    if (savedKey) {
        apiKeyInput.value = savedKey;
        genArea.style.display = 'block';
    } else {
        genArea.style.display = 'none';
    }
    
    // Save button click
    saveBtn.onclick = () => {
        const val = apiKeyInput.value.trim();
        if (val) {
            localStorage.setItem('gemini_api_key', val);
            alert('Cheia API a fost salvată local în browser!');
            genArea.style.display = 'block';
        } else {
            localStorage.removeItem('gemini_api_key');
            alert('Cheia API a fost ștearsă.');
            genArea.style.display = 'none';
        }
    };
    
    // Copy button click
    copyTakeawaysBtn.onclick = () => {
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = outputBox.innerText;
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextarea);
        
        const origText = copyTakeawaysBtn.innerText;
        copyTakeawaysBtn.innerText = 'Copiat!';
        copyTakeawaysBtn.style.background = '#10b981';
        copyTakeawaysBtn.style.borderColor = '#10b981';
        copyTakeawaysBtn.style.color = '#fff';
        setTimeout(() => {
            copyTakeawaysBtn.innerText = origText;
            copyTakeawaysBtn.style.background = '';
            copyTakeawaysBtn.style.borderColor = '';
            copyTakeawaysBtn.style.color = '';
        }, 2000);
    };
    
    // Generate button click
    genBtn.onclick = async () => {
        const key = localStorage.getItem('gemini_api_key');
        if (!key) {
            alert('Te rog adaugă o cheie API Gemini validă mai întâi.');
            return;
        }
        
        genBtn.disabled = true;
        genBtn.innerText = '⌛ Se generează concluziile cu AI...';
        resultsArea.style.display = 'block';
        outputBox.innerText = 'Analizăm datele de înmatriculări ale lunii și trimitem solicitarea către modelul Gemini...';
        
        try {
            // Pregătim datele pentru prompt
            const totalEV = state.data.totalAutoReg + state.data.totalUtilReg;
            const totalNew = totalEV - state.data.totalUsedEv;
            const totalUsed = state.data.totalUsedEv;
            const yoyGrowth = state.data.yoyGrowth.toFixed(2);
            const evShare = (state.data.evShare * 100).toFixed(2);
            const totalFirme = state.data.totalFirme;
            const totalPf = state.data.totalPf;
            const totalRadieri = state.data.totalRadieri;
            
            // Calculăm datele pentru prompt
            const results = computeYtdAndParcData(state.data.lunaNume, state.data.inmatriculariModele);
            const specificData = results.models.filter(d => d.brand !== "Alte Modele");
            
            const formatModel = (brand, model) => {
                const b = (brand || "").trim();
                const m = (model || "").trim();
                return m.toUpperCase().startsWith(b.toUpperCase()) ? m : `${b} ${m}`;
            };
            
            const top5Monthly = [...specificData].sort((a, b) => (b.current_monthly || 0) - (a.current_monthly || 0)).slice(0, 5)
                .map((m, idx) => `${idx+1}. ${formatModel(m.brand, m.model)}: ${m.current_monthly} unități`).join('\n');
                
            const top5Ytd = [...specificData].sort((a, b) => b.ytd - a.ytd).slice(0, 5)
                .map((m, idx) => `${idx+1}. ${formatModel(m.brand, m.model)}: ${m.ytd} unități`).join('\n');
                
            const top5Parc = [...specificData].sort((a, b) => b.parc - a.parc).slice(0, 5)
                .map((m, idx) => `${idx+1}. ${formatModel(m.brand, m.model)}: ${m.parc} unități`).join('\n');
                
            const monthTranslations = {
                'JAN': 'Ianuarie', 'FEB': 'Februarie', 'MAR': 'Martie', 'APR': 'Aprilie',
                'MAY': 'Mai', 'JUN': 'Iunie', 'JUL': 'Iulie', 'AUG': 'August',
                'SEP': 'Septembrie', 'OCT': 'Octombrie', 'NOV': 'Noiembrie', 'DEC': 'Decembrie'
            };
            const monthRo = monthTranslations[state.data.lunaNume.toUpperCase()] || state.data.lunaNume;
            
            const prompt = `Ești un analist auto specializat în mașini electrice în România. Iată datele înmatriculărilor de vehicule electrice în România pentru luna ${monthRo} 2026:
- Total înmatriculări EV (M1+N1): ${totalEV} (Noi: ${totalNew}, Second-hand/Rulate: ${totalUsed})
- Evoluție YoY (față de aceeași lună din 2025): ${yoyGrowth >= 0 ? '+' : ''}${yoyGrowth}%
- Cota de piață a vehiculelor electrice noi din total înmatriculări noi: ${evShare}%
- Înmatriculări pe Firme/Companii: ${totalFirme} unități, Persoane Fizice: ${totalPf} unități
- Număr vehicule radiate din circulație: ${totalRadieri}
- Top 5 modele înmatriculate în această lună:
${top5Monthly}
- Top 5 YTD (ianuarie - ${monthRo} 2026):
${top5Ytd}
- Top 5 Parc Auto General:
${top5Parc}

Generează două secțiuni separate EXACT prin linia delimitatoare "--- SEO ---":

Secțiunea 1: 3-4 concluzii cheie (key takeaways) EXTREM DE SUCCINTE și direct la obiect în limba română pentru blogul ElectroMobilitate.
Reguli de stil obligatorii pentru Secțiunea 1:
1. Fără introduceri, fraze de umplutură, metafore sau speculații. Direct la subiect.
2. Fiecare punct trebuie să aibă maximum 1-2 propoziții scurte, axate pe cifre concrete din datele furnizate.
3. Respectă cu strictețe următorul format:
[Emoji] **Titlu scurt (2-4 cuvinte)**: [Descriere scurtă cu date concrete].

Exemple de concluzii acceptate ca stil:
📈 **Creștere anuală puternică**: Înmatriculările lunare de EV au crescut cu ${yoyGrowth >= 0 ? '+' : ''}${yoyGrowth}%, atingând un volum total de ${totalEV} unități.
🚗 **Model 3 pe primul loc**: Tesla Model 3 conduce topul lunar cu ${top5Monthly.split('\n')[0] ? top5Monthly.split('\n')[0].split(': ')[1] : 'X unități'}, fiind urmat de Model Y.
💼 **Segmentul corporate domină**: Companiile dețin majoritatea achizițiilor din această lună cu ${totalFirme} înmatriculări, față de doar ${totalPf} unități în dreptul persoanelor fizice.

Secțiunea 2: Optimizare SEO Blog (Yoast SEO).
Furnizează următoarele două elemente:
1. Focus Keyphrase (Cuvânt cheie focusat în limba română, de exemplu: "inmatriculari masini electrice ${monthRo.toLowerCase()} 2026" sau similar, relevant pentru articolul de blog).
2. Meta Description (O descriere meta captivantă, axată pe impact și care să îndemne la click, în limba română, având STRICT între 120 și 155 de caractere).

Formatul dorit pentru Secțiunea 2:
Focus Keyphrase: [Cuvânt cheie ales]
Meta Description: [Descrierea optimizată pentru SEO]`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });
            
            const resData = await response.json();
            if (resData.candidates && resData.candidates[0] && resData.candidates[0].content && resData.candidates[0].content.parts[0]) {
                const text = resData.candidates[0].content.parts[0].text;
                
                // Divizăm răspunsul în Concluzii și SEO
                const parts = text.split('--- SEO ---');
                const takeawaysText = parts[0].trim();
                const seoText = parts[1] ? parts[1].trim() : '';
                
                outputBox.innerText = takeawaysText;
                
                const seoOutputBox = document.getElementById('seo-output-box');
                if (seoOutputBox) {
                    seoOutputBox.innerText = seoText || 'Nu s-a generat secțiunea SEO. Încearcă din nou.';
                }
            } else if (resData.error) {
                console.error("Gemini API Error:", resData.error);
                outputBox.innerText = `Eroare API Gemini (${resData.error.status || 'Cod ' + resData.error.code}): ${resData.error.message}\n\nVerifică dacă cheia ta API este activă, are acces la modelul gemini-2.5-flash și nu are restricții de IP sau domeniu.`;
            } else {
                console.error(resData);
                outputBox.innerText = "Eroare: Nu s-a putut obține răspunsul corect de la Gemini. Verifică cheia API și conexiunea.";
            }
        } catch (error) {
            console.error(error);
            outputBox.innerText = "Eroare la comunicarea cu Gemini: " + error.message;
        } finally {
            genBtn.disabled = false;
            genBtn.innerText = '✨ Generează Concluzii cu AI (Gemini)';
        }
    };
    
    // Copy SEO button click
    const copySeoBtn = document.getElementById('copy-seo-btn');
    if (copySeoBtn) {
        copySeoBtn.onclick = () => {
            const seoOutputBox = document.getElementById('seo-output-box');
            if (!seoOutputBox || !seoOutputBox.innerText) return;
            
            const tempTextarea = document.createElement('textarea');
            tempTextarea.value = seoOutputBox.innerText;
            document.body.appendChild(tempTextarea);
            tempTextarea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextarea);
            
            const origText = copySeoBtn.innerText;
            copySeoBtn.innerText = 'Copiat!';
            copySeoBtn.style.background = '#10b981';
            copySeoBtn.style.borderColor = '#10b981';
            copySeoBtn.style.color = '#fff';
            setTimeout(() => {
                copySeoBtn.innerText = origText;
                copySeoBtn.style.background = '';
                copySeoBtn.style.borderColor = '';
                copySeoBtn.style.color = '';
            }, 2000);
        };
    }
}

function setupCopyAndDownloadBtns() {
    // Configure separate copy buttons
    document.querySelectorAll('.copy-section-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.target.getAttribute('data-target');
            const textarea = document.getElementById(targetId);
            if (textarea) {
                textarea.select();
                document.execCommand('copy');
                
                // Visual feedback on the button
                const originalText = e.target.innerText;
                e.target.innerText = 'Copiat!';
                e.target.style.background = '#10b981';
                e.target.style.borderColor = '#10b981';
                e.target.style.color = '#fff';
                setTimeout(() => {
                    e.target.innerText = originalText;
                    e.target.style.background = '';
                    e.target.style.borderColor = '';
                    e.target.style.color = '';
                }, 2000);
            }
        });
    });

    const downloadCoverBtn = document.getElementById('download-cover-btn');
    if (downloadCoverBtn) {
        downloadCoverBtn.addEventListener('click', () => {
            const canvas = document.getElementById('blog-cover-canvas');
            if (!canvas) return;
            
            const monthTranslations = {
                'JAN': 'Ianuarie', 'FEB': 'Februarie', 'MAR': 'Martie',
                'APR': 'Aprilie', 'MAY': 'Mai', 'JUN': 'Iunie',
                'JUL': 'Iulie', 'AUG': 'August', 'SEP': 'Septembrie',
                'OCT': 'Octombrie', 'NOV': 'Noiembrie', 'DEC': 'Decembrie'
            };
            const lunaRo = monthTranslations[state.data.lunaNume] || state.data.lunaNume;
            const currentYear = state.data.luna ? state.data.luna.substring(0, 4) : '2026';
            
            const link = document.createElement('a');
            link.download = `EV_Radar_Romania_Coperta_${lunaRo}_${currentYear}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }
}

function drawBlogCoverCanvas() {
    const canvas = document.getElementById('blog-cover-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 1200, 630);
    
    // Draw subtle bottom pattern/gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 630);
    grad.addColorStop(0, 'rgba(2, 132, 199, 0.02)');
    grad.addColorStop(1, 'rgba(0, 75, 135, 0.05)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 630);
    
    // Romanian month translations
    const monthTranslations = {
        'JAN': 'Ianuarie', 'FEB': 'Februarie', 'MAR': 'Martie',
        'APR': 'Aprilie', 'MAY': 'Mai', 'JUN': 'Iunie',
        'JUL': 'Iulie', 'AUG': 'August', 'SEP': 'Septembrie',
        'OCT': 'Octombrie', 'NOV': 'Noiembrie', 'DEC': 'Decembrie'
    };
    const lunaRo = monthTranslations[state.data.lunaNume] || state.data.lunaNume;
    const currentYear = state.data.luna ? state.data.luna.substring(0, 4) : '2026';
    
    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#004b87'; // primary-color
    ctx.font = 'bold 54px Montserrat, sans-serif';
    ctx.fillText(`EV Radar România - ${lunaRo} ${currentYear}`, 600, 85);
    
    // Fetch values first
    const totalEV = state.data.totalAutoReg + state.data.totalUtilReg;
    const base2025 = 63986;
    const history2026 = {
        'JAN': 1325, 'FEB': 1278, 'MAR': 1020, 'APR': 1257, 'MAY': 1402,
        'JUN': 0, 'JUL': 0, 'AUG': 0, 'SEP': 0, 'OCT': 0, 'NOV': 0, 'DEC': 0
    };
    
    // We can sum YTD total fleet
    const monthsOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    let totalFleet = base2025;
    for (const m of monthsOrder) {
        if (m === state.data.lunaNume) {
            totalFleet += (totalEV - state.data.totalRadieri);
            break;
        }
        totalFleet += history2026[m];
    }

    // DRAW THE RADAR SCREEN BACKGROUND SCENE
    const centerX = 600;
    const centerY = 310;
    
    // 1. Concentric circles with soft glow
    ctx.strokeStyle = 'rgba(2, 132, 199, 0.15)'; // light primary blue/cyan
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 240, 0, 2 * Math.PI);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 160, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Inner circle (dashed)
    ctx.strokeStyle = 'rgba(2, 132, 199, 0.25)';
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, 90, 0, 2 * Math.PI);
    ctx.stroke();
    
    // 2. Axis/Crosshair lines
    ctx.setLineDash([6, 8]);
    ctx.beginPath();
    ctx.moveTo(centerX - 280, centerY);
    ctx.lineTo(centerX + 280, centerY);
    ctx.moveTo(centerX, centerY - 220);
    ctx.lineTo(centerX, centerY + 220);
    ctx.stroke();
    ctx.setLineDash([]); // reset dash
    
    // 3. Radar sweeping glow
    ctx.save();
    ctx.translate(centerX, centerY);
    const radarGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, 240);
    radarGrad.addColorStop(0, 'rgba(2, 132, 199, 0.12)');
    radarGrad.addColorStop(0.5, 'rgba(2, 132, 199, 0.04)');
    radarGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
    ctx.fillStyle = radarGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 240, -Math.PI / 4, 0); // sweep wedge angle
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    
    // 4. Stylized Lightning Bolt Icon at the top-center of the radar
    ctx.save();
    ctx.translate(centerX, centerY - 165);
    ctx.beginPath();
    ctx.moveTo(0, -28); // top tip
    ctx.lineTo(13, 0);  // middle right
    ctx.lineTo(2, 0);   // middle inner right
    ctx.lineTo(8, 28);  // bottom tip
    ctx.lineTo(-13, 0); // middle left
    ctx.lineTo(-2, 0);  // middle inner left
    ctx.closePath();
    ctx.fillStyle = '#0284c7';
    ctx.shadowColor = 'rgba(2, 132, 199, 0.3)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();

    // 5. Total fleet number & label centered inside the radar
    ctx.fillStyle = '#004b87';
    ctx.font = '900 102px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(totalFleet.toLocaleString('ro-RO'), centerX, centerY + 25);
    
    ctx.fillStyle = '#1e293b';
    ctx.font = '700 24px Montserrat, sans-serif';
    ctx.fillText('MAȘINI ELECTRICE ÎN TOTAL', centerX, centerY + 75);
    
    // Card 1: Left Card (New Registrations)
    drawRoundedRect(ctx, 100, 460, 480, 130, 16, '#ffffff', '#e2e8f0');
    ctx.fillStyle = '#004b87';
    ctx.font = '900 64px Montserrat, sans-serif';
    ctx.fillText(totalEV.toLocaleString('ro-RO'), 340, 525);
    ctx.fillStyle = '#64748b';
    ctx.font = '700 14px Montserrat, sans-serif';
    ctx.fillText(`ÎNMATRICULĂRI NOI ÎN ${lunaRo.toUpperCase()}`, 340, 565);
    
    // Card 2: Right Card (YoY Growth)
    drawRoundedRect(ctx, 620, 460, 480, 130, 16, '#ffffff', '#e2e8f0');
    const yoyVal = state.data.yoyGrowth;
    const yoySign = yoyVal >= 0 ? '+' : '';
    const yoyArrow = yoyVal >= 0 ? '↑' : '↓';
    const yoyColor = yoyVal >= 0 ? '#10b981' : '#ef4444';
    
    ctx.fillStyle = yoyColor;
    ctx.font = '900 64px Montserrat, sans-serif';
    ctx.fillText(`${yoySign}${yoyVal.toFixed(1)}% ${yoyArrow}`, 860, 525);
    
    const prevYearVal = Math.round(totalEV / (1 + (yoyVal / 100)));
    ctx.fillStyle = '#64748b';
    ctx.font = '700 14px Montserrat, sans-serif';
    ctx.fillText(`EVOLUȚIE YoY (vs. ${prevYearVal.toLocaleString('ro-RO')} în ${lunaRo} 2025)`, 860, 565);
}

function drawRoundedRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) {
        ctx.fillStyle = fill;
        ctx.shadowColor = 'rgba(15, 23, 42, 0.04)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 4;
        ctx.fill();
        ctx.shadowColor = 'transparent'; // reset
    }
    if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }
}

function setupSendBtn() {
    const btn = document.getElementById('send-to-sheets-btn');
    btn.addEventListener('click', async () => {
        if (!state.sheetsUrl) {
            alert("Te rugăm să introduci URL-ul Google Sheets în secțiunea de Configurare de sus.");
            document.getElementById('sheets-url').scrollIntoView({ behavior: 'smooth' });
            document.getElementById('sheets-url').focus();
            return;
        }
        
        showLoader("Se trimit datele în Google Sheets...");
        
        const payload = {
            luna: state.data.luna,
            lunaNume: state.data.lunaNume,
            total_inmatriculari: state.data.totalAutoReg + state.data.totalUtilReg,
            total_radieri: state.data.totalRadieri,
            modele: state.data.inmatriculariModele
        };
        
        try {
            await fetch(state.sheetsUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify(payload)
            });
            
            hideLoader();
            alert("Datele au fost trimise spre Google Sheets! Te rugăm să verifici documentul centralizator.");
        } catch (error) {
            hideLoader();
            console.error("Eroare la trimiterea datelor (s-ar putea să fi fost trimise totuși):", error);
            alert("Trimiterea a fost inițiată. Verifică documentul Google Sheets pentru a confirma actualizarea.");
        }
    });
}

function setupAutoDgpciBtn() {
    const btn = document.getElementById('auto-dgpci-btn');
    btn.addEventListener('click', async () => {
        const select = document.getElementById('auto-month-select');
        const [luna, lunaNume, monthName, code] = select.value.split('|');
        
        // Verificam daca datele sunt deja in cache
        const cached = localStorage.getItem('ev_radar_ro_data_' + luna);
        if (cached) {
            const useCache = confirm(`Datele pentru ${monthName} sunt deja procesate și salvate local. Vrei să le încarci instant din cache?\n\n[OK = Încarcă instant, Cancel = Re-descarcă și re-procesează de pe site]`);
            if (useCache) {
                state.data = JSON.parse(cached);
                renderDashboard();
                return;
            }
        }
        
        showLoader(`Se descarcă și se procesează datele DGPCI pentru ${monthName}...`);
        
        // Pornim interogarea progresului in paralel
        let progressInterval = setInterval(async () => {
            try {
                const res = await fetch('http://localhost:8000/api/progress');
                if (res.ok) {
                    const progressData = await res.json();
                    if (progressData && progressData.step) {
                        const pct = progressData.percent !== undefined ? progressData.percent : 0;
                        document.getElementById('loader-text').innerText = `${progressData.step} (${pct}%)`;
                        const progressBar = document.getElementById('loader-progress-bar');
                        if (progressBar) {
                            progressBar.style.width = `${pct}%`;
                        }
                    }
                }
            } catch (err) {
                console.warn("Eroare la obținerea progresului:", err);
            }
        }, 1000);
        
        try {
            const response = await fetch(`http://localhost:8000/api/download-and-process?month=${encodeURIComponent(monthName)}&code=${code}&lunaNume=${lunaNume}&luna=${luna}`);
            
            // Oprim intervalul imediat ce avem raspunsul final de la server
            clearInterval(progressInterval);
            
            if (!response.ok) {
                throw new Error("Eroare la procesarea pe serverul local.");
            }
            
            const result = await response.json();
            if (result.status === "success") {
                state.data.luna = luna;
                state.data.lunaNume = lunaNume;
                state.data.totalAutoReg = result.data.totalAutoReg;
                state.data.totalUtilReg = result.data.totalUtilReg;
                state.data.totalRadieri = result.data.totalRadieri;
                state.data.totalUsedEv = result.data.totalUsedEv || Math.round((result.data.totalAutoReg + result.data.totalUtilReg) * result.data.usedShare);
                state.data.totalFirme = result.data.totalFirme;
                state.data.totalPf = result.data.totalPf;
                state.data.evShare = result.data.evShare;
                state.data.usedShare = result.data.usedShare;
                state.data.yoyGrowth = result.data.yoyGrowth;
                state.data.inmatriculariModele = result.data.inmatriculariModele;
                state.data.radieriModele = result.data.radieriModele;
                
                hideLoader();
                renderDashboard();
                
                // Derulam pana la dashboard
                document.getElementById('results-dashboard').scrollIntoView({ behavior: 'smooth' });
                
                alert(`Datele pentru ${monthName} au fost descărcate și procesate cu succes!`);
            } else {
                throw new Error(result.message || "Procesarea a eșuat pe server.");
            }
        } catch (error) {
            clearInterval(progressInterval);
            hideLoader();
            console.error("Eroare la procesarea automată:", error);
            alert("Eroare la procesarea automată: " + error.message + "\n\nAsigură-te că serverul local rulează (python3 server.py).");
        }
    });
}

function setupLocalProcessBtn() {
    const btn = document.getElementById('local-process-btn');
    if (!btn) return;
    btn.addEventListener('click', async () => {
        const select = document.getElementById('local-month-select');
        const [luna, lunaNume, monthName, code] = select.value.split('|');
        
        // Verificam daca datele sunt deja in cache
        const cached = localStorage.getItem('ev_radar_ro_data_' + luna);
        if (cached) {
            const useCache = confirm(`Datele locale pentru ${monthName} sunt deja procesate și salvate local. Vrei să le încarci instant din cache?\n\n[OK = Încarcă instant, Cancel = Re-procesează fișierele locale]`);
            if (useCache) {
                state.data = JSON.parse(cached);
                renderDashboard();
                return;
            }
        }
        
        showLoader(`Se analizează datele locale pentru ${monthName}...`);
        
        let progressInterval = setInterval(async () => {
            try {
                const res = await fetch('http://localhost:8000/api/progress');
                if (res.ok) {
                    const progressData = await res.json();
                    if (progressData && progressData.step) {
                        const pct = progressData.percent !== undefined ? progressData.percent : 0;
                        document.getElementById('loader-text').innerText = `${progressData.step} (${pct}%)`;
                        const progressBar = document.getElementById('loader-progress-bar');
                        if (progressBar) {
                            progressBar.style.width = `${pct}%`;
                        }
                    }
                }
            } catch (err) {
                console.warn("Eroare la obținerea progresului:", err);
            }
        }, 1000);
        
        try {
            const response = await fetch(`http://localhost:8000/api/process-local?code=${code}&lunaNume=${lunaNume}&luna=${luna}`);
            
            clearInterval(progressInterval);
            
            if (!response.ok) {
                const errResult = await response.json().catch(() => ({}));
                throw new Error(errResult.message || "Eroare la procesarea locală (asigură-te că fișierele există în folder).");
            }
            
            const result = await response.json();
            if (result.status === "success") {
                state.data.luna = luna;
                state.data.lunaNume = lunaNume;
                state.data.totalAutoReg = result.data.totalAutoReg;
                state.data.totalUtilReg = result.data.totalUtilReg;
                state.data.totalRadieri = result.data.totalRadieri;
                state.data.totalUsedEv = result.data.totalUsedEv || Math.round((result.data.totalAutoReg + result.data.totalUtilReg) * result.data.usedShare);
                state.data.totalFirme = result.data.totalFirme;
                state.data.totalPf = result.data.totalPf;
                state.data.evShare = result.data.evShare;
                state.data.usedShare = result.data.usedShare;
                state.data.yoyGrowth = result.data.yoyGrowth;
                state.data.inmatriculariModele = result.data.inmatriculariModele;
                state.data.radieriModele = result.data.radieriModele;
                
                hideLoader();
                renderDashboard();
                
                document.getElementById('results-dashboard').scrollIntoView({ behavior: 'smooth' });
                
                alert(`Datele locale pentru ${monthName} au fost procesate cu succes!`);
            } else {
                throw new Error(result.message || "Procesarea locală a eșuat.");
            }
        } catch (error) {
            clearInterval(progressInterval);
            hideLoader();
            console.error("Eroare la procesarea locală:", error);
            alert("Eroare la procesarea locală: " + error.message);
        }
    });
}

function setupClearBtn() {
    const btn = document.getElementById('clear-sheets-btn');
    btn.addEventListener('click', async () => {
        if (!state.sheetsUrl) {
            alert("Te rugăm să introduci URL-ul Google Sheets în secțiunea de Configurare de sus.");
            document.getElementById('sheets-url').scrollIntoView({ behavior: 'smooth' });
            document.getElementById('sheets-url').focus();
            return;
        }
        
        const select = document.getElementById('manual-month-select');
        const [luna, lunaNume] = select.value.split('|');
        
        if (!confirm(`Ești sigur că vrei să ȘTERGI complet toate datele pentru luna ${lunaNume} din Google Sheets?`)) {
            return;
        }
        
        showLoader(`Se curăță datele pentru luna ${lunaNume} în Google Sheets...`);
        
        const payload = {
            luna: luna,
            lunaNume: lunaNume,
            total_inmatriculari: 0,
            total_radieri: 0,
            modele: []
        };
        
        try {
            await fetch(state.sheetsUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify(payload)
            });
            
            hideLoader();
            alert(`Datele pentru luna ${lunaNume} au fost curățate în Google Sheets!`);
        } catch (error) {
            hideLoader();
            console.error("Eroare la ștergerea datelor:", error);
            alert("Solicitarea de curățare a fost trimisă. Verifică documentul Google Sheets pentru a confirma resetarea.");
        }
    });
}

function showLoader(text) {
    document.getElementById('loader-text').innerText = text;
    const progressBar = document.getElementById('loader-progress-bar');
    if (progressBar) {
        progressBar.style.width = '0%';
    }
    document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

function renderHistoricalCharts() {
    // 1. Date lunare 2025 vs 2026 (Inmatriculari brute BEV)
    const regs2025 = {
        'JAN': 1639, 'FEB': 1069, 'MAR': 628, 'APR': 612, 'MAY': 863, 'JUN': 807,
        'JUL': 976, 'AUG': 1335, 'SEP': 1158, 'OCT': 1562, 'NOV': 1552, 'DEC': 1880
    };
    
    const regs2026 = {
        'JAN': 1410, 'FEB': 1370, 'MAR': 1206, 'APR': 1306, 'MAY': 1505,
        'JUN': null, 'JUL': null, 'AUG': null, 'SEP': null, 'OCT': null, 'NOV': null, 'DEC': null
    };
    
    // Suprascriem luna selectata in mod dinamic cu datele actuale incarcate
    const currentLunaNume = state.data.lunaNume;
    const currentRegs = state.data.totalAutoReg + state.data.totalUtilReg;
    if (regs2026.hasOwnProperty(currentLunaNume)) {
        regs2026[currentLunaNume] = currentRegs;
    }
    
    // De asemenea, daca suntem pe o luna ulterioara, sa stergem valorile din lunile viitoare
    const monthsOrder = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const currentIdx = monthsOrder.indexOf(currentLunaNume);
    if (currentIdx !== -1) {
        for (let i = currentIdx + 1; i < monthsOrder.length; i++) {
            regs2026[monthsOrder[i]] = null;
        }
    }
    
    // Generam badge-urile de crestere procentuala (acum sunt incluse in coloane)
    const badgesContainer = document.getElementById('growth-badges-container');
    if (badgesContainer) {
        badgesContainer.innerHTML = '';
    }
    
    // Generam graficul comparativ 2025 vs 2026 (Format Vertical Mockup)
    const compContainer = document.getElementById('monthly-comp-list');
    if (compContainer) {
        compContainer.innerHTML = '';
        
        // Gasim valoarea maxima pentru scalare (adaugam un buffer de 15% pentru a incapea etichetele de deasupra)
        let maxVal = 0;
        monthsOrder.forEach(m => {
            if (regs2025[m] > maxVal) maxVal = regs2025[m];
            if (regs2026[m] !== null && regs2026[m] > maxVal) maxVal = regs2026[m];
        });
        const scaleMax = maxVal * 1.15;
        
        monthsOrder.forEach(m => {
            const val25 = regs2025[m];
            const val26 = regs2026[m];
            
            const h25 = ((val25 / scaleMax) * 100).toFixed(1);
            const h26 = val26 !== null ? ((val26 / scaleMax) * 100).toFixed(1) : 0;
            let badgeHTML = '';
            if (val26 !== null && val26 > 0) {
                const pct = ((val26 - val25) / val25 * 100).toFixed(1);
                const sign = pct >= 0 ? '+' : '';
                const badgeClass = pct >= 0 ? 'positive' : 'negative';
                badgeHTML = `<span class="growth-badge ${badgeClass}" style="padding: 0.2rem 0.45rem; font-size: 0.78rem; border-radius: 4px; line-height: 1; font-weight: 800;">${sign}${pct}%</span>`;
            }

            const col = document.createElement('div');
            col.className = 'v-col-group';
            col.innerHTML = `
                <div class="v-badge-wrapper" style="height: 22px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
                    ${badgeHTML}
                </div>
                <div class="v-bars" style="height: 190px;">
                    ${val26 !== null ? `
                        <div class="v-bar-2026" style="height: ${h26}%;">
                            <span class="v-bar-val-static active-year">${val26.toLocaleString('ro-RO')}</span>
                        </div>
                    ` : ''}
                    <div class="v-bar-2025" style="height: ${h25}%;">
                        <span class="v-bar-val-static">${val25.toLocaleString('ro-RO')}</span>
                    </div>
                </div>
                <div class="v-col-lbl">${{
                    'JAN': 'IAN', 'FEB': 'FEB', 'MAR': 'MAR', 'APR': 'APR', 'MAY': 'MAI', 'JUN': 'IUN',
                    'JUL': 'IUL', 'AUG': 'AUG', 'SEP': 'SEP', 'OCT': 'OCT', 'NOV': 'NOV', 'DEC': 'DEC'
                }[m] || m}</div>
            `;
            compContainer.appendChild(col);
        });
    }
    
    // 2. Evolutie Anuala 2011 - Prezent (Format Vertical)
    const annualData = [
        { year: 2011, qty: 7 },
        { year: 2012, qty: 5 },
        { year: 2013, qty: 50 },
        { year: 2014, qty: 16 },
        { year: 2015, qty: 32 },
        { year: 2016, qty: 104 },
        { year: 2017, qty: 247 },
        { year: 2018, qty: 710 },
        { year: 2019, qty: 1747 },
        { year: 2020, qty: 3134 },
        { year: 2021, qty: 6831 },
        { year: 2022, qty: 12466 },
        { year: 2023, qty: 16852 },
        { year: 2024, qty: 12677 },
        { year: 2025, qty: 12756 }
    ];
    
    // Calculeaza parcul auto total estimat (similar cu cardul principal)
    const base2025 = 63986;
    const history2026 = {
        'JAN': 1410 - 85,
        'FEB': 1370 - 92,
        'MAR': 1206 - 186,
        'APR': 1306 - 49,
        'MAY': 1505 - 103,
        'JUN': 0, 'JUL': 0, 'AUG': 0, 'SEP': 0, 'OCT': 0, 'NOV': 0, 'DEC': 0
    };
    
    // Calculam netGrowth din datele curente ale lunii selectate
    const netGrowth = (state.data.totalAutoReg + state.data.totalUtilReg) - state.data.totalRadieri;
    history2026[currentLunaNume] = netGrowth;
    
    let totalFleet = base2025;
    for (const m of monthsOrder) {
        totalFleet += history2026[m];
        if (m === currentLunaNume) break;
    }
    
    // Adaugam 2026 in mod dinamic cu valoarea inmatricularilor nete din 2026 pana in prezent
    annualData.push({ year: 2026, qty: totalFleet - base2025, active: true });
    
    // Actualizam caseta de sumare din card
    const summaryVal = document.getElementById('val-fleet-summary');
    if (summaryVal) {
        summaryVal.innerText = totalFleet.toLocaleString('ro-RO');
    }
    const summaryTitle = document.getElementById('annual-summary-title');
    if (summaryTitle) {
        summaryTitle.innerText = `TOTAL PARC AUTO (${currentLunaNume} '26)`;
    }
    const captionEl = document.getElementById('annual-chart-caption');
    if (captionEl) {
        captionEl.innerHTML = `* Date aferente anului 2026 sunt în curs de actualizare (${monthsOrder[0].toLowerCase()} – ${currentLunaNume.toLowerCase()}).`;
    }
    
    const annualContainer = document.getElementById('annual-evolution-list');
    if (annualContainer) {
        annualContainer.innerHTML = '';
        
        const maxQty = Math.max(...annualData.map(d => d.qty));
        const scaleMaxQty = maxQty * 1.15; // buffer de 15% pentru etichete
        
        // Afisam in ordine cronologica normala (stanga la dreapta)
        annualData.forEach(d => {
            const heightPct = ((d.qty / scaleMaxQty) * 100).toFixed(1);
            const is2026Class = d.active ? 'highlight' : '';
            
            const col = document.createElement('div');
            col.className = 'v-col-group';
            col.innerHTML = `
                <div class="v-bars">
                    <div class="v-bar-annual ${is2026Class}" style="height: ${heightPct}%;">
                        <span class="v-bar-val-static ${d.active ? 'active-year' : ''}">${d.qty.toLocaleString('ro-RO')}</span>
                    </div>
                </div>
                <div class="v-col-lbl" style="font-size: 0.72rem; font-weight: 700;">
                    ${d.year}${d.active ? '*' : ''}
                </div>
            `;
            annualContainer.appendChild(col);
        });
    }
}
