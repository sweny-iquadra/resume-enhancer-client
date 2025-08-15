// Normalize arrays in current_resumes & enhanced_resume:
// - If an array contains JSON-like entries (strings of {...} / [...] or objects/arrays),
//   convert those entries into single-line strings (keep order).
export function normalizeResumeArrays(response) {
    // --- helpers ---
    const pythonToJson = (str) =>
        str
            .replace(/\\'/g, "__SQUOTE_ESC__")       // protect escaped single-quotes
            .replace(/'/g, '"')                      // single -> double
            .replace(/__SQUOTE_ESC__/g, "\\'")       // restore escapes
            .replace(/\bNone\b/g, "null")
            .replace(/\bTrue\b/g, "true")
            .replace(/\bFalse\b/g, "false");

    const isPythonObjectString = (v) =>
        typeof v === "string" && v.trim().startsWith("{") && v.trim().endsWith("}");

    const safeParse = (s) => {
        try { return JSON.parse(pythonToJson(s)); }
        catch { return null; }
    };

    // Turn a plain object into an array of "Key: Value" strings
    // Array values are joined by ", " into a single line.
    const objectToKVStrings = (obj) => {
        const lines = [];
        for (const key of Object.keys(obj)) {         // preserves original key order
            const val = obj[key];
            if (Array.isArray(val)) {
                // join array items into one string, preserving item order
                const joined = val.map((x) => String(x)).join(", ");
                lines.push(`${key}: ${joined}`);
            } else if (val !== null && typeof val === "object") {
                // Nested objects are rare here; serialize compactly
                lines.push(`${key}: ${JSON.stringify(val)}`);
            } else {
                lines.push(`${key}: ${val}`);
            }
        }
        return lines;
    };

    // Transform a single array (preserve order, expand elements as needed)
    const transformArray = (arr) => {
        const out = [];
        for (const item of arr) {
            if (isPythonObjectString(item)) {
                const parsed = safeParse(item);
                if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                    out.push(...objectToKVStrings(parsed)); // expand into multiple lines
                    continue;
                }
            } else if (item && typeof item === "object" && !Array.isArray(item)) {
                out.push(...objectToKVStrings(item));     // already an object
                continue;
            }
            // keep original (string/number/etc.) when not parsed
            out.push(item);
        }
        return out;
    };

    // Transform all array props in a section object
    const transformSection = (section) => {
        if (!section || typeof section !== "object") return section;
        const copy = { ...section };
        for (const key of Object.keys(copy)) {
            if (Array.isArray(copy[key])) {
                copy[key] = transformArray(copy[key]);
            }
        }
        return copy;
    };

    // --- main ---
    const result = { ...response };
    const pr = response?.parsed_resumes;

    if (pr && typeof pr === "object") {
        result.parsed_resumes = { ...pr };
        for (const sec of ["current_resumes", "enhanced_resume"]) {
            if (pr[sec]) {
                result.parsed_resumes[sec] = transformSection(pr[sec]);
            }
        }
    }

    return result;
}


/**
 * Utility function to check if a value is a parsed JSON object/array
 * @param {any} value - The value to check
 * @returns {boolean} True if the value is an object or array (not a primitive)
 */
export function isParsedJson(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value) || Array.isArray(value);
}


/**
 * Utility function to safely stringify a value for display
 * @param {any} value - The value to stringify
 * @returns {string} A string representation of the value
 */
export function safeStringify(value) {
    if (typeof value === 'string') return value;
    if (isParsedJson(value)) {
        try {
            return JSON.stringify(value, null, 2);
        } catch (error) {
            return String(value);
        }
    }
    return String(value);
}