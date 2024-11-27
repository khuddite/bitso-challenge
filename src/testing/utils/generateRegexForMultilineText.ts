const generateRegexForMultilineText = (str: string) => {
  return new RegExp(str.split("").join("\\s*"), "i");
};

export default generateRegexForMultilineText;
