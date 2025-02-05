import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;
const NUMBERS_API_BASE_URL = process.env.NUMBERS_API_BASE_URL || "http://numbersapi.com";
const WIKI_PARITY_URL = process.env.WIKI_PARITY_URL || "https://en.wikipedia.org/wiki/Parity_(mathematics)";

app.use(cors());
const checkArmstrong = (num) => {
    const digits = num.toString().split("").map(Number);
    const power = digits.length;
    const sum = digits.reduce((acc, digit) => acc + Math.pow(digit, power), 0);
    return sum === num;
};

// Check if a number is prime
const checkPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) return false;
    }
    return true;
};

// Check if a number is a perfect number
const checkPerfect = (num) => {
    if (num < 1) return false;
    let sum = 0;
    for (let i = 1; i <= num / 2; i++) {
        if (num % i === 0) sum += i;
    }
    return sum === num;
};

// Sum of digits
const sumDigits = (num) => {
    return num.toString().split("").reduce((sum, digit) => sum + parseInt(digit), 0);
};
app.get("/api/classify-number", async (req, res) => {
    const num = req.query.number;

    if (!num || !/^-?\d+$/.test(num)) {
        return res.status(400).json({
            error: "Invalid input. Please enter a valid integer."
        });
    }

    const number = parseInt(num, 10);
    const isEven = number % 2 === 0;
    const isOdd = !isEven;
    const isArmstrong = checkArmstrong(number);
    const isPrime = checkPrime(number);
    const isPerfect = checkPerfect(number);
    const digitSum = sumDigits(number);

    let properties = [];
    if (isArmstrong && isOdd) properties = ["armstrong", "odd"];
    else if (isArmstrong && isEven) properties = ["armstrong", "even"];
    else if (!isArmstrong && isOdd) properties = ["odd"];
    else if (!isArmstrong && isEven) properties = ["even"];

    let funFact = `No fun fact available for ${number}.`;
    try {
        const response = await axios.get(`${NUMBERS_API_BASE_URL}/${number}/math`);
        funFact = response.data;
    } catch (error) {
        console.error("Error fetching fun fact:", error.message);
    }

    res.json({
        number,
        is_prime: isPrime,
        is_perfect: isPerfect,
        properties,
        digit_sum: digitSum,
        fun_fact: funFact
    });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});