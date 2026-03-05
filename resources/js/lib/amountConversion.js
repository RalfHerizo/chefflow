const UNIT_ALIAS = {
    unite: 'pcs',
    unité: 'pcs',
    unit: 'pcs',
    piece: 'pcs',
    pieces: 'pcs',
};

function normalizeUnit(unit) {
    const value = String(unit || '').toLowerCase();
    return UNIT_ALIAS[value] || value;
}

function isWeight(unit) {
    const u = normalizeUnit(unit);
    return u === 'kg' || u === 'g';
}

function isVolume(unit) {
    const u = normalizeUnit(unit);
    return u === 'l' || u === 'ml';
}

function isPiece(unit) {
    return normalizeUnit(unit) === 'pcs';
}

export function getUnitOptions(baseUnit) {
    const unit = normalizeUnit(baseUnit);

    if (unit === 'kg') {
        return ['kg', 'g'];
    }

    if (unit === 'l') {
        return ['L', 'ml'];
    }

    if (unit === 'g') {
        return ['g', 'kg'];
    }

    if (unit === 'ml') {
        return ['ml', 'L'];
    }

    return [unit || 'pcs'];
}

export function getPreferredInputUnit(baseUnit) {
    const unit = normalizeUnit(baseUnit);

    if (unit === 'kg') {
        return 'g';
    }

    if (unit === 'l') {
        return 'ml';
    }

    return unit || 'pcs';
}

export function getInputStep(baseUnit, inputUnit) {
    if (isPiece(baseUnit)) {
        return '1';
    }

    const unit = normalizeUnit(inputUnit);
    if (unit === 'g' || unit === 'ml') {
        return '1';
    }

    return '0.001';
}

export function convertAmount(value, unitFrom, unitTo) {
    const from = normalizeUnit(unitFrom);
    const to = normalizeUnit(unitTo);
    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return 0;
    }

    if (from === to) {
        return amount;
    }

    if (isWeight(from) && isWeight(to)) {
        if (from === 'kg' && to === 'g') {
            return amount * 1000;
        }
        if (from === 'g' && to === 'kg') {
            return amount / 1000;
        }
    }

    if (isVolume(from) && isVolume(to)) {
        if (from === 'l' && to === 'ml') {
            return amount * 1000;
        }
        if (from === 'ml' && to === 'l') {
            return amount / 1000;
        }
    }

    return amount;
}

export function formatAmountDisplay(value, unit) {
    const numeric = Number(value || 0);

    if (isPiece(unit)) {
        return String(Math.round(numeric));
    }

    return numeric
        .toFixed(4)
        .replace(/\.?0+$/, '');
}

export function formatIngredientAmountForPreview(value, baseUnit) {
    const unit = normalizeUnit(baseUnit);
    const numeric = Number(value || 0);

    if (!Number.isFinite(numeric)) {
        return { value: '0', unit: unit || 'pcs' };
    }

    if (isPiece(unit)) {
        return { value: String(Math.round(numeric)), unit: 'pcs' };
    }

    if (unit === 'kg') {
        if (numeric < 1) {
            return { value: formatAmountDisplay(convertAmount(numeric, 'kg', 'g'), 'g'), unit: 'g' };
        }
        return { value: formatAmountDisplay(numeric, 'kg'), unit: 'kg' };
    }

    if (unit === 'l') {
        if (numeric < 1) {
            return { value: formatAmountDisplay(convertAmount(numeric, 'l', 'ml'), 'ml'), unit: 'ml' };
        }
        return { value: formatAmountDisplay(numeric, 'l'), unit: 'L' };
    }

    if (unit === 'g') {
        return { value: formatAmountDisplay(numeric, 'g'), unit: 'g' };
    }

    if (unit === 'ml') {
        return { value: formatAmountDisplay(numeric, 'ml'), unit: 'ml' };
    }

    return { value: formatAmountDisplay(numeric, unit), unit: baseUnit || '' };
}
