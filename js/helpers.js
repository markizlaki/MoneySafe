export const convertStringNumber = (str) => {
    const noSpaceStr = String(str).replace(/\s+/g, '');
    const num = parseFloat(noSpaceStr);

    if (!isNaN(num) && isFinite(num)) {
        return num;
    } else {
        return false;
    }
};

export const reformatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;
};

export const animationNumbers_OLD = (element, number) => {
    const fps = 60;
    const duration = 1000;
    const frameDuration = duration / fps;
    const totalFrame = Math.round(duration / frameDuration);
    
    let currentFrame = 0;

    const initialNumber = parseInt(
        element.textContent.replace(/[^0-9.-]+/g, ""),
    );

    const increment = Math.trunc((number - initialNumber) / totalFrame);

    const intervalId = setInterval(() => {
        currentFrame += 1;

        const newNumber = initialNumber + increment * currentFrame;

        element.textContent = `${newNumber.toLocaleString("RU-ru")} ₽`;

        if (currentFrame === totalFrame) {
            clearInterval(intervalId);
            element.textContent = `${number.toLocaleString("RU-ru")} ₽`;
        }
    }, frameDuration);
};

export const animationNumbers = (element, number) => {
    const fps = 60;
    const duration = 1000;
    const frameDuration = duration / fps;
    const totalFrame = Math.round(duration / frameDuration);
    
    let currentFrame = 0;

    const initialNumber = parseInt(
        element.textContent.replace(/[^0-9.-]+/g, ""),
    );

    const increment = Math.trunc((number - initialNumber) / totalFrame);

    const animate = () => {
        currentFrame += 1;
        const newNumber = initialNumber + increment * currentFrame;
        element.textContent = `${newNumber.toLocaleString("RU-ru")} ₽`;

        if (currentFrame < totalFrame) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = `${number.toLocaleString("RU-ru")} ₽`;
        }
    };

    requestAnimationFrame(animate);
};