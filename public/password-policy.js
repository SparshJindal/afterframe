// One policy, shared by browser and Node. Never use \p{Emoji}: it includes 0–9, # and *.
export const PASSWORD_RULES = Object.freeze({min:15,max:128,maxBytes:512});
const emoji = /[\p{Extended_Pictographic}\p{Regional_Indicator}\p{Emoji_Modifier}\u200D\uFE0E\uFE0F\u20E3]/u;
const invisible = /[\p{Cc}\p{Cf}\p{Cs}]/u;
export function passwordProblem(value) {
  if (typeof value !== 'string') return 'Enter a password.';
  if (emoji.test(value)) return 'Passwords cannot contain emojis or emoji sequences.';
  if (invisible.test(value)) return 'Passwords cannot contain invisible or control characters.';
  if (/^\s+$/.test(value)) return 'Use a passphrase with more than just spaces.';
  const length = [...value].length;
  if (length < PASSWORD_RULES.min) return 'Use at least 15 characters. A memorable passphrase works well.';
  if (length > PASSWORD_RULES.max || new TextEncoder().encode(value).length > PASSWORD_RULES.maxBytes)
    return 'Use at most 128 characters and 512 UTF-8 bytes.';
  return null;
}
// Passwords are never trimmed, normalised, silently truncated or required to mix character classes.
