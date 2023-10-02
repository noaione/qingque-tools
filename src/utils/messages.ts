/**
 * Format the text message to be gendered and replace the nickname
 * @param text The text to format
 * @param gender The gender to be used, defaults to `Male`/`M`
 * @param nickname The nickname to be used, defaults to `Trailblazer`
 * @returns The formatted text
 */
export function formatTextMessage(
  text: string,
  gender: string = "M",
  nickname: string = "Trailblazer"
) {
  // replace {NICKNAME}
  text = text.replace("{NICKNAME}", nickname);
  // Use gendered version of the text, formatted like:
  // {F#Text}{M#Text} or swap the order, depending on the `gender`

  let genderStr = gender.slice(0, 1).toUpperCase();
  if (!["M", "F"].includes(gender)) {
    genderStr = "M";
  }
  const matcher = /\{([FM])#(.*?)\}/g;
  text = text.replace(matcher, (match, g, text) => (g === genderStr ? text : ""));
  return text;
}
