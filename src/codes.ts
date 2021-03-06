/**
 * @quale/core - code point utils
 *
 * Copyright (C) 2021-2022 Doug Owings
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * isFullwidth copied from is-fullwidth-code-point:
 * - https://www.npmjs.com/package/is-fullwidth-code-point
 * - https://github.com/sindresorhus/is-fullwidth-code-point/blob/27f57288/index.js
 * ----------------------
 * isCombining, isControl, and isSurrogate extracted from string-width:
 * - https://www.npmjs.com/package/string-width
 * - https://github.com/sindresorhus/string-width
 * ----------------------
 * MIT License
 * Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
 * -------------------------------------------------------------------------------
 * See file NOTICE.md for details and full license.
 * ------------------------------------------------
 */

/**
 * Whether a codepoint represents a breaking space.
 * 
 * @see https://www.fileformat.info/info/unicode/category/Zs/list.htm
 * @param cp The code point
 */
export function isBreakingSpace(cp: number): boolean {
    // See test/notes/codes.md for more notes.
    return Number.isInteger(cp) && (
        // space
        cp === 0x20 ||
        // ogham space mark
        cp === 0x1680 ||
        // 0x2000: en quad .. 0x200A: hair space
        (0x2000 <= cp && cp <= 0x200A) ||
        // medium mathematical space
        cp === 0x205F ||
        // ideographic space (full-width)
        cp === 0x3000
    )
}

/**
 * Diacritics are always added after the main character.
 * Code extracted from string-width, (C) Sindre Sorhus, MIT License.
 * @param cp The code point
 */
export function isCombining(cp: number): boolean {
    return Number.isInteger(cp) && cp >= 0x300 && cp <= 0x36F
}

/**
 * Control codes are not visually represented.
 * Code extracted from string-width, (C) Sindre Sorhus, MIT License.
 * @param cp The code point
 */
export function isControl(cp: number): boolean {
    return Number.isInteger(cp) && (cp <= 0x1F || (cp >= 0x7F && cp <= 0x9F))
}

/**
 * Whether a codepoint represents a non-breaking space.
 * @see https://www.fileformat.info/info/unicode/category/Zs/list.htm
 * @param cp The code point
 */
export function isNonBreakingSpace(cp: number): boolean {
    return Number.isInteger(cp) && (
        // no-break space
        cp === 0xA0 ||
        // narrow no-break space
        cp === 0x202F
    )
}

/**
 * Whether a codepoint represents a space.
 * @see https://www.fileformat.info/info/unicode/category/Zs/list.htm
 * @param cp The code point
 */
export function isSpace(cp: number): boolean {
    return isNonBreakingSpace(cp) || isBreakingSpace(cp)
}

/**
 * Surrogates come in pairs, e.g. emojis.
 * Code extracted from string-width, (C) Sindre Sorhus, MIT License.
 * @param cp The code point
 */
export function isSurrogate(cp: number): boolean {
    return Number.isInteger(cp) && cp > 0xFFFF
}

/**
 * from is-fullwidth-code-point:
 * - https://www.npmjs.com/package/is-fullwidth-code-point
 * Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
 * MIT License
 * ------------
 * Code points are derived from:
 * https://unicode.org/Public/UNIDATA/EastAsianWidth.txt
 * @param cp The code point
 */
export function isFullwidth(cp: number): boolean {
    return Number.isInteger(cp) && cp >= 0x1100 && (
        cp <= 0x115F || // Hangul Jamo
        cp === 0x2329 || // LEFT-POINTING ANGLE BRACKET
        cp === 0x232A || // RIGHT-POINTING ANGLE BRACKET
        // CJK Radicals Supplement .. Enclosed CJK Letters and Months
        (0x2E80 <= cp && cp <= 0x3247 && cp !== 0x303F) ||
        // Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
        (0x3250 <= cp && cp <= 0x4DBF) ||
        // CJK Unified Ideographs .. Yi Radicals
        (0x4E00 <= cp && cp <= 0xA4C6) ||
        // Hangul Jamo Extended-A
        (0xA960 <= cp && cp <= 0xA97C) ||
        // Hangul Syllables
        (0xAC00 <= cp && cp <= 0xD7A3) ||
        // CJK Compatibility Ideographs
        (0xF900 <= cp && cp <= 0xFAFF) ||
        // Vertical Forms
        (0xFE10 <= cp && cp <= 0xFE19) ||
        // CJK Compatibility Forms .. Small Form Variants
        (0xFE30 <= cp && cp <= 0xFE6B) ||
        // Halfwidth and Fullwidth Forms
        (0xFF01 <= cp && cp <= 0xFF60) ||
        (0xFFE0 <= cp && cp <= 0xFFE6) ||
        // Kana Supplement
        (0x1B000 <= cp && cp <= 0x1B001) ||
        // Enclosed Ideographic Supplement
        (0x1F200 <= cp && cp <= 0x1F251) ||
        // CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
        (0x20000 <= cp && cp <= 0x3FFFD)
    )
}

/**
 * @see https://unicode.org/reports/tr29/
 * @param cp The code point
 */
export function isWordBreaking(cp: number): boolean {
    return isBreakingSpace(cp) || isBreakingDash(cp)
}

/**
 * @see https://www.compart.com/en/unicode/category/Pd
 * @param cp The code point
 */
export function isBreakingDash(cp: number): boolean {
    return Number.isInteger(cp) && (
        // hyphen-minus
        cp === 0x2D ||
        // Argumenian hyphen
        cp === 0x58A ||
        // Hebrew punctuation maqaf
        cp === 0x5BE ||
        // Canadian syllabics hyphen
        cp === 0x1400 ||
        // Mongolian todo soft hyphen
        cp === 0x1806 ||
        (0x2010 <= cp && cp <= 0x30A0 && (
            // hyphen
            cp === 0x2010 ||
            // 0x2012: figure dash
            // 0x2013: en dash
            // 0x2014: em dash
            // 0x2015: horizontal bar
            (0x2012 <= cp && cp <= 0x2015) ||
            // double oblique hyphen
            cp === 0x2E17 ||
            // hyphen with diaeresis
            cp === 0x2E1A ||
            // two-em dash
            cp === 0x2E3A ||
            // three-em dash
            cp === 0x2E3B ||
            // double hyphen
            cp === 0x2E40 ||
            // wave dash
            cp === 0x301C ||
            // wavy dash
            cp === 0x3030 ||
            // Katakana-Hiragana double hyphen
            cp === 0x30A0
        )) ||
        (0xFE31 <= cp && cp <= 0xFF0D && (
            // presentation form for vertical em dash
            cp === 0xFE31 ||
            // presentation form for vertical en dash
            cp === 0xFE32 ||
            // small em dash
            cp === 0xFE58 ||
            // small hyphen-minus
            cp === 0xFE63 ||
            // fullwidth hyphen-minus
            cp === 0xFF0D
        )) ||
        // Yezidi hyphenation mark
        cp === 0x10EAD
    )
}
