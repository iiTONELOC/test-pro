export const calculatePercentage = (earnedPoints: number, totalPoints: number): number => Math
    .round((earnedPoints / totalPoints) * 100);

export const calculateScore = (earnedPoints: number, totalPoints: number): number => calculatePercentage(earnedPoints, totalPoints);

export const calculateAverage = (numArray: number[]): number => {
    // ensure the array is not empty
    if (numArray.length === 0) {
        return 0;
    }
    return numArray.reduce((a, b) => a + b) / numArray.length
};

export const calculateMedian = (numArray: number[]): number => {
    numArray.sort((a, b) => a - b);
    const half = Math.floor(numArray.length / 2);
    return numArray.length % 2 ? numArray[half] : (numArray[half - 1] + numArray[half]) / 2.0;
};

export const calculateMode = (numArray: number[]): number[] => {
    const freq: { [key: number]: number } = {};
    let maxFreq = 0;
    let modes: number[] = [];

    numArray.forEach((num) => {
        freq[num] = (freq[num] || 0) + 1;
        if (freq[num] > maxFreq) {
            maxFreq = freq[num];
            modes = [num];
        } else if (freq[num] === maxFreq) {
            modes.push(num);
        }
    });

    return modes;
};

export const calculateRange = (numArray: number[]): number => {
    numArray.sort((a, b) => a - b);
    return numArray[numArray.length - 1] - numArray[0];
};

export const calculateVariance = (numArray: number[]): number => {
    const mean = calculateAverage(numArray);
    return calculateAverage(numArray.map((num) => Math.pow(num - mean, 2)));
};

export const calculateStandardDeviation = (numArray: number[]): number => Math.sqrt(calculateVariance(numArray));

export const calculateZScore = (num: number, numArray: number[]): number => (num - calculateAverage(numArray)) / calculateStandardDeviation(numArray);

export const calculateQuartiles = (numArray: number[]): number[] => {
    numArray.sort((a, b) => a - b);
    const half = Math.floor(numArray.length / 2);
    const lowerHalf = numArray.slice(0, half);
    const upperHalf = numArray.length % 2 ? numArray.slice(half + 1) : numArray.slice(half);
    return [calculateMedian(lowerHalf), calculateMedian(numArray), calculateMedian(upperHalf)];
};

export const calculateInterQuartileRange = (numArray: number[]): number => {
    const quartiles = calculateQuartiles(numArray);
    return quartiles[2] - quartiles[0];
};

export const calculateOutlierRange = (numArray: number[]): number[] => {
    const quartiles = calculateQuartiles(numArray);
    const iqr = calculateInterQuartileRange(numArray);
    return [quartiles[0] - (1.5 * iqr), quartiles[2] + (1.5 * iqr)];
};

export const calculateOutliers = (numArray: number[]): number[] => {
    const outlierRange = calculateOutlierRange(numArray);
    return numArray.filter((num) => num < outlierRange[0] || num > outlierRange[1]);
};

export const calculateOutlierFreeData = (numArray: number[]): number[] => {
    const outlierRange = calculateOutlierRange(numArray);
    return numArray.filter((num) => num >= outlierRange[0] && num <= outlierRange[1]);
};

export const calculateOutlierFreeMean = (numArray: number[]): number => calculateAverage(calculateOutlierFreeData(numArray));

export const calculateOutlierFreeMedian = (numArray: number[]): number => calculateMedian(calculateOutlierFreeData(numArray));

export const calculateOutlierFreeMode = (numArray: number[]): number[] => calculateMode(calculateOutlierFreeData(numArray));

export const calculateOutlierFreeRange = (numArray: number[]): number => calculateRange(calculateOutlierFreeData(numArray));

export const calculateOutlierFreeVariance = (numArray: number[]): number => calculateVariance(calculateOutlierFreeData(numArray));

export const calculateOutlierFreeStandardDeviation = (numArray: number[]): number => calculateStandardDeviation(calculateOutlierFreeData(numArray));

export const calculateOutlierFreeZScore = (num: number, numArray: number[]): number => calculateZScore(num, calculateOutlierFreeData(numArray));

export const calculateOutlierFreeQuartiles = (numArray: number[]): number[] => calculateQuartiles(calculateOutlierFreeData(numArray));

export const calculateOutlierFreeInterQuartileRange = (numArray: number[]): number => calculateInterQuartileRange(calculateOutlierFreeData(numArray));
