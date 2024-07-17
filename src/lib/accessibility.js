export const pressRightArrow = () => {
    const event = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        code: 'ArrowRight',
        bubbles: true
    });
    document.dispatchEvent(event);
}

export const pressLeftArrow = () => {
    const event = new KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        code: 'ArrowLeft',
        bubbles: true
    });
    document.dispatchEvent(event);
}

export const pressSpacebar = () => {
    const event = new KeyboardEvent('keydown', {
        key: ' ',
        code: 'Space',
        bubbles: true
    });
    document.dispatchEvent(event);
}